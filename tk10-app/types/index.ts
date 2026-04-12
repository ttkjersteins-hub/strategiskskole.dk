// === TIRSDAG KL. 10 — Core Types ===

export type Rolle = 'skoleleder' | 'ledelsesteam' | 'bestyrelse'
export type TrinStatus = 'ikke-startet' | 'i-gang' | 'afsluttet'
export type HandlingStatus = 'ikke-startet' | 'i-gang' | 'udfoert' | 'udskudt'
export type ModeType = 'forberedelse' | 'beslutning' | 'opfolgning'
export type NoteTav = 'privat' | 'team' | 'bestyrelse'

// === Kortdefinitioner (stabile — indholdet fra modellen) ===

export type KortType = 'model' | 'aabning' | 'menneskelig-rum' | 'afslutning'

export interface KortSektion {
  label: string          // f.eks. "SKÆRPELSE", "PERSPEKTIV", "RAMME"
  spørgsmål: string[]
}

export interface KortDefinition {
  trin: number           // 0 = åbning, 1-6 = model/menneskelig-rum, 7 = afslutning
  rolle: Rolle
  type: KortType         // kortets kategori
  kortLabel?: string     // visningstitel i navigation (f.eks. "USIKKERHED", "MOD")
  forside: string        // centralt spørgsmål — vist på kortets forside
  åbning: string[]       // åbningsspørgsmål (uden sektionslabel)
  sektioner: KortSektion[]
  erkendelse: string     // output/erkendelse vist i fremhævet boks
  handling: string       // konkret næste skridt — altid vist i bunden
}

// === Forløb ===

export interface Forloeb {
  id: string
  navn: string
  maal?: string
  oprettet: string       // ISO date
  sidstAkt?: string
  data: {
    [rolle in Rolle]?: {
      [trin: number]: TrinData
    }
  }
}

export interface TrinData {
  noter: { privat: string; team: string; bestyrelse: string }
  beslutninger: Beslutning[]
  handlinger: Handling[]
  moeder: Moede[]
  auditLog: AuditEntry[]
  status: TrinStatus
  sidstAendret?: string
}

// === Beslutning ===

export interface Beslutning {
  id: string
  tekst: string
  af?: string
  opf?: string
  dato: string
}

// === Handling ===

export interface Handling {
  id: string
  opgave: string
  ansvar?: string
  deadline?: string
  status: HandlingStatus
  noter?: string
}

// === Mødesession ===

export interface Moede {
  id: string
  dato: string
  deltagere?: string
  type: ModeType
  opsummering?: string
  bslCount: number
  hdlCount: number
  oprettet: string
}

// === Audit log ===

export interface AuditEntry {
  dato: string
  type: 'bsl' | 'hdl' | 'del' | 'moede'
  tekst: string
  detaljer?: string
}

// === TGUIDE ===

export type TGuideMatrix = {
  [mode in ModeType]: string[][]  // [mode][trin][spørgsmål index]
}

// === App state ===

export interface AppState {
  flId: string | null
  rolle: Rolle | null
  trin: number
  flipped: boolean
  mode: ModeType
  noteTav: NoteTav
  dtab: 'oversigt' | 'beslutninger' | 'handlinger'
}

// === Supabase DB types ===

export interface DbProfile {
  id: string
  email: string
  navn?: string
  rolle_default?: Rolle
  organisation?: string
  created_at: string
}

export interface DbForloeb {
  id: string
  user_id: string
  navn: string
  maal?: string
  data: Forloeb['data']
  created_at: string
  updated_at: string
}
