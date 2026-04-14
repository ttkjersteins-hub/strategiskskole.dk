#!/usr/bin/env node
// ============================================================
// AI Træningsscript — Simulerer 100+ samtaler
// Kører mod den deployede Cloudflare Worker
// Brug: node scripts/simulate.js
// ============================================================

const API_URL = 'https://strategi-chat.strategiskskole.workers.dev/api/chat'
const ORIGIN = 'https://strategiskskoledk-app.vercel.app'

// ── Roller ────────────────────────────────────────────────────
const ROLLER = ['skoleleder', 'ledelsesteam', 'bestyrelse']

// ── Proceskort data (fra appen) ───────────────────────────────
const KORT_DATA = {
  skoleleder: {
    model: [
      { nr: 1, label: 'Strategisk spejling', forside: 'Hvad ser du egentlig ske?', aabning: ['Hvad fylder mest?', 'Hvad ser du?', 'Hvad undrer dig?'], skaerpelse: ['Hvad overser du?', 'Hvad taler I ikke om?', 'Hvad er mønstret?'], perspektiv: ['Hvad ville en ny leder se?', 'Hvad siger data?', 'Hvad er den ærlige version?'], erkendelse: 'At se virkeligheden som den er.' },
      { nr: 2, label: 'Strategisk analyse', forside: 'Hvad er problemet bag problemet?', aabning: ['Hvad er kernen?', 'Hvornår startede det?', 'Hvem mærker det mest?'], skaerpelse: ['Hvad vedligeholder problemet?', 'Hvad er din andel?', 'Hvad sker der om et år?'], perspektiv: ['Hvad ville du anbefale andre?', 'Hvad er du bange for?', 'Hvad er det rigtige spørgsmål?'], erkendelse: 'At stille den rigtige diagnose.' },
      { nr: 3, label: 'Strategisk valg', forside: 'Hvad vælger du — og hvad vælger du fra?', aabning: ['Hvad er mulighederne?', 'Hvad trækker dig?', 'Hvad holder dig tilbage?'], skaerpelse: ['Hvad koster det at vente?', 'Hvad siger du nej til?', 'Hvem påvirkes?'], perspektiv: ['Hvad ville du ønske du havde valgt?', 'Hvad er det modige valg?', 'Hvad kan du leve med?'], erkendelse: 'At vælge er at vælge fra.' },
      { nr: 4, label: 'Strategisk organisering', forside: 'Hvordan organiserer du det?', aabning: ['Hvad skal ændres?', 'Hvem skal involveres?', 'Hvad er første skridt?'], skaerpelse: ['Hvad kan gå galt?', 'Hvad mangler?', 'Hvem har modstand?'], perspektiv: ['Hvad er den enkleste vej?', 'Hvad kræver det af dig?', 'Hvad kan du delegere?'], erkendelse: 'Struktur er design.' },
      { nr: 5, label: 'Strategisk praksis', forside: 'Kan du se det tirsdag kl. 10?', aabning: ['Hvad sker der i praksis?', 'Hvad kan du observere?', 'Hvad mærker du?'], skaerpelse: ['Passer det med planen?', 'Hvad overrasker dig?', 'Hvad justerer du?'], perspektiv: ['Hvad ville lærerne sige?', 'Hvad er du stolt af?', 'Hvad mangler stadig?'], erkendelse: 'Strategien skal kunne mærkes.' },
      { nr: 6, label: 'Strategisk forankring', forside: 'Hvordan holder du det levende?', aabning: ['Hvad truer forankringen?', 'Hvad holder fast?', 'Hvornår tjekker du?'], skaerpelse: ['Hvad glemmer du først?', 'Hvad kræver disciplin?', 'Hvad fejrer du?'], perspektiv: ['Hvad er dit system?', 'Hvem hjælper dig?', 'Hvad er dit næste skridt?'], erkendelse: 'Strategier dør af glemsel.' },
    ],
    human: [
      { nr: 1, label: 'Det menneskelige rum', forside: 'Hvad gør usikkerheden ved dig?', aabning: ['Hvad fylder hos dig?', 'Hvad er du usikker på?', 'Hvad har du brug for?'], skaerpelse: ['Hvad gør du med usikkerheden?', 'Hvem taler du med?', 'Hvad beskytter du dig mod?'], perspektiv: ['Hvad ville du sige til en ven?', 'Hvad giver dig ro?', 'Hvad har du lært om dig selv?'], erkendelse: 'At rumme usikkerhed.' },
      { nr: 2, label: 'Det menneskelige rum', forside: 'Hvad koster det dig at lede?', aabning: ['Hvad slider?', 'Hvad savner du?', 'Hvad giver energi?'], skaerpelse: ['Hvornår mærker du prisen?', 'Hvad gør du ved det?', 'Hvad overser du hos dig selv?'], perspektiv: ['Hvad ville du ønske?', 'Hvad er godt nok?', 'Hvad tager du med?'], erkendelse: 'Ledelse koster — og giver.' },
      { nr: 3, label: 'Det menneskelige rum', forside: 'Hvad kræver det at vælge?', aabning: ['Hvad er svært?', 'Hvad frygter du?', 'Hvad håber du?'], skaerpelse: ['Hvad holder dig vågen?', 'Hvem bærer du ansvar for?', 'Hvad kan du ikke kontrollere?'], perspektiv: ['Hvad er dit kompas?', 'Hvad stoler du på?', 'Hvad accepterer du?'], erkendelse: 'Valg kræver mod.' },
      { nr: 4, label: 'Det menneskelige rum', forside: 'Hvem er du i organisationen?', aabning: ['Hvilken rolle tager du?', 'Hvad forventes af dig?', 'Hvad vil du selv?'], skaerpelse: ['Hvornår er du ikke dig selv?', 'Hvad spiller du?', 'Hvad koster det?'], perspektiv: ['Hvem vil du være?', 'Hvad giver autoritet?', 'Hvad er autentisk?'], erkendelse: 'Rollen former lederen.' },
      { nr: 5, label: 'Det menneskelige rum', forside: 'Hvad ser vi — som vi ikke taler om?', aabning: ['Hvad ved alle?', 'Hvad ville vi se?', 'Hvornår er der forskel?'], skaerpelse: ['Hvem betaler prisen?', 'Hvad med tilliden?', 'Hvornår beskytter vi os selv?'], perspektiv: ['Hvad ville ændre sig?', 'Hvad siger I nu?', 'Hvad tager du ansvar for?'], erkendelse: 'Mod til virkeligheden.' },
      { nr: 6, label: 'Det menneskelige rum', forside: 'Hvad kræver det at holde fast?', aabning: ['Hvad er det sværeste?', 'Hvad har du brug for?', 'Hvornår er tvivl okay?'], skaerpelse: ['Hvad sker der med mennesker?', 'Hvornår presser vi?', 'Hvad koster manglende plads?'], perspektiv: ['Hvad giver energi?', 'Hvad tager du med?', 'Hvad gør du for dig selv?'], erkendelse: 'Hvad forandring kræver.' },
    ]
  }
}

