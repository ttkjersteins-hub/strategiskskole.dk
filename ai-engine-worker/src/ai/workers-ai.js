// ============================================================
// Cloudflare Workers AI wrapper
// Gratis LLM via env.AI.run() — Llama 3 modeller
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
    case 'forloeb': return 600
    default:        return 300
  }
}

// Hovedkald til Workers AI
export async function runAI(env, { systemPrompt, messages, source }) {
  const model = selectModel(source)
  const maxTokens = selectMaxTokens(source)

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

// Letvægts AI-kald til extraction (lavere tokens, lavere temperatur)
export async function runExtractionAI(env, systemPrompt, userContent) {
  const result = await env.AI.run(MODEL_8B, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    max_tokens: 200,
    temperature: 0.2,  // Lav temp for struktureret output
  })

  return result.response || ''
}
