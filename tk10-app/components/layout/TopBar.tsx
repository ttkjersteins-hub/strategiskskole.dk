'use client'

import Link from 'next/link'

interface Props {
  title?: string
  sub?: string
  backHref?: string
  rolle?: string
  rolleColor?: string
  right?: React.ReactNode
}

const ROLLE_COLORS: Record<string, string> = {
  skoleleder: '#3A9DB0',
  ledelsesteam: '#8BA4C0',
  bestyrelse: '#C9982A',
}

export default function TopBar({ title, sub, backHref, rolle, rolleColor, right }: Props) {
  const rc = rolle ? (rolleColor ?? ROLLE_COLORS[rolle] ?? '#3A9DB0') : undefined

  return (
    <div
      className="flex items-center gap-3 px-4 flex-shrink-0 no-print"
      style={{
        background: 'rgba(8,15,26,.92)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        paddingTop: `calc(var(--safe-t) + 14px)`,
        paddingBottom: '14px',
        backdropFilter: 'blur(12px)',
        minHeight: '60px',
        zIndex: 20,
      }}
    >
      {backHref && (
        <Link
          href={backHref}
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.07)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </Link>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <h1 className="font-serif text-base font-semibold leading-tight truncate" style={{ color: 'rgba(255,255,255,.92)' }}>
            {title}
          </h1>
        )}
        {sub && (
          <div className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,.4)' }}>{sub}</div>
        )}
      </div>

      {rolle && (
        <div
          className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: `${rc}22`, color: rc, border: `1px solid ${rc}44` }}
        >
          {rolle === 'skoleleder' ? 'Skoleleder' : rolle === 'ledelsesteam' ? 'Ledelsesteam' : 'Bestyrelse'}
        </div>
      )}

      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  )
}
