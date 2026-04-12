// ============================================================
// Tirsdag kl. 10-modellen® — Modeldata
// Autoritativ kilde: tk10-app/lib/data/model.ts
// ============================================================

export const TRIN_NAVNE = [
  'Spejling', 'Klarhed', 'Valg', 'Struktur', 'Kernen', 'Forankring'
]

export const TRIN_SPØRGSMÅL = [
  'Hvad er det vi egentlig står i?',
  'Hvad er problemet bag problemet?',
  'Hvad vælger vi — og hvad vælger vi fra?',
  'Hvordan organiserer vi os?',
  'Kan vi se det i praksis tirsdag kl. 10?',
  'Hvordan holder vi det levende?',
]

export const TRIN_KONTEKST = [
  'Spejling handler om at se virkeligheden klart — ikke som vi ønsker den, men som den faktisk er. Ingen løsninger endnu. Kun observation og ærlighed.',
  'Klarhed handler om at finde det egentlige problem bag de synlige symptomer. En forkert diagnose giver altid den forkerte løsning.',
  'Valg handler om prioritering. At sige ja er kun meningsfuldt, hvis vi også siger nej til noget andet. Hvad vælger vi fra?',
  'Struktur handler om at designe de rammer, der gør strategien mulig i hverdagen. Møder, ansvar, koordinering — alt er design.',
  'Kernen er prøven. Kan strategien faktisk mærkes i det, der sker tirsdag kl. 10? Ikke i dokumenter — i praksis.',
  'Forankring handler om at holde det levende. Strategier dør ikke af modstand — de dør af glemsel og hverdagspres.',
]

export const TGUIDE = {
  forberedelse: [
    ['Hvad er det vigtigste at have overblik over inden mødet?', 'Hvilke observationer tager du med ind?', 'Hvad vil du gerne have svar på?'],
    ['Hvad er de vigtigste spørgsmål du ønsker afklaret?', 'Hvad er du usikker på, som holdet bør drøfte?', 'Hvad har du brug for fra de andre?'],
    ['Hvad er din holdning til det forestående valg?', 'Hvad er dine bekymringer?', 'Hvad er afgørende at have på bordet?'],
    ['Hvad ved du om den nuværende struktur, der bør deles?', 'Hvad mangler struktur?', 'Hvad vil du foreslå?'],
    ['Hvad ser du faktisk ske tirsdag kl. 10?', 'Hvad viser det om strategien?', 'Hvad vil du fremhæve?'],
    ['Hvad er dine forankringspunkter?', 'Hvornår tjekker du selv op?', 'Hvad frygter du kan gå i glemmebogen?'],
  ],
  beslutning: [
    ['Hvad er vi enige om at kalde den aktuelle situation?', 'Hvad er den fælles forståelse vi vil arbejde ud fra?', 'Hvem ejer opfølgningen?'],
    ['Hvad er vi enige om er kerneproblemet?', 'Hvad beslutter vi at sætte fokus på — og hvad parkerer vi?', 'Hvem formulerer problemudmeldingen?'],
    ['Hvad vælger vi?', 'Hvad siger vi eksplicit fra til?', 'Hvem kommunikerer valget — og til hvem?'],
    ['Hvem gør hvad?', 'Hvad er den nye struktur vi er enige om?', 'Hvad skal koordineres — og hvad kan løbe selv?'],
    ['Er vi enige om, at strategien er synlig i hverdagen?', 'Hvad kræver øjeblikkelig justering?', 'Hvad er vores fælles billede af "godt nok"?'],
    ['Hvad er vores konkrete opfølgningsstruktur?', 'Hvornår mødes vi næste gang om dette?', 'Hvad er vores tegn på fremgang?'],
  ],
  opfolgning: [
    ['Hvad har vi gjort siden sidst?', 'Hvad er ændret i det billede vi har?', 'Hvad er ikke ændret — og hvad siger det?'],
    ['Er vi kommet tættere på klarhed?', 'Hvad er stadig uklart?', 'Hvad nyt har vi lært?'],
    ['Holder vores valg?', 'Hvad viser konsekvenserne sig at være?', 'Skal vi justere?'],
    ['Fungerer strukturen i praksis?', 'Hvad kræver justering?', 'Hvad kører godt?'],
    ['Er strategien stadig synlig tirsdag kl. 10?', 'Hvad er forbedret?', 'Hvad er vi stadig utilfredse med?'],
    ['Holder vi det levende?', 'Hvad er vores opfølgningsdisciplin?', 'Hvad fejrer vi?'],
  ],
}

