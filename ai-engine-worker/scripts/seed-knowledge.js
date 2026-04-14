#!/usr/bin/env node
// ============================================================
// Seed Knowledge — Indsætter kurateret rådgiverviden direkte i D1
// 50 emner × 3 roller + sprogmønstre + dialogeksempler
// Brug: node scripts/seed-knowledge.js
// ============================================================

import { execSync } from 'child_process'
const DB = 'strategiskskole-ai'

function d1(sql) {
  const s = sql.replace(/\n/g,' ').replace(/\s+/g,' ').trim()
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --command="${s.replace(/"/g,'\\"')}"`,
      { encoding:'utf-8', timeout:15000, stdio:['pipe','pipe','pipe'] })
    return true
  } catch { return false }
}

function esc(s) { return s.replace(/'/g,"''") }

function insert(tema, trin, rolle, type, indhold, kvalitet=1.0, kilde='kurateret') {
  const sql = `INSERT INTO shared_knowledge (id,tema,trin,rolle,type,indhold,kvalitet,kilde) VALUES (lower(hex(randomblob(16))),'${esc(tema)}',${trin||'NULL'},${rolle?`'${rolle}'`:'NULL'},'${type}','${esc(indhold)}',${kvalitet},'${kilde}')`
  return d1(sql)
}

let count = 0
function add(tema,trin,rolle,type,indhold,kval=1.0) {
  if(insert(tema,trin,rolle,type,indhold,kval)) count++
}

async function main() {
  console.log('=== Seed Knowledge: 50 emner × 3 roller ===\n')

  // ═══════════════════════════════════════════════════════════
  // DEL 1: SPROGMØNSTRE — Sådan taler en rådgiver (ikke en AI)
  // ═══════════════════════════════════════════════════════════
  console.log('Indsætter sprogmønstre...')

  // Rådgiver-stil åbninger
  add('sprogstil',null,null,'spørgsmål','Når du siger det sådan, hvad er det så egentlig du mærker? Ikke hvad du tænker — hvad du mærker.',1.0)
  add('sprogstil',null,null,'spørgsmål','Lad mig spørge dig om noget: Hvis du sad overfor en kollega der fortalte dig præcis det her — hvad ville du sige til vedkommende?',1.0)
  add('sprogstil',null,null,'spørgsmål','Jeg hører to ting i det du siger. Det ene er frustrationen. Det andet er noget der ligner omsorg. Hvad handler det om?',1.0)
  add('sprogstil',null,null,'spørgsmål','Det du beskriver kender mange skoleledere. Men dit spørgsmål er unikt. Hvad er det du egentlig søger svar på?',1.0)
  add('sprogstil',null,null,'spørgsmål','Prøv at sætte ord på det der er sværest. Ikke det der er mest presserende — det der er sværest.',1.0)
  add('sprogstil',null,null,'spørgsmål','Hvad ville du sige, hvis det var helt risikofrit at sige det?',1.0)
  add('sprogstil',null,null,'spørgsmål','Der er noget du ikke siger endnu. Jeg mærker det. Vil du prøve?',1.0)
  add('sprogstil',null,null,'spørgsmål','Hvad ved du allerede, som du ikke handler på endnu?',1.0)
  add('sprogstil',null,null,'spørgsmål','Når du hører dig selv sige det — hvad tænker du så?',1.0)
  add('sprogstil',null,null,'spørgsmål','Lad os blive her et øjeblik. Der er noget vigtigt i det du lige sagde.',1.0)

  // Rådgiver-anerkendelser (ikke AI-agtigt "det er en god observation")
  add('sprogstil',null,null,'spørgsmål','Det kræver mod at sige det. Mange i din position ville have pakket det ind.',1.0)
  add('sprogstil',null,null,'spørgsmål','Ja. Det er svært. Og det er okay at det er svært.',1.0)
  add('sprogstil',null,null,'spørgsmål','Du er ikke den eneste der oplever det. Men du er en af de få der tør se det i øjnene.',1.0)
  add('sprogstil',null,null,'spørgsmål','Det giver mening. Der er en logik i det du gør, selvom det ikke føles sådan.',1.0)

  // Niveau-differentiering: Sådan spørger man en skoleleder vs. ledelsesteam vs. bestyrelse
  add('sprogstil',null,'skoleleder','spørgsmål','SKOLELEDER-NIVEAU: Stil personlige, eksistentielle spørgsmål. Skolelederen er alene med ansvaret. Spørg ind til deres oplevelse, mavefornemmelse, dilemmaer. Brug "du" og "dig". Anerkend ensomheden i rollen.',1.0)
  add('sprogstil',null,'ledelsesteam','spørgsmål','LEDELSESTEAM-NIVEAU: Stil samarbejdsspørgsmål. Fokusér på "vi", "I", "teamet". Spørg om rollefordeling, fælles forståelse, prioritering. Udfordr teamets dynamik og vaner.',1.0)
  add('sprogstil',null,'bestyrelse','spørgsmål','BESTYRELSE-NIVEAU: Stil strategiske og governance-spørgsmål. Fokusér på tilsyn, retning, rammer. Brug "bestyrelsen", "jeres rolle". Hjælp dem med at skelne mellem drift og strategi.',1.0)

  // ═══════════════════════════════════════════════════════════
  // DEL 2: EMNESPECIFIK VIDEN — 50 emner × 3 roller
  // ═══════════════════════════════════════════════════════════
  console.log('Indsætter emneviden...')

  // 1. Kvalitetsprogram
  add('kvalitetsprogram',null,'skoleleder','indsigt','Kvalitetsprogrammet giver frihed fra detailstyring men kræver at du selv sætter retning. Timebanken erstatter understøttende undervisning. Nøglespørgsmålet er: Hvad vil DU bruge friheden til?',1.0)
  add('kvalitetsprogram',null,'ledelsesteam','indsigt','I ledelsesteamet skal I blive enige om hvad timebanken bruges til FØR lærerne spørger. Uenighed i ledelsen skaber forvirring i organisationen.',1.0)
  add('kvalitetsprogram',null,'bestyrelse','indsigt','Bestyrelsen skal formulere de overordnede prioriteringer for skolens brug af den nye frihed. Det er governance — ikke drift.',1.0)

  // 2. Fagfornyelse
  add('fagfornyelse',null,'skoleleder','indsigt','4.000 læringsmål erstattes af nye fagplaner. Risikoen er forandringstræthed. Nøglen er at gøre det meningsfuldt for lærerne, ikke bare nødvendigt.',1.0)
  add('fagfornyelse',null,'ledelsesteam','indsigt','Fagfornyelsen skal koordineres i ledelsesteamet. Hvem har overblik over implementeringen? Hvem støtter lærerne? Hvem holder tidsplanen?',1.0)
  add('fagfornyelse',null,'bestyrelse','indsigt','Bestyrelsen skal forstå fagfornyelsens omfang og sikre at ledelsen har ressourcer til implementering. Spørg: Er tidsplanen realistisk?',1.0)

  // 3. Skolepolitik
  add('skolepolitik',null,'skoleleder','indsigt','Politiske skift skaber uro. Din opgave er at oversætte politik til pædagogisk praksis. Hvad ændrer sig reelt for din skole — og hvad er støj?',1.0)
  add('skolepolitik',null,'ledelsesteam','indsigt','Ledelsesteamet skal have en fælles kommunikationslinje når politik skaber usikkerhed. Hvad siger I til personalet? Og hvad siger I ikke?',1.0)
  add('skolepolitik',null,'bestyrelse','indsigt','Bestyrelsen navigerer mellem kommunalpolitik og skolens behov. Jeres strategiske position bør være tydelig uanset hvem der sidder i byrådet.',1.0)

  // 4. Sammen om Skolen
  add('sammen_om_skolen',null,'skoleleder','indsigt','Initiativet kræver at du træder ind i den lokale dialog med en klar stemme. Hvad er din skoles unikke bidrag til fællesskabet?',1.0)
  add('sammen_om_skolen',null,'ledelsesteam','indsigt','Deltagelse i lokale dialogfora kræver tid og forberedelse. Ledelsesteamet skal beslutte hvem der repræsenterer skolen og med hvilket mandat.',1.0)
  add('sammen_om_skolen',null,'bestyrelse','indsigt','Bestyrelsen har en naturlig rolle i Sammen om Skolen. I er broen mellem skole og samfund. Brug den position strategisk.',1.0)

  // 5. Færre prøver
  add('faerre_proever',null,'skoleleder','indsigt','Færre prøver er en mulighed, ikke et tab. Du kan nu designe evalueringsformer der faktisk måler det der betyder noget for jeres elever.',1.0)
  add('faerre_proever',null,'ledelsesteam','indsigt','Nye evalueringsformer kræver fælles udvikling i ledelsesteamet. Det er en chance for at definere hvad kvalitet er på jeres skole.',1.0)
  add('faerre_proever',null,'bestyrelse','indsigt','Bestyrelsen skal kunne forklare forældre at færre prøver ikke er lavere ambitioner. Det kræver en klar kommunikationsstrategi.',1.0)

  // 6. Besparelser
  add('besparelser',null,'skoleleder','indsigt','43 procent af kommuner sparer i 2026. Prioritering med færre ressourcer er ledelsens sværeste øvelse. Hvad fjerner du? Hvad beskytter du?',1.0)
  add('besparelser',null,'ledelsesteam','indsigt','Besparelser kræver at ledelsesteamet er enigt om hvad der prioriteres. Uenighed i ledelsen bliver til forvirring i organisationen.',1.0)
  add('besparelser',null,'bestyrelse','indsigt','Bestyrelsen skal sikre at besparelser ikke bare skærer ens men skærer klogt. Spørg: Hvad er konsekvenserne af hvert scenarie?',1.0)

  // 7. 740 mio
  add('740mio',null,'skoleleder','indsigt','Varige midler er en strategisk mulighed. Faren er at pengene forsvinder i generelle budgetter. Din opgave: Lav en plan der binder midlerne til konkrete indsatser.',1.0)
  add('740mio',null,'ledelsesteam','indsigt','Nye midler kræver fælles prioritering. Ledelsesteamet skal designe en plan der skaber varig værdi, ikke bare lukker huller.',1.0)
  add('740mio',null,'bestyrelse','indsigt','Bestyrelsen har tilsynsansvar for at nye midler bruges til det de er beregnet til. Kræv dokumentation og opfølgning.',1.0)

  // 8. Udgift pr. elev
  add('udgift_pr_elev',null,'skoleleder','indsigt','Fra 77.000 til 130.000 kr. pr. elev mellem kommuner. Variationen er ikke tilfældig — den afspejler politiske valg. Kend jeres tal.',1.0)
  add('udgift_pr_elev',null,'ledelsesteam','indsigt','Benchmarking kræver at I sammenligner med skoler der ligner jeres. Ledelsesteamet skal forstå økonomien for at lede kvaliteten.',1.0)
  add('udgift_pr_elev',null,'bestyrelse','indsigt','Bestyrelser på frie skoler skal benchmarke og argumentere for deres økonomi. Kend jeres nøgletal og kommunikér dem klart.',1.0)

  // 9. Specialøkonomi
  add('specialokonomi',null,'skoleleder','indsigt','Specialundervisning koster 300.000-500.000 kr. pr. visitering. Hver krone taget fra almenområdet svækker forebyggelsen. Det er en ond cirkel.',1.0)
  add('specialokonomi',null,'ledelsesteam','indsigt','Balance mellem inklusion og segregering er ikke bare pædagogisk men dybt økonomisk. Ledelsesteamet skal have et fælles billede af omkostningerne.',1.0)
  add('specialokonomi',null,'bestyrelse','indsigt','Bestyrelsen skal beslutte den strategiske retning: Investerer I i forebyggelse (billigere langsigtet) eller betaler I for brandslukning (dyrere)?',1.0)

  // 10. Tilskud frie skoler
  add('tilskudsmodeller',null,'skoleleder','indsigt','76 procent statstilskud kræver kreativ finansiering af resten. Forældrebetaling, fundraising, udlejning — det hele skal tænkes sammen.',1.0)
  add('tilskudsmodeller',null,'ledelsesteam','indsigt','Økonomisk bæredygtighed er et fælles ledelsesansvar. Ledelsesteamet skal forstå forretningsmodellen, ikke bare den pædagogiske model.',1.0)
  add('tilskudsmodeller',null,'bestyrelse','indsigt','Bestyrelsen har det ultimative ansvar for skolens økonomi. Bæredygtig forældrebetaling og diversificerede indtægter er strategiske mål.',1.0)

  // 11-15 Rekruttering
  add('laerermangel',null,'skoleleder','indsigt','13.000 lærere mangler inden 10 år. 12,9 procent uden uddannelse. Rekruttering kræver kreativitet: arbejdsmiljø, udvikling og mening er dine bedste kort.',1.0)
  add('laerermangel',null,'ledelsesteam','indsigt','Ledelsesteamet skal tænke rekruttering som employer branding. Hvad tilbyder I som andre skoler ikke gør?',1.0)
  add('laerermangel',null,'bestyrelse','indsigt','Lærermangel er en strategisk risiko. Bestyrelsen skal sikre at skolen har en rekrutteringsstrategi der rækker længere end næste ansættelse.',1.0)

  add('frafald_laerer',null,'skoleleder','indsigt','35-40 procent frafald fra læreruddannelsen. Gode praktikforløb og mentorordninger kan gøre din skole til et sted der former fremtidens lærere.',1.0)
  add('lederskifte',null,'skoleleder','indsigt','Halvdelen overvejer at skifte job. Ensomheden, presset, de uendelige krav. Det er ikke et personligt svigt at mærke det — det er systemets pris.',1.0)
  add('lederskifte',null,'bestyrelse','indsigt','Hvis bestyrelsen mister skolelederen, mister skolen kontinuitet og retning. Ledertrivsel er et strategisk bestyrelsesansvar.',1.0)
  add('lederbalance',null,'skoleleder','indsigt','55 timer om ugen er ikke bæredygtigt. Lederliv i Balance handler om at finde grænser. Ikke som svaghed men som professionel nødvendighed.',1.0)
  add('konkurrence_frie',null,'skoleleder','indsigt','Du kan ikke matche lønnen. Men du kan tilbyde kultur, mening og udvikling. Det er det mange lærere søger. Kan du formulere det?',1.0)

  // 16-20 Inklusion
  add('inklusion_pres',null,'skoleleder','indsigt','Inklusion er den tungeste opgave. Strategien skal balancere ambition med virkelighed. Spørg dig selv: Hvad kan vi realistisk rumme med det vi har?',1.0)
  add('inklusion_pres',null,'ledelsesteam','indsigt','En realistisk inklusionsstrategi kræver at ledelsesteamet er ærligt om hvad der virker og hvad der ikke gør. Ikke ønsketænkning men realisme.',1.0)
  add('inklusion_pres',null,'bestyrelse','indsigt','Bestyrelsen sætter den strategiske ramme for inklusion. Det handler om ambitionsniveau, ressourceallokering og forventningsafstemning.',1.0)

  add('diagnoser',null,'skoleleder','indsigt','Flere diagnoser kræver specialiserede kompetencer. Din opgave er at bygge strukturer der støtter lærerne, ikke at forvente at de klarer det alene.',1.0)
  add('elevtrivsel',null,'skoleleder','indsigt','Forebyggelse er billigere og bedre end brandslukning. Men det kræver at trivsel behandles som strategisk — ikke som noget der bare skal klares.',1.0)
  add('tre_strategier_inklusion',null,'skoleleder','indsigt','Tre forskningsbaserede strategier: Styrk almenmiljøet, byg broer mellem almen og special, involver forældrene aktivt. Hvilken er I stærkest på?',1.0)
  add('specialpaed',null,'skoleleder','indsigt','Lærere mangler redskaber til kompleksiteten. Kompetenceudvikling i specialpædagogik er en investering i almenundervisningens kvalitet.',1.0)

  // 21-25 Digitalisering
  add('ai_undervisning',null,'skoleleder','indsigt','Eleverne bruger allerede AI. Dit valg er ikke om de bruger det, men hvordan. Sæt rammer der både beskytter og muliggør innovation.',1.0)
  add('ai_undervisning',null,'ledelsesteam','indsigt','AI-politik kræver at ledelsesteamet har en fælles holdning. Uenighed i ledelsen skaber forvirring hos lærerne. Bliv enige først.',1.0)
  add('ai_undervisning',null,'bestyrelse','indsigt','AI ændrer fundamentalt hvad undervisning er. Bestyrelsen bør sikre at skolen har en fremtidssikret politik inden årets udgang.',1.0)

  add('ai_strategi',null,'skoleleder','indsigt','Uden national strategi er det op til dig. Lav en lokal AI-tilgang der er robust nok til at overleve de næste tre års udvikling.',1.0)
  add('gdpr',null,'skoleleder','indsigt','GDPR-compliance er dit ansvar. Følsomme elevdata kræver databehandleraftaler og klare procedurer. Tvivl er ikke en mulighed.',1.0)
  add('lovlig_ai',null,'skoleleder','indsigt','STILs vejledning giver fundament. Fra vejledning til praksis kræver oversættelse. Hvem på din skole gør det operationelt?',1.0)
  add('laeringsplatforme',null,'skoleleder','indsigt','Aula og læringsplatforme genererer data I aldrig kigger på. Fraværsmønstre, engagement, kommunikation — det er strategisk guld.',1.0)

  // 26-30 Skole-hjem
  add('foraeldre_klager',null,'skoleleder','indsigt','75 procent oplever klager som for meget. Strategisk konflikthåndtering er en kompetence. Det handler om systemer, ikke om tykkere hud.',1.0)
  add('foraeldre_klager',null,'ledelsesteam','indsigt','Klagehåndtering skal være systematisk, ikke ad hoc. Ledelsesteamet skal have en fælles tilgang og fordeling af de svære samtaler.',1.0)
  add('foraeldre_klager',null,'bestyrelse','indsigt','Klager der eskalerer til bestyrelsen er et symptom. Bestyrelsen bør spørge: Hvad er det systemiske problem bag de gentagne klager?',1.0)

  add('skole_hjem',null,'skoleleder','indsigt','46 procent af ledere mener samarbejdet går forkert. Forventningerne til skolen er eksploderet. Gentænk formaterne — ikke bare indholdet.',1.0)
  add('bestyrelse_rolle',null,'bestyrelse','indsigt','Fra drift til strategi kræver disciplin. Når enkeltsager presser sig på, er det fristende at dykke ned. Bestyrelsens rolle er at holde det lange lys.',1.0)
  add('omdoemme',null,'skoleleder','indsigt','Strategisk kommunikation er troværdighedsopbygning, ikke markedsføring. Hvad er jeres fortælling? Og lever den i alt I gør?',1.0)
  add('lokalsamfund',null,'skoleleder','indsigt','Skolen er ofte det sidste samlingssted. Den forbindelse er en styrke. Brug den aktivt — det giver legitimitet og støtte.',1.0)

  // 31-35 Organisation
  add('ledelse_taet_paa',null,'skoleleder','indsigt','Pædagogisk ledelse kræver nærvær. Men administration trækker dig væk. Prioritering er svaret — ikke mere tid.',1.0)
  add('ledelse_taet_paa',null,'ledelsesteam','indsigt','Synlighed i undervisningen handler om tilstedeværelse, ikke kontrol. Ledelsesteamet skal aftale hvordan I er til stede meningsfuldt.',1.0)
  add('team_samarbejde',null,'ledelsesteam','indsigt','Teamudvikling er strategisk nødvendighed. I koordinerer opgaver men samarbejder I strategisk? Der er en afgørende forskel.',1.0)
  add('distribueret_ledelse',null,'skoleleder','indsigt','Distribueret ledelse kræver at du slipper kontrol og giver rammer. Involvering styrker ejerskab men kræver tydelighed fra dig.',1.0)
  add('moedekultur',null,'skoleleder','indsigt','Møder er skolens vigtigste koordineringsværktøj. Dårlige møder er en strategisk risiko. Design dine møder som du designer undervisning.',1.0)
  add('strategi_praksis',null,'skoleleder','indsigt','Kan du se strategien tirsdag kl. 10? Det er testspørgsmålet. Hvis svaret er nej, lever strategien ikke. Implementering er den egentlige opgave.',1.0)

  // 36-40 Struktur
  add('skolelukninger',null,'skoleleder','indsigt','339 folkeskoler lukket siden 2007. Små skoler skal dokumentere deres eksistensberettigelse med data, kvalitet og lokal forankring.',1.0)
  add('sammenlaegninger',null,'skoleleder','indsigt','Sammenlægninger kræver kulturintegration. To identiteter skal blive til én ny. Det tager mindst to år og kræver bevidst ledelse.',1.0)
  add('friskoler_vaekst',null,'skoleleder','indsigt','Friskolernes vækst udfordrer folkeskolen. Svaret er kvalitet og identitet. Hvad kan du tilbyde som friskolen ikke kan?',1.0)
  add('efterskoler',null,'skoleleder','indsigt','Stor efterspørgsel men enormt forventningspres. Balance mellem pædagogik og økonomi kræver disciplineret prioritering.',1.0)
  add('smaa_skoler',null,'skoleleder','indsigt','Nye frihedsgrader kræver strategisk kapacitet. Frihed uden kapacitet er en fælde. Hvad har I brug for at kunne udnytte den?',1.0)

  // 41-45 Kompetencer
  add('professionsmasters',null,'skoleleder','indsigt','300 pladser i 2026. Kompetenceløft for ledere og nøglepersoner er en strategisk investering. Hvem sender du og med hvilket formål?',1.0)
  add('groen_skole',null,'skoleleder','indsigt','Grøn skoleledelse handler om retning, ikke perfektion. Start med det der giver mening for jeres skole og byg derfra.',1.0)
  add('praksisfaglighed',null,'skoleleder','indsigt','Mere praktisk undervisning kræver fysiske rammer, udstyr og kompetencer. Ambitioner uden rammer er frustrerende.',1.0)
  add('coteaching',null,'skoleleder','indsigt','Co-teaching er et kulturprojekt, ikke et skemaprojekt. Det kræver match af lærere og en samarbejdskultur der tåler at dele klasselokalet.',1.0)
  add('datainformeret',null,'skoleleder','indsigt','Data skal bruges klogt, ikke som kontrol. Brug data til at spørge bedre spørgsmål, ikke til at give hurtige svar.',1.0)

  // 46-50 Arbejdsmiljø
  add('psykisk_arbejdsmiljoe',null,'skoleleder','indsigt','Hver syvende er stresset. Skoler er særligt udsatte. Forebyggelse er ledelsens ansvar — men du skal også passe på dig selv.',1.0)
  add('psykisk_arbejdsmiljoe',null,'ledelsesteam','indsigt','I skal lede stressforebyggelse mens I selv er pressede. Start med jer selv. Et ledelsesteam der trives, skaber trivsel.',1.0)
  add('psykisk_arbejdsmiljoe',null,'bestyrelse','indsigt','Psykisk arbejdsmiljø er et bestyrelsesansvar. Kend tallene. Spørg ledelsen: Hvad gør I forebyggende? Og hvad har I brug for?',1.0)

  add('vold_trusler',null,'skoleleder','indsigt','Vold mod ansatte kræver handleplaner der virker — ikke bare eksisterer. Det faktiske menneske der er ramt, har brug for mere end procedurer.',1.0)
  add('ok26',null,'skoleleder','indsigt','OK26 ændrer rammerne for løn, tid og samarbejde. Kend aftalerne ned i detaljen. Det er fundamentet for fair ledelse.',1.0)
  add('sygefravaer',null,'skoleleder','indsigt','8 procent sygefravær er to lærere der mangler hver dag. Strategisk fraværshåndtering kræver analyse af mønstre, ikke bare reaktion.',1.0)
  add('kulturforandring',null,'skoleleder','indsigt','Skoler er reformeret i årtier. Anerkend trætheden før du beder om mere. Forandring skal give mening, ikke bare være nyt.',1.0)
  add('kulturforandring',null,'ledelsesteam','indsigt','Ledelsesteamet skal vælge én meningsfuld forandring frem for fem overfladiske. Fokus slår ambition.',1.0)
  add('kulturforandring',null,'bestyrelse','indsigt','Forandringstræthed er reel. Bestyrelsen skal forstå den og justere forventningerne. Hvad er realistisk at forvente det næste år?',1.0)

  // ═══════════════════════════════════════════════════════════
  // DEL 3: DIALOGEKSEMPLER — Sådan lyder en god rådgiver-dialog
  // ═══════════════════════════════════════════════════════════
  console.log('Indsætter dialogeksempler...')

  add('dialog_eksempel',null,'skoleleder','godt_svar','BRUGER: Inklusionen presser os. Vi har ikke ressourcer nok. RÅDGIVER: Jeg kan høre det presser. Og det er en virkelighed mange deler med dig. Men lad mig spørge: Hvis du havde ressourcerne — ville du så vide præcis hvad du ville gøre med dem?',1.0)
  add('dialog_eksempel',null,'skoleleder','godt_svar','BRUGER: Jeg arbejder for mange timer. RÅDGIVER: Det lyder som om du betaler en pris. Ikke bare i tid, men i noget der er sværere at måle. Hvad koster det dig, som du sjældent siger højt?',1.0)
  add('dialog_eksempel',null,'skoleleder','godt_svar','BRUGER: Min bestyrelse blander sig i alt. RÅDGIVER: Det er frustrerende når grænsen er uklar. Men lad os vende det: Hvad ville du ønske bestyrelsen brugte deres energi på i stedet?',1.0)
  add('dialog_eksempel',null,'ledelsesteam','godt_svar','BRUGER: Vi er uenige om hvad der er vigtigst. RÅDGIVER: Uenighed i et ledelsesteam er ikke problemet. Problemet er når uenigheden ikke bruges. Hvad ville I opdage hvis I lyttede til det I er mest uenige om?',1.0)
  add('dialog_eksempel',null,'ledelsesteam','godt_svar','BRUGER: Vi koordinerer men samarbejder ikke. RÅDGIVER: Du rammer noget vigtigt der. Koordinering er logistik. Samarbejde er tillid. Hvor er tilliden i jeres team lige nu?',1.0)
  add('dialog_eksempel',null,'bestyrelse','godt_svar','BRUGER: Vi ved ikke hvad vores rolle egentlig er. RÅDGIVER: Det er ærligt sagt. Og det er faktisk udgangspunktet for noget godt. For nu kan I selv definere den. Hvad ville I gerne være for skolen?',1.0)
  add('dialog_eksempel',null,'bestyrelse','godt_svar','BRUGER: Vi drukner i enkeltsager. RÅDGIVER: Enkeltsager er forførende fordi de er konkrete. Strategi er abstrakt. Men lad mig spørge: Hvad sker der med skolen om tre år hvis I kun tager enkeltsager?',1.0)

  // ═══════════════════════════════════════════════════════════
  // DEL 4: ANTI-MØNSTRE — Hvad AI IKKE skal gøre
  // ═══════════════════════════════════════════════════════════
  console.log('Indsætter anti-mønstre...')

  add('anti_moenster',null,null,'indsigt','Sig ALDRIG "Det er en god observation" eller "Det er et vigtigt spørgsmål". Det er AI-sprog. Sig i stedet noget konkret om hvad du hørte.',1.0)
  add('anti_moenster',null,null,'indsigt','Stil ALDRIG to spørgsmål i samme svar. Ét spørgsmål. Ét. Lad det hænge i luften.',1.0)
  add('anti_moenster',null,null,'indsigt','Lav ALDRIG lister med punktopstillinger i en samtale. Tal som et menneske, ikke som et dokument.',1.0)
  add('anti_moenster',null,null,'indsigt','Sig ALDRIG "Tirsdag kl. 10-modellen" i åbningen. Modellen er rammen, ikke samtaleemnet. Brugeren skal ikke føle sig i et system.',1.0)
  add('anti_moenster',null,null,'indsigt','Start ALDRIG med en lang opsummering af hvad brugeren sagde. De ved godt hvad de sagde. Gå direkte til kanten.',1.0)
  add('anti_moenster',null,null,'indsigt','Brug ALDRIG formuleringen "Lad os udforske det sammen". Det er terapeutsprog. Brug i stedet: "Fortæl mig mere" eller "Hvad mener du med det?"',1.0)

  console.log(`\n=== Seed færdig: ${count} entries indsat ===`)
}

main().catch(console.error)
