// ============================================================
// ChatHandler — hovedflow for AI-samtale
// Bruges af alle tre klienter: website, app, forloeb
// D1-version (Cloudflare D1 / SQLite)
// ============================================================

import { buildSystemPrompt } from '../ai/prompt-builder.js'
import { runAI } from '../ai/workers-ai.js'
import { runExtractionPipeline } from '../ai/extraction.js'
import { getFallbackResponse } from '../ai/fallback.js'
import {
  getSession, createSession, updateSessionMessageCount,
  getMessages, insertMessages,
  getPriorInsights, getThemes, getKeywords
} from '../data/db.js'

export async function handleChat(body, env, ctx) {
  const db = env.DB
  const { session_id, message, source } = body

  // ── Validering ──────────────────────────────────────────────
  if (!message?.trim()) {
    return { error: 'Tomt spørgsmål', status: 400 }
  }

  if (message.length > 2000) {
    return { error: 'Beskeden er for lang (max 2000 tegn)', status: 400 }
  }

  // ── Hent eller opret session ────────────────────────────────
  let session
  if (session_id) {
    session = await getSession(db, session_id)
    if (!session) {
      return { error: 'Session ikke fundet', status: 404 }
    }
  } else {
    // Website-chatbot: auto-opret session
    session = await createSession({
      db,
      forloeb_id: body.forloeb_id || 'website-default',
      source: source || 'website',
      rolle: body.rolle || null,
      trin: body.trin || null,
      mode: body.mode || null
    })
  }

  const rolle = session.rolle || body.rolle
  const trin = session.trin || body.trin
  const mode = session.mode || body.mode
  const src = source || session.source || 'website'

  // ── Hent samtalehistorik ────────────────────────────────────
  const history = await getMessages(db, session.id, 16)

  // ── Hent carry-forward fra tidligere trin ────────────────────
  let priorInsights = []
  if (trin && session.forloeb_id && session.forloeb_id !== 'website-default') {
    priorInsights = await getPriorInsights(db, session.forloeb_id, rolle || 'skoleleder', trin)
  }

  // ── Hent temaer ─────────────────────────────────────────────
  let themes = []
  if (session.forloeb_id && session.forloeb_id !== 'website-default') {
    themes = await getThemes(db, session.forloeb_id, 0.3, 8)
  }

  // ── Hent nøgleord ───────────────────────────────────────────
  const keywords = await getKeywords(db, session.id, 15)

  // ── Byg system prompt ───────────────────────────────────────
  const systemPrompt = buildSystemPrompt({
    source: src,
    rolle,
    trin,
    mode,
    priorInsights,
    themes,
    keywords
  })

  // ── Kald Workers AI (med fallback) ──────────────────────────
  let reply
  let isFallback = false

  try {
    reply = await runAI(env, {
      systemPrompt,
      messages: [
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
      ],
      source: src
    })

    if (!reply || reply.trim().length < 10) {
      throw new Error('Tom AI-response')
    }
  } catch (e) {
    console.error('Workers AI fejl:', e.message)
    reply = getFallbackResponse(trin, mode, history.length)
    isFallback = true
  }

  // ── Persist beskeder ────────────────────────────────────────
  await insertMessages(db, [
    { session_id: session.id, role: 'user', content: message },
    { session_id: session.id, role: 'assistant', content: reply }
  ])

  // Opdater message_count
  await updateSessionMessageCount(db, session.id, history.length + 2)

  // ── Kør extraction pipeline (asynkron) ──────────────────────
  if (session.forloeb_id !== 'website-default') {
    ctx.waitUntil(
      runExtractionPipeline(
        env, db, session.id, session.forloeb_id,
        message, trin, rolle
      ).catch(e => console.error('Extraction fejl:', e.message))
    )
  }

  // ── Response ────────────────────────────────────────────────
  const response = {
    reply,
    session_id: session.id,
  }

  // Tilføj ekstra data baseret på kilde
  if (src === 'app' && keywords.length > 0) {
    response.keywords = keywords.slice(0, 5).map(k => k.keyword)
  }
  if (src === 'forloeb' && themes.length > 0) {
    response.theme_hint = themes[0].theme
  }
  if (isFallback) {
    response.fallback = true
  }

  return { data: response, status: 200 }
}
