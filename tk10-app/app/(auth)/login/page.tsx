'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // TODO: createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: '/dashboard' } })
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #080F1A 0%, #0A1628 60%, #05090F 100%)' }}
    >
      {/* Logo */}
      <div className="mb-10 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}
        >
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2">
            <circle cx="24" cy="24" r="19"/><path d="M24 13v11l7 4" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="2" fill="rgba(255,255,255,.75)" stroke="none"/>
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold" style={{ color: 'rgba(255,255,255,.95)', fontStyle: 'italic' }}>
          Strategiskskole App
        </h1>
        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,.4)' }}>
          Strategisk procesapp til skoleledelse
        </p>
      </div>

      {/* Kort */}
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: 'rgba(13,25,40,.8)',
          border: '1px solid rgba(255,255,255,.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 48px rgba(0,0,0,.6)',
        }}
      >
        {!sent ? (
          <>
            <h2 className="text-lg font-semibold mb-1" style={{ color: 'rgba(255,255,255,.9)' }}>
              Log ind
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,.4)' }}>
              Vi sender dig et login-link på email
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,.4)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="din@email.dk"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.1)',
                    color: 'rgba(255,255,255,.9)',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(58,157,176,.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold transition-opacity"
                style={{
                  background: loading ? 'rgba(58,157,176,.5)' : '#3A9DB0',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(58,157,176,.3)',
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? 'Sender...' : 'Send login-link →'}
              </button>
            </form>

            <p className="text-xs text-center mt-5" style={{ color: 'rgba(255,255,255,.25)' }}>
              Har du ikke adgang?{' '}
              <a href="mailto:tk@feldballe-friskole.dk" style={{ color: 'rgba(58,157,176,.7)' }}>
                Kontakt os
              </a>
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'rgba(255,255,255,.9)' }}>
              Check din email
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,.45)' }}>
              Vi har sendt et login-link til <strong style={{ color: 'rgba(255,255,255,.7)' }}>{email}</strong>
            </p>
            <button
              className="mt-6 text-xs"
              style={{ color: 'rgba(58,157,176,.7)' }}
              onClick={() => setSent(false)}
            >
              Prøv igen
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs" style={{ color: 'rgba(255,255,255,.18)' }}>
        Strategiskskole.dk © {new Date().getFullYear()}
      </p>
    </div>
  )
}
