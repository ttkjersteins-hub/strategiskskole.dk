// ============================================================
// D1 Database Helper — Cloudflare D1 (SQLite)
// Erstatter supabase.js — bruger env.DB binding
// ============================================================

/**
 * Hjælpefunktioner til D1 operationer.
 * D1 API: env.DB.prepare(sql).bind(...params).run() / .all() / .first()
 */

// ── Sessions ──────────────────────────────────────────────────

export async function getSession(db, sessionId) {
  return db.prepare('SELECT * FROM sessions WHERE id = ?').bind(sessionId).first()
}

export async function createSession({ db, forloeb_id, source, rolle, trin, mode }) {
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO sessions (id, forloeb_id, source, rolle, trin, mode, message_count, context_blob)
     VALUES (?, ?, ?, ?, ?, ?, 0, '{}')`
  ).bind(id, forloeb_id, source, rolle || null, trin || null, mode || null).run()

  return db.prepare('SELECT * FROM sessions WHERE id = ?').bind(id).first()
}

export async function updateSessionMessageCount(db, sessionId, count) {
  await db.prepare('UPDATE sessions SET message_count = ? WHERE id = ?')
    .bind(count, sessionId).run()
}

// ── Messages ──────────────────────────────────────────────────

export async function getMessages(db, sessionId, limit = 16) {
  const { results } = await db.prepare(
    'SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC LIMIT ?'
  ).bind(sessionId, limit).all()
  return results || []
}

export async function insertMessages(db, messages) {
  // D1 understøtter batch — indsæt alle på én gang
  const stmts = messages.map(m =>
    db.prepare(
      'INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), m.session_id, m.role, m.content)
  )
  await db.batch(stmts)
}

export async function countMessages(db, sessionId) {
  const row = await db.prepare(
    'SELECT COUNT(*) as cnt FROM messages WHERE session_id = ?'
  ).bind(sessionId).first()
  return row?.cnt || 0
}

// ── Keywords ──────────────────────────────────────────────────

export async function getKeywords(db, sessionId, limit = 15) {
  const { results } = await db.prepare(
    'SELECT keyword, category, weight FROM extracted_keywords WHERE session_id = ? ORDER BY weight DESC LIMIT ?'
  ).bind(sessionId, limit).all()
  return results || []
}

export async function insertKeywords(db, keywords) {
  if (!keywords.length) return
  const stmts = keywords.map(k =>
    db.prepare(
      'INSERT INTO extracted_keywords (id, session_id, keyword, category, weight, trin) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), k.session_id, k.keyword, k.category, k.weight, k.trin || null)
  )
  await db.batch(stmts)
}

// ── Themes ────────────────────────────────────────────────────

export async function getThemes(db, forloebId, minScore = 0.3, limit = 8) {
  const { results } = await db.prepare(
    `SELECT theme, score, evidence FROM theme_scores
     WHERE forloeb_id = ? AND score >= ?
     ORDER BY score DESC LIMIT ?`
  ).bind(forloebId, minScore, limit).all()
  // Parse evidence JSON string → array
  return (results || []).map(t => ({
    ...t,
    evidence: safeJSON(t.evidence, [])
  }))
}

export async function upsertTheme(db, { session_id, forloeb_id, theme, score, evidence, trin }) {
  // SQLite UPSERT via INSERT OR REPLACE on unique(session_id, theme)
  const existing = await db.prepare(
    'SELECT id FROM theme_scores WHERE session_id = ? AND theme = ?'
  ).bind(session_id, theme).first()

  const evidenceJSON = JSON.stringify(evidence || [])

  if (existing) {
    await db.prepare(
      `UPDATE theme_scores SET score = ?, evidence = ?, trin = ?, updated_at = datetime('now')
       WHERE session_id = ? AND theme = ?`
    ).bind(score, evidenceJSON, trin || null, session_id, theme).run()
  } else {
    await db.prepare(
      `INSERT INTO theme_scores (id, session_id, forloeb_id, theme, score, evidence, trin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), session_id, forloeb_id, theme, score, evidenceJSON, trin || null).run()
  }
}

// ── Progress Snapshots ────────────────────────────────────────

export async function getProgressSnapshots(db, forloebId) {
  const { results } = await db.prepare(
    'SELECT rolle, trin, status, depth_score, key_insights FROM progress_snapshots WHERE forloeb_id = ? ORDER BY trin'
  ).bind(forloebId).all()
  return (results || []).map(s => ({
    ...s,
    key_insights: safeJSON(s.key_insights, [])
  }))
}

export async function getPriorInsights(db, forloebId, rolle, maxTrin) {
  const { results } = await db.prepare(
    `SELECT trin, key_insights, carry_forward FROM progress_snapshots
     WHERE forloeb_id = ? AND rolle = ? AND trin < ?
     ORDER BY trin ASC`
  ).bind(forloebId, rolle, maxTrin).all()
  return (results || []).map(s => ({
    ...s,
    key_insights: safeJSON(s.key_insights, []),
    carry_forward: safeJSON(s.carry_forward, [])
  }))
}

export async function upsertProgressSnapshot(db, { forloeb_id, rolle, trin, status, depth_score, key_insights, carry_forward }) {
  const existing = await db.prepare(
    'SELECT id, key_insights FROM progress_snapshots WHERE forloeb_id = ? AND rolle = ? AND trin = ?'
  ).bind(forloeb_id, rolle, trin).first()

  const insightsJSON = JSON.stringify(key_insights || [])
  const carryJSON = JSON.stringify(carry_forward || [])

  if (existing) {
    await db.prepare(
      `UPDATE progress_snapshots
       SET status = ?, depth_score = ?, key_insights = ?, carry_forward = ?, updated_at = datetime('now')
       WHERE forloeb_id = ? AND rolle = ? AND trin = ?`
    ).bind(status, depth_score, insightsJSON, carryJSON, forloeb_id, rolle, trin).run()
  } else {
    await db.prepare(
      `INSERT INTO progress_snapshots (id, forloeb_id, rolle, trin, status, depth_score, key_insights, carry_forward)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), forloeb_id, rolle, trin, status, depth_score, insightsJSON, carryJSON).run()
  }

  return existing
}

export async function countSessions(db, forloebId) {
  const row = await db.prepare(
    'SELECT COUNT(*) as cnt FROM sessions WHERE forloeb_id = ?'
  ).bind(forloebId).first()
  return row?.cnt || 0
}

// ── Helper ────────────────────────────────────────────────────

function safeJSON(str, fallback) {
  try {
    return typeof str === 'string' ? JSON.parse(str) : (str || fallback)
  } catch {
    return fallback
  }
}
