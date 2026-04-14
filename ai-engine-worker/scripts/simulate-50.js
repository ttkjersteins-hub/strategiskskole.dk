#!/usr/bin/env node
// ============================================================
// Mega-simulering: 50 emner × 3 roller × 10 beskeder per kort
// Kører mod Cloudflare Worker API
// ============================================================

const API_URL = 'https://strategi-chat.strategiskskole.workers.dev/api/chat'
const ORIGIN = 'https://strategiskskoledk-app.vercel.app'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── Proceskort ────────────────────────────────────────────────
const KORT = {
  model: [
    { nr:1, label:'Strategisk spejling', forside:'Hvad ser du egentlig ske?', aabning:['Hvad fylder mest?','Hvad ser du?','Hvad undrer dig?'], skaerpelse:['Hvad overser du?','Hvad taler I ikke om?','Hvad er mønstret?'], perspektiv:['Hvad ville en ny leder se?','Hvad siger data?','Hvad er den ærlige version?'], erkendelse:'At se virkeligheden som den er.' },
    { nr:2, label:'Strategisk analyse', forside:'Hvad er problemet bag problemet?', aabning:['Hvad er kernen?','Hvornår startede det?','Hvem mærker det mest?'], skaerpelse:['Hvad vedligeholder problemet?','Hvad er din andel?','Hvad sker der om et år?'], perspektiv:['Hvad ville du anbefale andre?','Hvad er du bange for?','Hvad er det rigtige spørgsmål?'], erkendelse:'At stille den rigtige diagnose.' },
    { nr:3, label:'Strategisk valg', forside:'Hvad vælger du — og hvad vælger du fra?', aabning:['Hvad er mulighederne?','Hvad trækker dig?','Hvad holder dig tilbage?'], skaerpelse:['Hvad koster det at vente?','Hvad siger du nej til?','Hvem påvirkes?'], perspektiv:['Hvad ville du ønske du havde valgt?','Hvad er det modige valg?','Hvad kan du leve med?'], erkendelse:'At vælge er at vælge fra.' },
    { nr:4, label:'Strategisk organisering', forside:'Hvordan organiserer du det?', aabning:['Hvad skal ændres?','Hvem skal involveres?','Hvad er første skridt?'], skaerpelse:['Hvad kan gå galt?','Hvad mangler?','Hvem har modstand?'], perspektiv:['Hvad er den enkleste vej?','Hvad kræver det af dig?','Hvad kan du delegere?'], erkendelse:'Struktur er design.' },
    { nr:5, label:'Strategisk praksis', forside:'Kan du se det tirsdag kl. 10?', aabning:['Hvad sker der i praksis?','Hvad kan du observere?','Hvad mærker du?'], skaerpelse:['Passer det med planen?','Hvad overrasker dig?','Hvad justerer du?'], perspektiv:['Hvad ville lærerne sige?','Hvad er du stolt af?','Hvad mangler stadig?'], erkendelse:'Strategien skal kunne mærkes.' },
    { nr:6, label:'Strategisk forankring', forside:'Hvordan holder du det levende?', aabning:['Hvad truer forankringen?','Hvad holder fast?','Hvornår tjekker du?'], skaerpelse:['Hvad glemmer du først?','Hvad kræver disciplin?','Hvad fejrer du?'], perspektiv:['Hvad er dit system?','Hvem hjælper dig?','Hvad er dit næste skridt?'], erkendelse:'Strategier dør af glemsel.' }
  ]
}

