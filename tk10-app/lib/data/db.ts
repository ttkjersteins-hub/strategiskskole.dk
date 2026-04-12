// === Lokal datamodel (localStorage prototype) ===
// Skift til Supabase ved produktion via lib/supabase/client.ts

import type { Forloeb, TrinData, Rolle, Beslutning, Handling, Moede, AuditEntry } from '@/types'

const DB_KEY = 'tk10v3'

export function loadDB(): { forloeb: Forloeb[] } {
  if (typeof window === 'undefined') return { forloeb: [] }
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || 'null') || { forloeb: [] }
  } catch {
    return { forloeb: [] }
  }
}

export function saveDB(db: { forloeb: Forloeb[] }) {
  if (typeof window === 'undefined') return
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export function getFl(db: { forloeb: Forloeb[] }, id: string): Forloeb | undefined {
  return db.forloeb.find(f => f.id === id)
}

export function getTD(fl: Forloeb, rolle: Rolle, trin: number): TrinData {
  if (!fl.data) fl.data = {}
  if (!fl.data[rolle]) fl.data[rolle] = {}
  const rd = fl.data[rolle]!
  if (!rd[trin]) {
    rd[trin] = {
      noter: { privat: '', team: '', bestyrelse: '' },
      beslutninger: [],
      handlinger: [],
      moeder: [],
      auditLog: [],
      status: 'ikke-startet',
    }
  }
  const d = rd[trin]!
  if (!d.moeder) d.moeder = []
  if (!d.auditLog) d.auditLog = []
  return d
}

export function calcProgress(fl: Forloeb): number {
  let done = 0
  for (let i = 1; i <= 6; i++) {
    const anyDone = (['skoleleder', 'ledelsesteam', 'bestyrelse'] as Rolle[]).some(
      r => fl.data?.[r]?.[i]?.status === 'afsluttet'
    )
    if (anyDone) done++
  }
  return done
}

export function addBeslutning(td: TrinData, tekst: string, af?: string, opf?: string): Beslutning {
  const b: Beslutning = { id: Date.now() + '', tekst, af, opf, dato: new Date().toISOString() }
  td.beslutninger.push(b)
  td.auditLog.push({ dato: b.dato, type: 'bsl', tekst: 'Beslutning tilføjet' + (af ? ' af ' + af : ''), detaljer: tekst })
  if (td.status === 'ikke-startet') td.status = 'i-gang'
  return b
}

export function deleteBeslutning(td: TrinData, idx: number) {
  const b = td.beslutninger[idx]
  if (b) td.auditLog.push({ dato: new Date().toISOString(), type: 'del', tekst: 'Beslutning slettet', detaljer: b.tekst })
  td.beslutninger.splice(idx, 1)
}

export function addHandling(td: TrinData, opgave: string, ansvar?: string, deadline?: string): Handling {
  const h: Handling = { id: Date.now() + '', opgave, ansvar, deadline, status: 'ikke-startet' }
  td.handlinger.push(h)
  td.auditLog.push({ dato: new Date().toISOString(), type: 'hdl', tekst: 'Handling tilføjet' + (ansvar ? ' (' + ansvar + ')' : ''), detaljer: opgave })
  if (td.status === 'ikke-startet') td.status = 'i-gang'
  return h
}

export function toggleHandling(td: TrinData, idx: number) {
  const h = td.handlinger[idx]
  if (!h) return
  h.status = h.status === 'udfoert' ? 'i-gang' : 'udfoert'
  td.auditLog.push({ dato: new Date().toISOString(), type: 'hdl', tekst: 'Handling markeret som ' + (h.status === 'udfoert' ? 'udført' : 'i gang'), detaljer: h.opgave })
}

export function addMoede(td: TrinData, dato: string, deltagere: string, type: string, opsummering: string): Moede {
  const m: Moede = {
    id: Date.now() + '',
    dato,
    deltagere,
    type: type as Moede['type'],
    opsummering,
    bslCount: td.beslutninger.length,
    hdlCount: td.handlinger.filter(h => h.status !== 'udfoert').length,
    oprettet: new Date().toISOString(),
  }
  td.moeder.push(m)
  td.auditLog.push({ dato: m.oprettet, type: 'moede', tekst: 'Møde logget' + (deltagere ? ' — ' + deltagere : ''), detaljer: opsummering || type })
  return m
}

export function fmtDate(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return '' }
}
