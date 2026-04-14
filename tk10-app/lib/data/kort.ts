// === Proceskort — Tirsdag kl. 10-modellen® ===
// Kilde: Strategiskskole.dk — alle rettigheder tilhører Thomas Kjerstein
// 42 kort: 3 åbning + 18 model + 18 menneskelig-rum + 3 afslutning

import type { KortDefinition } from '@/types'

const HANDLING = 'Hvad gør vi anderledes fra i morgen? Ét konkret skridt.'

export const KORT: KortDefinition[] = [

  // ════════════════════════════════════════
  //  ÅBNING  (trin: 0)
  // ════════════════════════════════════════

  {
    trin: 0, rolle: 'skoleleder', type: 'aabning',
    kortLabel: 'ÅBNING',
    forside: 'Før vi begynder — hvad bringer I med ind i rummet?',
    åbning: [
      'Hvad fylder hos jer lige nu?',
      'Hvad håber I at gå herfra med?',
      'Hvad er den vigtigste ting, I har brug for at blive klogere på i dag?',
    ],
    sektioner: [
      {
        label: 'RAMME',
        spørgsmål: [
          'Vi arbejder med virkelige situationer — ikke cases',
          'Der er ingen rigtige svar — men der er skarpere spørgsmål',
          'Vi arbejder os gennem modellens trin — ét ad gangen',
          'Hvert trin har et output, der fører videre til det næste',
        ],
      },
    ],
    erkendelse: 'Et fælles afsæt: hvad er vi her for, og hvad vil vi arbejde med?',
    handling: HANDLING,
  },

  {
    trin: 0, rolle: 'ledelsesteam', type: 'aabning',
    kortLabel: 'ÅBNING',
    forside: 'Før vi begynder — hvad bringer I med ind i rummet?',
    åbning: [
      'Hvad fylder hos jer lige nu?',
      'Hvad håber I at gå herfra med?',
      'Hvad er den vigtigste ting, I har brug for at blive klogere på i dag?',
    ],
    sektioner: [
      {
        label: 'RAMME',
        spørgsmål: [
          'Vi arbejder med virkelige situationer — ikke cases',
          'Der er ingen rigtige svar — men der er skarpere spørgsmål',
          'Vi arbejder os gennem modellens trin — ét ad gangen',
          'Hvert trin har et output, der fører videre til det næste',
        ],
      },
    ],
    erkendelse: 'Et fælles afsæt: hvad er vi her for, og hvad vil vi arbejde med?',
    handling: HANDLING,
  },

  {
    trin: 0, rolle: 'bestyrelse', type: 'aabning',
    kortLabel: 'ÅBNING',
    forside: 'Før vi begynder — hvad bringer I med ind i rummet?',
    åbning: [
      'Hvad fylder hos jer lige nu?',
      'Hvad håber I at gå herfra med?',
      'Hvad er den vigtigste ting, I har brug for at blive klogere på i dag?',
    ],
    sektioner: [
      {
        label: 'RAMME',
        spørgsmål: [
          'Vi arbejder med virkelige situationer — ikke cases',
          'Der er ingen rigtige svar — men der er skarpere spørgsmål',
          'Vi arbejder os gennem modellens trin — ét ad gangen',
          'Hvert trin har et output, der fører videre til det næste',
        ],
      },
    ],
    erkendelse: 'Et fælles afsæt: hvad er vi her for, og hvad vil vi arbejde med?',
    handling: HANDLING,
  },

  // ════════════════════════════════════════
  //  SKOLELEDER — MODEL (trin 1-6)
  // ════════════════════════════════════════

  {
    trin: 1, rolle: 'skoleleder', type: 'model',
    forside: 'Hvad er det, jeg faktisk står i som skoleleder?',
    åbning: [
      'Hvad er det for en situation, jeg står i lige nu?',
      'Hvad kalder tydeligt på min opmærksomhed?',
      'Hvor mister jeg retning eller overblik?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad gør jeg i dag — som ikke skaber den ønskede retning?',
          'Hvornår bliver jeg uklar i min ledelse?',
          'Hvad undgår jeg at tage fat på?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad kalder situationen på af ledelse?',
          'Hvad er min opgave som skoleleder — og hvad er ikke min opgave?',
          'Hvad gør jeg konkret anderledes fra i morgen?',
        ],
      },
    ],
    erkendelse: 'Et klart billede af situationen og skolelederens opgave i den.',
    handling: HANDLING,
  },

  {
    trin: 2, rolle: 'skoleleder', type: 'model',
    forside: 'Hvad er det egentlige problem — ikke symptomet?',
    åbning: [
      'Hvad er det, der faktisk holder mig tilbage?',
      'Hvad forsøger jeg at løse — igen og igen?',
      'Hvad er det, der binder problemerne sammen?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad er symptomet — og hvad er problemet bag det?',
          'Hvad ville klarhed gøre muligt, som ikke er muligt nu?',
          'Hvad undgår jeg at sige højt?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad kræver det af mig at finde den egentlige klarhed?',
          'Hvad kan ingen andre se tydeligere end jeg?',
          'Hvad er det første, der ville ændre sig, hvis jeg var klar?',
        ],
      },
    ],
    erkendelse: 'En præcis formulering af det egentlige problem — ikke symptomet.',
    handling: HANDLING,
  },

  {
    trin: 3, rolle: 'skoleleder', type: 'model',
    forside: 'Hvad er mit ledelsesmæssige valg?',
    åbning: [
      'Hvad er de reelle muligheder, jeg har?',
      'Hvad trækker mig i forskellige retninger?',
      'Hvad viger jeg uden om at beslutte?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad siger jeg ja til — med min tid og opmærksomhed?',
          'Hvad er jeg nødt til at sige nej til?',
          'Hvad vil det koste ikke at vælge?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad kræver dette valg af mig som leder?',
          'Hvad er konsekvensen for teamet?',
          'Hvad ville jeg fortryde ikke at have valgt?',
        ],
      },
    ],
    erkendelse: 'Ét tydeligt valg i én sætning: "Jeg vælger ___ — og det betyder at ___ stopper." Hvem fortæller du det?',
    handling: HANDLING,
  },

  {
    trin: 4, rolle: 'skoleleder', type: 'model',
    forside: 'Hvad er den konkrete struktur, der bærer dit valg?',
    åbning: [
      'Se på dit valg fra trin 3: Hvilken struktur kræver det? Nyt mødeformat? Ny rollefordeling? Ny kadence?',
      'Tag dit vigtigste ledermøde: Hvad skal agendaen være, hvis den skal afspejle din strategiske retning?',
      'Hvem skal gøre hvad — og hvornår starter det?',
    ],
    sektioner: [
      {
        label: 'PRODUKTION',
        spørgsmål: [
          'Design dit nye ledermøde: Hvad er de 3-4 faste punkter — og hvad er IKKE på agendaen længere?',
          'Hvem har ansvar for hvad? Skriv navnene ned.',
          'Hvornår starter den nye struktur — og hvad er den første konkrete ændring?',
        ],
      },
      {
        label: 'PRÆSENTATION',
        spørgsmål: [
          'Hvem præsenterer du denne struktur for — og hvornår?',
          'Hvad har de brug for at vide for at kunne følge den?',
          'Hvad gør du, hvis der er modstand mod den nye struktur?',
        ],
      },
    ],
    erkendelse: 'Én konkret struktur du kan præsentere for dit team i denne uge. Hvem viser du den til — og hvornår?',
    handling: HANDLING,
  },

  {
    trin: 5, rolle: 'skoleleder', type: 'model',
    forside: 'Er strategien til stede tirsdag kl. 10?',
    åbning: [
      'FELTØVELSE: Gå til dit næste ledermøde eller personalemøde. Observér med disse spørgsmål: Hvad handler mødet reelt om — strategi eller drift?',
      'Læg mærke til: Hvem taler? Om hvad? Henviser nogen til den retning I har sat?',
      'Når du ser dagsordenen: Kan du se jeres strategiske valg afspejlet — eller er det samme dagsorden som for 6 måneder siden?',
    ],
    sektioner: [
      {
        label: 'OBSERVATION',
        spørgsmål: [
          'Hvad lagde du mærke til ved mødet? Hvad overraskede dig?',
          'Hvor var strategien synlig — og hvor var den fraværende?',
          'Hvad sagde deltagernes adfærd om kulturen — uafhængigt af ordene?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad kalder observationen på af ledelse fra dig?',
          'Hvad er dit ansvar for det, du så?',
          'Hvad vil du gøre anderledes næste tirsdag — helt konkret?',
        ],
      },
    ],
    erkendelse: 'Et ærligt billede baseret på observation — ikke antagelser. Hvem deler du observationen med?',
    handling: HANDLING,
  },

  {
    trin: 6, rolle: 'skoleleder', type: 'model',
    forside: 'Hvad gør jeg, for at det holder?',
    åbning: [
      'Hvad er mit ansvar for at holde strategien levende?',
      'Hvad gør jeg allerede — og hvad har jeg glemt?',
      'Hvad er tegnet på, at det holder?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad dør stille — fordi ingen holder det fast?',
          'Hvornår tjekker jeg op — og hvornår undlader jeg det?',
          'Hvad er der brug for, at kun jeg gør?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad er min forankringsrolle?',
          'Hvad er tegnet på, at strategien lever?',
          'Hvad gør jeg konkret for at holde det levende?',
        ],
      },
    ],
    erkendelse: 'En konkret aftale: Hvem holder dig fast — og har de sagt ja til det?',
    handling: HANDLING,
  },

  // ════════════════════════════════════════
  //  LEDELSESTEAM — MODEL (trin 1-6)
  // ════════════════════════════════════════

  {
    trin: 1, rolle: 'ledelsesteam', type: 'model',
    forside: 'Hvad er det, vi faktisk står i sammen som ledelsesteam?',
    åbning: [
      'Hvad er den situation, vi befinder os i fælles — og er vi enige om det?',
      'Hvornår håndterer vi situationer forskelligt?',
      'Hvornår overlader vi noget til hinanden — uden aftale?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad gør vi i dag, som ikke skaber klarhed?',
          'Hvad undgår vi at tale om som team?',
          'Hvornår er vi for enige — eller for utydelige?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad kalder situationen på af fælles ledelse?',
          'Hvad er vores fælles opgave — og hvem tager hvad?',
          'Hvad aftaler vi at gøre anderledes fra næste uge?',
        ],
      },
    ],
    erkendelse: 'Et klart billede af situationen og ledelsesteamets fælles opgave i den.',
    handling: HANDLING,
  },

  {
    trin: 2, rolle: 'ledelsesteam', type: 'model',
    forside: 'Hvad er det, vi ikke får talt om?',
    åbning: [
      'Hvilke mønstre ser vi gentage sig i organisationen?',
      'Hvad ligger bag den uro, vi mærker hos medarbejderne?',
      'Hvad ser vi hver især — som vi ikke har delt med hinanden?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår nøjes vi med at håndtere — i stedet for at forstå?',
          'Hvilken samtale har vi undgået som ledelsesteam?',
          'Hvad ved vi godt — men har ikke gjort til en fælles erkendelse?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad er den fælles opgave, der viser sig, når vi ser tydeligt?',
          'Hvad kræver det af os som team at handle på det, vi nu ser?',
          'Hvad er den første fælles handling, vi forpligter os på?',
        ],
      },
    ],
    erkendelse: 'En fælles erkendelse af den egentlige opgave — formuleret helt tydeligt.',
    handling: HANDLING,
  },

  {
    trin: 3, rolle: 'ledelsesteam', type: 'model',
    forside: 'Hvad prioriterer vi fælles — og hvad holder vi op med?',
    åbning: [
      'Hvad er vores fælles topprioritet lige nu?',
      'Hvad ville vi stoppe — hvis vi turde sige det til hinanden?',
      'Hvad gør vi, fordi det forventes — ikke fordi det virker?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår lader vi alle køre deres eget — fordi det er nemmere end at prioritere fælles?',
          'Hvad sker der, når vi ikke er enige om retningen?',
          'Hvad undgår vi at vælge fra — og hvad koster det?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville medarbejderne mærke, hvis vi valgte tydeligere?',
          'Hvad kræver det af os at stå sammen om et fravalg?',
          'Hvad kommunikerer vi til organisationen — og hvornår gør vi det?',
        ],
      },
    ],
    erkendelse: 'Én fælles prioritering i én sætning: "Vi vælger ___ — og det betyder at ___ stopper." Hvem kommunikerer det til organisationen — og hvornår?',
    handling: HANDLING,
  },

  {
    trin: 4, rolle: 'ledelsesteam', type: 'model',
    forside: 'Hvad er den konkrete struktur, der bærer jeres fælles valg?',
    åbning: [
      'Se på jeres valg fra trin 3: Hvilken organisering kræver det? Nye roller? Nyt mødeformat? Ny opgavefordeling?',
      'Tag jeres næste ledelsesmøde: Hvad skal agendaen være, hvis den skal afspejle jeres prioritering?',
      'Hvem gør hvad — og hvornår starter det? Skriv det ned.',
    ],
    sektioner: [
      {
        label: 'PRODUKTION',
        spørgsmål: [
          'Design jeres nye ledelsesmøde: Hvad er de faste punkter — og hvad dropper I fra agendaen?',
          'Hvem har ansvar for hvad? Skriv navnene ned — ikke "vi" men konkrete personer.',
          'Hvornår implementerer I den nye struktur — og hvad er den første synlige ændring for medarbejderne?',
        ],
      },
      {
        label: 'PRÆSENTATION',
        spørgsmål: [
          'Hvem kommunikerer den nye struktur til organisationen — og hvornår?',
          'Hvad har medarbejderne brug for at vide for at følge med?',
          'Hvad gør I, hvis der er modstand — hvem tager den samtale?',
        ],
      },
    ],
    erkendelse: 'Én konkret struktur med navne, datoer og ansvar. Hvem præsenterer den for organisationen — og hvornår?',
    handling: HANDLING,
  },

  {
    trin: 5, rolle: 'ledelsesteam', type: 'model',
    forside: 'Kan vi se vores fælles retning i det, der sker i hverdagen?',
    åbning: [
      'FELTØVELSE: Aftal at hvert medlem af ledelsesteamet observerer ét møde eller én situation i denne uge. Observér: Kan man se jeres fælles retning i det der sker?',
      'Prøv dette: Byt rundgang med en kollega tirsdag kl. 10. Hvad ser I, når I ser hinandens hverdag?',
      'Spørg tre medarbejdere: "Hvad er skolens vigtigste prioritering lige nu?" — matcher svarene jeres strategi?',
    ],
    sektioner: [
      {
        label: 'OBSERVATION',
        spørgsmål: [
          'Hvad opdagede I, da I observerede? Var jeres fælles retning synlig — eller usynlig?',
          'Hvad gør I forskelligt i praksis — som medarbejderne kan mærke?',
          'Hvad sagde medarbejdernes svar om jeres tydelighed som ledelsesteam?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville medarbejderne mærke, hvis jeres retning var tydelig?',
          'Hvad skal I gøre anderledes — fra i morgen — som team?',
          'Hvor er det vigtigste sted at justere — og hvem tager ansvar for det?',
        ],
      },
    ],
    erkendelse: 'Et fælles billede baseret på observation — ikke antagelser. Hvem deler I observationen med — og hvad beder I dem lægge mærke til?',
    handling: HANDLING,
  },

  {
    trin: 6, rolle: 'ledelsesteam', type: 'model',
    forside: 'Hvordan sikrer vi, at det vi har besluttet, lever videre?',
    åbning: [
      'Hvad gør vi sammen — i næste uge — for at følge op?',
      'Hvordan holder vi hinanden fast på det aftalte?',
      'Hvordan kommunikerer vi vores beslutninger til organisationen?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår har vi tidligere besluttet noget, der døde stille?',
          'Hvad sker der, når én af os falder tilbage — og de andre ikke siger noget?',
          'Hvad er vores største risiko for at miste momentum?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad vil medarbejderne mærke om en måned, hvis vi holder fast?',
          'Hvornår mødes vi næste gang — og hvad skal vi tale om?',
          'Hvad aftaler vi konkret i dag — og hvem holder os fast på det?',
        ],
      },
    ],
    erkendelse: 'Konkrete aftaler med navne og datoer. Hvem holder jer fast — og har de sagt ja til det?',
    handling: HANDLING,
  },

  // ════════════════════════════════════════
  //  BESTYRELSE — MODEL (trin 1-6)
  // ════════════════════════════════════════

  {
    trin: 1, rolle: 'bestyrelse', type: 'model',
    forside: 'Hvad er det, vi faktisk står i som bestyrelse?',
    åbning: [
      'Hvad hører vi fra forældre og omverden — og hvad gør vi ved det?',
      'Hvornår bliver vi usikre på vores rolle?',
      'Hvad er vi i tvivl om i forholdet til ledelsen?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad gør vi i dag, som skaber uklarhed?',
          'Hvad reagerer vi på — i stedet for at sætte retning?',
          'Hvornår er vi for detaljerede — eller for passive?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad kalder situationen på af bestyrelsesarbejde?',
          'Hvad er vores opgave som bestyrelse — og hvad er det ikke?',
          'Hvad tager bestyrelsen med herfra — og hvad gør vi ved det?',
        ],
      },
    ],
    erkendelse: 'Et klart billede af situationen og bestyrelsens opgave i den.',
    handling: HANDLING,
  },

  {
    trin: 2, rolle: 'bestyrelse', type: 'model',
    forside: 'Hvad ser vi ikke — som vi burde se?',
    åbning: [
      'Hvad fortæller de tal og resultater, vi får forelagt, os egentlig?',
      'Hvad ved vi for lidt om til at træffe gode beslutninger?',
      'Hvad ville vi opdage, hvis vi kiggede bag referaterne?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår accepterer vi svar, der er for glatte?',
          'Hvad spørger vi aldrig om — og hvorfor?',
          'Hvornår er vi for langt væk fra virkeligheden til at have en mening?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad er bestyrelsens egentlige opgave i det, vi nu ser?',
          'Hvad kræver det af os at spørge ind — uden at overtage?',
          'Hvad spørger vi ledelsen om — på vores næste møde?',
        ],
      },
    ],
    erkendelse: 'En skarpere forståelse af skolens reelle situation — set fra bestyrelsens position.',
    handling: HANDLING,
  },

  {
    trin: 3, rolle: 'bestyrelse', type: 'model',
    forside: 'Hvad beslutter vi — og hvad lader vi ligge?',
    åbning: [
      'Hvad er det vigtigste, bestyrelsen kan beslutte sig for lige nu?',
      'Hvad beder vi ledelsen om — som reelt modarbejder deres fokus?',
      'Hvad ville vi sige nej til, hvis vi tog vores rolle alvorligt?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår beslutter vi for meget — eller for lidt?',
          'Hvad er vi bange for at overlade til ledelsen?',
          'Hvad sker der, når vi ikke bakker op om et svært valg?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad er bestyrelsens vigtigste strategiske beslutning lige nu?',
          'Hvordan bakker vi op om ledelsens valg — uden at overtage?',
          'Hvad beslutter bestyrelsen i dag — og hvem kommunikerer det til hvem?',
        ],
      },
    ],
    erkendelse: 'Én klar beslutning i én sætning: "Bestyrelsen beslutter ___ — og overlader ___ til ledelsen." Hvem kommunikerer det — og hvornår?',
    handling: HANDLING,
  },

  {
    trin: 4, rolle: 'bestyrelse', type: 'model',
    forside: 'Hvad er den konkrete ramme, bestyrelsen sætter — for sig selv og for ledelsen?',
    åbning: [
      'Se på jeres beslutning fra trin 3: Hvad skal bestyrelsen bede ledelsen rapportere på — konkret?',
      'Design jeres næste bestyrelsesmødes agenda: Hvad skal I bruge tid på — og hvad skal I STOPPE med at bruge tid på?',
      'Hvad er den klare aftale med skolelederen om, hvad der er bestyrelsens bord — og hvad der ikke er?',
    ],
    sektioner: [
      {
        label: 'PRODUKTION',
        spørgsmål: [
          'Skriv jeres 3 vigtigste spørgsmål til ledelsen ved næste møde. Ikke generelle — konkrete.',
          'Design bestyrelsens egen årshjul: Hvornår følger I op på hvad?',
          'Hvad er den ene ting I fjerner fra bestyrelsens agenda — fordi det er ledelsens opgave?',
        ],
      },
      {
        label: 'PRÆSENTATION',
        spørgsmål: [
          'Hvem fortæller skolelederen om de nye rammer — og hvornår?',
          'Hvad har skolelederen brug for at vide for at arbejde inden for dem?',
          'Hvordan sikrer I at rammen opleves som støtte — ikke som kontrol?',
        ],
      },
    ],
    erkendelse: 'Konkrete rammer med datoer og spørgsmål. Hvem kommunikerer det til skolelederen — og hvornår?',
    handling: HANDLING,
  },

  {
    trin: 5, rolle: 'bestyrelse', type: 'model',
    forside: 'Kan vi se skolens strategi i det, der faktisk sker?',
    åbning: [
      'FELTØVELSE: Besøg skolen på en almindelig tirsdag kl. 10. Gå en tur i gangene, kig ind i et klasselokale, lyt til stemningen. Hvad ser I?',
      'Alternativ: Bed skolelederen beskrive én helt almindelig tirsdag formiddag. Stil spørgsmålet: "Hvor i den beskrivelse kan vi se strategien?"',
      'Spørg tre forældre: "Hvad er skolen mest optaget af lige nu?" — matcher svarene det I besluttede?',
    ],
    sektioner: [
      {
        label: 'OBSERVATION',
        spørgsmål: [
          'Hvad opdagede I — enten ved besøget eller i skolelederens beskrivelse?',
          'Hvornår forvekslede I aktivitet med strategisk retning?',
          'Hvad ville I have opdaget, hvis I havde stillet andre spørgsmål til ledelsen?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad er det vigtigste spørgsmål I kan stille ledelsen ved næste bestyrelsesmøde?',
          'Hvordan kan I følge op på strategien — uden at overtage driften?',
          'Hvad beslutter bestyrelsen at gøre konkret for at holde strategien synlig?',
        ],
      },
    ],
    erkendelse: 'Et realistisk billede baseret på observation. Hvad er det vigtigste spørgsmål I stiller ledelsen — og hvornår?',
    handling: HANDLING,
  },

  {
    trin: 6, rolle: 'bestyrelse', type: 'model',
    forside: 'Hvordan følger vi op — uden at overtage?',
    åbning: [
      'Hvad vil vi bede ledelsen om at rapportere på — og hvornår?',
      'Hvad er de vigtigste tegn på, at retningen holder?',
      'Hvad er vores egen forankringsopgave som bestyrelse?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår forventer vi resultater hurtigere, end de kan leveres?',
          'Hvad sker der, når bestyrelsen mister tålmodigheden?',
          'Hvornår skifter vi kurs — i stedet for at holde fast og justere?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad er bestyrelsens vigtigste opgave det næste halve år?',
          'Hvordan støtter vi ledelsen i at holde retningen — uden at blande os i driften?',
          'Hvad beslutter bestyrelsen at gøre — konkret — inden næste bestyrelsesmøde?',
        ],
      },
    ],
    erkendelse: 'En klar opfølgningsaftale med datoer. Hvem i bestyrelsen holder fast — og har skolelederen sagt ja til formatet?',
    handling: HANDLING,
  },

  // ════════════════════════════════════════
  //  SKOLELEDER — DET MENNESKELIGE RUM (trin 1-6)
  // ════════════════════════════════════════

  {
    trin: 1, rolle: 'skoleleder', type: 'menneskelig-rum',
    kortLabel: 'USIKKERHED',
    forside: 'Hvad bærer du med dig — som du ikke siger højt?',
    åbning: [
      'Hvor føler du dig alene med ansvaret?',
      'Hvad er du usikker på — men lader som om du har styr på?',
      'Hvad ville du sige, hvis du turde?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad koster det dig at bære usikkerheden alene?',
          'Hvornår bliver du en anden leder, end du gerne vil være?',
          'Hvad sker der i rummet, når usikkerheden ikke bliver sagt?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville ændre sig, hvis usikkerheden fik plads?',
          'Hvad har du brug for — fra dem du arbejder med?',
          'Hvad siger du højt i dette rum — som du ikke har sagt før?',
        ],
      },
    ],
    erkendelse: 'Åbenhed om det der fylder — som grundlag for ærlig dialog.',
    handling: HANDLING,
  },

  {
    trin: 2, rolle: 'skoleleder', type: 'menneskelig-rum',
    kortLabel: 'SÅRBARHED',
    forside: 'Hvad koster det at se klart?',
    åbning: [
      'Hvornår er det lettere ikke at vide?',
      'Hvad risikerer du ved at sige det, du ser?',
      'Hvad sker der i relationen, når nogen siger noget ærligt?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen, når vi ikke tør se klart?',
          'Hvornår bliver loyalitet en hindring for ærlighed?',
          'Hvad sker der over tid, når vi undgår de rigtige spørgsmål?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville det betyde for jeres samarbejde, hvis I turde se klart — sammen?',
          'Hvornår er sårbarhed en forudsætning for god ledelse?',
          'Hvad har I brug for af hinanden for at kunne være ærlige?',
        ],
      },
    ],
    erkendelse: 'Tillid til at sige det, vi ser — også når det er svært.',
    handling: HANDLING,
  },

  {
    trin: 3, rolle: 'skoleleder', type: 'menneskelig-rum',
    kortLabel: 'MOD',
    forside: 'Hvad koster det at vælge — og hvad koster det ikke at gøre det?',
    åbning: [
      'Hvem skuffer du, når du vælger tydeligt?',
      'Hvad er du bange for at tabe?',
      'Hvad ville du vælge, hvis du vidste, du havde opbakning?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen for din manglende beslutning?',
          'Hvornår er "vi tager den til næste gang" egentlig et fravalg i sig selv?',
          'Hvad sker der med respekten for ledelsen, når valget udebliver?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad gør modige valg ved et fællesskab?',
          'Hvad er det valg, du har udsat — og hvad tager du med herfra?',
          'Hvad har du brug for af de andre i dette rum, for at turde?',
        ],
      },
    ],
    erkendelse: 'Erkendelse af hvad modet kræver — og hvad det giver.',
    handling: HANDLING,
  },

  {
    trin: 4, rolle: 'skoleleder', type: 'menneskelig-rum',
    kortLabel: 'TILLID',
    forside: 'Hvad bygger vi rammerne på — kontrol eller tillid?',
    åbning: [
      'Hvornår skaber vi strukturer af tillid — og hvornår af mistillid?',
      'Hvad siger vores organisering om det, vi tror om hinanden?',
      'Hvad sker der med mennesker, når rammerne er uklare?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår bruger vi struktur som skjold mod det menneskelige?',
          'Hvad sker der med relationer, når alt bliver til processer?',
          'Hvornår er fravær af struktur det samme som fravær af omsorg?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville det betyde, hvis strukturerne var bygget på tillid til mennesker?',
          'Hvornår har en god ramme givet dig frihed — i stedet for begrænsning?',
          'Hvad har I brug for af hinanden, for at rammerne kan bære?',
        ],
      },
    ],
    erkendelse: 'Bevidsthed om hvad rammerne gør ved mennesker — og hvad mennesker gør ved rammerne.',
    handling: HANDLING,
  },

  {
    trin: 5, rolle: 'skoleleder', type: 'menneskelig-rum',
    kortLabel: 'ÆRLIGHED',
    forside: 'Hvad ser vi — som vi ikke taler om?',
    åbning: [
      'Hvad ved alle — men ingen siger?',
      'Hvad ville vi se, hvis vi turde se det?',
      'Hvornår er der forskel på det, vi siger, og det vi gør?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen, når vi ikke er ærlige om virkeligheden?',
          'Hvad sker der med tilliden, når afstanden mellem ord og praksis vokser?',
          'Hvornår er vi mere optaget af at beskytte os selv end af at lede?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville ændre sig, hvis vi talte om det, vi faktisk ser?',
          'Hvad er det, I siger til hinanden nu — som I ikke har sagt før?',
          'Hvad er den ene ting, du tager ansvar for at sige — inden I forlader dette rum?',
        ],
      },
    ],
    erkendelse: 'Mod til at tale om virkeligheden — som den er, ikke som vi ønsker den var.',
    handling: HANDLING,
  },

  {
    trin: 6, rolle: 'skoleleder', type: 'menneskelig-rum',
    kortLabel: 'UDHOLDENHED',
    forside: 'Hvad kræver det at holde fast — når hverdagen vender tilbage?',
    åbning: [
      'Hvad er det sværeste ved at holde fast i forandring?',
      'Hvad har du brug for fra andre, for at holde ud?',
      'Hvornår er det okay at tvivle — uden at give op?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad sker der med mennesker, der hele tiden skal forandre sig?',
          'Hvornår presser vi mere på — i stedet for at anerkende det der allerede er gjort?',
          'Hvad koster det, når vi ikke giver plads til træthed?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad giver dig energi til at fortsætte?',
          'Hvad tager du med herfra — som hjælp til at holde fast?',
          'Hvad er den ene ting, du gør anderledes fra i morgen — for at passe på dig selv i dette arbejde?',
        ],
      },
    ],
    erkendelse: 'En realistisk erkendelse af hvad forandring kræver — og hvad der holder os fast.',
    handling: HANDLING,
  },

  // ════════════════════════════════════════
  //  LEDELSESTEAM — DET MENNESKELIGE RUM (trin 1-6)
  // ════════════════════════════════════════

  {
    trin: 1, rolle: 'ledelsesteam', type: 'menneskelig-rum',
    kortLabel: 'USIKKERHED',
    forside: 'Hvad bærer du med dig — som du ikke siger højt?',
    åbning: [
      'Hvor føler du dig alene med ansvaret?',
      'Hvad er du usikker på — men lader som om du har styr på?',
      'Hvad ville du sige, hvis du turde?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad koster det dig at bære usikkerheden alene?',
          'Hvornår bliver du en anden leder, end du gerne vil være?',
          'Hvad sker der i rummet, når usikkerheden ikke bliver sagt?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville ændre sig, hvis usikkerheden fik plads?',
          'Hvad har du brug for — fra dem du arbejder med?',
          'Hvad siger du højt i dette rum — som du ikke har sagt før?',
        ],
      },
    ],
    erkendelse: 'Åbenhed om det der fylder — som grundlag for ærlig dialog.',
    handling: HANDLING,
  },

  {
    trin: 2, rolle: 'ledelsesteam', type: 'menneskelig-rum',
    kortLabel: 'SÅRBARHED',
    forside: 'Hvad koster det at se klart?',
    åbning: [
      'Hvornår er det lettere ikke at vide?',
      'Hvad risikerer du ved at sige det, du ser?',
      'Hvad sker der i relationen, når nogen siger noget ærligt?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen, når vi ikke tør se klart?',
          'Hvornår bliver loyalitet en hindring for ærlighed?',
          'Hvad sker der over tid, når vi undgår de rigtige spørgsmål?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville det betyde for jeres samarbejde, hvis I turde se klart — sammen?',
          'Hvornår er sårbarhed en forudsætning for god ledelse?',
          'Hvad har I brug for af hinanden for at kunne være ærlige?',
        ],
      },
    ],
    erkendelse: 'Tillid til at sige det, vi ser — også når det er svært.',
    handling: HANDLING,
  },

  {
    trin: 3, rolle: 'ledelsesteam', type: 'menneskelig-rum',
    kortLabel: 'MOD',
    forside: 'Hvad koster det at vælge — og hvad koster det ikke at gøre det?',
    åbning: [
      'Hvem skuffer du, når du vælger tydeligt?',
      'Hvad er du bange for at tabe?',
      'Hvad ville du vælge, hvis du vidste, du havde opbakning?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen for din manglende beslutning?',
          'Hvornår er "vi tager den til næste gang" egentlig et fravalg i sig selv?',
          'Hvad sker der med respekten for ledelsen, når valget udebliver?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad gør modige valg ved et fællesskab?',
          'Hvad er det valg, du har udsat — og hvad tager du med herfra?',
          'Hvad har du brug for af de andre i dette rum, for at turde?',
        ],
      },
    ],
    erkendelse: 'Erkendelse af hvad modet kræver — og hvad det giver.',
    handling: HANDLING,
  },

  {
    trin: 4, rolle: 'ledelsesteam', type: 'menneskelig-rum',
    kortLabel: 'TILLID',
    forside: 'Hvad bygger vi rammerne på — kontrol eller tillid?',
    åbning: [
      'Hvornår skaber vi strukturer af tillid — og hvornår af mistillid?',
      'Hvad siger vores organisering om det, vi tror om hinanden?',
      'Hvad sker der med mennesker, når rammerne er uklare?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår bruger vi struktur som skjold mod det menneskelige?',
          'Hvad sker der med relationer, når alt bliver til processer?',
          'Hvornår er fravær af struktur det samme som fravær af omsorg?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville det betyde, hvis strukturerne var bygget på tillid til mennesker?',
          'Hvornår har en god ramme givet dig frihed — i stedet for begrænsning?',
          'Hvad har I brug for af hinanden, for at kunne arbejde ud fra tillid?',
        ],
      },
    ],
    erkendelse: 'Rammer bygget på tillid til mennesker — ikke kontrol.',
    handling: HANDLING,
  },

  {
    trin: 5, rolle: 'ledelsesteam', type: 'menneskelig-rum',
    kortLabel: 'ÆRLIGHED',
    forside: 'Hvad ser vi — som vi ikke taler om?',
    åbning: [
      'Hvad ved alle — men ingen siger?',
      'Hvad ville vi se, hvis vi turde se det?',
      'Hvornår er der forskel på det, vi siger, og det vi gør?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen, når vi ikke er ærlige om virkeligheden?',
          'Hvad sker der med tilliden, når afstanden mellem ord og praksis vokser?',
          'Hvornår er vi mere optaget af at beskytte os selv end af at lede?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville ændre sig, hvis vi talte om det, vi faktisk ser?',
          'Hvad er det, I siger til hinanden nu — som I ikke har sagt før?',
          'Hvad er den ene ting, du tager ansvar for at sige — inden I forlader dette rum?',
        ],
      },
    ],
    erkendelse: 'Mod til at tale om virkeligheden — ikke sandheden vi håber på.',
    handling: HANDLING,
  },

  {
    trin: 6, rolle: 'ledelsesteam', type: 'menneskelig-rum',
    kortLabel: 'UDHOLDENHED',
    forside: 'Hvad kræver det at holde fast — når hverdagen vender tilbage?',
    åbning: [
      'Hvad er det sværeste ved at holde fast i forandring?',
      'Hvad har du brug for fra andre, for at holde ud?',
      'Hvornår er det okay at tvivle — uden at give op?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad sker der med mennesker, der hele tiden skal forandre sig?',
          'Hvornår presser vi mere på — i stedet for at anerkende det der allerede er gjort?',
          'Hvad koster det, når vi ikke giver plads til træthed?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad giver dig energi til at fortsætte?',
          'Hvad tager du med herfra — som hjælp til at holde fast?',
          'Hvad er den ene ting, du gør anderledes fra i morgen — for at passe på dig selv i dette arbejde?',
        ],
      },
    ],
    erkendelse: 'En realistisk erkendelse af hvad forandring kræver — og hvad der holder os fast.',
    handling: HANDLING,
  },

  // ════════════════════════════════════════
  //  BESTYRELSE — DET MENNESKELIGE RUM (trin 1-6)
  // ════════════════════════════════════════

  {
    trin: 1, rolle: 'bestyrelse', type: 'menneskelig-rum',
    kortLabel: 'USIKKERHED — PÅ AFSTAND',
    forside: 'Hvad er det sværeste ved at have ansvar for noget, du ikke ser i hverdagen?',
    åbning: [
      'Hvornår føler du dig for langt væk til at have en mening?',
      'Hvad er du usikker på i din rolle som bestyrelsesmedlem — men tør ikke spørge om?',
      'Hvornår lader du som om du forstår mere, end du gør?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad koster det skolen, at bestyrelsen ikke spørger ind?',
          'Hvornår bruger du professionel distance som beskyttelse mod usikkerhed?',
          'Hvad ville ændre sig, hvis du sagde: "Jeg forstår det ikke — forklar det for mig"?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville det betyde for relationen til skolelederen, hvis I turde sige hvad I ikke forstår?',
          'Hvad har du brug for fra skolelederen for at føle dig tryg i rollen?',
          'Hvad siger du højt i dette rum — som du ikke har sagt til bestyrelsen?',
        ],
      },
    ],
    erkendelse: 'Åbenhed om den usikkerhed der følger med at lede på afstand — som grundlag for bedre spørgsmål.',
    handling: HANDLING,
  },

  {
    trin: 2, rolle: 'bestyrelse', type: 'menneskelig-rum',
    kortLabel: 'SÅRBARHED — ANSVAR UDEN INDSIGT',
    forside: 'Hvad koster det at bære ansvaret — uden at kende hverdagen?',
    åbning: [
      'Hvornår træffer I beslutninger på grundlag, I ikke selv kan vurdere?',
      'Hvad risikerer du ved at stille det spørgsmål, du egentlig vil stille?',
      'Hvornår er loyalitet mod skolelederen en hindring for at se klart?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen, når bestyrelsen accepterer svar den ikke forstår?',
          'Hvornår forveksler I tillid til lederen med fravær af nysgerrighed?',
          'Hvad sker der over tid, når bestyrelsen ikke stiller de svære spørgsmål?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville det betyde for skolens udvikling, hvis bestyrelsen turde spørge anderledes?',
          'Hvornår er sårbarhed i bestyrelsen en styrke — ikke en svaghed?',
          'Hvad har I brug for fra skolelederen for at kunne stille ærlige spørgsmål?',
        ],
      },
    ],
    erkendelse: 'Mod til at indrømme hvad I ikke ved — som grundlag for bedre governance.',
    handling: HANDLING,
  },

  {
    trin: 3, rolle: 'bestyrelse', type: 'menneskelig-rum',
    kortLabel: 'MOD — AT BESLUTTE PÅ AFSTAND',
    forside: 'Hvad kræver det af dig at træffe beslutninger for en skole, du ikke ser i hverdagen?',
    åbning: [
      'Hvornår har du tvivlet på om bestyrelsen har ret til at beslutte det, I beslutter?',
      'Hvad er du bange for at ødelægge ved at blande dig?',
      'Hvad ville du beslutte, hvis du vidste at skolelederen bakkede op?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen, når bestyrelsen udsætter en beslutning af frygt for at blande sig?',
          'Hvornår forveksler I forsigtighed med ansvarsfralæggelse?',
          'Hvad sker der med skolelederens handlingsrum, når bestyrelsen er uklar?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad gør klare bestyrelsesbeslutninger ved skolelederens arbejde?',
          'Hvad er den beslutning I har udsat — og hvad tager du med herfra?',
          'Hvad har du brug for fra resten af bestyrelsen for at turde være tydelig?',
        ],
      },
    ],
    erkendelse: 'Erkendelse af at bestyrelsesmod handler om tydelighed — ikke om at overtage.',
    handling: HANDLING,
  },

  {
    trin: 4, rolle: 'bestyrelse', type: 'menneskelig-rum',
    kortLabel: 'TILLID — MELLEM NIVEAUER',
    forside: 'Hvad bygger relationen til skolelederen på — kontrol eller tillid?',
    åbning: [
      'Hvornår tjekker bestyrelsen op — af nysgerrighed vs. af mistillid?',
      'Hvad siger jeres rapporteringskrav om det, I tror om ledelsen?',
      'Hvad sker der i relationen til skolelederen, når I beder om mere dokumentation?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvornår bruger I struktur og rapportering som erstatning for en ærlig samtale?',
          'Hvad sker der med skolelederens motivation, når bestyrelsen kontrollerer i stedet for at støtte?',
          'Hvornår er bestyrelsens behov for tryghed vigtigere end skolens behov for handlefrihed?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville ændre sig, hvis bestyrelsens møder handlede om dialog i stedet for rapportering?',
          'Hvad har skolelederen brug for fra jer — og har I spurgt?',
          'Hvad er den ene ting I kan gøre for at styrke tilliden mellem bestyrelse og ledelse?',
        ],
      },
    ],
    erkendelse: 'Bevidsthed om at bestyrelsens rammer enten skaber frihed eller kontrol — og at valget er bevidst.',
    handling: HANDLING,
  },

  {
    trin: 5, rolle: 'bestyrelse', type: 'menneskelig-rum',
    kortLabel: 'ÆRLIGHED — DET USETE',
    forside: 'Hvad ved bestyrelsen — som den ikke taler åbent om?',
    åbning: [
      'Hvad diskuterer I i bilen på vej hjem — som I ikke sagde på mødet?',
      'Hvad ville I se, hvis I besøgte skolen uanmeldt en tirsdag kl. 10?',
      'Hvornår er bestyrelsens billede af skolen baseret på det I ønsker — ikke det der er?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvem betaler prisen, når bestyrelsen ikke er ærlig om hvad den ser — eller ikke ser?',
          'Hvad sker der med skolens udvikling, når bestyrelsen accepterer det pæne svar?',
          'Hvornår er det lettere at godkende en beretning end at stille et spørgsmål?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad ville ændre sig, hvis bestyrelsen stillede ét ærligt spørgsmål per møde?',
          'Hvad er det I siger til hinanden nu — som I ikke har sagt på et bestyrelsesmøde?',
          'Hvad tager du ansvar for at sige ved næste møde?',
        ],
      },
    ],
    erkendelse: 'Mod til at stille de spørgsmål bestyrelsen ikke plejer at stille — fordi skolen har brug for det.',
    handling: HANDLING,
  },

  {
    trin: 6, rolle: 'bestyrelse', type: 'menneskelig-rum',
    kortLabel: 'UDHOLDENHED — LANGT PERSPEKTIV',
    forside: 'Hvad kræver det at holde strategisk retning — når bestyrelsen kun mødes 4-6 gange om året?',
    åbning: [
      'Hvad er det sværeste ved at fastholde en retning, når I ikke er til stede i hverdagen?',
      'Hvornår mister bestyrelsen tålmodigheden og skifter kurs — i stedet for at holde fast?',
      'Hvad har du brug for for at bevare engagementet som frivillig bestyrelsesmedlem?',
    ],
    sektioner: [
      {
        label: 'SKÆRPELSE',
        spørgsmål: [
          'Hvad sker der med skolen, når bestyrelsen skifter fokus hvert halvår?',
          'Hvornår er bestyrelsens utålmodighed den største trussel mod skolens strategi?',
          'Hvad koster det skolen, når bestyrelsesmedlemmer mister engagementet stille?',
        ],
      },
      {
        label: 'PERSPEKTIV',
        spørgsmål: [
          'Hvad giver dig energi i bestyrelsesarbejdet — og hvad dræner?',
          'Hvad tager du med herfra som kan holde dig fast i rollen?',
          'Hvad er den ene ting bestyrelsen kan gøre for at holde hinanden engagerede?',
        ],
      },
    ],
    erkendelse: 'En realistisk erkendelse af hvad strategisk udholdenhed kræver — når man leder på afstand.',
    handling: HANDLING,
  },

  // ════════════════════════════════════════
  //  AFSLUTNING  (trin: 7)
  // ════════════════════════════════════════

  {
    trin: 7, rolle: 'skoleleder', type: 'afslutning',
    kortLabel: 'AFSLUTNING',
    forside: 'Hvad tager vi med herfra — og hvad gør vi i morgen?',
    åbning: [
      'Hvad er den vigtigste erkendelse fra i dag?',
      'Hvad har vi besluttet — og hvem gør hvad?',
      'Hvad var overraskende — eller svært?',
      'Hvad har vi brug for at vende tilbage til?',
    ],
    sektioner: [
      {
        label: 'RAMME',
        spørgsmål: [
          'Hvert trin har givet et konkret output',
          'Handlingerne starter i morgen — ikke "snart"',
          'Vi mødes igen tirsdag kl. 10 — med status på det vi aftalte',
        ],
      },
    ],
    erkendelse: 'Vi ved, hvad vi gør — og vi ved, hvem der gør hvad.',
    handling: HANDLING,
  },

  {
    trin: 7, rolle: 'ledelsesteam', type: 'afslutning',
    kortLabel: 'AFSLUTNING',
    forside: 'Hvad tager vi med herfra — og hvad gør vi i morgen?',
    åbning: [
      'Hvad er den vigtigste erkendelse fra i dag?',
      'Hvad har vi besluttet — og hvem gør hvad?',
      'Hvad var overraskende — eller svært?',
      'Hvad har vi brug for at vende tilbage til?',
    ],
    sektioner: [
      {
        label: 'RAMME',
        spørgsmål: [
          'Hvert trin har givet et konkret output',
          'Handlingerne starter i morgen — ikke "snart"',
          'Vi mødes igen tirsdag kl. 10 — med status på det vi aftalte',
        ],
      },
    ],
    erkendelse: 'Vi ved, hvad vi gør — og vi ved, hvem der gør hvad.',
    handling: HANDLING,
  },

  {
    trin: 7, rolle: 'bestyrelse', type: 'afslutning',
    kortLabel: 'AFSLUTNING',
    forside: 'Hvad tager vi med herfra — og hvad gør vi i morgen?',
    åbning: [
      'Hvad er den vigtigste erkendelse fra i dag?',
      'Hvad har vi besluttet — og hvem gør hvad?',
      'Hvad var overraskende — eller svært?',
      'Hvad har vi brug for at vende tilbage til?',
    ],
    sektioner: [
      {
        label: 'RAMME',
        spørgsmål: [
          'Hvert trin har givet et konkret output',
          'Handlingerne starter i morgen — ikke "snart"',
          'Vi mødes igen tirsdag kl. 10 — med status på det vi aftalte',
        ],
      },
    ],
    erkendelse: 'Vi ved, hvad vi gør — og vi ved, hvem der gør hvad.',
    handling: HANDLING,
  },
]

// === Lookup functions ===

export function getKort(rolle: string, trin: number): KortDefinition | undefined {
  return KORT.find(k => k.rolle === rolle && k.trin === trin && k.type === 'model')
}

export function getAabningKort(rolle: string): KortDefinition | undefined {
  return KORT.find(k => k.rolle === rolle && k.type === 'aabning')
}

export function getMenneskeligRumKort(rolle: string, trin: number): KortDefinition | undefined {
  return KORT.find(k => k.rolle === rolle && k.trin === trin && k.type === 'menneskelig-rum')
}

export function getAfslutningKort(rolle: string): KortDefinition | undefined {
  return KORT.find(k => k.rolle === rolle && k.type === 'afslutning')
}