// ── Realistiske scenarier baseret på research ────────────────
const SCENARIER = [
  // Inklusion
  { tema: 'inklusion', beskrivelse: 'Vi har fået tre nye elever med særlige behov, og lærerne føler sig presset. Vi mangler ressourcer og kompetencer til at håndtere det ordentligt.', rolle: 'skoleleder' },
  { tema: 'inklusion', beskrivelse: 'Inklusionen fylder enormt. Halvdelen af mine lærere siger de ikke kan mere. Vi har ikke nok støttetimer, og forældrene klager.', rolle: 'skoleleder' },
  { tema: 'inklusion', beskrivelse: 'Vi skal drøfte skolens inklusionsstrategi. Lærerne er delte — nogle vil have flere specialtilbud, andre vil have mere støtte i klassen.', rolle: 'ledelsesteam' },
  { tema: 'inklusion', beskrivelse: 'Som bestyrelse skal vi tage stilling til om vi vil investere i et ressourcecenter eller i flere støttetimer. Budgettet er stramt.', rolle: 'bestyrelse' },

  // Rekruttering og fastholdelse
  { tema: 'rekruttering', beskrivelse: 'Vi kan ikke skaffe lærere. Vi har haft to ubesatte stillinger i fire måneder. Vikardækningen slider på de faste lærere.', rolle: 'skoleleder' },
  { tema: 'rekruttering', beskrivelse: 'To af vores bedste lærere har sagt op. De siger arbejdspresset er for stort. Jeg er bange for en dominoeffekt.', rolle: 'skoleleder' },
  { tema: 'rekruttering', beskrivelse: 'Vi mister dygtige folk. Hvad kan vi gøre som ledelsesteam for at skabe en arbejdsplads folk bliver på?', rolle: 'ledelsesteam' },

  // Folkeskolereform 2026
  { tema: 'reform', beskrivelse: 'Den nye reform giver os mere frihed, men også mere ansvar. Jeg ved ikke hvor vi skal starte med de nye fagplaner.', rolle: 'skoleleder' },
  { tema: 'reform', beskrivelse: 'Vi skal implementere nye fagplaner samtidig med at hverdagen kører. Lærerne er trætte af forandringer.', rolle: 'skoleleder' },
  { tema: 'reform', beskrivelse: 'Bestyrelsen skal beslutte hvordan vi bruger den øgede frihed fra reformen. Hvad prioriterer vi?', rolle: 'bestyrelse' },

  // Forældresamarbejde
  { tema: 'foraeldresamarbejde', beskrivelse: 'Vi har en gruppe forældre der er meget kritiske og dominerende. Det tager al min energi og tager fokus fra det vigtige.', rolle: 'skoleleder' },
  { tema: 'foraeldresamarbejde', beskrivelse: 'Forældrene vil have mere indflydelse, men de forstår ikke altid den pædagogiske baggrund for vores beslutninger.', rolle: 'skoleleder' },
  { tema: 'foraeldresamarbejde', beskrivelse: 'Samarbejdet mellem bestyrelse og forældrekreds er anspændt. Der er mistillid efter en kontroversiel beslutning.', rolle: 'bestyrelse' },

  // Ledelsesteam-samarbejde
  { tema: 'ledelsesteam', beskrivelse: 'Mit ledelsesteam fungerer ikke optimalt. Vi har for mange bolde i luften og ingen klar prioritering.', rolle: 'skoleleder' },
  { tema: 'ledelsesteam', beskrivelse: 'Vi er tre i ledelsesteamet, men vi taler forbi hinanden. Der er uklarhed om hvem der har ansvar for hvad.', rolle: 'ledelsesteam' },
  { tema: 'ledelsesteam', beskrivelse: 'Som nyt ledelsesteam skal vi finde vores fælles retning. Vi kommer fra meget forskellige ledelsestraditioner.', rolle: 'ledelsesteam' },

  // Faglig ledelse
  { tema: 'faglig_ledelse', beskrivelse: 'Jeg bruger 80% af min tid på drift og brandslukning. Den faglige ledelse drukner i administration.', rolle: 'skoleleder' },
  { tema: 'faglig_ledelse', beskrivelse: 'Kvaliteten af undervisningen varierer enormt mellem vores lærere. Jeg ved ikke hvordan jeg griber det an uden at virke kontrollerende.', rolle: 'skoleleder' },
  { tema: 'faglig_ledelse', beskrivelse: 'Vi vil gerne have mere faglig ledelse tæt på undervisningen, men hvornår? Kalenderen er fuld.', rolle: 'ledelsesteam' },

  // Trivsel og psykisk arbejdsmiljø
  { tema: 'trivsel', beskrivelse: 'Trivselsundersøgelsen viser at mange lærere er pressede. Sygefraværet er steget 40% det sidste år.', rolle: 'skoleleder' },
  { tema: 'trivsel', beskrivelse: 'Der er en kultur hvor folk ikke siger fra. Alle kører på over evne, og ingen taler om det.', rolle: 'skoleleder' },
  { tema: 'trivsel', beskrivelse: 'Personalet er slidt. Hvordan sikrer vi som ledelse at folk trives, samtidig med at opgaverne skal løses?', rolle: 'ledelsesteam' },

  // Bestyrelsesgoverance
  { tema: 'governance', beskrivelse: 'Bestyrelsen blander sig for meget i den daglige ledelse. Grænsen mellem governance og drift er uklar.', rolle: 'skoleleder' },
  { tema: 'governance', beskrivelse: 'Vi har som bestyrelse svært ved at holde det strategiske fokus. Møderne drukner i enkeltsager.', rolle: 'bestyrelse' },
  { tema: 'governance', beskrivelse: 'Halvdelen af bestyrelsen er nye. De kender ikke forskellen på deres rolle og lederens rolle.', rolle: 'bestyrelse' },

  // Prioritering og tidspres
  { tema: 'prioritering', beskrivelse: 'Alt er vigtigt, og intet kan vente. Jeg har 15 projekter kørende og kan ikke overskue det.', rolle: 'skoleleder' },
  { tema: 'prioritering', beskrivelse: 'Vi siger ja til alt. Kommunen vil have os med i udviklingsprojekter, forældre vil have aktiviteter, lærerne vil have ro.', rolle: 'skoleleder' },
  { tema: 'prioritering', beskrivelse: 'Som ledelsesteam kan vi ikke blive enige om hvad der er vigtigst. Alle har deres kæpheste.', rolle: 'ledelsesteam' },

  // Forandringstræthed
  { tema: 'forandringstraethed', beskrivelse: 'Lærerne er forandringstrætte. Hver gang vi præsenterer noget nyt, møder vi modstand og opgivelse.', rolle: 'skoleleder' },
  { tema: 'forandringstraethed', beskrivelse: 'Vi har haft tre store forandringer på to år. Folk er udbrændte. Jeg er selv træt.', rolle: 'skoleleder' },

  // Ny skoleleder
  { tema: 'ny_leder', beskrivelse: 'Jeg er ny skoleleder og arver en kultur med mange usynlige regler. Jeg ved ikke hvem jeg kan stole på.', rolle: 'skoleleder' },
  { tema: 'ny_leder', beskrivelse: 'Jeg har været leder i tre måneder. Lærerne sammenligner mig konstant med den forrige leder.', rolle: 'skoleleder' },

  // Delegation
  { tema: 'delegation', beskrivelse: 'Jeg kan ikke slippe kontrollen. Jeg ved godt jeg skal delegere mere, men jeg stoler ikke på at det bliver gjort ordentligt.', rolle: 'skoleleder' },
  { tema: 'delegation', beskrivelse: 'Vi taler om distribueret ledelse, men i praksis lander alt hos mig. Mellemlederne tager ikke ansvar.', rolle: 'skoleleder' },

  // Kommunikation
  { tema: 'kommunikation', beskrivelse: 'Informationen når ikke ud. Lærerne siger de aldrig hører noget, men vi sender nyhedsbreve og holder møder.', rolle: 'skoleleder' },
  { tema: 'kommunikation', beskrivelse: 'Der er rygter og snak i krogene. Den uformelle kommunikation underminerer vores beslutninger.', rolle: 'ledelsesteam' },

  // Digital transformation
  { tema: 'digitalisering', beskrivelse: 'Vi skal digitalisere mere, men halvdelen af personalet er teknologiforskrækket. Og budgettet er begrænset.', rolle: 'skoleleder' },

  // Økonomi
  { tema: 'oekonomi', beskrivelse: 'Bestyrelsen skal spare 500.000 kr. Vi kan ikke undgå at det rammer undervisningen. Hvad gør vi?', rolle: 'bestyrelse' },
  { tema: 'oekonomi', beskrivelse: 'Vores elevtal falder. Om tre år har vi måske 20% færre elever. Vi skal handle nu.', rolle: 'bestyrelse' },

  // Skolekultur
  { tema: 'skolekultur', beskrivelse: 'Der er klikedannelse i personalegruppen. To grupper der ikke samarbejder. Det påvirker eleverne.', rolle: 'skoleleder' },
  { tema: 'skolekultur', beskrivelse: 'Vi vil gerne skabe en mere samarbejdende kultur, men de erfarne lærere holder fast i "sådan gør vi her".', rolle: 'ledelsesteam' },

  // Strategisk retning
  { tema: 'strategisk_retning', beskrivelse: 'Vi har en flot strategi på papir, men ingen kan se den i hverdagen. Den lever ikke.', rolle: 'skoleleder' },
  { tema: 'strategisk_retning', beskrivelse: 'Vi skal formulere en ny vision for skolen. Men vi er uenige om retningen i bestyrelsen.', rolle: 'bestyrelse' },

  // Elevtrivsel
  { tema: 'elevtrivsel', beskrivelse: 'Elevtrivslen er faldet markant i overbygningen. Der er konflikter, mobning og fravær.', rolle: 'skoleleder' },
  { tema: 'elevtrivsel', beskrivelse: 'Vi har elever der mistrives, men lærerne føler ikke de har redskaberne til at gøre noget ved det.', rolle: 'ledelsesteam' },
]

