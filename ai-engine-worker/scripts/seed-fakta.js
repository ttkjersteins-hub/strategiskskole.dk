#!/usr/bin/env node
// Seed kuraterede fakta — sikrer chatbotten ALTID har korrekt info
// Brug: node scripts/seed-fakta.js
import { execSync } from 'child_process'

const DB = 'strategiskskole-ai'

function d1(sql) {
  const s = sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --command="${s.replace(/"/g, '\\"')}"`,
      { encoding: 'utf-8', timeout: 20000, stdio: ['pipe', 'pipe', 'pipe'] })
    return true
  } catch { return false }
}

function esc(s) { return s.replace(/'/g, "''") }

function add(tema, indhold, kontekst = '') {
  const sql = `INSERT INTO shared_knowledge (id, tema, type, indhold, kontekst, kilde, kvalitet) VALUES (lower(hex(randomblob(16))), '${tema}', 'fakta', '${esc(indhold)}', '${esc(kontekst)}', 'kurateret-fakta', 1.0)`
  return d1(sql)
}

console.log('Indsætter kuraterede fakta...')

const FAKTA = [
  // Modellen — autoritative korrekte navne
  ['tirsdag_kl10', 'Tirsdag kl. 10-modellen® består af præcis 6 trin i denne rækkefølge: 1. Spejling, 2. Analyse, 3. Valg, 4. Organisering, 5. Kernen, 6. Forankring. Disse er de eneste korrekte trin-navne — brug aldrig andre.', 'Officielt trin-navn'],
  ['tirsdag_kl10', 'Tirsdag kl. 10-modellen® har et centralt testspørgsmål: "Kan vi se strategien i det, der sker tirsdag kl. 10?" Dette er modellens kerne — om strategien er synlig i hverdagen.', 'Modellens kerne'],
  ['tirsdag_kl10', 'Tirsdag kl. 10-modellen® arbejder med 3 roller: Skolelederen, Ledelsesteamet og Bestyrelsen. Hver rolle har sin egen indgang til modellen.', 'De 3 roller'],
  ['tirsdag_kl10', 'Det menneskelige spor i Tirsdag kl. 10-modellen® har 6 humane kort: Usikkerhed, Sårbarhed, Mod, Tillid, Ærlighed, og Forankring (det personlige). De arbejder parallelt med de strategiske trin.', 'Humane kort'],
  ['tirsdag_kl10', 'Det digitale proceskortforløb til Tirsdag kl. 10-modellen® findes på strategiskskole.dk/forloeb/ (med adgangskode) eller læs om det på strategiskskole.dk/digitalt-forloeb.html.', 'Korrekt URL til forløbet'],

  // Tre Stole-modellen
  ['ydelse', 'Tre Stole-modellen™ er et flagskibsforløb for hele skolens ledelse — bestyrelse, skoleleder og ledelsesteam — der bygger fælles strategi-grammatik over 8-10 uger. Læs mere på strategiskskole.dk/lp-tre-stole.html.', 'Korrekt URL til Tre Stole'],

  // Kontakt-info — autoritative
  ['kontakt', 'Thomas Kjerstein er grundlægger og ejer af Strategiskskole.dk. Han er viceleder på Feldballe Friskole & Børnehus i Ebeltoft. Kontakt: thomas@strategiskskole.dk eller 61 65 73 65. Adresse: Munkebakken 17, 8400 Ebeltoft.', 'Thomas kontakt-info'],
  ['kontakt', 'For at booke en uforpligtende samtale med Thomas: Ring 61 65 73 65 eller skriv til thomas@strategiskskole.dk. Første samtale er gratis og varer ca. 60 minutter.', 'Booking'],

  // Priser — sandhed
  ['ydelser', 'Priser på forløb og ydelser hos Strategiskskole.dk afhænger af opgavens omfang og varighed. Der er ingen fast pris-liste på hjemmesiden. For et konkret tilbud skal man kontakte Thomas på 61 65 73 65 eller thomas@strategiskskole.dk.', 'Pris-håndtering'],
  ['ydelser', 'Strategiskskole.dk tilbyder bl.a.: Strategisk skoleledelse, Ny i lederrollen (de første 100 dage), Strategi i hverdagspraksis, Bestyrelsen som strategisk aktiv, Lederskifte, Forandringsledelse, Tre Stole-modellen™, Introduktionsworkshop, Det digitale proceskortforløb, og Individuel afklaring. Se alle på strategiskskole.dk/ydelser.html.', 'Ydelser-oversigt'],

  // Korrekte URL'er
  ['urls', 'Korrekte URL\\u0027er på strategiskskole.dk: Forsiden er strategiskskole.dk. Ydelser: /ydelser.html. Om os: /om-os.html. Kontakt: /kontakt.html. Tirsdag kl. 10-modellen: /tirsdag-kl10-modellen.html. Tre Stole-modellen: /lp-tre-stole.html. Det digitale forløb: /forloeb/ eller /digitalt-forloeb.html. Forløb-login: /forloeb/.', 'URL-oversigt'],

  // Værdier
  ['om_os', 'Strategiskskole.dk arbejder med konsulentydelser til frie grundskoler, friskoler, efterskoler og lignende. Målgruppe: skoleledere, ledelsesteams og bestyrelser. Tilgangen er praksisnær, ikke teoretisk — strategi skal kunne mærkes om tirsdagen kl. 10.', 'Værdier og målgruppe'],
]

let ok = 0, fail = 0
for (const [tema, indhold, kontekst] of FAKTA) {
  if (add(tema, indhold, kontekst)) ok++
  else fail++
}

console.log(`Indsat: ${ok} fakta. Fejl: ${fail}.`)
