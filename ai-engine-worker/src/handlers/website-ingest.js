// ============================================================
// Website Ingest — Scraper alle sider på strategiskskole.dk
// og indsætter indhold i shared_knowledge
// Kaldes fra nightly cron (scheduled.js)
// ============================================================

import { insertSharedKnowledge } from '../data/db.js'

const BASE_URL = 'https://strategiskskole.dk'

// Liste over sider der skal scrapes (alle public HTML-sider)
const PAGES = [
  '/',
  '/ydelser.html',
  '/om-os.html',
  '/kontakt.html',
  '/skoleleder.html',
  '/skolegovernance.html',
  '/forandringsledelse.html',
  '/tirsdag-kl10-modellen.html',
  '/tirsdag-kl10-skoleleder.html',
  '/tirsdag-kl10-bestyrelsen.html',
  '/tirsdag-kl10-lederteam.html',
  '/digitalt-forloeb.html',
  '/ny-leder.html',
  '/ledelse-som-design.html',
  '/strategi-i-hverdagspraksis.html',
  '/individuel-afklaring.html',
  '/koordinering.html',
  '/moedekultur.html',
  '/arbejdsmiljoe.html',
  '/smaa-greb.html',
  '/work-domains.html',
  // Landing pages
  '/lp-tre-stole.html',
  '/lp-strategisk-skoleledelse.html',
  '/lp-forandringsledelse.html',
  '/lp-ny-leder-100-dage.html',
  '/lp-ny-leder-friskole.html',
  '/lp-ny-leder-efterskole.html',
  '/lp-ny-leder-sparring.html',
  '/lp-ny-skoleleder.html',
  '/lp-skoleledelse.html',
  '/lp-friskole-ledelse.html',
  '/lp-efterskole-ledelse.html',
  '/lp-skoleudvikling.html',
  '/lp-ledelsesudvikling-skole.html',
  '/lp-skolekonsulent.html',
  '/lp-bestyrelsesarbejde.html',
  '/lp-byggeudvalg-skole.html',
  '/lp-strategisk-skolebyggeri.html',
  '/lp-laeringslandskab-vision.html',
  '/lp-intro-workshop.html',
  '/lp-moedekultur-skole.html',
  '/lp-lederskifte-skole.html',
]

// Strip HTML tags og udtræk synligt tekst
function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (m) return m[1].replace(/\s*[|–—]\s*Strategiskskole\.dk/i, '').trim()
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  return h1 ? h1[1].trim() : null
}

function extractDescription(html) {
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
  return m ? m[1].trim() : null
}

function categorize(path, text) {
  const f = path.toLowerCase()
  const t = text.toLowerCase()
  if (f.includes('tirsdag-kl10')) return 'tirsdag_kl10'
  if (f.includes('lp-')) return 'ydelse'
  if (f.includes('forandring')) return 'forandringsledelse'
  if (f.includes('ny-leder') || f.includes('skoleleder')) return 'ny_leder'
  if (f.includes('governance') || f.includes('bestyrelse')) return 'governance'
  if (f.includes('moede') || f.includes('koordin')) return 'moedekultur'
  if (f.includes('ydelser')) return 'ydelser'
  if (f.includes('kontakt')) return 'kontakt'
  if (f.includes('om-os')) return 'om_os'
  if (f.includes('arbejdsmilj')) return 'trivsel'
  if (f.includes('strategi')) return 'strategisk_retning'
  if (t.includes('inklusion')) return 'inklusion'
  if (t.includes('rekrutter')) return 'rekruttering'
  return 'generelt'
}

// Chunk tekst i bidder af max ~350 tegn (på sætningsgrænser)
function chunkText(text, maxLen = 350) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 20)
  const chunks = []
  let current = ''
  for (const s of sentences) {
    if (current.length + s.length > maxLen) {
      if (current.length > 30) chunks.push(current.trim())
      current = s
    } else {
      current += ' ' + s
    }
  }
  if (current.length > 30) chunks.push(current.trim())
  return chunks
}

// Scrape én side og returnér chunks
async function scrapePage(path) {
  const url = BASE_URL + path
  try {
    const r = await fetch(url, {
      cf: { cacheTtl: 0 },
      headers: { 'User-Agent': 'StrategiskskoleBot/1.0 (knowledge-ingest)' }
    })
    if (!r.ok) return null
    const html = await r.text()
    const title = extractTitle(html) || path.replace(/[/.html]/g, '') || 'Forside'
    const description = extractDescription(html)
    const text = extractText(html)
    const tema = categorize(path, text)

    const chunks = []
    if (description) chunks.push(`Side: ${title}. ${description}`)
    chunks.push(...chunkText(text))

    return {
      path,
      url,
      title,
      tema,
      chunks: chunks.slice(0, 5), // Max 5 chunks per side
    }
  } catch (e) {
    console.error(`Scrape fejl ${path}:`, e.message)
    return null
  }
}

// Hovedfunktion — scrape alle sider og indsæt i shared_knowledge
export async function ingestWebsite(env) {
  const db = env.DB
  const stats = { sider: 0, chunks: 0, fejl: 0 }

  // 1. Slet gamle website-entries (kilde='website')
  try {
    await db.prepare(`DELETE FROM shared_knowledge WHERE kilde = 'website'`).run()
  } catch (e) {
    console.error('Delete fejl:', e.message)
  }

  // 2. Scrape og indsæt
  for (const path of PAGES) {
    const result = await scrapePage(path)
    if (!result) {
      stats.fejl++
      continue
    }
    stats.sider++

    const rows = result.chunks.map(chunk => ({
      tema: result.tema,
      trin: null,
      rolle: null,
      type: 'website',
      indhold: chunk.slice(0, 400),
      kontekst: `Fra ${result.title} (${result.url})`,
      kilde: 'website',
      kvalitet: 0.9,
    }))

    if (rows.length > 0) {
      try {
        await insertSharedKnowledge(db, rows)
        stats.chunks += rows.length
      } catch (e) {
        console.error(`Insert fejl ${path}:`, e.message)
        stats.fejl++
      }
    }
  }

  console.log(`Website ingest: ${stats.sider} sider, ${stats.chunks} chunks, ${stats.fejl} fejl`)
  return stats
}
