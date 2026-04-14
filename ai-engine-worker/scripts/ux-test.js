#!/usr/bin/env node
// ============================================================
// UX-test: 3 profiler × udvalgte trin — systematisk AI-kvalitetstest
// ============================================================

const API_URL = 'https://strategi-chat.strategiskskole.workers.dev/api/chat'
const ORIGIN = 'https://strategiskskoledk-app.vercel.app'
const fs = await import('fs')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const KORT = {
  aabning: { forside:'Hvad fylder hos jer lige nu?', aabning:['Hvad fylder mest?','Hvad tager mest energi?','Hvad ville du ønske var anderledes?'], skaerpelse:['Hvad har I prøvet?','Hvad virker ikke længere?','Hvad undgår I at tale om?'], perspektiv:['Hvad ville en ny leder se?','Hvad er I stolte af?','Hvad savner I?'], erkendelse:'At se situationen som den er.', label:'Åbning' },
  model: [
    { nr:1, forside:'Hvad ser du egentlig ske?', aabning:['Hvad fylder mest?','Hvad ser du?','Hvad undrer dig?'], skaerpelse:['Hvad overser du?','Hvad taler I ikke om?','Hvad er mønstret?'], perspektiv:['Hvad ville en ny leder se?','Hvad siger data?','Hvad er den ærlige version?'], erkendelse:'At se virkeligheden som den er.', label:'Strategisk spejling' },
    { nr:2, forside:'Hvad er problemet bag problemet?', aabning:['Hvad er kernen?','Hvornår startede det?','Hvem mærker det mest?'], skaerpelse:['Hvad vedligeholder problemet?','Hvad er din andel?','Hvad sker der om et år?'], perspektiv:['Hvad ville du anbefale andre?','Hvad er du bange for?','Hvad er det rigtige spørgsmål?'], erkendelse:'At stille den rigtige diagnose.', label:'Strategisk analyse' },
    { nr:3, forside:'Hvad vælger du — og hvad vælger du fra?', aabning:['Hvad er mulighederne?','Hvad trækker dig?','Hvad holder dig tilbage?'], skaerpelse:['Hvad koster det at vente?','Hvad siger du nej til?','Hvem påvirkes?'], perspektiv:['Hvad ville du ønske du havde valgt?','Hvad er det modige valg?','Hvad kan du leve med?'], erkendelse:'At vælge er at vælge fra.', label:'Strategisk valg' },
    { nr:4, forside:'Hvordan organiserer du det?', aabning:['Hvad skal ændres?','Hvem skal involveres?','Hvad er første skridt?'], skaerpelse:['Hvad kan gå galt?','Hvad mangler?','Hvem har modstand?'], perspektiv:['Hvad er den enkleste vej?','Hvad kræver det af dig?','Hvad kan du delegere?'], erkendelse:'Struktur er design.', label:'Strategisk organisering' },
    { nr:5, forside:'Kan du se det tirsdag kl. 10?', aabning:['Hvad sker der i praksis?','Hvad kan du observere?','Hvad mærker du?'], skaerpelse:['Passer det med planen?','Hvad overrasker dig?','Hvad justerer du?'], perspektiv:['Hvad ville lærerne sige?','Hvad er du stolt af?','Hvad mangler stadig?'], erkendelse:'Strategien skal kunne mærkes.', label:'Strategisk praksis' },
    { nr:6, forside:'Hvordan holder du det levende?', aabning:['Hvad truer forankringen?','Hvad holder fast?','Hvornår tjekker du?'], skaerpelse:['Hvad glemmer du først?','Hvad kræver disciplin?','Hvad fejrer du?'], perspektiv:['Hvad er dit system?','Hvem hjælper dig?','Hvad er dit næste skridt?'], erkendelse:'Strategier dør af glemsel.', label:'Strategisk forankring' }
  ],
  human: [
    { nr:1, forside:'Hvad gør usikkerheden ved dig?', aabning:['Hvad fylder hos dig?','Hvad er du usikker på?','Hvad har du brug for?'], skaerpelse:['Hvad gør du med usikkerheden?','Hvem taler du med?','Hvad beskytter du dig mod?'], perspektiv:['Hvad ville du sige til en ven?','Hvad giver dig ro?','Hvad har du lært om dig selv?'], erkendelse:'At rumme usikkerhed.', label:'Det menneskelige rum' },
    { nr:2, forside:'Hvad koster det dig at lede?', aabning:['Hvad slider?','Hvad savner du?','Hvad giver energi?'], skaerpelse:['Hvornår mærker du prisen?','Hvad gør du ved det?','Hvad overser du hos dig selv?'], perspektiv:['Hvad ville du ønske?','Hvad er godt nok?','Hvad tager du med?'], erkendelse:'Ledelse koster — og giver.', label:'Det menneskelige rum' },
    { nr:3, forside:'Hvad kræver det at vælge?', aabning:['Hvad er svært?','Hvad frygter du?','Hvad håber du?'], skaerpelse:['Hvad holder dig vågen?','Hvem bærer du ansvar for?','Hvad kan du ikke kontrollere?'], perspektiv:['Hvad er dit kompas?','Hvad stoler du på?','Hvad accepterer du?'], erkendelse:'Valg kræver mod.', label:'Det menneskelige rum' },
    { nr:4, forside:'Hvem er du i organisationen?', aabning:['Hvilken rolle tager du?','Hvad forventes af dig?','Hvad vil du selv?'], skaerpelse:['Hvornår er du ikke dig selv?','Hvad spiller du?','Hvad koster det?'], perspektiv:['Hvem vil du være?','Hvad giver autoritet?','Hvad er autentisk?'], erkendelse:'Rollen former lederen.', label:'Det menneskelige rum' },
    { nr:5, forside:'Hvad ser vi — som vi ikke taler om?', aabning:['Hvad ved alle?','Hvad ville vi se?','Hvornår er der forskel?'], skaerpelse:['Hvem betaler prisen?','Hvad med tilliden?','Hvornår beskytter vi os selv?'], perspektiv:['Hvad ville ændre sig?','Hvad siger I nu?','Hvad tager du ansvar for?'], erkendelse:'Mod til virkeligheden.', label:'Det menneskelige rum' },
    { nr:6, forside:'Hvad kræver det at holde fast?', aabning:['Hvad er det sværeste?','Hvad har du brug for?','Hvornår er tvivl okay?'], skaerpelse:['Hvad sker der med mennesker?','Hvornår presser vi?','Hvad koster manglende plads?'], perspektiv:['Hvad giver energi?','Hvad tager du med?','Hvad gør du for dig selv?'], erkendelse:'Hvad forandring kræver.', label:'Det menneskelige rum' }
  ],
  afslutning: { forside:'Hvad tager du med?', aabning:['Hvad er din vigtigste erkendelse?','Hvad vil du gøre anderledes?','Hvad har overrasket dig?'], skaerpelse:['Hvad kræver mod?','Hvad starter du med i morgen?','Hvem inddrager du?'], perspektiv:['Hvad er dit næste skridt?','Hvad fejrer du?','Hvad vil du huske?'], erkendelse:'Fra erkendelse til handling.', label:'Afslutning' }
}

