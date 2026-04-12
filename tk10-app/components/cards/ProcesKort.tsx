'use client'

import { useState } from 'react'
import type { KortDefinition, Rolle } from '@/types'

interface Props {
  kort: KortDefinition
  rolle: Rolle
  trinNavn: string
  onGptPanel?: () => void
}

// Sektionslabel-farver: teal for skoleleder, blå-grå for ledelsesteam, guld for bestyrelse
const SEKTION_COLOR: Record<Rolle, string> = {
  skoleleder:   '#1E7A8C',
  ledelsesteam: '#2E5F8A',
  bestyrelse:   '#C8A84B',
}

const ERKENDELSE_BG: Record<Rolle, string> = {
  skoleleder:   '#EDF6F9',
  ledelsesteam: '#EDF2F8',
  bestyrelse:   '#FBF7EC',
}

const ERKENDELSE_LABEL_COLOR: Record<Rolle, string> = {
  skoleleder:   '#1E7A8C',
  ledelsesteam: '#2E5F8A',
  bestyrelse:   '#C8A84B',
}

const ROLLE_LABEL: Record<Rolle, string> = {
  skoleleder:   'SKOLELEDER',
  ledelsesteam: 'LEDELSESTEAM',
  bestyrelse:   'BESTYRELSE',
}