// ── Opfølgende svar (simulerer brugerens dybde-refleksion) ───
const OPFOELGNINGER = [
  'Ja, det er præcis det der fylder. Og det værste er at jeg ikke ved hvor jeg skal starte.',
  'Det handler nok mest om at jeg ikke har turdet sige det højt endnu.',
  'Når du spørger sådan, kan jeg mærke at det egentlig handler om noget andet.',
  'Vi har talt om det før, men det ender altid med at vi parkerer det.',
  'Jeg tror det handler om tillid. Eller mangel på samme.',
  'Det er et godt spørgsmål. Jeg tror svaret gør mig utilpas.',
  'Ja, der er et mønster. Det er det samme der sker igen og igen.',
  'Lærerne siger det ene, men gør noget andet. Og jeg ved ikke hvordan jeg adresserer det.',
  'Det koster mig søvn. Bogstaveligt talt.',
  'Vi har prøvet at løse det før, men det vender altid tilbage.',
  'Jeg tror vi undgår den svære samtale. Alle ved det, men ingen siger det.',
  'Det handler om prioritering — men vi kan ikke blive enige om hvad der er vigtigst.',
  'Ja, men hvad gør jeg med det? Jeg føler mig alene med det.',
  'Der er en elefant i rummet. Alle kan se den, men vi går udenom.',
  'Det giver mening. Men det kræver mod at handle på det.',
]

