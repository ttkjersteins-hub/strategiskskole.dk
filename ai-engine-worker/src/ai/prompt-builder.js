// ============================================================
// Dynamisk system prompt builder
// Samler kontekst fra session, forløb, trin, keywords, temaer
// ============================================================

import { SYSTEM_IDENTITY } from '../data/system-prompt.js'
import { TRIN_NAVNE, TRIN_SPØRGSMÅL, TRIN_KONTEKST, TGUIDE } from '../data/model.js'

export function buildSystemPrompt({ source, rolle, trin, mode, priorInsights, themes, keywords }) {
  let prompt = SYSTEM_IDENTITY

  // Trin-specifik kontekst
  if (trin && trin >= 1 && trin <= 6) {
    prompt += `\n\n## Aktuelt trin: ${TRIN_NAVNE[trin - 1]} (Trin ${trin}/6)`
    prompt += `\nKernespørgsmål: "${TRIN_SPØRGSMÅL[trin - 1]}"`
    prompt += `\nKontekst: ${TRIN_KONTEKST[trin - 1]}`

    if (mode && TGUIDE[mode]) {
      prompt += `\nMode: ${mode}`
      const guideQs = TGUIDE[mode][trin - 1]
      if (guideQs) {
        prompt += `\nGuidespørgsmål du kan bruge: ${guideQs.join(' | ')}`
      }
    }
  }

  // Carry-forward fra tidligere trin
  if (priorInsights?.length > 0) {
    prompt += `\n\n## Kontekst fra tidligere trin`
    prompt += `\nBrug dette aktivt — henvis til brugerens egne ord og erkendelser:`
    for (const snap of priorInsights) {
      if (snap.trin >= 1 && snap.trin <= 6) {
        prompt += `\n\nTrin ${snap.trin} (${TRIN_NAVNE[snap.trin - 1]}):`
        if (snap.key_insights?.length) {
          prompt += `\n  Erkendelser: ${snap.key_insights.join('; ')}`
        }
        if (snap.carry_forward?.length) {
          prompt += `\n  Videreført: ${snap.carry_forward.join('; ')}`
        }
      }
    }
  }

  // Temaer
  if (themes?.length > 0) {
    prompt += `\n\n## Identificerede temaer i dette forløb`
    prompt += `\nDisse temaer er fremtrædende baseret på brugerens input:`
    for (const t of themes) {
      prompt += `\n- ${t.theme} (styrke: ${(t.score * 100).toFixed(0)}%)`
      if (t.evidence?.length && t.evidence[0]) {
        prompt += ` — brugerens ord: "${t.evidence[0]}"`
      }
    }
  }

  // Brugerens nøgleord
  if (keywords?.length > 0) {
    prompt += `\n\n## Brugerens eget sprog`
    prompt += `\nBrug disse ord og vendinger aktivt i dine svar:`
    const grouped = {}
    for (const kw of keywords) {
      const cat = kw.category || 'øvrig'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(kw.keyword)
    }
    for (const [cat, words] of Object.entries(grouped)) {
      prompt += `\n  ${cat}: ${words.join(', ')}`
    }
  }

  // Kilde-specifik instruktion
  if (source === 'website') {
    prompt += `\n\n## Kontekst: Hjemmesidechatbot`
    prompt += `\nKort, skærpende, max 150 ord. Stil ét opfølgende spørgsmål.`
    prompt += `\nHenvis til relevant side på strategiskskole.dk hvis relevant.`
    prompt += `\nDu kender disse sider: Tirsdag kl. 10-modellen, Proceskort, Digitalt forløb, Ydelser, Ny skoleleder, Forandringsledelse, Skolegovernance, Om os, Kontakt.`
  } else if (source === 'app') {
    prompt += `\n\n## Kontekst: Tirsdag kl. 10-appen`
    prompt += `\nDu er procesguide i appen. Vær konkret og handlingsorienteret.`
    prompt += `\nHenvis til proceskortets spørgsmål. Foreslå beslutninger og handlinger.`
    prompt += `\nMax 200 ord.`
  } else if (source === 'forloeb') {
    prompt += `\n\n## Kontekst: Digitalt procesforløb`
    prompt += `\nFacilitér et dybt refleksionsforløb. Stil skærpende spørgsmål.`
    prompt += `\nBrug brugerens egne ord. Byg videre på tidligere trin.`
    prompt += `\nMax 250 ord. Ét spørgsmål ad gangen.`
  }

  return prompt
}
