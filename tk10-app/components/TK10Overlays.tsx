'use client'

// Overlay-komponenten til brug i TK10App — udtrukket for læsbarhed
// Ikke standalone — bruger props fra TK10App

import type { TrinData, ModeType, Forloeb, Rolle } from '@/types'
import { TRIN_NAVNE, TRIN_KONTEKST, ROLLE_LABELS } from '@/lib/data/model'
import { getKort } from '@/lib/data/kort'
import { fmtDate } from '@/lib/data/db'

interface OverlayProps {
  show: string | null
  onClose: () => void
  accentColor: string
  // Møde eksport
  td?: TrinData | null
  fl?: Forloeb | null
  rolle?: Rolle | null
  trin?: number
  msteExpMi?: number
}

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: 10,
  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
  color: 'rgba(255,255,255,.9)', fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none',
}

export function MsteExpOverlay({ show, onClose, td, fl, rolle, trin, msteExpMi = 0, accentColor }: OverlayProps) {
  if (!td || !fl || !rolle || trin === undefined) return null
  const m = td.moeder[msteExpMi]
  if (!m) return null
  const typeLabel = m.type === 'forberedelse' ? 'Forberedelsesmøde' : m.type === 'beslutning' ? 'Beslutningsøde' : 'Opfølgningsmøde'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 200, display: 'flex', alignItems: 'flex-end', opacity: show === 'mste-exp' ? 1 : 0, pointerEvents: show === 'mste-exp' ? 'all' : 'none', transition: 'opacity .25s' }} onClick={onClose}>
      <div style={{ background: '#0D1928', borderRadius: '20px 20px 0 0', padding: '20px 20px calc(20px + var(--safe-b))', width: '100%', maxHeight: '88vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,.08)', borderBottom: 'none', transform: show === 'mste-exp' ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .3s cubic-bezier(.4,0,.2,1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.15)', margin: '0 auto 16px' }}/>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,.92)', marginBottom: 16 }}>{typeLabel} — {fmtDate(m.dato)}</h3>

        {/* Mødeoplysninger */}
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 8 }}>Mødeoplysninger</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', lineHeight: 1.6 }}>
            <strong>Forløb:</strong> {fl.navn}<br/>
            <strong>Trin:</strong> {trin} — {TRIN_NAVNE[trin - 1]}<br/>
            <strong>Dato:</strong> {fmtDate(m.dato)}<br/>
            {m.deltagere && <><strong>Deltagere:</strong> {m.deltagere}<br/></>}
          </div>
        </div>

        {/* Opsummering */}
        {m.opsummering && (
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 8 }}>Opsummering</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', lineHeight: 1.6 }}>{m.opsummering}</p>
          </div>
        )}

        {/* Beslutningslog */}
        {td.beslutninger.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 8 }}>Beslutningslog ({td.beslutninger.length})</div>
            {td.beslutninger.map((b, bi) => (
              <div key={bi} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: bi < td.beslutninger.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                <span style={{ color: accentColor, fontWeight: 700, flexShrink: 0 }}>→</span>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)' }}>
                  {b.tekst}{b.af && <span style={{ opacity: .6, fontSize: 11 }}> — {b.af}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Åbne handlinger */}
        {td.handlinger.filter(h => h.status !== 'udfoert').length > 0 && (
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 8 }}>Åbne handlinger</div>
            {td.handlinger.filter(h => h.status !== 'udfoert').map((h, hi) => (
              <div key={hi} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: hi < td.handlinger.filter(hh=>hh.status!=='udfoert').length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                <span style={{ color: '#3AA87A', fontWeight: 700, flexShrink: 0 }}>→</span>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)' }}>
                  {h.opgave}{h.ansvar && <span style={{ opacity: .6, fontSize: 11 }}> — {h.ansvar}</span>}
                  {h.deadline && <span style={{ opacity: .5, fontSize: 11 }}> · {fmtDate(h.deadline)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' }} onClick={onClose}>Luk</button>
          <button style={{ flex: 2, padding: '13px', borderRadius: 12, background: accentColor, color: 'white', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' }} onClick={() => window.print()}>Udskriv referat</button>
        </div>
      </div>
    </div>
  )
}