// Tema-taksonomi med regex-patterns og relaterede ord
export const THEME_TAXONOMY = {
  'ledelsesidentitet': {
    patterns: /ledelsesidentitet|hvem er jeg som leder|min rolle|lederrolle|personlig ledelse|lederstil/i,
    related: ['personlig', 'identitet', 'rolle', 'autoritet', 'legitimitet']
  },
  'strategisk retning': {
    patterns: /strategisk retning|vision|mission|retning|kurs|mål|prioriter|fokus/i,
    related: ['strategi', 'retning', 'prioritet', 'vision', 'mål']
  },
  'mødekultur': {
    patterns: /mødekultur|møder|dagsorden|beslutning i møde|mødestruktur|referater/i,
    related: ['møde', 'dagsorden', 'beslutning', 'drøftelse', 'referat']
  },
  'medarbejdermodstand': {
    patterns: /modstand|forandring.*modstand|skepti|ikke med|bremseklods|uenig/i,
    related: ['modstand', 'skeptisk', 'uenig', 'bremse', 'forandring']
  },
  'kommunikation': {
    patterns: /kommunikation|dialog|information|budskab|tydelig|utydelig|formidl/i,
    related: ['kommunikation', 'dialog', 'budskab', 'tydelig', 'formidling']
  },
  'bestyrelsessamarbejde': {
    patterns: /bestyrelse|governance|bestyrelsesform|bestyrelses/i,
    related: ['bestyrelse', 'governance', 'formandsrolle', 'generalforsamling']
  },
  'tidspres': {
    patterns: /tid.*pres|travl|har ikke tid|overvældet|for mange|kapacitet/i,
    related: ['tid', 'pres', 'travlt', 'kapacitet', 'overbelastning']
  },
  'forandringstræthed': {
    patterns: /træt|udbrændt|forandrings.*træt|endnu en|projekt.*træt|opgivenhed/i,
    related: ['træthed', 'udbrændt', 'opgivelse', 'forandringstræt']
  },
  'delegation': {
    patterns: /delegat|uddelegere|fordel.*ansvar|give.*ansvar|slippe.*kontrol/i,
    related: ['delegation', 'ansvar', 'fordeling', 'kontrol', 'tillid']
  },
  'faglig ledelse': {
    patterns: /faglig ledelse|didaktik|undervisning|pædagogisk|faglighed/i,
    related: ['faglig', 'didaktisk', 'pædagogisk', 'undervisning', 'læringsmål']
  },
  'relationsarbejde': {
    patterns: /relation|tillid|samarbejde|konflikthåndtering|trivsel|psykologisk tryghed/i,
    related: ['relation', 'tillid', 'samarbejde', 'konflikt', 'trivsel']
  },
  'strukturel uklarhed': {
    patterns: /uklar|hvem gør hvad|rolle.*uklar|ansvar.*uklar|forvirr|mangler struktur/i,
    related: ['uklarhed', 'rolle', 'ansvar', 'struktur', 'forvirring']
  },
  'prioritering': {
    patterns: /priorit|vælge.*fra|fokus|sige nej|afgræns|for mange bolde/i,
    related: ['prioritering', 'afgrænsning', 'fokus', 'fravalg', 'bolde']
  },
  'forankring i praksis': {
    patterns: /forankr|praksis|hverdag|tirsdag kl|implementer|fasthold|vedligehold/i,
    related: ['forankring', 'praksis', 'hverdag', 'implementering', 'fastholdelse']
  },
  'personlig ledelsesudvikling': {
    patterns: /personlig udvikling|lederudvikling|refleksion|coaching|sparring|selvindsigt/i,
    related: ['udvikling', 'refleksion', 'sparring', 'coaching', 'indsigt']
  }
}