// ── 50 emner med rollespecifikke åbninger ─────────────────────
const EMNER = [
  // Reform og politik (1-5)
  { nr:1, tema:'kvalitetsprogram', navn:'Folkeskolens kvalitetsprogram',
    skoleleder: 'Vi har fået besked om at timebanken erstatter understøttende undervisning fra næste skoleår. Jeg sidder med et planlægningspuslespil der kræver at vi selv sætter retningen. Det er befriende men også skræmmende.',
    ledelsesteam: 'Vi skal som ledelsesteam omsætte kvalitetsprogrammets frihed til konkrete prioriteringer. Vi er fire ledere og allerede nu uenige om hvad der skal prioriteres med de frigjorte timer.',
    bestyrelse: 'Kvalitetsprogrammet giver os som bestyrelse en ny rolle. Vi skal nu formulere retning for skolen i stedet for bare at godkende kommunens. Men vi er forældre, ikke uddannelseseksperter.' },
  { nr:2, tema:'fagfornyelse', navn:'Fagfornyelsen og nye læreplaner',
    skoleleder: '4.000 læringsmål skal erstattes af nye fagplaner. Mine lærere er allerede trætte af forandringer, og nu skal de lære et helt nyt system. Jeg frygter modstanden.',
    ledelsesteam: 'Vi skal implementere fagfornyelsen uden at tabe den undervisning der allerede fungerer. Hvordan koordinerer vi det i ledelsesteamet?',
    bestyrelse: 'Skoleledelsen præsenterer fagfornyelsen for os. Som bestyrelse skal vi forstå konsekvenserne og sikre at implementeringen har de rette ressourcer.' },
  { nr:3, tema:'skolepolitik', navn:'Folketingsvalg og skolepolitik',
    skoleleder: 'Valget har skabt uro. Forældre spørger hvad det betyder for skolen. Kommunen signalerer nye retninger. Jeg skal navigere i noget jeg ikke selv har valgt.',
    ledelsesteam: 'De politiske løfter skaber forventninger vi ikke kan indfri. Vi som ledelsesteam skal finde en fælles fortælling om hvad vi kan og hvad vi ikke kan.',
    bestyrelse: 'De nye politiske signaler påvirker vores skole direkte. Vi skal som bestyrelse tage stilling til hvad det betyder for vores strategi.' },
  { nr:4, tema:'sammen_om_skolen', navn:'Sammen om Skolen-initiativet',
    skoleleder: 'Sammen om Skolen handler om at folkeskolen skal stoppe med at være kampplads. Men lokalt er det stadig tungt. Forældrene har deres dagsorden, kommunen har sin.',
    ledelsesteam: 'Vi er bedt om at deltage i lokale dialogfora som del af Sammen om Skolen. Men hvem af os har tid? Og hvad er vores stemme som ledelsesteam?',
    bestyrelse: 'Initiativet giver bestyrelsen en unik platform. Men vi skal vide hvad vi vil sige før vi siger det. Hvad er vores strategiske position?' },
  { nr:5, tema:'faerre_proever', navn:'Færre afgangsprøver',
    skoleleder: 'Kun én udtræksprøve nu. Det lyder som en lettelse men det skaber usikkerhed: Hvordan dokumenterer vi at eleverne lærer det de skal?',
    ledelsesteam: 'Prøvereduktionen kræver at vi finder nye evalueringsformer. Vi har aldrig talt systematisk om hvad der erstatter prøverne som pejlemærke.',
    bestyrelse: 'Færre prøver kan se ud som faldende ambitionsniveau for forældre. Vi skal kunne forklare hvad vi gør i stedet og hvorfor det er bedre.' },

  // Økonomi (6-10)
  { nr:6, tema:'besparelser', navn:'Kommunale besparelser',
    skoleleder: 'Vi skal spare 800.000 næste år. Jeg kan ikke se hvor de skal komme fra uden det rammer undervisningen direkte. Det holder mig vågen om natten.',
    ledelsesteam: 'Besparelserne tvinger os til at vælge. Vi er uenige i ledelsesteamet — nogen vil skære i administration, andre i vikarer, andre i materialer.',
    bestyrelse: 'Vi har modtaget kommunens sparemål. 43 procent af kommuner sparer i 2026. Hvordan sikrer vi at vores skole ikke bare skærer ens med alle andre?' },
  { nr:7, tema:'740mio', navn:'740 mio. kr. til folkeskolen',
    skoleleder: 'Der kommer nye varige midler. Men jeg er bange for at pengene forsvinder i det kommunale maskineri inden de når os. Hvordan sikrer jeg at de lander i undervisningen?',
    ledelsesteam: 'Vi skal planlægge hvordan de nye midler bruges bedst. Det er en strategisk mulighed vi ikke har haft i år. Men vi kan heller ikke købe alt.',
    bestyrelse: 'De 740 millioner er en politisk gave. Men som bestyrelse skal vi holde øje med at de faktisk bruges til det de er beregnet til. Hvad er vores tilsynsrolle her?' },
  { nr:8, tema:'udgift_pr_elev', navn:'Udgifter pr. elev varierer enormt',
    skoleleder: 'Vores kommune bruger 82.000 pr. elev mens nabokommunen bruger 115.000. Hvordan forklarer jeg den forskel til frustrerede forældre?',
    ledelsesteam: 'Vi skal benchmarke os mod andre skoler med lignende profil. Men sammenligning er vanskelig når kommunerne prioriterer så forskelligt.',
    bestyrelse: 'Som fri skole skal vi argumentere for vores økonomi. Fra 77.000 til 130.000 pr. elev — hvor ligger vi, og er det rigtigt?' },
  { nr:9, tema:'specialokonomi', navn:'Specialundervisningens økonomi',
    skoleleder: 'Specialundervisningen æder vores budget. Hver ny visitering koster 300.000-500.000 kr. Og pengene tages fra almenundervisningen.',
    ledelsesteam: 'Balance mellem inklusion og segregering er ikke bare pædagogisk, den er dybt økonomisk. Vi mangler et fælles billede af hvad det koster.',
    bestyrelse: 'Stigende specialudgifter presser hele budgettet. Bestyrelsen skal beslutte: Investerer vi i forebyggelse eller betaler vi for brandslukning?' },
  { nr:10, tema:'tilskudsmodeller', navn:'Tilskudsmodeller for frie skoler',
    skoleleder: 'Statstilskuddet dækker 76 procent. Resten skal vi selv finde. Forældrebetalingen er allerede høj. Jeg er bekymret for at vi priser os ud af markedet.',
    ledelsesteam: 'Vi skal tænke kreativt om finansiering. Fundraising, udlejning, samarbejder. Men vi er skoleleder, ikke forretningsfolk.',
    bestyrelse: 'Tilskudsmodellen kræver at vi som bestyrelse sikrer en bæredygtig økonomi. Forældrebetaling, fondsmidler, drift — det hele skal hænge sammen.' },

  // Rekruttering (11-15)
  { nr:11, tema:'laerermangel', navn:'Lærermangel',
    skoleleder: 'Vi har tre ubesatte stillinger. 13.000 lærere mangler nationalt inden ti år. Jeg ansætter folk uden læreruddannelse fordi der ikke er andre. Det bekymrer mig fagligt.',
    ledelsesteam: 'Lærermanglen tvinger os til at tænke anderledes om roller og ansvar. Kan pædagoger, studerende, pensionerede lærere løfte noget af det?',
    bestyrelse: 'Skolen kan ikke skaffe kvalificerede lærere. Det er en strategisk risiko for hele skolens fremtid. Hvad er bestyrelsens ansvar her?' },
  { nr:12, tema:'frafald_laerer', navn:'Frafald på læreruddannelsen',
    skoleleder: 'Mellem 35 og 40 procent dropper ud af læreruddannelsen. Vi har tilbudt praktikpladser, men det kræver tid og ressourcer vi knap har.',
    ledelsesteam: 'Vi kunne gøre vores skole til et sted der gør professionen attraktiv. Mentorordninger, gode praktikforløb. Men det kræver at vi investerer i det.',
    bestyrelse: 'Frafaldet på læreruddannelsen er et samfundsproblem. Men hvad kan vi som bestyrelse gøre for at vores skole bidrager til løsningen?' },
  { nr:13, tema:'lederskifte', navn:'Skolelederes jobskifte',
    skoleleder: 'Halvdelen af mine kollegaer har overvejet at skifte job. Jeg har også tænkt tanken. Arbejdspresset er uoverkommeligt nogle dage.',
    ledelsesteam: 'Når ledere flygter, mister skoler kontinuitet. Vi skal som ledelsesteam tale om hvad der gør at vi bliver — og hvad der truer.',
    bestyrelse: 'Vores skoleleder ser presset ud. Halvdelen overvejer at skifte. Hvis vi mister lederen, starter vi forfra. Hvad gør vi proaktivt?' },
  { nr:14, tema:'lederbalance', navn:'Lederliv i Balance',
    skoleleder: 'Jeg arbejder 55 timer om ugen. Min familie ser mig ikke. Jeg elsker jobbet, men det æder mig op. Hvornår er nok nok?',
    ledelsesteam: 'Lederliv i Balance-projektet viser at det ikke kun er mig. Vi er alle pressede. Kan vi som team lave aftaler om grænser?',
    bestyrelse: 'Skolelederforeningen og kommunerne kører et projekt om ledertrivsel. Kender vi det? Støtter vi det? Hvad er vores rolle som bestyrelse?' },
  { nr:15, tema:'konkurrence_frie', navn:'Konkurrence om arbejdskraft med frie skoler',
    skoleleder: 'Den frie skole to kilometer herfra tilbyder bedre vilkår. Vi mister gode folk til dem. Hvordan konkurrerer vi?',
    ledelsesteam: 'Vi kan ikke matche lønnen. Men vi kan tilbyde noget andet: kultur, udvikling, mening. Bare vi kan formulere det.',
    bestyrelse: 'Nye overenskomster giver lidt mere rum for løn. Men konkurrencen om arbejdskraft handler om mere end penge. Hvad er vores strategi?' },

  // Inklusion og trivsel (16-20)
  { nr:16, tema:'inklusion_pres', navn:'Inklusion som største arbejdspres',
    skoleleder: 'Inklusion er det der presser mig mest. Vi skal rumme alle, men ressourcerne rækker ikke. Lærerne er ved at knække.',
    ledelsesteam: 'Vi skal som ledelsesteam lave en realistisk inklusionsstrategi. Ikke en ønskeliste, men noget vi faktisk kan gennemføre med det vi har.',
    bestyrelse: 'Skolelederne peger på inklusion som den tungeste opgave. Hvad er bestyrelsens strategiske rolle? Vi kan ikke løse det operationelt, men vi kan sætte retning.' },
  { nr:17, tema:'diagnoser', navn:'Stigende diagnoser blandt børn',
    skoleleder: 'Antallet af elever med diagnoser stiger hvert år. Vi har ikke kompetencerne til at håndtere det. Lærerne føler sig utilstrækkelige.',
    ledelsesteam: 'Differentierede tilgange lyder godt i teorien. I praksis sidder der 28 elever i klassen og tre af dem har diagnoser. Hvad gør vi konkret?',
    bestyrelse: 'Flere diagnoser kræver flere støttestrukturer. Men det koster penge. Bestyrelsen skal beslutte om vi vil investere forebyggende eller reaktivt.' },
  { nr:18, tema:'elevtrivsel', navn:'Elevtrivsel og mistrivsel',
    skoleleder: 'Trivselsmålingen viser røde tal i overbygningen. Det er ikke nyt, men det er værre end nogensinde. Og vi har ingen plan.',
    ledelsesteam: 'Vi skal væk fra brandslukning og over til forebyggelse. Men hvem har overblikket? Og hvem tager ejerskab for trivsel som strategisk område?',
    bestyrelse: 'National trivselsmåling viser bekymrende tendenser. Bestyrelsen skal forstå tallene og stille de rigtige spørgsmål til ledelsen.' },
  { nr:19, tema:'tre_strategier_inklusion', navn:'Tre strategier for øget inklusion',
    skoleleder: 'Forskning siger: styrk almenmiljøet, byg broer mellem almen og special, involver forældrene. Det lyder klogt. Men i min hverdag er det kaos.',
    ledelsesteam: 'Vi har brug for en fælles strategi for inklusion. Ikke tre individuelle tilgange fra tre afdelingsledere. Hvordan samler vi det?',
    bestyrelse: 'Forskningsbaseret inklusion kræver langsigtet investering. Bestyrelsen skal sikre at strategien har tid og ressourcer til at virke.' },
  { nr:20, tema:'specialpaed', navn:'Specialpædagogisk viden i almenundervisningen',
    skoleleder: 'Mine lærere mangler redskaber. De er uddannet til normalklassen, men sidder med børn der kræver specialpædagogik. Kompetenceudvikling er dyrt og tager tid.',
    ledelsesteam: 'Vi skal prioritere kompetenceudvikling i specialpædagogik. Men hvem skal på kursus, hvornår, og hvem tager deres timer imens?',
    bestyrelse: 'Lærerne mangler specialkompetencer. Det er en risiko for undervisningskvaliteten. Hvad er bestyrelsens ansvar for kompetenceudvikling?' },

  // Digitalisering (21-25)
  { nr:21, tema:'ai_undervisning', navn:'AI i undervisningen',
    skoleleder: 'Eleverne bruger ChatGPT til alt. Nogle lærere forbyder det, andre omfavner det. Vi har ingen fælles linje, og det skaber frustration.',
    ledelsesteam: 'AI er her, og det forsvinder ikke. Vi skal som ledelsesteam sætte rammer der både beskytter og muliggør. Men ingen af os er AI-eksperter.',
    bestyrelse: 'AI ændrer fundamentalt hvad undervisning er. Bestyrelsen skal sikre at skolen har en politik der er fremtidssikret uden at bremse innovation.' },
  { nr:22, tema:'ai_strategi', navn:'National AI-strategi for folkeskolen',
    skoleleder: 'Der er ingen national linje for AI i skolen endnu. Så vi må selv. Men jeg vil ikke lave en strategi der er forældet om seks måneder.',
    ledelsesteam: 'Vi efterlyser retning fra centralt hold, men den kommer ikke. Kan vi selv definere en tilgang der er robust nok til at overleve de næste tre år?',
    bestyrelse: 'Uden national strategi er det op til den enkelte skole. Bestyrelsen bør sikre at vores skole har en klar AI-tilgang inden årets udgang.' },
  { nr:23, tema:'gdpr', navn:'GDPR og datasikkerhed',
    skoleleder: 'Vi håndterer følsomme elevdata hver dag. Jeg er usikker på om alle vores systemer lever op til GDPR. Og ansvaret er mit.',
    ledelsesteam: 'Databehandleraftaler, persondatapolitikker, sikker kommunikation — hvem i ledelsesteamet har overblikket? Og er vi compliant?',
    bestyrelse: 'GDPR-compliance er et bestyrelsesansvar. Kan vi dokumentere at skolen lever op til kravene? Hvad sker der hvis vi ikke gør?' },
  { nr:24, tema:'lovlig_ai', navn:'STILs mini-guide til lovlig AI-brug',
    skoleleder: 'STILs vejledning fra januar giver os et fundament. Men fra vejledning til praksis er der langt. Hvordan omsætter jeg det til noget mine lærere faktisk bruger?',
    ledelsesteam: 'Vejledningen er god, men den kræver fortolkning. Hvem i ledelsesteamet tager ejerskab for at gøre den operationel?',
    bestyrelse: 'Der er nu officiel vejledning om lovlig AI-brug i skolen. Bestyrelsen bør sikre at skolens praksis er i overensstemmelse.' },
  { nr:25, tema:'laeringsplatforme', navn:'Digitale læringsplatforme og Aula',
    skoleleder: 'Aula er nu daglig infrastruktur. Men vi bruger den mest til beskeder, ikke til strategisk udvikling. Dataene fra platformen kunne fortælle os meget mere.',
    ledelsesteam: 'Platformene genererer data vi aldrig kigger på. Fraværsmønstre, kommunikationsmønstre, engagementsdata. Bruger vi dem strategisk?',
    bestyrelse: 'Digitale platforme er store investeringer. Bestyrelsen bør spørge: Får vi værdi for pengene? Bruger vi data til at forbedre skolen?' },

  // Skole-hjem (26-30)
  { nr:26, tema:'foraeldre_klager', navn:'Forældreklager som ledelsesudfordring',
    skoleleder: '75 procent af os oplever klager som for meget. Jeg bruger halve dage på en enkelt forælder der er utilfreds med alt. Det dræner mig.',
    ledelsesteam: 'Klager skal håndteres professionelt men de stjæler tid fra alt andet. Har vi en strategi for konflikthåndtering, eller reagerer vi bare?',
    bestyrelse: 'Forældreklager der eskalerer til bestyrelsen er et symptom. Hvad er den underliggende årsag, og hvad kan bestyrelsen gøre strukturelt?' },
  { nr:27, tema:'skole_hjem', navn:'Forældresamarbejde i forkert retning',
    skoleleder: '46 procent af ledere mener samarbejdet bevæger sig den forkerte vej. Forventningerne til skolen er eksploderet, men vores evne til at møde dem er den samme.',
    ledelsesteam: 'Forældrene vil mere, lærerne kan mindre. Vi er klemt i midten. Hvordan gentænker vi formater og forventningsafstemning?',
    bestyrelse: 'Når 37 procent af lærere og 46 procent af ledere siger samarbejdet går forkert, er det en strategisk krise. Hvad er bestyrelsens bud?' },
  { nr:28, tema:'bestyrelse_rolle', navn:'Skolebestyrelsens rolle',
    skoleleder: 'Min bestyrelse blander sig i alt. De vil bestemme hvilke lærere der ansættes og hvordan timerne fordeles. Grænsen mellem deres rolle og min er udvisket.',
    ledelsesteam: 'Vi oplever at bestyrelsen svinger mellem total passivitet og detailstyring. Der er ingen fast rollefordeling. Det skaber usikkerhed.',
    bestyrelse: 'Vi vil gerne løfte os fra drift til strategi. Men det er svært når de konkrete sager presser sig på. Hvordan holder vi det strategiske fokus?' },
  { nr:29, tema:'omdoemme', navn:'Kommunikation og omdømme',
    skoleleder: 'Vi er en god skole, men det ved folk ikke. Naboskolen har en flottere hjemmeside og en dygtigere kommunikatør. Vi taber kampen om fortællingen.',
    ledelsesteam: 'Strategisk kommunikation er ikke markedsføring men troværdighed. Hvem i ledelsesteamet har ansvaret for vores omdømme?',
    bestyrelse: 'Frie skoler lever af omdømme. Hvis forældrene mister tilliden, mister vi elever. Bestyrelsen skal sikre en bevidst kommunikationsstrategi.' },
  { nr:30, tema:'lokalsamfund', navn:'Samarbejde mellem skole og lokalsamfund',
    skoleleder: 'Skolen er det sidste samlingssted i vores landsby. Hvis vi lukker, dør byen. Det ansvar tynger, men det giver også muligheder.',
    ledelsesteam: 'Vi kan styrke forbindelsen til lokalsamfundet — foreninger, virksomheder, institutioner. Men det kræver at vi åbner skolen op.',
    bestyrelse: 'Skolelukninger rammer 339 skoler siden 2007. Vores skole er truet. Bestyrelsen skal dokumentere vores eksistensberettigelse strategisk.' },

  // Organisation og ledelse (31-35)
  { nr:31, tema:'ledelse_taet_paa', navn:'Ledelse tæt på undervisningen',
    skoleleder: 'Jeg vil gerne være tæt på undervisningen. Men kalenderen er fuld af møder, administration og brandslukning. Pædagogisk ledelse er et ideal jeg ikke lever op til.',
    ledelsesteam: 'Vi taler om at være mere synlige i undervisningen. Men hvornår? Og hvordan gør vi det uden at det føles som kontrol?',
    bestyrelse: 'Forskning siger at ledelse tæt på undervisningen er nøglen. Bestyrelsen bør spørge: Har vores ledelse tid og rum til det?' },
  { nr:32, tema:'team_samarbejde', navn:'Ledelsesteamets samarbejde',
    skoleleder: 'Mit ledelsesteam taler ikke samme sprog om strategi. Når vi ikke er samstemt, mærker hele organisationen det.',
    ledelsesteam: 'Vi har aldrig rigtig investeret i os selv som team. Vi koordinerer opgaver, men vi samarbejder ikke strategisk. Det skal ændres.',
    bestyrelse: 'Når ledelsesteamet ikke fungerer, mister skolen retning. Bestyrelsen skal sikre at teamudvikling prioriteres som strategisk nødvendighed.' },
  { nr:33, tema:'distribueret_ledelse', navn:'Demokratisk og distribueret ledelse',
    skoleleder: 'Forskning siger involvering styrker ejerskab. Men det kræver at jeg slipper kontrol. Og hvad gør jeg når folk træffer beslutninger jeg er uenig i?',
    ledelsesteam: 'Distribueret ledelse handler om tillid og tydelige rammer. Vi har tilliden. Vi mangler rammerne. Det skaber forvirring.',
    bestyrelse: 'Demokratisk ledelse passer til skolens værdier. Men det kræver klare rammer. Hvad er bestyrelsens rolle i at definere dem?' },
  { nr:34, tema:'moedekultur', navn:'Mødekulturens strategiske betydning',
    skoleleder: 'Vores møder er informationskanal, ikke strategisk rum. Vi sidder 15 mennesker og gennemgår praktiske ting. Ingen forlader rummet klogere.',
    ledelsesteam: 'Møder er skolens vigtigste koordineringsværktøj, men vores møder er spild af tid. Hvem tør sige det? Og hvad gør vi ved det?',
    bestyrelse: 'Dårlig mødekultur er en strategisk risiko. Bestyrelsen bør spørge: Er møderne på skolen designet til at skabe værdi?' },
  { nr:35, tema:'strategi_praksis', navn:'Fra strategi til hverdagspraksis',
    skoleleder: 'Vi har en flot strategi i et dokument. Men spørg en lærer hvad strategien er, og du får et blankt blik. Den lever ikke.',
    ledelsesteam: 'Kan vi se strategien i det der sker tirsdag kl. 10? Det er testspørgsmålet. Og svaret er nej. Hvad gør vi ved det?',
    bestyrelse: 'Implementering er den egentlige ledelsesopgave. Bestyrelsen skal ikke bare godkende strategier, men spørge: Kan I se den i praksis?' },

  // Skolens struktur (36-40)
  { nr:36, tema:'skolelukninger', navn:'Skolelukninger i landdistrikter',
    skoleleder: 'Vi er 89 elever. Kommunen antyder at vi er for dyre. Jeg kæmper for skolens overlevelse, men det er svært når tallene taler imod os.',
    ledelsesteam: 'Vores lille skole har kvaliteter de store ikke har. Men vi skal dokumentere det. Hvem tager den opgave? Og hvordan?',
    bestyrelse: '339 folkeskoler lukket siden 2007. Vores er måske den næste. Bestyrelsen skal have en overlevelsesplan der er strategisk, ikke bare emotionel.' },
  { nr:37, tema:'sammenlaegninger', navn:'Skolesammenlægninger',
    skoleleder: 'Vi sammenlægges med naboskolen om et år. To kulturer, to identiteter, to ledelsesteams. Usikkerheden lammer begge skoler.',
    ledelsesteam: 'Sammenlægningen kræver at vi bygger et nyt team af to gamle. Nogens identitet vil gå tabt. Hvordan håndterer vi det?',
    bestyrelse: 'Sammenlægningen er besluttet politisk. Bestyrelsens opgave er nu at sikre kulturintegration og ny identitet. Men modstanden er stor.' },
  { nr:38, tema:'friskoler_vaekst', navn:'Friskolernes vækst',
    skoleleder: 'Andelen af elever på frie skoler stiger. Vi mister familier til den lokale friskole hvert år. De sælger fællesskab og frihed.',
    ledelsesteam: 'Vi skal svare med kvalitet. Men hvad er vores unikke fortælling? Hvad kan vi tilbyde som friskolen ikke kan?',
    bestyrelse: 'Konkurrencen med frie skoler ændrer dynamikken lokalt. Bestyrelsen skal forstå markedet og beslutte om vi skal differentiere os.' },
  { nr:39, tema:'efterskoler', navn:'Efterskolernes særlige position',
    skoleleder: 'Efterspørgslen er stor, men forventningspresset er endnu større. Forældre betaler og forventer alt — trivsel, faglighed, dannelse, kost og logi.',
    ledelsesteam: 'Vi skal balancere pædagogik med økonomi. Hvert tomt værelse koster. Hvert ekstra barn kræver ressourcer. Vi presser grænser.',
    bestyrelse: 'Efterskoler lever af omdømme og anbefalinger. Bestyrelsen skal sikre at den pædagogiske kvalitet ikke ofres for fyldte værelser.' },
  { nr:40, tema:'smaa_skoler', navn:'Fleksibilitet for små skoler',
    skoleleder: 'Nye frihedsgrader i kvalitetsprogrammet giver os rum. Men frihed kræver at vi kan det. Strategisk kapacitet er svær at opbygge med tre lærere.',
    ledelsesteam: 'Vi er to i ledelsen. Hele skolens fremtid hviler på os. Hvordan udnytter vi friheden uden at drukne i den?',
    bestyrelse: 'Små skoler har fået nye frihedsgrader. Bestyrelsen skal sikre at skolen har strategisk kapacitet til at bruge dem klogt.' },

  // Kompetencer (41-45)
  { nr:41, tema:'professionsmasters', navn:'Nye professionsmasteruddannelser',
    skoleleder: 'Fra 2026 kommer nye masteruddannelser i skoleudvikling. Skal jeg selv tage en? Eller prioritere at sende nøglepersoner af sted?',
    ledelsesteam: 'Kompetenceløft er nødvendigt, men hvem og hvornår? Ledelsesteamet skal planlægge hvem der udvikler sig hvornår uden at skabe tomrum.',
    bestyrelse: '300 pladser i 2026, stigende til 650 i 2028. Bestyrelsen bør sikre at skolen har en plan for ledelsesudvikling og kompetenceløft.' },
  { nr:42, tema:'groen_skole', navn:'Grøn skoleledelse',
    skoleleder: 'Bæredygtighed skal ind i alle fag og i driften. Men jeg har aldrig lært at lede grønt. Og lærerne har allerede nok at gøre.',
    ledelsesteam: 'Den grønne omstilling er et ledelsesansvar. Men det skal gøres meningsfuldt, ikke som endnu et krav oveni alt andet.',
    bestyrelse: 'Grøn skoleledelse handler om at sætte retning. Bestyrelsen skal formulere ambitioner der er realistiske og forpligtende.' },
  { nr:43, tema:'praksisfaglighed', navn:'Praksisfaglighed og praktisk undervisning',
    skoleleder: 'Reformen vil mere praktisk læring. Men vores faglokaler er fra 1973 og udstyret er nedslidt. Ambitioner uden rammer er frustrerende.',
    ledelsesteam: 'Praktisk undervisning kræver planlægning, udstyr og kompetencer. Hvem i ledelsesteamet tager fat på dette? Og med hvilke midler?',
    bestyrelse: 'Mere praktisk undervisning kræver investering i fysiske rammer. Bestyrelsen skal beslutte om vi vil prioritere det i budgettet.' },
  { nr:44, tema:'coteaching', navn:'Co-teaching og tolærerordninger',
    skoleleder: 'To voksne i undervisningen lyder fantastisk. Men det kræver helt ny planlægning og en samarbejdskultur vi ikke har. Det er et kulturprojekt.',
    ledelsesteam: 'Co-teaching kræver match af lærere og ny skemalægning. Ledelsesteamet skal designe et system der ikke kollapser ved sygdom.',
    bestyrelse: 'Kvalitetsprogrammet åbner for tolærerordninger. Det kan løfte undervisningen markant. Bestyrelsen bør sikre at det prioriteres.' },
  { nr:45, tema:'datainformeret', navn:'Data-informeret ledelse',
    skoleleder: 'Vi har trivselstal, testresultater, fraværsdata. Men jeg bruger dem ikke systematisk. Det føles som kontrol, ikke som ledelse.',
    ledelsesteam: 'Data kan styrke beslutninger, men kun hvis vi bruger dem klogt. Vi har aldrig aftalt hvad vi kigger på og hvornår.',
    bestyrelse: 'Data-informeret ledelse kræver at bestyrelsen kan læse og forstå nøgletal. Kan vi det? Og stiller vi de rigtige spørgsmål?' },

  // Arbejdsmiljø (46-50)
  { nr:46, tema:'psykisk_arbejdsmiljoe', navn:'Psykisk arbejdsmiljø',
    skoleleder: 'Hver syvende dansker er stresset i høj grad. På min skole er det værre. Sygefraværet er eksploderet. Jeg er selv tæt på kanten.',
    ledelsesteam: 'Vi skal lede stressforebyggelse mens vi selv er stressede. Det er paradokset. Hvordan tager vi os af os selv og andre?',
    bestyrelse: 'Psykisk arbejdsmiljø er et bestyrelsesansvar. Vi skal kende tallene og sikre at ledelsen har en plan for forebyggelse.' },
  { nr:47, tema:'vold_trusler', navn:'Vold og trusler mod ansatte',
    skoleleder: 'En lærer blev slået i forrige uge. Det er anden gang i år. Vi har handleplaner, men de dækker ikke det faktiske menneske der står rystet.',
    ledelsesteam: 'Ro og orden er et reformmål. Men det er også et ledelsesmål. Vores støttestrukturer er for svage. Hvad gør vi konkret?',
    bestyrelse: 'Reformen prioriterer ro og orden. Bestyrelsen skal sikre at skolen har handleplaner og at de bruges — ikke bare eksisterer på papir.' },
  { nr:48, tema:'ok26', navn:'OK26-forhandlinger',
    skoleleder: 'Nye overenskomster ændrer spillereglerne. Arbejdstid, løn, samarbejdsvilkår — jeg skal kende aftalerne ned i detaljen for at lede fair.',
    ledelsesteam: 'OK26 giver nye rammer for samarbejde. Vi skal som ledelsesteam forstå dem og bruge dem aktivt, ikke defensivt.',
    bestyrelse: 'Overenskomsten påvirker skolens økonomi og drift direkte. Bestyrelsen bør have overblik over hvad de nye aftaler betyder.' },
  { nr:49, tema:'sygefravaer', navn:'Sygefravær og vikardækning',
    skoleleder: 'Sygefraværet er 8 procent. Det er to lærere der mangler hver dag. Vikardækningen er en konstant ild vi slukker. Kvaliteten lider.',
    ledelsesteam: 'Strategisk fraværshåndtering er en ledelsesopgave. Men vi gør det reaktivt. Vi har aldrig analyseret mønstre eller årsager systematisk.',
    bestyrelse: 'Højt fravær underminerer undervisningen. Bestyrelsen bør kende fraværstal og spørge: Hvad gør ledelsen proaktivt?' },
  { nr:50, tema:'kulturforandring', navn:'Kulturforandring og forandringstræthed',
    skoleleder: 'Skoler er blevet reformeret i årtier. Mine lærere orker ikke mere. Og alligevel skal vi videre. Hvordan finder jeg energien til meningsfuld udvikling?',
    ledelsesteam: 'Vi skal anerkende trætheden inden vi kan bede om mere. Forandring skal give mening, ikke bare være nyt. Hvordan vælger vi?',
    bestyrelse: 'Forandringstræthed er reel. Bestyrelsen skal forstå den og ikke bare presse på med nye strategier. Hvad er realistisk at forvente?' }
]

