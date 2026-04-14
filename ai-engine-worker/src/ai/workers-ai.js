// ============================================================
// AI wrapper — Claude API for forløb, Workers AI for website/app
// Hybrid: Gratis Llama til hurtige svar, Claude til dybe processer
// ============================================================

const MODEL_8B  = '@cf/meta/llama-3.1-8b-instruct'
const MODEL_70B = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

// Model-valg baseret på kilde
export function selectModel(source) {
  return source === 'forloeb' ? 'claude' : MODEL_8B
}

// Max tokens baseret på kilde
export function selectMaxTokens(source) {
  switch (source) {
    case 'website': return 250
    case 'app':     return 400
    case 'forloeb': return 800  // Claude kan bruge flere tokens effektivt
    default:        return 300
  }
}

// ── Claude API kald ──────────────────────────────────────────
async function runClaude(apiKey, { systemPrompt, messages, maxTokens }) {
  const claudeMessages = messages.map(m => ({
    role: m.role === 'system' ? 'user' : m.role,
    content: m.content,
  }))

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      temperature: 0.7,
      system: systemPrompt,
      messages: claudeMessages,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Claude API error:', response.status, err)
    return null  // Fallback til Workers AI
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}

// ── Workers AI kald (Llama) ──────────────────────────────────
async function runWorkersAI(env, { systemPrompt, messages, model, maxTokens }) {
  const aiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]

  const result = await env.AI.run(model, {
    messages: aiMessages,
    max_tokens: maxTokens,
    temperature: 0.7,
  })

  return result.response || ''
}

// ── Hovedkald — router til Claude eller Workers AI ───────────
export async function runAI(env, { systemPrompt, messages, source }) {
  const modelChoice = selectModel(source)
  const maxTokens = selectMaxTokens(source)

  // Forløb → Claude API (med fallback til Llama 70B)
  if (modelChoice === 'claude' && env.ANTHROPIC_API_KEY) {
    const reply = await runClaude(env.ANTHROPIC_API_KEY, {
      systemPrompt,
      messages,
      maxTokens,
    })

    // Fallback til Workers AI hvis Claude fejler
    if (!reply) {
      console.log('Claude fallback → Workers AI 70B')
      return runWorkersAI(env, {
        systemPrompt,
        messages,
        model: MODEL_70B,
        maxTokens,
      })
    }

    return reply
  }

  // Website/app → Workers AI (gratis)
  return runWorkersAI(env, {
    systemPrompt,
    messages,
    model: source === 'forloeb' ? MODEL_70B : MODEL_8B,
    maxTokens,
  })
}

// Letvægts AI-kald til extraction (altid Llama 8B — billigt og hurtigt)
export async function runExtractionAI(env, systemPrompt, userContent) {
  const result = await env.AI.run(MODEL_8B, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    max_tokens: 200,
    temperature: 0.2,
  })

  return result.response || ''
}
