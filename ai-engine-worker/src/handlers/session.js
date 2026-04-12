// ============================================================
// SessionHandler — opret og hent sessions (D1-version)
// ============================================================

import { getSession, createSession } from '../data/db.js'

export async function handleCreateSession(body, db) {
  const { forloeb_id, source, rolle, trin, mode } = body

  if (!forloeb_id || !source) {
    return { error: 'forloeb_id og source er påkrævet', status: 400 }
  }

  if (!['website', 'app', 'forloeb'].includes(source)) {
    return { error: 'source skal være website, app eller forloeb', status: 400 }
  }

  try {
    const session = await createSession({ db, forloeb_id, source, rolle, trin, mode })
    return {
      data: {
        session_id: session.id,
        forloeb_id: session.forloeb_id,
        source: session.source
      },
      status: 200
    }
  } catch (e) {
    console.error('Session oprettelse fejlede:', e.message)
    return { error: 'Kunne ikke oprette session', status: 500 }
  }
}

export async function handleGetSession(sessionId, db) {
  if (!sessionId) {
    return { error: 'session_id er påkrævet', status: 400 }
  }

  const session = await getSession(db, sessionId)
  if (!session) {
    return { error: 'Session ikke fundet', status: 404 }
  }

  return { data: session, status: 200 }
}