// ── Hjælpefunktioner ──────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getKortForTrin(rolle, trin, type) {
  const data = KORT_DATA[rolle] || KORT_DATA.skoleleder
  const kort = data[type]
  if (!kort) return null
  return kort.find(k => k.nr === trin) || kort[0]
}

async function sendMessage(sessionId, message, trin, rolle, kort) {
  const body = {
    message,
    source: 'forloeb',
    trin,
    rolle,
    mode: 'forberedelse',
    kort: kort ? {
      forside: kort.forside,
      aabning: kort.aabning,
      skaerpelse: kort.skaerpelse,
      perspektiv: kort.perspektiv,
      erkendelse: kort.erkendelse,
      label: kort.label
    } : undefined
  }
  if (sessionId) body.session_id = sessionId

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ORIGIN
      },
      body: JSON.stringify(body)
    })
    const data = await resp.json()
    return {
      reply: data.reply || data.data?.reply,
      session_id: data.session_id || data.data?.session_id
    }
  } catch (e) {
    console.error(`  Fejl: ${e.message}`)
    return { reply: null, session_id: sessionId }
  }
}

// ── Kør én samtale ────────────────────────────────────────────

async function runConversation(scenarie, index) {
  const { tema, beskrivelse, rolle } = scenarie

  // Vælg et tilfældigt trin (1-6) og korttype
  const trin = Math.floor(Math.random() * 6) + 1
  const kortType = Math.random() > 0.5 ? 'model' : 'human'
  const kort = getKortForTrin(rolle, trin, kortType)

  console.log(`[${index + 1}] ${rolle} — Trin ${trin} (${kortType}) — ${tema}`)

  // Første besked: scenariet
  let result = await sendMessage(null, beskrivelse, trin, rolle, kort)
  if (!result.reply) {
    console.log(`  ⚠ Ingen svar`)
    return
  }
  console.log(`  AI: ${result.reply.substring(0, 80)}...`)

  // 2-4 opfølgende beskeder for dybde
  const turns = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < turns; i++) {
    await sleep(1500 + Math.random() * 2000) // Rate limiting
    const opfoelg = pick(OPFOELGNINGER)
    result = await sendMessage(result.session_id, opfoelg, trin, rolle, kort)
    if (!result.reply) break
    console.log(`  AI: ${result.reply.substring(0, 80)}...`)
  }

  console.log(`  ✓ Samtale færdig (${turns + 1} beskeder)`)
}

// ── Hovedfunktion ─────────────────────────────────────────────

async function main() {
  console.log('=== Strategiskskole.dk AI Træning ===')
  console.log(`Kører ${SCENARIER.length} scenarier...`)
  console.log()

  let success = 0
  let failed = 0

  for (let i = 0; i < SCENARIER.length; i++) {
    try {
      await runConversation(SCENARIER[i], i)
      success++
    } catch (e) {
      console.error(`  ✗ Fejl: ${e.message}`)
      failed++
    }
    // Rate limiting — vent mellem samtaler
    await sleep(2000 + Math.random() * 3000)
  }

  console.log()
  console.log('=== Resultat ===')
  console.log(`Gennemført: ${success}/${SCENARIER.length}`)
  console.log(`Fejlede: ${failed}`)
  console.log()
  console.log('Kør nu harvest-scriptet for at samle viden:')
  console.log('  node scripts/harvest.js')
}

main().catch(console.error)
