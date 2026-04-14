'use client'

import { useState, useEffect } from 'react'
import type { Rolle } from '@/types'
import { TRIN_NAVNE } from '@/lib/data/model'

const API_BASE = 'https://strategi-chat.strategiskskole.workers.dev'

const TRIN_OUTPUT_LABELS = [
  'Situationsbeskrivelse',
  'Problemformulering',
  'Strategisk valg',
  'Konkret struktur',
  'Observation',
  'Opfølgningsaftale',
] as const

const TRIN_IKONER = ['👁', '🔍', '⚡', '🏗', '🎯', '🔒'] as const

interface TrinSnapshot {
  trin: number
  status: string
  depth_score: number
  key_insights: string[]
}

interface ProgressData {
  forloeb_id: string
  roller: {
    skoleleder: TrinSnapshot[]
    ledelsesteam: TrinSnapshot[]
    bestyrelse: TrinSnapshot[]
  }
  top_themes: { theme: string; score: number }[]
  total_sessions: number
}

interface MinRejseProps {
  forloebId: string
  rolle: Rolle
  accentColor: string
  onClose: () => void
}

export default function MinRejse({ forloebId, rolle, accentColor, onClose }: MinRejseProps) {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch(`${API_BASE}/api/progress/${forloebId}`, {
          headers: { 'x-source': 'forloeb' },
        })
        if (!res.ok) throw new Error('Kunne ikke hente data')
        const json = await res.json()
        setData(json.data || json)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Ukendt fejl')
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [forloebId])

  const trin: TrinSnapshot[] = data?.roller?.[rolle] || []
  const hasAnyInsights = trin.some(t => t.key_insights?.length > 0)

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ background: '#0B1522' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{
        padding: 'calc(var(--safe-t, 0px) + 12px) 16px 16px',
        background: `linear-gradient(160deg, #0D1928 0%, ${accentColor}12 100%)`,
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <div className="flex items-center justify-between mb-3">
          <button
            className="flex items-center gap-2 text-sm"
            style={{ color: 'rgba(255,255,255,.6)' }}
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            Tilbage
          </button>
        </div>
        <h1 className="font-serif text-xl font-bold" style={{ color: 'rgba(255,255,255,.95)', fontStyle: 'italic' }}>
          Min rejse
        </h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.4)' }}>
          Dine erkendelser og beslutninger — samlet fra hele forløbet
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-sm" style={{ color: 'rgba(255,255,255,.4)' }}>Henter din rejse...</div>
          </div>
        )}

        {error && (
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,80,80,.1)', border: '1px solid rgba(255,80,80,.2)' }}>
            <div className="text-sm" style={{ color: 'rgba(255,120,120,.8)' }}>{error}</div>
          </div>
        )}

        {!loading && !error && !hasAnyInsights && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <div className="text-base font-semibold mb-2" style={{ color: 'rgba(255,255,255,.7)' }}>
              Din rejse begynder her
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.35)' }}>
              Efterhånden som du arbejder dig gennem trinnene, samler denne side dine erkendelser, beslutninger og aftaler — så du kan se den røde tråd.
            </div>
          </div>
        )}

        {!loading && !error && hasAnyInsights && (
          <div className="space-y-4">
            {/* Tidslinje */}
            {trin.map((snap, i) => {
              const hasInsights = snap.key_insights?.length > 0
              const isActive = snap.status === 'i-gang' || snap.status === 'in-progress'
              const isDone = snap.status === 'afsluttet' || snap.status === 'completed'

              return (
                <div key={snap.trin} className="relative">
                  {/* Forbindelseslinje */}
                  {i < trin.length - 1 && (
                    <div className="absolute left-[19px] top-[44px] bottom-[-16px] w-[2px]"
                      style={{ background: hasInsights ? `${accentColor}33` : 'rgba(255,255,255,.06)' }} />
                  )}

                  <div className="flex gap-3">
                    {/* Trin-indikator */}
                    <div className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center text-base"
                      style={{
                        background: isDone ? 'rgba(58,168,122,.15)' : hasInsights ? `${accentColor}18` : 'rgba(255,255,255,.04)',
                        border: `2px solid ${isDone ? '#3AA87A' : hasInsights ? accentColor : 'rgba(255,255,255,.08)'}`,
                      }}>
                      {isDone ? '✓' : TRIN_IKONER[i]}
                    </div>

                    {/* Indhold */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-bold tracking-wider uppercase"
                          style={{ color: isDone ? '#3AA87A' : hasInsights ? accentColor : 'rgba(255,255,255,.3)' }}>
                          Trin {snap.trin} — {TRIN_NAVNE[snap.trin - 1]}
                        </span>
                      </div>

                      {hasInsights ? (
                        <div className="rounded-xl p-3.5" style={{
                          background: `${accentColor}08`,
                          border: `1px solid ${accentColor}18`,
                        }}>
                          <div className="text-xs font-semibold tracking-wider uppercase mb-2"
                            style={{ color: `${accentColor}88` }}>
                            {TRIN_OUTPUT_LABELS[i]}
                          </div>
                          <div className="space-y-2">
                            {snap.key_insights.map((insight, j) => (
                              <div key={j} className="text-sm leading-relaxed"
                                style={{ color: 'rgba(255,255,255,.75)' }}>
                                {insight}
                              </div>
                            ))}
                          </div>
                          {/* Dybde-indikator */}
                          {snap.depth_score > 0 && (
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,.06)' }}>
                                <div className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(snap.depth_score * 100, 100)}%`,
                                    background: snap.depth_score >= 0.6 ? '#3AA87A' : accentColor,
                                  }} />
                              </div>
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,.25)' }}>
                                {snap.depth_score >= 0.6 ? 'Dyb' : snap.depth_score >= 0.3 ? 'God' : 'Start'}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl p-3 text-center" style={{
                          background: 'rgba(255,255,255,.02)',
                          border: '1px solid rgba(255,255,255,.05)',
                        }}>
                          <div className="text-xs" style={{ color: 'rgba(255,255,255,.2)' }}>
                            Ikke startet endnu
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Temaer */}
            {data?.top_themes && data.top_themes.length > 0 && (
              <div className="mt-6 rounded-xl p-4" style={{
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.06)',
              }}>
                <div className="text-xs font-bold tracking-wider uppercase mb-3"
                  style={{ color: 'rgba(255,255,255,.35)' }}>
                  Gennemgående temaer
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.top_themes.map((t, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        background: `${accentColor}12`,
                        border: `1px solid ${accentColor}22`,
                        color: `${accentColor}cc`,
                      }}>
                      {t.theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