// ── Rollespecifikke opfølgninger ──────────────────────────────

const OPFOELG_SKOLELEDER = [
  'Ja, det rammer præcist. Og det sværeste er at jeg ikke kan tale med nogen om det. Som skoleleder er man alene på en særlig måde.',
  'Det er lige præcis det. Jeg ved godt hvad der skal til, men hverdagen stjæler al min tid til at gøre det.',
  'Når du spørger sådan, kan jeg mærke det handler om noget dybere. Det handler om hvad slags leder jeg vil være.',
  'Det er rigtigt. Men jeg er bange for konsekvenserne hvis jeg siger det højt til personalet.',
  'Jeg har faktisk prøvet det. Det virkede i tre uger, og så vendte det hele tilbage til det gamle.',
  'Det er et godt spørgsmål. Jeg tror svaret er at jeg ikke har prioriteret det fordi det er for svært.',
  'Min mavefornemmelse siger det samme. Men data peger i en anden retning. Eller gør de?',
  'Det er præcis det dilemma jeg sidder i. Vælger jeg det ene, svigter jeg det andet.',
  'Jeg ved det godt. Men det kræver en samtale med min bestyrelse som jeg udskyder.',
  'Tak for spørgsmålet. Ingen spørger mig normalt om det. De spørger altid om resultater og tal.'
]

