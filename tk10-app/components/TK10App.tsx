'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Forloeb, Rolle, TrinData, ModeType, NoteTav } from '@/types'
import { TRIN_NAVNE, TRIN_SPØRGSMÅL, TRIN_KONTEKST, TGUIDE, ROLLE_LABELS } from '@/lib/data/model'
import { getKort, getAabningKort, getMenneskeligRumKort, getAfslutningKort } from '@/lib/data/kort'
import ProcesKort from '@/components/cards/ProcesKort'
import MinRejse from '@/components/MinRejse'
import {
  loadDB, saveDB, getFl, getTD, calcProgress,
  addBeslutning, deleteBeslutning, addHandling, toggleHandling, addMoede, fmtDate
} from '@/lib/data/db'

type Screen = 'welcome' | 'forloeb' | 'rolle' | 'dash' | 'trin'
type DashTab = 'oversigt' | 'beslutninger' | 'handlinger'

const ROLLE_COLOR: Record<Rolle, string> = {
  skoleleder: '#3A9DB0',
  ledelsesteam: '#8BA4C0',
  bestyrelse: '#C9982A',
}

const ROLLER: { id: Rolle; emoji: string; label: string; desc: string }[] = [
  { id: 'skoleleder', emoji: '🏫', label: 'Skoleleder', desc: 'Personlig strategisk refleksion og beslutningsrum' },
  { id: 'ledelsesteam', emoji: '👥', label: 'Ledelsesteam', desc: 'Fælles beslutningslog og struktureret opfølgning' },
  { id: 'bestyrelse', emoji: '🏛️', label: 'Bestyrelse', desc: 'Strategisk tilsyn, årshjul og governance' },
]

function esc(s?: string) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

