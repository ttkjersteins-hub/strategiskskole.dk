#!/usr/bin/env node
// ============================================================
// Harvest Remote — Høster viden fra remote D1 database
// Brug: node scripts/harvest-remote.js
// ============================================================

import { execSync } from 'child_process'

const DB_NAME = 'strategiskskole-ai'

function d1Query(sql) {
  const oneLine = sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  try {
    const result = execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --json --command="${oneLine.replace(/"/g, '\\"')}"`,
      { encoding: 'utf-8', timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] }
    )
    const parsed = JSON.parse(result)
    return parsed[0]?.results || []
  } catch (e) {
    console.error('Query fejl:', oneLine.substring(0, 80))
    return []
  }
}

function d1Execute(sql) {
  const oneLine = sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="${oneLine.replace(/"/g, '\\"')}"`,
      { encoding: 'utf-8', timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] }
    )
    return true
  } catch (e) {
    console.error('Execute fejl:', oneLine.substring(0, 80))
    return false
  }
}

function escapeSql(str) {
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\')
}

async function main() {
  console.log('=== Harvest Remote: Samler viden fra samtaler ===\n')

  // 1. Hent gode AI-svar per rolle og trin
  console.log('Henter AI-svar...')
  const replies = d1Query(
    `SELECT m.content, s.rolle, s.trin FROM messages m JOIN sessions s ON m.session_id = s.id WHERE m.role = 'assistant' AND s.source = 'forloeb' AND s.rolle IS NOT NULL AND LENGTH(m.content) > 80 AND LENGTH(m.content) < 400 ORDER BY RANDOM() LIMIT 60`
  )
  console.log(`  Fundet ${replies.length} gode AI-svar`)

  // 2. Hent bruger-beskeder for at identificere temaer
  console.log('Henter bruger-beskeder...')
  const userMsgs = d1Query(
    `SELECT m.content, s.rolle, s.trin FROM messages m JOIN sessions s ON m.session_id = s.id WHERE m.role = 'user' AND s.source = 'forloeb' AND LENGTH(m.content) > 30 ORDER BY RANDOM() LIMIT 40`
  )
  console.log(`  Fundet ${userMsgs.length} bruger-beskeder`)

  // 3. Indsæt AI-svar som shared knowledge
  console.log('\nIndsætter i shared_knowledge...')
  let inserted = 0

  for (const r of replies) {
    if (!r.content || !r.rolle) continue
    const safe = escapeSql(r.content.substring(0, 400))
    const tema = categorize(r.content)
    const ok = d1Execute(
      `INSERT INTO shared_knowledge (id, tema, trin, rolle, type, indhold, kvalitet, kilde) VALUES (lower(hex(randomblob(16))), '${tema}', ${r.trin || 'NULL'}, '${r.rolle}', 'godt_svar', '${safe}', 0.85, 'simulering')`
    )
    if (ok) inserted++
  }

  // 4. Indsæt bruger-scenarier som kontekst
  for (const u of userMsgs) {
    if (!u.content || u.content.length < 30) continue
    const safe = escapeSql(u.content.substring(0, 300))
    const tema = categorize(u.content)
    const ok = d1Execute(
      `INSERT INTO shared_knowledge (id, tema, trin, rolle, type, indhold, kvalitet, kilde) VALUES (lower(hex(randomblob(16))), '${tema}', ${u.trin || 'NULL'}, ${u.rolle ? `'${u.rolle}'` : 'NULL'}, 'scenarie', '${safe}', 0.7, 'simulering')`
    )
    if (ok) inserted++
  }

  // 5. Indsæt manuelt kuraterede indsigter baseret på research
  const curatedInsights = [
    { tema: 'inklusion', indhold: 'Inklusion er den største udfordring for skoleledere. Det kræver både ressourcer, kompetencer og en klar strategi for at lykkes. Mange ledere føler sig alene med opgaven.', kvalitet: 1.0 },
    { tema: 'rekruttering', indhold: 'Rekruttering og fastholdelse af lærere er kritisk. Halvdelen af skoleledere har overvejet at søge nyt job. Arbejdsmiljø og faglig udvikling er vigtigere end løn.', kvalitet: 1.0 },
    { tema: 'reform', indhold: 'Folkeskolereformen 2026 giver mere frihed til den enkelte skole men også mere ansvar. Nye fagplaner skal udvikles og afprøves 2025-2027. Skolebestyrelsernes rolle styrkes.', kvalitet: 1.0 },
    { tema: 'faglig_ledelse', indhold: 'Faglig ledelse tæt på undervisningen er nøglen til elevernes læring og trivsel. Men driftsopgaver sluger tiden. Hård prioritering er nødvendig.', kvalitet: 1.0 },
    { tema: 'forandringstraethed', indhold: 'Fokusér på én til to vigtige forandringer ad gangen. Følg hver forandring tæt fra start til slut. Evaluér effekten før næste forandring startes.', kvalitet: 1.0 },
    { tema: 'ledelsesteam', indhold: 'Når ledelsesteamet er tværfagligt og samarbejder på tværs, sender det et stærkt signal. Klar rollefordeling og fælles prioritering er afgørende.', kvalitet: 1.0 },
    { tema: 'governance', indhold: 'Bestyrelsen er skolens øverste myndighed og ansvarlig for drift over for ministeren. Grænsen mellem governance og daglig ledelse skal være klar.', kvalitet: 1.0 },
    { tema: 'prioritering', indhold: 'Skoleledere skal delegere opgaver og tænke i at løfte sammen som team. Ledelsen skal prioritere og frigøre tid til det vigtigste.', kvalitet: 1.0 },
    { tema: 'trivsel', indhold: 'Stigende kompleksitet med forældresamarbejde, elevtrivsel og inklusion slider på ledere og lærere. Psykologisk tryghed er fundamentet.', kvalitet: 1.0 },
    { tema: 'kommunikation', indhold: 'Det er ikke nok at sende information ud. Medarbejderne skal have mulighed for at mødes og planlægge den fælles opgave. Det kræver at ledelsen prioriterer tid.', kvalitet: 1.0 },
  ]

  for (const ci of curatedInsights) {
    const ok = d1Execute(
      `INSERT INTO shared_knowledge (id, tema, type, indhold, kvalitet, kilde) VALUES (lower(hex(randomblob(16))), '${ci.tema}', 'indsigt', '${escapeSql(ci.indhold)}', ${ci.kvalitet}, 'research')`
    )
    if (ok) inserted++
  }

  console.log(`\n=== Harvest færdig ===`)
  console.log(`Indsat: ${inserted} stykker viden i shared_knowledge`)

  // Verificér
  const count = d1Query(`SELECT COUNT(*) as cnt FROM shared_knowledge`)
  console.log(`Total i shared_knowledge: ${count[0]?.cnt || 0}`)
}

