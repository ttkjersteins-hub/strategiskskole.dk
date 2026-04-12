// ============================================================
// ProgressHandler — hent progressionsdata for et forløb (D1)
// ============================================================

import { getProgressSnapshots, getThemes, countSessions } from '../data/db.js'

export async function handleGetProgress(forloebId, db) {
  if (!forloebId) {
    return { error: 'forloeb_id er påkrævet', status: 400 }
  }

  // Hent progress snapshots
  const snapshots = await getProgressSnapshots(db, forloebId)

  // Hent top temaer
  const themes = await getThemes(db, forloebId, 0.3, 10)

  // Hent session count
  const totalSessions = await countSessions(db, forloebId)

  // Organisér per rolle
  const roller = {
    skoleleder: buildTrinArray(snapshots, 'skoleleder'),
    ledelsesteam: buildTrinArray(snapshots, 'ledelsesteam'),
    bestyrelse: buildTrinArray(snapshots, 'bestyrelse'),
  }

  return {
    data: {
      forloeb_id: forloebId,
      roller,
      top_themes: themes.map(t => ({ theme: t.theme, score: t.score })),
      total_sessions: totalSessions
    },
    status: 200
  }
}

function buildTrinArray(snapshots, rolle) {
  const result = []
  for (let trin = 1; trin <= 6; trin++) {
    const snap = snapshots.find(s => s.rolle === rolle && s.trin === trin)
    result.push({
      trin,
      status: snap?.status || 'ikke-startet',
      depth_score: snap?.depth_score || 0,
      key_insights: snap?.key_insights || []
    })
  }
  return result
}