// Trin-sekvens (14 trin)
const TRIN = [
  { nr:0, type:'aabning', navn:'Åbning' },
  { nr:1, type:'model', navn:'Spejling (strategisk)' },
  { nr:1, type:'human', navn:'Usikkerhed (humant)' },
  { nr:2, type:'model', navn:'Klarhed (strategisk)' },
  { nr:2, type:'human', navn:'Sårbarhed (humant)' },
  { nr:3, type:'model', navn:'Valg (strategisk)' },
  { nr:3, type:'human', navn:'Mod (humant)' },
  { nr:4, type:'model', navn:'Organisering (strategisk)' },
  { nr:4, type:'human', navn:'Tillid (humant)' },
  { nr:5, type:'model', navn:'Kernen (strategisk)' },
  { nr:5, type:'human', navn:'Ærlighed (humant)' },
  { nr:6, type:'model', navn:'Forankring (strategisk)' },
  { nr:6, type:'human', navn:'Forankring-menneske (humant)' },
  { nr:7, type:'afslutning', navn:'Afslutning' }
]

const PROFILER = {
  A: {
    rolle: 'skoleleder',
    navn: 'Profil A — Erfaren skoleleder (friskole, 15 års erfaring)',
    beskeder: {
      aabning: 'Vi mister elever til nabokommunens nye folkeskole. De har fået 40 millioner til renovering og markedsfører sig aggressivt. Vi er 142 elever nu, var 168 for tre år siden. Jeg skal gentænke hele vores positionering.',
      model_1: 'Når jeg ser på det der faktisk sker, er det at forældrene vælger os fra fordi de tror folkeskolen er billigere og tættere på. Men vores faglige resultater er bedre. Det ved bare ingen.',
      human_1: 'Usikkerheden æder mig op. Jeg har bygget denne skole op i 15 år og nu kan jeg se den skrumpe. Det føles som et personligt nederlag selvom jeg ved det er markedskræfter.',
      model_2: 'Problemet bag problemet er nok at vi aldrig har formuleret hvad vi er. Vi har bare været "den gode friskole". Men det er ikke nok mere når folkeskolen profilerer sig.',
      human_2: 'Det sværeste er at jeg skal motivere personalet mens jeg selv tvivler. Tre lærere spørger om skolen overlever. Jeg siger ja, men jeg ved det ikke.',
      model_3: 'Vi står overfor et valg: Investere i markedsføring og synlighed, eller investere i det pædagogiske indhold og håbe det taler for sig selv. Vi har ikke råd til begge.',
      human_3: 'Jeg frygter at vi vælger forkert. Og at det bliver mit ansvar. Mine børn går selv på skolen. Det er ikke bare et job.',
      model_4: 'Vi skal organisere en indsats med forældreambassadører, synlighed i lokalpressen, og åbent hus-arrangementer. Men hvem driver det? Alle har allerede for meget.',
      human_4: 'Jeg skal stole på bestyrelsen, men halvdelen er nye. De kender ikke skolens DNA. Og den gamle formand der kendte alt, er gået.',
      model_5: 'Vores strategiske kerne er det nære fællesskab. Hver elev er kendt. Det kan folkeskolen med 600 elever ikke matche. Men kan vi omsætte det til noget synligt?',
      human_5: 'Det vi ikke taler om er at to af vores bedste lærere overvejer at søge til folkeskolen pga. bedre løn. Hvis de går, mister vi mere end kompetencer.',
      model_6: 'Forankringen kræver at vi gentager vores fortælling igen og igen. Til forældre, til nye familier, til os selv. Det kræver disciplin.',
      human_6: 'Det sværeste er at holde modet oppe hos mig selv og andre når tallene peger nedad. Jeg har brug for nogen der tror på det lige så meget som mig.',
      afslutning: 'Jeg tager med mig at vi skal definere hvem vi er, ikke bare hvad vi gør. Og at jeg ikke skal bære det alene. Bestyrelsen og lærerne skal med ind i kampen.'
    }
  },
  B: {
    rolle: 'ledelsesteam',
    navn: 'Profil B — Ny leder i ledelsesteam (efterskole, 8 måneder)',
    beskeder: {
      aabning: 'Jeg er ny i ledelsesteamet og føler mig som en gæst ved andres bord. De to andre har været her i 12 og 8 år. Bestyrelsen presser på for bedre økonomi, kollegerne vil have pædagogisk ledelse, og jeg ved ikke hvad min rolle er.',
      model_1: 'Jeg ser at vi som ledelsesteam koordinerer drift men aldrig taler strategi. Møderne handler om vikardækning og skemaproblemer. Aldrig om retning.',
      human_1: 'Usikkerheden er konstant. Jeg ved ikke om mine ideer er velkomne. De nikker til møderne men gør som de plejer bagefter.',
      model_2: 'Kerneproblem er at vi aldrig har defineret vores ledelsesteam-identitet. Vi er tre individer der leder hvert sit, ikke et team der leder sammen.',
      human_2: 'Det koster mig søvn. Jeg føler mig som en bedrager. Alle andre virker så sikre, og jeg famler.',
      model_3: 'Vi skal vælge: Fortsætte som tre parallelle ledere, eller investere i at blive et reelt team. Det kræver tid vi ikke har.',
      human_3: 'Jeg frygter konfrontationen. Hvis jeg siger "vi fungerer ikke som team", risikerer jeg at blive den besværlige nye.',
      model_4: 'Første skridt er et fælles seminar hvor vi definerer roller og ansvar. Men hvem tager initiativet? Det føles som om det burde være forstanderen.',
      human_4: 'Tillid bygges langsomt. Jeg skal vise at jeg kan noget, før de andre lukker mig ind. Men hvordan viser man det når man aldrig får bolden?',
      model_5: 'Vores strategiske kerne som ledelsesteam bør være at vi supplerer hinanden. Min baggrund i økonomi, deres i pædagogik. Men det kræver at vi anerkender hinanden.',
      human_5: 'Det vi ikke taler om er at forstanderen er udbrændt. Alle kan se det, men ingen siger det. Og jeg som ny kan slet ikke.',
      model_6: 'Forankring af et nyt samarbejde kræver ritualer. Faste ledelsesmøder med strategisk dagsorden. Ikke bare når der er brand.',
      human_6: 'Jeg har brug for at vide at det er okay at tvivle. At otte måneder ikke er lang tid. At jeg ikke skal have alle svarene endnu.',
      afslutning: 'Min erkendelse er at jeg skal turde tage plads. Ikke som den der ved mest, men som den der spørger bedst. Teamet har brug for nogen der tør sætte ord på det usynlige.'
    }
  },
  C: {
    rolle: 'bestyrelse',
    navn: 'Profil C — Bestyrelsesformand (fri grundskole, forældrevalgt)',
    beskeder: {
      aabning: 'Vores skoleleder har sagt op med tre måneders varsel. Vi har ingen stedfortræder og ingen plan. Jeg er forældrevalgt formand med en baggrund i salg, ikke skoleledelse. Jeg aner ikke hvor vi skal starte.',
      model_1: 'Jeg ser at bestyrelsen er i panik. Halvdelen vil ansætte hurtigt, den anden halvdel vil bruge tiden til at tænke strategi. Og forældrene er nervøse.',
      human_1: 'Jeg er bange for at vi træffer en forhastet beslutning og ansætter den forkerte. Eller at vi venter for længe og mister gode kandidater.',
      model_2: 'Problemet bag problemet er måske at vi aldrig har formuleret hvad vi forventer af en skoleleder. Vi ansatte den forrige for 11 år siden og lod bare tingene køre.',
      human_2: 'Det er sårbart at sidde som formand og ikke vide hvad jeg laver. Mine bestyrelseskollegaer kigger på mig og forventer retning.',
      model_3: 'Vi skal vælge: Bruger vi et rekrutteringsbureau, eller finder vi selv? Og vigtigere: Bruger vi krisen til at gentænke skolens retning?',
      human_3: 'Det modige ville være at sige: Vi skal ikke bare erstatte den gamle leder. Vi skal finde ud af hvad skolen har brug for de næste 10 år.',
      model_4: 'Vi skal organisere en interimløsning for de tre måneder, en ansættelsesproces, og en strategiproces. Tre ting på én gang. Med frivillige bestyrelsesmedlemmer.',
      human_4: 'Jeg skal stole på mine bestyrelseskollegaer. Men to af dem er nye og en tredje er i konflikt med den afgående leder.',
      model_5: 'Vores strategiske kerne som bestyrelse er at vi repræsenterer forældrene og sikrer skolens fremtid. Det er vi nødt til at huske midt i krisen.',
      human_5: 'Det vi ikke taler om er at den afgående leder sagde op fordi hun var udbrændt og bestyrelsen pressede for meget. Er vi en del af problemet?',
      model_6: 'Forankringen kræver at vi skriver ned hvad vi gør og hvorfor. Så den næste bestyrelse ikke starter forfra.',
      human_6: 'Det sværeste er at erkende at vi som bestyrelse måske har fejlet. At vi ikke passede godt nok på vores leder.',
      afslutning: 'Jeg tager med mig at bestyrelsen skal løfte sig fra brandslukning til strategi. Og at vi skylder den nye leder en klarere rollefordeling end vi gav den forrige.'
    }
  }
}

