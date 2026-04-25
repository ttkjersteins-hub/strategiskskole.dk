// ============================================================
// AI wrapper — Workers AI only (gratis, ingen ekstern API)
// Llama 8B til website/app, Llama 70B til forløb
// ============================================================

const MODEL_8B  = '@cf/meta/llama-3.1-8b-instruct'
const MODEL_70B = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

// Model-valg baseret på kilde
export function selectModel(source) {
  return source === 'forloeb' ? MODEL_70B : MODEL_8B
}

// Max tokens baseret på kilde
export function selectMaxTokens(source) {
  switch (source) {
    case 'website': return 250
    case 'app':     return 400
    case 'forloeb': return 800
    default:        return 300
  }
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

// ── Hovedkald — kun Workers AI (ingen ekstern betaling) ──────
export async function runAI(env, { systemPrompt, messages, source }) {
  const model = selectModel(source)
  const maxTokens = selectMaxTokens(source)

  return runWorkersAI(env, {
    systemPrompt,
    messages,
    model,
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