export default function TK10App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [db, setDb] = useState<{ forloeb: Forloeb[] }>({ forloeb: [] })
  const [flId, setFlId] = useState<string | null>(null)
  const [rolle, setRolle] = useState<Rolle | null>(null)
  const [trin, setTrin] = useState(1)          // 0=åbning, 1-6=model, 7=afslutning
  const [showHuman, setShowHuman] = useState(false) // vis menneskelig-rum kort for dette trin
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState<ModeType>('forberedelse')
  const [noteTav, setNoteTav] = useState<NoteTav>('privat')
  const [dtab, setDtab] = useState<DashTab>('oversigt')
  const [noteText, setNoteText] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [toast, setToast] = useState('')
  const [showOv, setShowOv] = useState<string | null>(null)
  const [showAudit, setShowAudit] = useState(false)
  const [gptPrompt, setGptPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [showRejse, setShowRejse] = useState(false)

  // Formlæder
  const [flNavn, setFlNavn] = useState('')
  const [flMaal, setFlMaal] = useState('')
  const [bslTekst, setBslTekst] = useState('')
  const [bslAf, setBslAf] = useState('')
  const [bslOpf, setBslOpf] = useState('')
  const [hdlOpg, setHdlOpg] = useState('')
  const [hdlAns, setHdlAns] = useState('')
  const [hdlDl, setHdlDl] = useState('')
  const [msteDato, setMsteDato] = useState('')
  const [msteDel, setMsteDel] = useState('')
  const [msteType, setMsteType] = useState<ModeType>('beslutning')
  const [msteOps, setMsteOps] = useState('')
  const [msteExpMi, setMsteExpMi] = useState(0)

  useEffect(() => { setDb(loadDB()) }, [])

  const persist = useCallback((updated: { forloeb: Forloeb[] }) => {
    setDb({ ...updated })
    saveDB(updated)
  }, [])

  function showToast(m: string) {
    setToast(m)
    setTimeout(() => setToast(''), 2400)
  }

  function goScreen(s: Screen) { setScreen(s) }

  const fl = flId ? getFl(db, flId) : null
  const td: TrinData | null = (fl && rolle && trin >= 1 && trin <= 6) ? getTD(fl, rolle, trin) : null
  const accentColor = rolle ? ROLLE_COLOR[rolle] : '#3A9DB0'
  const modelKort = (rolle && trin >= 1 && trin <= 6) ? getKort(rolle, trin) : null
  const humanKort = (rolle && trin >= 1 && trin <= 6) ? getMenneskeligRumKort(rolle, trin) : null
  const aabningKort = rolle ? getAabningKort(rolle) : null
  const afslutningKort = rolle ? getAfslutningKort(rolle) : null
  const kort = trin === 0 ? aabningKort
    : trin === 7 ? afslutningKort
    : showHuman ? humanKort
    : modelKort

  // === Forløb ===
  function createFl() {
    if (!flNavn.trim()) { showToast('Giv forløbet et navn'); return }
    const newFl: Forloeb = {
      id: 'fl_' + Date.now(),
      navn: flNavn.trim(),
      maal: flMaal.trim(),
      oprettet: new Date().toISOString(),
      data: {},
    }
    const updated = { forloeb: [newFl, ...db.forloeb] }
    persist(updated)
    setFlNavn(''); setFlMaal('')
    setShowOv(null)
    showToast('Forløb oprettet ✓')
  }

  function openFl(id: string) { setFlId(id); goScreen('rolle') }

  // === Rolle ===
  function selectRolle(r: Rolle) { setRolle(r); goScreen('dash') }

  // === Trin ===
  function openTrin(nr: number, human = false) {
    setTrin(nr); setShowHuman(human); setFlipped(false); setMode('forberedelse'); setNoteTav('privat'); setShowAudit(false)
    if (fl && rolle && nr >= 1 && nr <= 6) {
      const d = getTD(fl, rolle, nr)
      setNoteText(d.noter.privat)
    } else {
      setNoteText('')
    }
    goScreen('trin')
  }

  function goNextTrin() {
    if (!fl || !rolle) return
    if (trin === 0) { openTrin(1); return }
    if (trin >= 1 && trin <= 6) {
      if (showHuman) {
        // fra menneskelig-rum → næste model trin eller afslutning
        if (trin < 6) openTrin(trin + 1)
        else openTrin(7)
      } else {
        // fra model kort → menneskelig-rum for dette trin
        const d = getTD(fl, rolle, trin)
        if (d.status === 'ikke-startet') { d.status = 'i-gang'; persist(db) }
        setShowHuman(true); setFlipped(false)
      }
    }
  }

  function goPrevTrin() {
    if (trin === 7) { openTrin(6, true); return }
    if (trin >= 1 && trin <= 6) {
      if (showHuman) {
        setShowHuman(false); setFlipped(false)
      } else {
        if (trin > 1) openTrin(trin - 1, true)
        else openTrin(0)
      }
    }
  }

  // === Notes ===
  function handleNoteTavChange(t: NoteTav) {
    if (!td) return
    td.noter[noteTav] = noteText
    persist(db)
    setNoteTav(t)
    setNoteText(td.noter[t])
  }

  function saveNote() {
    if (!td) return
    td.noter[noteTav] = noteText
    persist(db)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 1800)
  }

  function setTrinStatus(st: TrinData['status']) {
    if (!td) return
    td.status = st; persist(db)
    if (st === 'afsluttet') showToast('Trin ' + trin + ' afsluttet ✓')
  }

  // === Beslutning ===
  function handleSaveBsl() {
    if (!td || !fl) return
    if (!bslTekst.trim()) { showToast('Beskriv beslutningen'); return }
    addBeslutning(td, bslTekst.trim(), bslAf.trim(), bslOpf.trim())
    persist(db)
    setBslTekst(''); setBslAf(''); setBslOpf('')
    setShowOv(null)
    showToast('Beslutning gemt ✓')
  }

  function handleDelBsl(i: number) {
    if (!td) return
    deleteBeslutning(td, i); persist(db)
  }

  // === Handling ===
  function handleSaveHdl() {
    if (!td) return
    if (!hdlOpg.trim()) { showToast('Beskriv opgaven'); return }
    addHandling(td, hdlOpg.trim(), hdlAns.trim(), hdlDl)
    persist(db)
    setHdlOpg(''); setHdlAns(''); setHdlDl('')
    setShowOv(null)
    showToast('Handling tilføjet ✓')
  }

  function handleToggleHdl(i: number) {
    if (!td) return
    toggleHandling(td, i); persist(db)
  }

  function handleToggleHdlDash(trinNr: number, i: number) {
    if (!fl || !rolle) return
    const d = getTD(fl, rolle, trinNr)
    toggleHandling(d, i); persist(db)
  }

  // === Møde ===
  function openMsteOv() {
    const today = new Date().toISOString().slice(0, 10)
    setMsteDato(today); setMsteDel(''); setMsteType('beslutning'); setMsteOps('')
    setShowOv('mste')
  }

  function handleSaveMste() {
    if (!td || !msteDato) { showToast('Vælg en dato'); return }
    addMoede(td, msteDato, msteDel, msteType, msteOps)
    persist(db)
    setShowOv(null)
    setTimeout(() => { setMsteExpMi(td.moeder.length - 1); setShowOv('mste-exp') }, 350)
    showToast('Møde gemt ✓')
  }

  // === GPT ===
  function openGpt() {
    if (!kort || !rolle) return
    const alleSpm = [
      ...kort.åbning,
      ...kort.sektioner.flatMap(s => [`[${s.label}]`, ...s.spørgsmål]),
    ]
    const kortTitel = kort.type === 'aabning' ? 'Åbning'
      : kort.type === 'afslutning' ? 'Afslutning'
      : kort.type === 'menneskelig-rum' ? `Det menneskelige rum — ${kort.kortLabel ?? ''} (Trin ${trin})`
      : `Trin ${trin}: ${TRIN_NAVNE[trin - 1]}`
    const kontekst = (trin >= 1 && trin <= 6) ? TRIN_KONTEKST[trin - 1] : ''
    const prompt = `Jeg arbejder med Tirsdag kl. 10-modellen® — ${kortTitel}\n\nKernespørgsmål: "${kort.forside}"\n\nSpørgsmål fra kortet:\n${alleSpm.map((q, j) => `${j + 1}. ${q}`).join('\n')}\n\nErkendelse: "${kort.erkendelse}"${kontekst ? `\n\nKontekst: ${kontekst}` : ''}\n\nMin rolle: ${ROLLE_LABELS[rolle]}\n\nHjælp mig at reflektere over dette. Stil mig uddybende spørgsmål, og hjælp mig finde klarhed.`
    setGptPrompt(prompt); setCopied(false); setShowOv('gpt')
  }

  function copyGpt() {
    navigator.clipboard.writeText(gptPrompt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  // === Stats ===
  function getStats() {
    if (!fl || !rolle) return { done: 0, bsl: 0, hdl: 0 }
    let done = 0, bsl = 0, hdl = 0
    for (let i = 1; i <= 6; i++) {
      const d = getTD(fl, rolle, i)
      bsl += d.beslutninger.length
      hdl += d.handlinger.filter(h => h.status !== 'udfoert').length
      if (d.status === 'afsluttet') done++
    }
    return { done, bsl, hdl }
  }

  function getNextTrin() {
    if (!fl || !rolle) return null
    for (let i = 1; i <= 6; i++) {
      if (getTD(fl, rolle, i).status !== 'afsluttet') return i
    }
    return null
  }

  // === RENDER ===

  const modalStyle = {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.6)',
    zIndex: 100, display: 'flex', alignItems: 'flex-end',
    opacity: showOv ? 1 : 0, pointerEvents: showOv ? 'all' as const : 'none' as const,
    transition: 'opacity .25s',
  }

  const sheetStyle = {
    background: '#0D1928',
    borderRadius: '20px 20px 0 0',
    padding: '20px 20px calc(20px + var(--safe-b))',
    width: '100%',
    maxHeight: '88vh',
    overflowY: 'auto' as const,
    border: '1px solid rgba(255,255,255,.08)',
    borderBottom: 'none',
    transform: showOv ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
  }

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: 10,
    background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
    color: 'rgba(255,255,255,.9)', fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none',
  }

  // ============ SCREENS ============

  if (screen === 'welcome') return (
    <div className="h-full flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #080F1A 0%, #0A1628 60%, #04080E 100%)' }}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
          style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2">
            <circle cx="24" cy="24" r="19"/><path d="M24 13v11l7 4" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="2" fill="rgba(255,255,255,.75)" stroke="none"/>
          </svg>
        </div>
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: 'rgba(255,255,255,.95)', fontStyle: 'italic' }}>
          Strategiskskole App
        </h1>
        <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,.45)' }}>Strategisk procesapp til skoleledelse</p>
        <p className="font-serif text-sm mb-10" style={{ color: 'rgba(255,255,255,.3)', fontStyle: 'italic' }}>
          "Kan vi se strategien i det, der sker tirsdag kl. 10?"
        </p>
        <button className="px-10 py-4 rounded-full text-base font-semibold transition-transform active:scale-95"
          style={{ background: '#3A9DB0', color: 'white', boxShadow: '0 4px 28px rgba(58,157,176,.35)' }}
          onClick={() => { persist(loadDB()); goScreen('forloeb') }}>
          Gå til dine forløb →
        </button>
      </div>
      <p className="absolute bottom-8 text-xs" style={{ color: 'rgba(255,255,255,.18)' }}>Strategiskskole.dk</p>
    </div>
  )

  if (screen === 'forloeb') return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ background: 'linear-gradient(180deg,#0D1928 0%,#080F1A 100%)', padding: 'calc(var(--safe-t) + 20px) 20px 24px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <h2 className="font-serif text-xl font-semibold mb-1" style={{ color: 'rgba(255,255,255,.92)' }}>Dine forløb</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,.38)' }}>Vælg et aktivt forløb eller opret nyt</p>
      </div>

      <div className="scroll-y flex-1 p-4 space-y-3">
        {db.forloeb.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-40">📋</div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,.38)' }}>Ingen forløb endnu.<br/>Opret dit første herunder.</p>
          </div>
        )}
        {db.forloeb.map(f => {
          const p = calcProgress(f), pct = Math.round(p / 6 * 100)
          return (
            <button key={f.id} className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-transform active:scale-98"
              style={{ background: '#0D1928', border: '1px solid rgba(255,255,255,.07)', boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}
              onClick={() => openFl(f.id)}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: 'rgba(58,157,176,.12)', border: '1px solid rgba(58,157,176,.2)' }}>📋</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate" style={{ color: 'rgba(255,255,255,.9)' }}>{f.navn}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.38)' }}>Oprettet {fmtDate(f.oprettet)} · {p}/6 trin</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,.08)' }}>
                    <div className="h-1 rounded-full transition-all" style={{ width: pct + '%', background: '#3A9DB0' }}/>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#3A9DB0' }}>{pct}%</span>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )
        })}

        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold mt-2 transition-colors"
          style={{ background: 'none', border: '1.5px dashed rgba(255,255,255,.14)', color: 'rgba(255,255,255,.45)' }}
          onClick={() => setShowOv('fl')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Opret nyt forløb
        </button>
      </div>

      {/* Overlay — nyt forløb */}
      <div style={modalStyle} onClick={() => setShowOv(null)}>
        <div style={sheetStyle} onClick={e => e.stopPropagation()}>
          <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,.18)' }}/>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgba(255,255,255,.9)' }}>Opret nyt forløb</h3>
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,.4)' }}>Forløbets navn</label>
            <input style={inputStyle} placeholder="f.eks. Strategiproces 2025-26" value={flNavn} onChange={e => setFlNavn(e.target.value)}/>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,.4)' }}>Mål for forløbet (valgfrit)</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'none' }} placeholder="Hvad ønsker vi at opnå?" value={flMaal} onChange={e => setFlMaal(e.target.value)}/>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)' }} onClick={() => setShowOv(null)}>Annullér</button>
            <button className="flex-2 py-3.5 rounded-xl text-sm font-semibold" style={{ flex: 2, background: '#3A9DB0', color: 'white' }} onClick={createFl}>Opret forløb</button>
          </div>
        </div>
      </div>
    </div>
  )

  if (screen === 'rolle') return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <div className="flex-shrink-0 flex items-center gap-3 p-4" style={{ paddingTop: 'calc(var(--safe-t) + 14px)', background: '#0D1928', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,.08)' }} onClick={() => goScreen('forloeb')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <h1 className="font-serif text-base font-semibold" style={{ color: 'rgba(255,255,255,.9)' }}>Vælg rolle</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,.38)' }}>{fl?.navn}</p>
        </div>
      </div>

      <div className="scroll-y flex-1 p-4 space-y-3 pt-5">
        {ROLLER.map(r => (
          <button key={r.id} className="w-full text-left rounded-2xl p-5 flex items-center gap-4 transition-transform active:scale-98"
            style={{ background: '#0D1928', border: `1px solid ${ROLLE_COLOR[r.id]}22`, boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}
            onClick={() => selectRolle(r.id)}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${ROLLE_COLOR[r.id]}14`, border: `1px solid ${ROLLE_COLOR[r.id]}28` }}>{r.emoji}</div>
            <div className="flex-1">
              <div className="font-semibold text-base" style={{ color: ROLLE_COLOR[r.id] }}>{r.label}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,.45)' }}>{r.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ))}
      </div>
    </div>
  )

  // === DASHBOARD ===
  if (screen === 'dash' && fl && rolle) {
    const { done, bsl, hdl } = getStats()
    const nextTrin = getNextTrin()

    if (showRejse) {
      return <MinRejse forloebId={fl.id} rolle={rolle} accentColor={accentColor} onClose={() => setShowRejse(false)} />
    }

    return (
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
        {/* Hero */}
        <div className="flex-shrink-0" style={{
          background: `linear-gradient(160deg, #0D1928 0%, ${accentColor}18 100%)`,
          padding: 'calc(var(--safe-t) + 16px) 18px 20px',
          borderBottom: '1px solid rgba(255,255,255,.06)',
        }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: accentColor + 'cc' }}>
                {ROLLE_LABELS[rolle]} · {fl.navn}
              </div>
              <h1 className="font-serif text-xl font-bold leading-tight" style={{ color: 'rgba(255,255,255,.95)', fontStyle: 'italic' }}>
                Tirsdag kl. 10-modellen®
              </h1>
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.08)' }}
              onClick={() => goScreen('rolle')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-2">
            {[
              { ico: '✅', num: done, lbl: 'Trin afsluttet' },
              { ico: '📋', num: bsl, lbl: 'Beslutninger' },
              { ico: '⚡', num: hdl, lbl: 'Åbne handlinger' },
            ].map((s, i) => (
              <div key={i} className="flex-1 rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="text-base mb-0.5">{s.ico}</div>
                <div className="text-xl font-bold" style={{ color: 'rgba(255,255,255,.92)' }}>{s.num}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Min rejse-knap */}
          <button className="mt-3 w-full flex items-center gap-3 rounded-xl p-3 text-left transition-opacity active:opacity-80"
            style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}
            onClick={() => setShowRejse(true)}>
            <span className="text-lg">🗺️</span>
            <div className="flex-1">
              <div className="text-xs font-bold tracking-wider uppercase mb-0.5" style={{ color: 'rgba(255,255,255,.5)' }}>Min rejse</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,.7)' }}>
                Se dine erkendelser og beslutninger samlet
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {nextTrin !== null && (
            <button className="mt-3 w-full flex items-center gap-3 rounded-xl p-3 text-left transition-opacity active:opacity-80"
              style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}28` }}
              onClick={() => openTrin(nextTrin!)}>
              <span className="text-lg">🎯</span>
              <div className="flex-1">
                <div className="text-xs font-bold tracking-wider uppercase mb-0.5" style={{ color: accentColor + 'aa' }}>Anbefalet næste skridt</div>
                <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,.85)' }}>
                  Trin {nextTrin} — {TRIN_NAVNE[nextTrin - 1]}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex" style={{ background: '#0D1928', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          {(['oversigt', 'beslutninger', 'handlinger'] as DashTab[]).map(t => (
            <button key={t} className="flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-all"
              style={{ color: dtab === t ? accentColor : 'rgba(255,255,255,.38)', borderBottom: dtab === t ? `2px solid ${accentColor}` : '2px solid transparent' }}
              onClick={() => setDtab(t)}>
              {t === 'oversigt' ? 'Oversigt' : t === 'beslutninger' ? 'Beslutninger' : 'Handlinger'}
            </button>
          ))}
        </div>

        <div className="scroll-y flex-1 p-4">
          {dtab === 'oversigt' && (
            <div className="grid grid-cols-2 gap-3">
              {/* Åbning */}
              <button className="col-span-1 text-left rounded-2xl p-4 transition-transform active:scale-97"
                style={{ background: '#0D1928', border: `1px solid ${accentColor}33`, borderTop: `3px solid ${accentColor}66`, boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
                onClick={() => openTrin(0)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: accentColor + '66' }}/>
                  <span className="text-xs font-bold" style={{ color: accentColor + '88' }}>Åbning</span>
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: 'rgba(255,255,255,.7)' }}>Velkommen</div>
                <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,.35)', fontStyle: 'italic' }}>Hvad bringer I med ind?</div>
              </button>
              {/* Afslutning */}
              <button className="col-span-1 text-left rounded-2xl p-4 transition-transform active:scale-97"
                style={{ background: '#0D1928', border: `1px solid ${accentColor}33`, borderTop: `3px solid ${accentColor}66`, boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
                onClick={() => openTrin(7)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: accentColor + '66' }}/>
                  <span className="text-xs font-bold" style={{ color: accentColor + '88' }}>Afslutning</span>
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: 'rgba(255,255,255,.7)' }}>Opsamling</div>
                <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,.35)', fontStyle: 'italic' }}>Hvad tager vi med?</div>
              </button>
              {[1,2,3,4,5,6].map(nr => {
                const d = getTD(fl, rolle, nr)
                const isActive = d.status === 'i-gang', isDone = d.status === 'afsluttet'
                const borderColor = isDone ? '#3AA87A' : isActive ? accentColor : 'rgba(255,255,255,.08)'
                return (
                  <button key={nr} className="text-left rounded-2xl p-4 transition-transform active:scale-97"
                    style={{ background: '#0D1928', border: `1px solid ${borderColor}`, borderTop: `3px solid ${borderColor}`, boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
                    onClick={() => openTrin(nr)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: borderColor }}/>
                      <span className="text-xs font-bold" style={{ color: isDone ? '#3AA87A' : isActive ? accentColor : 'rgba(255,255,255,.35)' }}>
                        {isDone ? 'Afsluttet' : isActive ? 'I gang' : `Trin ${nr}`}
                      </span>
                    </div>
                    <div className="font-semibold text-sm mb-1" style={{ color: isActive ? accentColor : 'rgba(255,255,255,.85)' }}>{TRIN_NAVNE[nr-1]}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,.38)', fontStyle: 'italic' }}>{TRIN_SPØRGSMÅL[nr-1]}</div>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: d.beslutninger.length > 0 ? `${accentColor}18` : 'rgba(255,255,255,.05)', color: d.beslutninger.length > 0 ? accentColor : 'rgba(255,255,255,.3)' }}>
                        {d.beslutninger.length} bsl.
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: d.handlinger.filter(h=>h.status!=='udfoert').length > 0 ? 'rgba(58,168,122,.12)' : 'rgba(255,255,255,.05)', color: d.handlinger.filter(h=>h.status!=='udfoert').length > 0 ? '#3AA87A' : 'rgba(255,255,255,.3)' }}>
                        {d.handlinger.filter(h=>h.status!=='udfoert').length} hdl.
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {dtab === 'beslutninger' && (
            <div className="space-y-3">
              {[1,2,3,4,5,6].map(nr => {
                const d = getTD(fl, rolle, nr)
                if (!d.beslutninger.length) return null
                return (
                  <div key={nr}>
                    <div className="text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-3" style={{ color: 'rgba(255,255,255,.35)' }}>
                      Trin {nr} — {TRIN_NAVNE[nr-1]}
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.06)' }}/>
                    </div>
                    {d.beslutninger.map((b, bi) => (
                      <div key={bi} className="rounded-xl p-3.5 mb-2" style={{ background: '#0D1928', borderLeft: `3px solid ${accentColor}`, border: `1px solid ${accentColor}22`, borderLeftWidth: 3 }}>
                        <div className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,.88)' }}>{b.tekst}</div>
                        <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.38)' }}>
                          {b.af && <strong>{b.af} · </strong>}{fmtDate(b.dato)}{b.opf && <><br/>Opfølgning: {b.opf}</>}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
              {[1,2,3,4,5,6].every(nr => getTD(fl, rolle, nr).beslutninger.length === 0) && (
                <div className="text-center py-10"><div className="text-3xl mb-3 opacity-40">📋</div><p className="text-sm" style={{ color: 'rgba(255,255,255,.35)' }}>Ingen beslutninger endnu</p></div>
              )}
            </div>
          )}

          {dtab === 'handlinger' && (
            <div className="space-y-3">
              {[1,2,3,4,5,6].map(nr => {
                const d = getTD(fl, rolle, nr)
                const åbne = d.handlinger.filter(h => h.status !== 'udfoert')
                if (!åbne.length) return null
                return (
                  <div key={nr}>
                    <div className="text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-3" style={{ color: 'rgba(255,255,255,.35)' }}>
                      Trin {nr} — {TRIN_NAVNE[nr-1]}
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.06)' }}/>
                    </div>
                    {åbne.map((h, hi) => {
                      const ov = h.deadline && new Date(h.deadline) < new Date()
                      const actualIdx = d.handlinger.indexOf(h)
                      return (
                        <div key={hi} className="flex items-start gap-3 rounded-xl p-3.5 mb-2" style={{ background: '#0D1928', border: '1px solid rgba(255,255,255,.06)' }}>
                          <button className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                            style={{ background: h.status==='udfoert'?'#3AA87A':'transparent', border: `2px solid ${h.status==='udfoert'?'#3AA87A':'rgba(255,255,255,.25)'}` }}
                            onClick={() => handleToggleHdlDash(nr, actualIdx)}>
                            {h.status === 'udfoert' && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>}
                          </button>
                          <div className="flex-1">
                            <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,.85)' }}>{h.opgave}</div>
                            <div className="text-xs mt-0.5" style={{ color: ov ? '#E05C5C' : 'rgba(255,255,255,.38)' }}>
                              {h.ansvar && <><strong>{h.ansvar}</strong></>}
                              {h.deadline && <> · {fmtDate(h.deadline)}{ov && ' ⚠'}</>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              {[1,2,3,4,5,6].every(nr => getTD(fl, rolle, nr).handlinger.filter(h=>h.status!=='udfoert').length === 0) && (
                <div className="text-center py-10"><div className="text-3xl mb-3 opacity-40">⚡</div><p className="text-sm" style={{ color: 'rgba(255,255,255,.35)' }}>Alle handlinger er udført</p></div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // === TRIN VIEW ===
  if (screen === 'trin' && fl && rolle) {
    const isModelTrin = trin >= 1 && trin <= 6
    const guides = isModelTrin && !showHuman ? TGUIDE[mode][trin - 1] : []
    const modeLabel = mode === 'forberedelse' ? 'Forbered dig til mødet' : mode === 'beslutning' ? 'Strukturér beslutningerne' : 'Følg op på handlingerne'
    const screenTitle = trin === 0 ? 'Åbning'
      : trin === 7 ? 'Afslutning'
      : showHuman && kort?.kortLabel ? kort.kortLabel
      : `Trin ${trin} — ${TRIN_NAVNE[trin - 1]}`

    return (
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
        {/* TopBar */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 no-print" style={{ paddingTop: 'calc(var(--safe-t) + 14px)', paddingBottom: 14, background: '#080F1A', borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 60 }}>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,.07)' }} onClick={() => goScreen('dash')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-base font-semibold truncate" style={{ color: 'rgba(255,255,255,.92)' }}>
              {screenTitle}
            </h1>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,.38)' }}>{fl.navn}</p>
          </div>
          <div className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}35` }}>
            {ROLLE_LABELS[rolle]}
          </div>
        </div>

        {/* Navigator: Åbning | Trin 1-6 | Afslutning */}
        <div className="flex-shrink-0 flex items-center gap-1 px-3 py-2 no-print" style={{ background: '#080F1A', borderBottom: '1px solid rgba(255,255,255,.05)', overflowX: 'auto' }}>
          {/* Åbning */}
          <button className="flex-shrink-0 h-6 px-2 rounded-full text-xs font-bold transition-all" style={{ background: trin === 0 ? accentColor : 'rgba(255,255,255,.08)', color: trin === 0 ? 'white' : 'rgba(255,255,255,.4)', fontSize: 10 }} onClick={() => openTrin(0)}>Å</button>
          {/* Trin 1-6 dots */}
          {[1,2,3,4,5,6].map(nr => {
            const d = getTD(fl, rolle, nr)
            const isA = nr === trin, isDone = d.status === 'afsluttet'
            return (
              <button key={nr} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: isA ? accentColor : isDone ? accentColor + '55' : 'rgba(255,255,255,.1)', minWidth: 24 }} onClick={() => openTrin(nr)}/>
            )
          })}
          {/* Afslutning */}
          <button className="flex-shrink-0 h-6 px-2 rounded-full text-xs font-bold transition-all" style={{ background: trin === 7 ? accentColor : 'rgba(255,255,255,.08)', color: trin === 7 ? 'white' : 'rgba(255,255,255,.4)', fontSize: 10 }} onClick={() => openTrin(7)}>A</button>
        </div>

        {/* Menneskelig rum toggle — kun for trin 1-6 */}
        {isModelTrin && humanKort && (
          <div className="flex-shrink-0 flex gap-1 px-4 py-1.5 no-print" style={{ background: '#080F1A', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <button className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: !showHuman ? `${accentColor}18` : 'rgba(255,255,255,.05)', color: !showHuman ? accentColor : 'rgba(255,255,255,.4)', border: !showHuman ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,.07)' }}
              onClick={() => { setShowHuman(false); setFlipped(false) }}>
              Proceskort
            </button>
            <button className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: showHuman ? `${accentColor}18` : 'rgba(255,255,255,.05)', color: showHuman ? accentColor : 'rgba(255,255,255,.4)', border: showHuman ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,.07)' }}
              onClick={() => { setShowHuman(true); setFlipped(false) }}>
              🫀 Det menneskelige rum
            </button>
          </div>
        )}

        <div className="scroll-y flex-1 px-4 py-5 space-y-4">
          {/* Kontekstpanel — kun for model trin */}
          {isModelTrin && !showHuman && (
          <div className="rounded-2xl p-4" style={{ background: '#0D1928', borderLeft: `4px solid ${accentColor}`, border: `1px solid ${accentColor}22`, borderLeftWidth: 4 }}>
            <div className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,.35)' }}>Om dette trin</div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.72)' }}>{TRIN_KONTEKST[trin - 1]}</p>
            {trin > 1 && (() => {
              const prev = getTD(fl, rolle, trin - 1)
              const pb = prev.beslutninger.slice(0, 2)
              if (!pb.length) return null
              return (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                  <div className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,.3)' }}>Fra Trin {trin-1} — {TRIN_NAVNE[trin-2]}</div>
                  {pb.map((b, bi) => (
                    <div key={bi} className="text-xs py-1.5 px-2 rounded-lg mb-1" style={{ background: 'rgba(255,255,255,.04)', borderLeft: `2px solid ${accentColor}55`, color: 'rgba(255,255,255,.55)' }}>{b.tekst}</div>
                  ))}
                </div>
              )
            })()}
          </div>
          )}

          {/* KORT */}
          {kort ? (
            <ProcesKort
              kort={kort}
              rolle={rolle}
              trinNavn={trin === 0 ? 'Åbning' : trin === 7 ? 'Afslutning' : showHuman ? (kort.kortLabel ?? 'Det menneskelige rum') : TRIN_NAVNE[trin - 1]}
              onGptPanel={openGpt}
            />
          ) : (
            /* Fallback hvis kort ikke findes */
            <div className="flip-wrap" style={{ height: 200 }}>
            <div className={`flip-inner relative w-full cursor-pointer${flipped ? ' flipped' : ''}`}
              style={{ height: 200 }}
              onClick={() => setFlipped(f => !f)}>
              {/* Forside */}
              <div className="flip-face rounded-2xl flex flex-col overflow-hidden w-full"
                style={{ background: 'linear-gradient(160deg, #0D1928 0%, #080F1A 100%)', border: '1px solid rgba(255,255,255,.07)', boxShadow: '0 8px 48px rgba(0,0,0,.65)', height: 200 }}>
                <div className="flex items-start justify-between p-5 pb-0">
                  <div>
                    <div className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: accentColor }}>{TRIN_NAVNE[trin-1]}</div>
                    <div className="text-xs tracking-wider uppercase" style={{ color: 'rgba(255,255,255,.28)' }}>TRINKORT</div>
                  </div>
                  <div className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.07)' }}>
                    {ROLLE_LABELS[rolle].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 flex items-center px-5 py-3">
                  <p className="font-serif text-xl leading-snug" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.92)' }}>
                    {TRIN_SPØRGSMÅL[trin - 1]}
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 pb-4">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,.2)' }}>Strategiskskole.dk</span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,.3)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12v-2a8 8 0 0114.93-4M20 12v2a8 8 0 01-14.93 4"/></svg>
                    vend
                  </span>
                </div>
              </div>

              {/* Bagside (fallback) */}
              <div className="flip-face flip-back rounded-2xl flex flex-col overflow-hidden w-full"
                style={{ background: 'linear-gradient(160deg, #0F1E32 0%, #0A1422 100%)', border: `1px solid ${accentColor}28`, height: 200 }}>
                <div className="flex-1 flex items-center justify-center px-5">
                  <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,.55)' }}>Kortindhold ikke fundet</p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Sektion: noter, beslutninger, status — kun for trin 1-6 */}
          {td && (<>

          {/* Mode */}
          <div className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,.35)' }}>Møde-mode</div>
          <div className="flex gap-2">
            {(['forberedelse','beslutning','opfolgning'] as ModeType[]).map(m => (
              <button key={m} className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: mode===m ? `${accentColor}18` : 'rgba(255,255,255,.05)', color: mode===m ? accentColor : 'rgba(255,255,255,.45)', border: mode===m ? `1.5px solid ${accentColor}45` : '1.5px solid rgba(255,255,255,.07)' }}
                onClick={() => setMode(m)}>
                {m==='forberedelse'?'📋 Forberedelse':m==='beslutning'?'✅ Beslutning':'🔁 Opfølgning'}
              </button>
            ))}
          </div>

          <div className="rounded-2xl p-4 space-y-2" style={{ background: '#0D1928', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="text-xs font-bold flex items-center gap-2" style={{ color: 'rgba(255,255,255,.7)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              {modeLabel}
            </div>
            {guides.map((g, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: accentColor }}>•</span>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.72)' }}>{g}</p>
              </div>
            ))}
            {mode === 'beslutning' && (
              <button className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: `${accentColor}10`, border: `1.5px dashed ${accentColor}40`, color: accentColor }}
                onClick={openMsteOv}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Log dette møde
              </button>
            )}
          </div>

          {/* Noter */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,.35)' }}>Noter</div>
            <div className="flex gap-1 rounded-xl p-1 mb-3" style={{ background: 'rgba(255,255,255,.05)' }}>
              {(['privat','team','bestyrelse'] as NoteTav[]).map(t => (
                <button key={t} className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: noteTav===t ? '#162438' : 'none', color: noteTav===t ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.4)', boxShadow: noteTav===t ? '0 1px 4px rgba(0,0,0,.3)' : 'none' }}
                  onClick={() => handleNoteTavChange(t)}>
                  {t==='privat'?'🔒 Privat':t==='team'?'👥 Team':'🏛 Bestyrelse'}
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-xl p-3.5 text-sm resize-none outline-none transition-all"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: 'rgba(255,255,255,.85)', minHeight: 100, fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}
              placeholder={noteTav==='privat'?'Mine refleksioner — kun mig...':noteTav==='team'?'Teamnoter...':'Notat til bestyrelsen...'}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onFocus={e => (e.target.style.borderColor = accentColor + '60')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs transition-opacity" style={{ color: '#3AA87A', opacity: noteSaved ? 1 : 0 }}>Gemt ✓</span>
              <button className="text-xs font-semibold px-4 py-2 rounded-lg" style={{ background: accentColor, color: 'white' }} onClick={saveNote}>Gem noter</button>
            </div>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }}/>

          {/* Beslutninger */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'rgba(255,255,255,.35)' }}>Beslutninger fra dette trin</div>
            {td.beslutninger.length === 0 && <div className="text-center py-5 text-sm" style={{ color: 'rgba(255,255,255,.3)' }}>Ingen beslutninger endnu</div>}
            {td.beslutninger.map((b, bi) => (
              <div key={bi} className="relative rounded-xl p-3.5 mb-2" style={{ background: '#0D1928', borderLeft: `3px solid ${accentColor}`, border: `1px solid ${accentColor}18`, borderLeftWidth: 3 }}>
                <button className="absolute top-2.5 right-2.5 opacity-30 hover:opacity-70" onClick={() => handleDelBsl(bi)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <div className="font-semibold text-sm pr-5" style={{ color: 'rgba(255,255,255,.88)' }}>{b.tekst}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.38)' }}>
                  {b.af && <><strong>{b.af}</strong> · </>}{fmtDate(b.dato)}
                  {b.opf && <><br/>Opfølgning: {b.opf}</>}
                </div>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold mt-1"
              style={{ border: '1.5px dashed rgba(255,255,255,.14)', color: 'rgba(255,255,255,.4)' }}
              onClick={() => setShowOv('bsl')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Tilføj beslutning
            </button>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }}/>

          {/* Handlinger */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'rgba(255,255,255,.35)' }}>Handlinger fra dette trin</div>
            {td.handlinger.length === 0 && <div className="text-center py-5 text-sm" style={{ color: 'rgba(255,255,255,.3)' }}>Ingen handlinger endnu</div>}
            {td.handlinger.map((h, hi) => {
              const ov = h.deadline && new Date(h.deadline) < new Date() && h.status !== 'udfoert'
              return (
                <div key={hi} className="flex items-start gap-3 rounded-xl p-3.5 mb-2" style={{ background: '#0D1928', border: '1px solid rgba(255,255,255,.06)' }}>
                  <button className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                    style={{ background: h.status==='udfoert'?'#3AA87A':'transparent', border: `2px solid ${h.status==='udfoert'?'#3AA87A':'rgba(255,255,255,.25)'}` }}
                    onClick={() => handleToggleHdl(hi)}>
                    {h.status==='udfoert' && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: h.status==='udfoert'?'rgba(255,255,255,.4)':'rgba(255,255,255,.85)', textDecoration: h.status==='udfoert'?'line-through':'none' }}>{h.opgave}</div>
                    <div className="text-xs mt-0.5" style={{ color: ov ? '#E05C5C' : 'rgba(255,255,255,.38)' }}>
                      {h.ansvar && <strong>{h.ansvar}</strong>}
                      {h.deadline && <> · {fmtDate(h.deadline)}{ov && ' ⚠'}</>}
                    </div>
                  </div>
                </div>
              )
            })}
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold mt-1"
              style={{ border: '1.5px dashed rgba(255,255,255,.14)', color: 'rgba(255,255,255,.4)' }}
              onClick={() => setShowOv('hdl')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Tilføj handling
            </button>
          </div>

          {/* Møder + Audit */}
          {td.moeder.length > 0 && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }}/>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'rgba(255,255,255,.35)' }}>Møder på dette trin ({td.moeder.length})</div>
                {td.moeder.map((m, mi) => (
                  <div key={mi} className="rounded-xl p-3.5 mb-2" style={{ background: '#0D1928', borderLeft: `3px solid ${accentColor}55`, border: `1px solid rgba(255,255,255,.06)`, borderLeftWidth: 3 }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,.85)' }}>
                        📅 {fmtDate(m.dato)} — {m.type==='forberedelse'?'Forberedelsesmøde':m.type==='beslutning'?'Beslutningsøde':'Opfølgningsmøde'}
                      </div>
                      <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: `${accentColor}14`, color: accentColor }} onClick={() => { setMsteExpMi(mi); setShowOv('mste-exp') }}>
                        Se referat
                      </button>
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,.38)' }}>
                      {m.deltagere && <><strong>Deltagere:</strong> {m.deltagere}<br/></>}
                      {m.bslCount} beslutninger · {m.hdlCount} handlinger
                      {m.opsummering && <><br/><em>{m.opsummering}</em></>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {td.auditLog.length > 0 && (
            <div>
              <button className="text-xs underline underline-offset-2 opacity-50" onClick={() => setShowAudit(a => !a)}>
                📜 {showAudit ? 'Skjul' : 'Vis'} ændringslog ({td.auditLog.length})
              </button>
              {showAudit && (
                <div className="mt-2 rounded-xl p-3 space-y-1.5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  {[...td.auditLog].reverse().map((e, ei) => (
                    <div key={ei} className="flex gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,.55)' }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                        style={{ background: e.type==='del'?'#E05C5C':e.type==='bsl'?accentColor:'#3AA87A' }}/>
                      <div>
                        <strong>{e.tekst}</strong>
                        {e.detaljer && <> — {e.detaljer.substring(0, 55)}</>}
                        <span className="block opacity-60 text-xs">{fmtDate(e.dato)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }}/>

          {/* Status */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'rgba(255,255,255,.35)' }}>Status for Trin {trin}</div>
            <div className="flex gap-2">
              {(['ikke-startet','i-gang','afsluttet'] as TrinData['status'][]).map(st => {
                const isA = td.status === st
                const color = st==='afsluttet' ? '#3AA87A' : accentColor
                return (
                  <button key={st} className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: isA ? `${color}18` : 'rgba(255,255,255,.05)', color: isA ? color : 'rgba(255,255,255,.45)', border: isA ? `1.5px solid ${color}45` : '1.5px solid rgba(255,255,255,.07)' }}
                    onClick={() => setTrinStatus(st)}>
                    {st==='ikke-startet'?'Ikke startet':st==='i-gang'?'I gang':'Afsluttet ✓'}
                  </button>
                )
              })}
            </div>
          </div>

          </>)} {/* end td block */}

          {/* Navigationsknap — Næste */}
          {trin === 0 && (
            <button className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: accentColor, color: 'white', boxShadow: `0 4px 20px ${accentColor}35` }}
              onClick={() => openTrin(1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              Gå til Trin 1 — {TRIN_NAVNE[0]}
            </button>
          )}
          {isModelTrin && !showHuman && (
            <button className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}40` }}
              onClick={() => { setShowHuman(true); setFlipped(false) }}>
              🫀 Det menneskelige rum — {humanKort?.kortLabel ?? ''}
            </button>
          )}
          {isModelTrin && showHuman && (
            <button className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: accentColor, color: 'white', boxShadow: `0 4px 20px ${accentColor}35` }}
              onClick={goNextTrin}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              {trin < 6 ? `Trin ${trin + 1} — ${TRIN_NAVNE[trin]}` : 'Afslutning'}
            </button>
          )}

          <div style={{ height: 32 }}/>
        </div>
      </div>
    )
  }

  // Fallback
  return <div className="h-full flex items-center justify-center" style={{ color: 'rgba(255,255,255,.4)' }}>Indlæser...</div>
}
