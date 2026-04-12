'use client'

import { TRIN_NAVNE, TRIN_SPØRGSMÅL } from '@/lib/data/model'

interface Props {
  aktivTrin: number       // 0-based
  afsluttede: number[]    // 0-based indices
  rolle: string
  onTrinClick?: (idx: number) => void
}

const ROLLE_ACTIVE_COLOR: Record<string, string> = {
  skoleleder: '#3A9DB0',
  ledelsesteam: '#8BA4C0',
  bestyrelse: '#C9982A',
}

export default function TrinStrip({ aktivTrin, afsluttede, rolle, onTrinClick }: Props) {
  const ac = ROLLE_ACTIVE_COLOR[rolle] ?? '#3A9DB0'

  return (
    <div
      className="flex-shrink-0 no-print"
      style={{
        background: 'rgba(8,15,26,.95)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        padding: '10px 16px 14px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div className="flex gap-1 min-w-max">
        {TRIN_NAVNE.map((navn, i) => {
          const isActive = i === aktivTrin
          const isDone = afsluttede.includes(i)

          return (
            <button
              key={i}
              onClick={() => onTrinClick?.(i)}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all"
              style={{
                minWidth: '72px',
                background: isActive ? `${ac}18` : 'transparent',
                border: isActive ? `1px solid ${ac}35` : '1px solid transparent',
              }}
            >
              {/* Cirkel */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: isActive ? ac : isDone ? 'rgba(58,168,122,.25)' : 'rgba(255,255,255,.08)',
                  border: isActive ? `2px solid ${ac}` : isDone ? '2px solid rgba(58,168,122,.5)' : '2px solid rgba(255,255,255,.12)',
                  color: isActive ? 'white' : isDone ? '#3AA87A' : 'rgba(255,255,255,.4)',
                }}
              >
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M2 6l3 3 5-5"/>
                  </svg>
                ) : (
                  <span>{String(i + 1).padStart(2, '0')}</span>
                )}
              </div>

              {/* Navn */}
              <span
                className="text-xs font-semibold leading-tight text-center"
                style={{ color: isActive ? ac : 'rgba(255,255,255,.4)' }}
              >
                {navn}
              </span>

              {/* Sub */}
              <span
                className="text-xs leading-tight text-center hidden sm:block"
                style={{ color: 'rgba(255,255,255,.25)', fontSize: '10px', maxWidth: '70px' }}
              >
                {TRIN_SPØRGSMÅL[i].split(' ').slice(0, 4).join(' ')}...
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