function categorize(text) {
  const t = text.toLowerCase()
  if (t.includes('inklusion') || t.includes('særlige behov') || t.includes('støtte')) return 'inklusion'
  if (t.includes('rekrutter') || t.includes('fasthold') || t.includes('opsig') || t.includes('vikardæk')) return 'rekruttering'
  if (t.includes('reform') || t.includes('fagplan')) return 'reform'
  if (t.includes('forældre') || t.includes('forældr')) return 'foraeldresamarbejde'
  if (t.includes('ledelsesteam') || t.includes('ledelsesgrupp')) return 'ledelsesteam'
  if (t.includes('faglig ledelse') || t.includes('undervisningskvalitet')) return 'faglig_ledelse'
  if (t.includes('trivsel') || t.includes('syge') || t.includes('stress') || t.includes('pres')) return 'trivsel'
  if (t.includes('bestyrelse') || t.includes('governance') || t.includes('tilsyn')) return 'governance'
  if (t.includes('prioriter') || t.includes('travlt') || t.includes('projekt')) return 'prioritering'
  if (t.includes('forandring') || t.includes('træt') || t.includes('modstand')) return 'forandringstraethed'
  if (t.includes('ny leder') || t.includes('ny skoleleder') || t.includes('arver')) return 'ny_leder'
  if (t.includes('deleger') || t.includes('kontrol') || t.includes('distribueret')) return 'delegation'
  if (t.includes('kommunikation') || t.includes('rygter') || t.includes('information')) return 'kommunikation'
  if (t.includes('digital') || t.includes('teknologi')) return 'digitalisering'
  if (t.includes('budget') || t.includes('økonomi') || t.includes('spar') || t.includes('elevtal')) return 'oekonomi'
  if (t.includes('kultur') || t.includes('klike') || t.includes('samarbejd')) return 'skolekultur'
  if (t.includes('strategi') || t.includes('vision') || t.includes('retning')) return 'strategisk_retning'
  if (t.includes('elevtrivsel') || t.includes('mobning') || t.includes('fravær')) return 'elevtrivsel'
  return 'generelt'
}

main().catch(console.error)