export default function ProcesKort({ kort, rolle, trinNavn, onGptPanel }: Props) {
  const [flipped, setFlipped] = useState(false)

  const sektionColor  = SEKTION_COLOR[rolle]
  const erkendelseBg  = ERKENDELSE_BG[rolle]
  const erkendelseLabel = ERKENDELSE_LABEL_COLOR[rolle]

  return (
    <>
      {/* Kort-header (label + flip-knap) */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span
          className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
          style={{
            background: `${sektionColor}14`,
            color: sektionColor,
            border: `1px solid ${sektionColor}30`,
            letterSpacing: '0.12em',
          }}
        >
          {kort.type === 'aabning' ? 'ÅBNING' : kort.type === 'afslutning' ? 'AFSLUTNING' : kort.type === 'menneskelig-rum' ? 'DET MENNESKELIGE RUM' : 'PROCESKORT'}
        </span>
        <button
          className="flex items-center gap-1.5 text-xs"
          style={{ color: '#8A9AB0' }}
          onClick={() => setFlipped(f => !f)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 12v-2a8 8 0 0114.93-4M20 12v2a8 8 0 01-14.93 4"/>
          </svg>
          {flipped ? 'Klik for at vende kortet' : 'Klik for at vende kortet'}
        </button>
      </div>

      {/* Flip-wrap */}
      <div className="flip-wrap w-full" style={{ height: 520 }}>
        <div
          className={`flip-inner relative w-full cursor-pointer${flipped ? ' flipped' : ''}`}
          style={{ height: 520 }}
          onClick={() => setFlipped(f => !f)}
        >

          {/* ══════════════ FORSIDE ══════════════ */}
          <div
            className="flip-face rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8EF',
              boxShadow: '0 2px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04)',
            }}
          >
            {/* Top-stripe */}
            <div
              className="h-1 w-full rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${sektionColor}, ${sektionColor}55)` }}
            />

            {/* Rolle + Trin */}
            <div className="flex items-center justify-between px-7 pt-5 pb-0">
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: sektionColor, letterSpacing: '0.13em' }}
              >
                {ROLLE_LABEL[rolle]}
              </span>
              <span
                className="text-xs font-semibold tracking-wider"
                style={{ color: '#B0BAC8', letterSpacing: '0.1em' }}
              >
                {trinNavn.toUpperCase()}
              </span>
            </div>

            {/* Central spørgsmål */}
            <div className="flex-1 flex items-center px-7 py-8">
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '1.45rem',
                  lineHeight: 1.38,
                  fontStyle: 'italic',
                  color: '#1A3A5C',
                  fontWeight: 400,
                }}
              >
                {kort.forside}
              </p>
            </div>

            {/* Bund */}
            <div className="flex items-center justify-between px-7 pb-5">
              <span className="text-xs" style={{ color: '#C8D0DC' }}>Strategiskskole.dk</span>
              <span className="flex items-center gap-1 text-xs" style={{ color: '#A0AAB8' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 12v-2a8 8 0 0114.93-4M20 12v2a8 8 0 01-14.93 4"/>
                </svg>
                vend
              </span>
            </div>
          </div>

          {/* ══════════════ BAGSIDE ══════════════ */}
          <div
            className="flip-face flip-back rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8EF',
              boxShadow: '0 2px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04)',
            }}
          >
            {/* Top-stripe */}
            <div
              className="h-1 w-full rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${sektionColor}, ${sektionColor}55)` }}
            />

            <div className="flex-1 overflow-y-auto px-7 pt-5 pb-4" onClick={e => e.stopPropagation()}>

              {/* Titel */}
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '1.2rem',
                  lineHeight: 1.38,
                  fontStyle: 'italic',
                  color: '#1A3A5C',
                  fontWeight: 400,
                  marginBottom: '1rem',
                }}
              >
                {kort.forside}
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: '#E2E8EF', marginBottom: '1rem' }} />

              {/* Åbningsspørgsmål */}
              <div style={{ marginBottom: '1.1rem' }}>
                {kort.åbning.map((q, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <span style={{ color: '#B0BAC8', flexShrink: 0, fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6 }}>—</span>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#3A4A5C', margin: 0 }}>{q}</p>
                  </div>
                ))}
              </div>

              {/* Sektioner */}
              {kort.sektioner.map((sek, si) => (
                <div key={si} style={{ marginBottom: '1.1rem' }}>
                  {/* Sektionslabel */}
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: sektionColor,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {sek.label}
                  </div>
                  {sek.spørgsmål.map((q, qi) => (
                    <div key={qi} className="flex gap-3 mb-2">
                      <span style={{ color: '#B0BAC8', flexShrink: 0, fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6 }}>—</span>
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#3A4A5C', margin: 0 }}>{q}</p>
                    </div>
                  ))}
                </div>
              ))}

              {/* Erkendelse-boks */}
              <div
                style={{
                  background: erkendelseBg,
                  borderRadius: 10,
                  padding: '0.9rem 1rem',
                  marginBottom: '0.9rem',
                  border: `1px solid ${sektionColor}18`,
                }}
              >
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: erkendelseLabel,
                    marginBottom: '0.4rem',
                  }}
                >
                  ERKENDELSE
                </div>
                <p
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    lineHeight: 1.45,
                    color: '#1A3A5C',
                    margin: 0,
                  }}
                >
                  {kort.erkendelse}
                </p>
              </div>

              {/* Handling */}
              <div
                style={{
                  paddingTop: '0.6rem',
                  borderTop: '1px solid #E8EDF3',
                  display: 'flex',
                  gap: '0.6rem',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#1A3A5C',
                    flexShrink: 0,
                    paddingTop: 2,
                  }}
                >
                  HANDLING
                </span>
                <p
                  style={{
                    fontSize: '0.82rem',
                    fontStyle: 'italic',
                    color: '#5A6A7A',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {kort.handling}
                </p>
              </div>

              {/* AI-knap */}
              {onGptPanel && (
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mt-4 transition-opacity hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #10a37f, #0d8a6a)',
                    color: 'white',
                    border: 'none',
                  }}
                  onClick={e => { e.stopPropagation(); onGptPanel() }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  Reflektér med AI-refleksionspartner
                </button>
              )}
            </div>

            {/* Bund */}
            <div
              className="flex items-center justify-between px-7 pb-4 pt-2"
              style={{ borderTop: '1px solid #EEF1F5' }}
            >
              <span className="text-xs" style={{ color: '#C8D0DC' }}>Strategiskskole.dk</span>
              <button
                className="flex items-center gap-1.5 text-xs"
                style={{ color: '#A0AAB8' }}
                onClick={e => { e.stopPropagation(); setFlipped(false) }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 12v-2a8 8 0 0114.93-4M20 12v2a8 8 0 01-14.93 4"/>
                </svg>
                vend
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
