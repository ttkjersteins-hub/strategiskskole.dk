#!/usr/bin/env node
// ============================================================
// Harvest Script — Samler viden fra simulerede samtaler
// Læser D1 via Wrangler og skriver til shared_knowledge tabel
// Brug: node scripts/harvest.js
// ============================================================

import { execSync } from 'child_process'

const DB_NAME = 'strategiskskole-ai'

function d1Query(sql) {
  try {
    const result = execSync(
      `npx wrangler d1 execute ${DB_NAME} --json --command="${sql.replace(/"/g, '\\"')}"`,
      { encoding: 'utf-8', timeout: 30000 }
    )
    const parsed = JSON.parse(result)
    return parsed[0]?.results || []
  } catch (e) {
    console.error('D1 query fejl:', e.message)
    return []
  }
}

function d1Execute(sql) {
  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --command="${sql.replace(/"/g, '\\"')}"`,
      { encoding: 'utf-8', timeout: 30000 }
    )
    return true
  } catch (e) {
    console.error('D1 execute fejl:', e.message)
    return false
  }
}

async function main() {
  console.log('=== Harvest: Samler viden fra samtaler ===\n')

  // 1. Hent alle unikke temaer fra theme_scores
  console.log('Henter temaer...')
  const themes = d1Query(
    `SELECT DISTINCT theme, AVG(score) as avg_score, COUNT(*) as count
     FROM theme_scores
     WHERE forloeb_id != 'website-default'
     GROUP BY theme
     HAVING avg_score > 0.3
     ORDER BY avg_score DESC`
  )
  console.log(`  Fundet ${themes.length} temaer`)

  // 2. Hent de bedste erkendelser fra progress_snapshots
  console.log('Henter erkendelser...')
  const insights = d1Query(
    `SELECT rolle, trin, key_insights, carry_forward
     FROM progress_snapshots
     WHERE key_insights != '[]' AND key_insights IS NOT NULL
     ORDER BY depth_score DESC
     LIMIT 100`
  )
  console.log(`  Fundet ${insights.length} erkendelser`)

  // 3. Hent de mest brugte nøgleord
  console.log('Henter nøgleord...')
  const keywords = d1Query(
    `SELECT keyword, category, SUM(weight) as total_weight, COUNT(*) as count
     FROM extracted_keywords
     GROUP BY keyword
     HAVING count > 1
     ORDER BY total_weight DESC
     LIMIT 50`
  )
  console.log(`  Fundet ${keywords.length} nøgleord`)

  // 4. Hent de bedste AI-svar (lange, substantielle svar)
  console.log('Henter gode AI-svar...')
  const goodReplies = d1Query(
    `SELECT m.content, s.rolle, s.trin, s.source
     FROM messages m
     JOIN sessions s ON m.session_id = s.id
     WHERE m.role = 'assistant'
       AND s.source = 'forloeb'
       AND LENGTH(m.content) > 100
       AND LENGTH(m.content) < 500
     ORDER BY RANDOM()
     LIMIT 50`
  )
  console.log(`  Fundet ${goodReplies.length} gode AI-svar`)

  // 5. Skriv til shared_knowledge
  console.log('\nSkriver til shared_knowledge...')

  // Opret tabellen hvis den ikke findes
  d1Execute(`CREATE TABLE IF NOT EXISTS shared_knowledge (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tema TEXT NOT NULL,
    trin INTEGER,
    rolle TEXT,
    type TEXT NOT NULL,
    indhold TEXT NOT NULL,
    kontekst TEXT DEFAULT '',
    kilde TEXT DEFAULT 'simulering',
    kvalitet REAL DEFAULT 1.0,
    brugt_antal INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`)
  d1Execute(`CREATE INDEX IF NOT EXISTS idx_sk_tema ON shared_knowledge(tema)`)
  d1Execute(`CREATE INDEX IF NOT EXISTS idx_sk_trin ON shared_knowledge(trin)`)

  let inserted = 0

  // Indsæt tema-indsigter
  for (const theme of themes) {
    const ok = d1Execute(
      `INSERT INTO shared_knowledge (id, tema, type, indhold, kvalitet, kilde)
       VALUES (lower(hex(randomblob(16))), '${theme.theme}', 'indsigt',
       'Tema "${theme.theme}" optræder hyppigt (${theme.count} gange, score: ${theme.avg_score?.toFixed(2)}). Dette er et kerneproblem for mange skoleledere.',
       ${Math.min(theme.avg_score || 0.5, 1.0)}, 'harvest')`
    )
    if (ok) inserted++
  }

  // Indsæt erkendelser
  for (const ins of insights) {
    try {
      const parsedInsights = JSON.parse(ins.key_insights || '[]')
      const parsedCarry = JSON.parse(ins.carry_forward || '[]')
      for (const ki of parsedInsights) {
        if (ki && ki.length > 10) {
          const safe = ki.replace(/'/g, "''")
          const ok = d1Execute(
            `INSERT INTO shared_knowledge (id, tema, trin, rolle, type, indhold, kvalitet, kilde)
             VALUES (lower(hex(randomblob(16))), 'erkendelse', ${ins.trin || 'NULL'},
             ${ins.rolle ? `'${ins.rolle}'` : 'NULL'}, 'indsigt', '${safe}', 0.8, 'harvest')`
          )
          if (ok) inserted++
        }
      }
      for (const cf of parsedCarry) {
        if (cf && cf.length > 10) {
          const safe = cf.replace(/'/g, "''")
          const ok = d1Execute(
            `INSERT INTO shared_knowledge (id, tema, trin, rolle, type, indhold, kontekst, kvalitet, kilde)
             VALUES (lower(hex(randomblob(16))), 'carry_forward', ${ins.trin || 'NULL'},
             ${ins.rolle ? `'${ins.rolle}'` : 'NULL'}, 'indsigt', '${safe}', 'Fra trin ${ins.trin}', 0.7, 'harvest')`
          )
          if (ok) inserted++
        }
      }
    } catch {}
  }

  // Indsæt gode AI-svar som eksempler
  for (const reply of goodReplies) {
    const safe = reply.content.replace(/'/g, "''").substring(0, 500)
    const ok = d1Execute(
      `INSERT INTO shared_knowledge (id, tema, trin, rolle, type, indhold, kvalitet, kilde)
       VALUES (lower(hex(randomblob(16))), 'godt_svar', ${reply.trin || 'NULL'},
       ${reply.rolle ? `'${reply.rolle}'` : 'NULL'}, 'godt_svar', '${safe}', 0.9, 'harvest')`
    )
    if (ok) inserted++
  }

  // Indsæt hyppige nøgleord som scenarie-kontekst
  for (const kw of keywords) {
    const ok = d1Execute(
      `INSERT INTO shared_knowledge (id, tema, type, indhold, kvalitet, kilde)
       VALUES (lower(hex(randomblob(16))), '${kw.category || 'generelt'}', 'scenarie',
       'Nøgleordet "${kw.keyword}" (${kw.category || 'generelt'}) optræder ${kw.count} gange med samlet vægt ${kw.total_weight?.toFixed(1)}. Brug det aktivt.',
       ${Math.min((kw.total_weight || 1) / 5, 1.0)}, 'harvest')`
    )
    if (ok) inserted++
  }

  console.log(`\n=== Harvest færdig ===`)
  console.log(`Indsat: ${inserted} stykker viden i shared_knowledge`)
  console.log(`\nDin AI er nu klogere! Viden bruges automatisk i fremtidige samtaler.`)
}

main().catch(console.error)