async function sendMsg(sessionId, message, trin, rolle, kort) {
  const body = { message, source:'forloeb', trin, rolle, mode:'forberedelse' }
  if (kort) body.kort = { forside:kort.forside, aabning:kort.aabning, skaerpelse:kort.skaerpelse, perspektiv:kort.perspektiv, erkendelse:kort.erkendelse, label:kort.label }
  if (sessionId) body.session_id = sessionId
  const resp = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json','Origin':ORIGIN}, body:JSON.stringify(body) })
  const data = await resp.json()
  return { reply: data.reply||data.data?.reply, session_id: data.session_id||data.data?.session_id }
}

function getKort(step) {
  if (step.type === 'aabning') return KORT.aabning
  if (step.type === 'afslutning') return KORT.afslutning
  if (step.type === 'model') return KORT.model[step.nr - 1]
  if (step.type === 'human') return KORT.human[step.nr - 1]
  return null
}

function getMsgKey(step) {
  if (step.type === 'aabning') return 'aabning'
  if (step.type === 'afslutning') return 'afslutning'
  return `${step.type}_${step.nr}`
}

async function testProfile(profilKey) {
  const profil = PROFILER[profilKey]
  console.log(`\n${'='.repeat(60)}`)
  console.log(`${profil.navn}`)
  console.log(`${'='.repeat(60)}`)

  const results = []

  for (let i = 0; i < TRIN.length; i++) {
    const step = TRIN[i]
    const kort = getKort(step)
    const msgKey = getMsgKey(step)
    const userMsg = profil.beskeder[msgKey]

    if (!userMsg) {
      console.log(`\n--- Trin ${i+1}: ${step.navn} — INGEN BESKED ---`)
      continue
    }

    console.log(`\n--- Trin ${i+1}: ${step.navn} ---`)
    console.log(`BRUGER: ${userMsg.substring(0, 100)}...`)

    const result = await sendMsg(null, userMsg, step.nr, profil.rolle, kort)
    if (result.reply) {
      console.log(`AI: ${result.reply.substring(0, 200)}...`)
      results.push({ trin: i+1, navn: step.navn, type: step.type, bruger: userMsg, ai: result.reply })
    } else {
      console.log(`AI: INGEN SVAR`)
      results.push({ trin: i+1, navn: step.navn, type: step.type, bruger: userMsg, ai: '(ingen svar)' })
    }
    await sleep(1500)
  }

  return results
}

async function main() {
  console.log('=== UX-TEST: 3 profiler × 14 trin ===')
  const allResults = {}

  for (const key of ['A', 'B', 'C']) {
    allResults[key] = await testProfile(key)
  }

  // Gem resultater
  const output = JSON.stringify(allResults, null, 2)
  fs.writeFileSync('scripts/ux-test-results.json', output)
  console.log('\n\nResultater gemt i scripts/ux-test-results.json')
}

main().catch(console.error)