const OPFOELG_LEDELSESTEAM = [
  'Vi har faktisk talt om det i teamet, men vi ender altid med at parkere det fordi der er noget mere akut.',
  'Det handler nok om at vi ikke har en fælles forståelse. Vi tolker opgaven helt forskelligt.',
  'Ja, rollefordelingen er uklar. Vi gør alle lidt af alt og ingen gør noget færdigt.',
  'Vi er enige om diagnosen men uenige om medicinen. Det er vores mønster.',
  'Det kræver at vi bruger tid på os selv som team. Og det føles egoistisk når lærerne drukner.',
  'Jeg tror problemet er at vi ikke har mod til at vælge fra. Vi bliver ved med at tilføje opgaver.',
  'Vi mangler et fælles sprog. Når vi siger strategi, mener vi tre forskellige ting.',
  'Det er et strukturelt problem. Vi har aldrig aftalt hvem der har ansvar for hvad.',
  'Du rammer noget. Vi koordinerer, men vi samarbejder ikke. Der er forskel.',
  'Det kræver tillid. Og tillid kræver at vi taler om de ting vi er uenige om, ikke bare de ting vi er enige om.'
]

const OPFOELG_BESTYRELSE = [
  'Vi er forældre der sidder i en bestyrelse. Vi vil gerne gøre det rigtigt, men vi ved ikke altid hvad det rigtige er.',
  'Det er en god pointe. Vi har nok blandet os for meget i drift og for lidt i strategi.',
  'Vi får meget information fra ledelsen, men vi har svært ved at skelne det vigtige fra det mindre vigtige.',
  'Bestyrelsens rolle er uklar for os. Hvornår spørger vi, hvornår beslutter vi, og hvornår holder vi os væk?',
  'Vi har diskuteret det på flere møder uden at nå til enighed. Der er forskellige holdninger i bestyrelsen.',
  'Jeg tror vi som bestyrelse er bange for at stille de svære spørgsmål til ledelsen.',
  'Vi ser tallene, men vi forstår ikke altid hvad de betyder for hverdagen på skolen.',
  'Det handler om at vi skal løfte os. Fra forældreperspektiv til strategisk perspektiv. Det er svært.',
  'Vi har brug for kompetenceudvikling som bestyrelse. Men hvem siger det højt?',
  'Det er rigtigt. Vi reagerer på det ledelsen bringer til os. Vi sætter sjældent selv dagsordenen.'
]