// Fallback-templates per trin og mode
export const FALLBACK_TEMPLATES = {
  1: {
    forberedelse: [
      'Hvad er det, du faktisk ser ske i hverdagen lige nu? Prøv at beskrive situationen som den er — ikke som du ønsker den.',
      'Hvis du skulle forklare situationen for en kollega på 2 minutter — hvad ville du sige?',
      'Hvad kalder mest på din opmærksomhed lige nu? Hvad fylder mest?'
    ],
    beslutning: [
      'Hvad er I enige om at kalde den aktuelle situation?',
      'Hvad er den fælles forståelse I vil arbejde ud fra?',
      'Hvem ejer opfølgningen på det, I beslutter her?'
    ],
    opfolgning: [
      'Hvad har ændret sig siden sidst? Hvad er ikke ændret — og hvad siger det?',
      'Hvad har I gjort siden sidst — og hvad kom der ud af det?'
    ]
  },
  2: {
    forberedelse: [
      'Hvad er problemet bag det problem, du ser? Prøv at grave ét lag dybere.',
      'Hvad er du usikker på, som bør drøftes med andre?',
      'Hvad tror du ville ske, hvis I ikke gør noget?'
    ],
    beslutning: [
      'Hvad er I enige om er kerneproblemet?',
      'Hvad beslutter I at sætte fokus på — og hvad parkerer I bevidst?'
    ],
    opfolgning: [
      'Er I kommet tættere på klarhed? Hvad er stadig uklart?',
      'Hvad nyt har I lært siden sidst?'
    ]
  },
  3: {
    forberedelse: [
      'Hvad er din holdning til det forestående valg? Hvad er dine bekymringer?',
      'Hvad er afgørende at have på bordet, inden I træffer et valg?',
      'Hvad vælger I fra, hvis I vælger dette til?'
    ],
    beslutning: [
      'Hvad vælger I — helt konkret? Hvad siger I eksplicit fra til?',
      'Hvem kommunikerer valget — og til hvem?'
    ],
    opfolgning: [
      'Holder jeres valg? Hvad viser konsekvenserne sig at være?',
      'Skal I justere — eller fastholde retningen?'
    ]
  },
  4: {
    forberedelse: [
      'Hvad ved du om den nuværende struktur, der bør deles med andre?',
      'Hvad mangler struktur? Hvor falder ting mellem to stole?',
      'Hvad vil du foreslå?'
    ],
    beslutning: [
      'Hvem gør hvad? Hvad er den nye struktur I er enige om?',
      'Hvad skal koordineres — og hvad kan løbe selv?'
    ],
    opfolgning: [
      'Fungerer strukturen i praksis? Hvad kræver justering?',
      'Hvad kører godt — og hvad er stadig uklart?'
    ]
  },
  5: {
    forberedelse: [
      'Hvad ser du faktisk ske tirsdag kl. 10? Hvad viser det om strategien?',
      'Hvad vil du fremhæve som tegn på, at det virker — eller ikke virker?',
      'Kan I se strategien i hverdagen — eller kun i dokumenterne?'
    ],
    beslutning: [
      'Er I enige om, at strategien er synlig i hverdagen?',
      'Hvad kræver øjeblikkelig justering? Hvad er jeres billede af "godt nok"?'
    ],
    opfolgning: [
      'Er strategien stadig synlig tirsdag kl. 10? Hvad er forbedret?',
      'Hvad er I stadig utilfredse med?'
    ]
  },
  6: {
    forberedelse: [
      'Hvad er dine forankringspunkter? Hvornår tjekker du selv op?',
      'Hvad frygter du kan gå i glemmebogen?',
      'Hvad holder strategien i live — og hvad truer den?'
    ],
    beslutning: [
      'Hvad er jeres konkrete opfølgningsstruktur?',
      'Hvornår mødes I næste gang om dette? Hvad er jeres tegn på fremgang?'
    ],
    opfolgning: [
      'Holder I det levende? Hvad er jeres opfølgningsdisciplin?',
      'Hvad fejrer I? Hvad skal justeres?'
    ]
  }
}
