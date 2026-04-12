// === Tirsdag kl. 10-modellen® — Modeldata ===

import type { TGuideMatrix } from '@/types'

export const TRIN_NAVNE = [
  'Spejling', 'Klarhed', 'Valg', 'Struktur', 'Kernen', 'Forankring'
] as const

export const TRIN_SPØRGSMÅL = [
  'Hvad er det vi egentlig står i?',
  'Hvad er problemet bag problemet?',
  'Hvad vælger vi — og hvad vælger vi fra?',
  'Hvordan organiserer vi os?',
  'Kan vi se det i praksis tirsdag kl. 10?',
  'Hvordan holder vi det levende?',
] as const

export const TRIN_KONTEKST = [
  'Spejling handler om at se virkeligheden klart — ikke som vi ønsker den, men som den faktisk er. Ingen løsninger endnu. Kun observation og ærlighed.',
  'Klarhed handler om at finde det egentlige problem bag de synlige symptomer. En forkert diagnose giver altid den forkerte løsning.',
  'Valg handler om prioritering. At sige ja er kun meningsfuldt, hvis vi også siger nej til noget andet. Hvad vælger vi fra?',
  'Struktur handler om at designe de rammer, der gør strategien mulig i hverdagen. Møder, ansvar, koordinering — alt er design.',
  'Kernen er prøven. Kan strategien faktisk mærkes i det, der sker tirsdag kl. 10? Ikke i dokumenter — i praksis.',
  'Forankring handler om at holde det levende. Strategier dør ikke af modstand — de dør af glemsel og hverdagspres.',
] as const

export const ROLLE_LABELS: Record<string, string> = {
  skoleleder: 'Skoleleder',
  ledelsesteam: 'Ledelsesteam',
  bestyrelse: 'Bestyrelse',
}

export const ROLLE_EMOJI: Record<string, string> = {
  skoleleder: '🏫',
  ledelsesteam: '👥',
  bestyrelse: '🏛️',
}

export const ROLLE_COLOR: Record<string, string> = {
  skoleleder: 'teal',
  ledelsesteam: 'navy',
  bestyrelse: 'gold',
}

// === TGUIDE — Guidespørgsmål per mode og trin ===

export const TGUIDE: TGuideMatrix = {
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