// ── API-kald ──────────────────────────────────────────────────

async function sendMessage(sessionId, message, trin, rolle, kort) {
  const body = {
    message, source: 'forloeb', trin, rolle, mode: 'forberedelse',
    kort: kort ? { forside: kort.forside, aabning: kort.aabning, skaerpelse: kort.skaerpelse, perspektiv: kort.perspektiv, erkendelse: kort.erkendelse, label: kort.label } : undefined
  }
  if (sessionId) body.session_id = sessionId
  try {
    const resp = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Origin': ORIGIN }, body: JSON.stringify(body) })
    const data = await resp.json()
    return { reply: data.reply || data.data?.reply, session_id: data.session_id || data.data?.session_id }
  } catch (e) { return { reply: null, session_id: sessionId } }
}

// ── Kør én fuld samtale ───────────────────────────────────────

async function runConversation(emne, rolle, kortNr) {
  const kort = KORT.model[kortNr]
  const trin = kort.nr
  const startMsg = emne[rolle]
  const opfoelgninger = rolle === 'skoleleder' ? OPFOELG_SKOLELEDER : rolle === 'ledelsesteam' ? OPFOELG_LEDELSESTEAM : OPFOELG_BESTYRELSE

  let result = await sendMessage(null, startMsg, trin, rolle, kort)
  if (!result.reply) return false

  // 9 opfølgende beskeder for dybde (10 total)
  for (let i = 0; i < 9; i++) {
    await sleep(1200 + Math.random() * 1500)
    const msg = opfoelgninger[i]
    result = await sendMessage(result.session_id, msg, trin, rolle, kort)
    if (!result.reply) break
  }
  return true
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('=== MEGA-SIMULERING: 50 emner × 3 roller × 10 beskeder ===')
  console.log(`Total samtaler: ${EMNER.length * 3}`)
  console.log()

  let success = 0, failed = 0, total = EMNER.length * 3

  for (let i = 0; i < EMNER.length; i++) {
    const emne = EMNER[i]
    const kortNr = i % 6 // Fordel over alle 6 kort

    for (const rolle of ['skoleleder', 'ledelsesteam', 'bestyrelse']) {
      const nr = success + failed + 1
      process.stdout.write(`[${nr}/${total}] ${emne.navn} — ${rolle} — Trin ${kortNr + 1}...`)
      try {
        const ok = await runConversation(emne, rolle, kortNr)
        if (ok) { success++; console.log(' ✓') }
        else { failed++; console.log(' ⚠') }
      } catch (e) { failed++; console.log(` ✗ ${e.message}`) }
      await sleep(2000 + Math.random() * 2000) // Rate limit
    }
  }

  console.log()
  console.log(`=== Resultat ===`)
  console.log(`Gennemført: ${success}/${total}`)
  console.log(`Fejlede: ${failed}`)
  console.log()
  console.log('Kør harvest: node scripts/harvest-remote.js')
}

main().catch(console.error)
