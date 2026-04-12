// ============================================================
// Fallback-system: Template-svar når Workers AI er utilgængelig
// Bruger TGUIDE-baserede spørgsmål som procesguide
// ============================================================

import { FALLBACK_TEMPLATES, TRIN_NAVNE } from '../data/model.js'

export function getFallbackResponse(trin, mode, messageIndex) {
  const trinTemplates = FALLBACK_TEMPLATES[trin]
  if (!trinTemplates) {
    return 'Fortæl mere om hvad du ser i den konkrete situation — hvad fylder mest lige nu?'
  }

  const modeTemplates = trinTemplates[mode] || trinTemplates['forberedelse'] || []
  if (modeTemplates.length === 0) {
    return `I ${TRIN_NAVNE[(trin || 1) - 1]} handler det om: "${getKernespørgsmål(trin)}". Hvad ser du, når du kigger på din egen situation?`
  }

  // Rotér mellem templates baseret på besked-nummer
  const idx = (messageIndex || 0) % modeTemplates.length
  return modeTemplates[idx]
}

function getKernespørgsmål(trin) {
  const spørgsmål = [
    'Hvad er det vi egentlig står i?',
    'Hvad er problemet bag problemet?',
    'Hvad vælger vi — og hvad vælger vi fra?',
    'Hvordan organiserer vi os?',
    'Kan vi se det i praksis tirsdag kl. 10?',
    'Hvordan holder vi det levende?',
  ]
  return spørgsmål[(trin || 1) - 1] || spørgsmål[0]
}
