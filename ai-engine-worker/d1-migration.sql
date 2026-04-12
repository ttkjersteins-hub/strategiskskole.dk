-- ============================================================
-- AI Engine — D1 (SQLite) Migration
-- Kør i: Cloudflare Dashboard → D1 → Console → Paste → Execute
-- ============================================================

-- ── 1. Forloeb (minimal — til website-default bucket) ─────────

CREATE TABLE IF NOT EXISTS forloeb (
  id            TEXT PRIMARY KEY,
  org_id        TEXT,
  navn          TEXT NOT NULL,
  maal          TEXT DEFAULT '',
  data          TEXT DEFAULT '{}',
  aktiv_rolle   TEXT DEFAULT 'skoleleder',
  samlet_progress INTEGER DEFAULT 0,
  ai_summary    TEXT DEFAULT '{}',
  created_at    TEXT DEFAULT (datetime('now')),
  updated_at    TEXT DEFAULT (datetime('now'))
);

-- Default website bucket
INSERT OR IGNORE INTO forloeb (id, navn, maal, data)
VALUES ('website-default', 'Website chatbot sessions', '', '{}');

-- ── 2. Sessions ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  forloeb_id    TEXT NOT NULL REFERENCES forloeb(id),
  source        TEXT NOT NULL CHECK (source IN ('website', 'app', 'forloeb')),
  rolle         TEXT CHECK (rolle IN ('skoleleder', 'ledelsesteam', 'bestyrelse')),
  trin          INTEGER,
  mode          TEXT CHECK (mode IN ('forberedelse', 'beslutning', 'opfolgning')),
  started_at    TEXT DEFAULT (datetime('now')),
  ended_at      TEXT,
  message_count INTEGER DEFAULT 0,
  context_blob  TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_sessions_forloeb ON sessions(forloeb_id);

-- ── 3. Messages ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  session_id    TEXT NOT NULL REFERENCES sessions(id),
  role          TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content       TEXT NOT NULL,
  tokens_in     INTEGER,
  tokens_out    INTEGER,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);

-- ── 4. Extracted Keywords ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS extracted_keywords (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  session_id    TEXT NOT NULL REFERENCES sessions(id),
  message_id    TEXT REFERENCES messages(id),
  keyword       TEXT NOT NULL,
  category      TEXT,
  weight        REAL DEFAULT 1.0,
  trin          INTEGER,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_keywords_session ON extracted_keywords(session_id);

-- ── 5. Theme Scores ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS theme_scores (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  session_id    TEXT NOT NULL REFERENCES sessions(id),
  forloeb_id    TEXT NOT NULL REFERENCES forloeb(id),
  theme         TEXT NOT NULL,
  score         REAL NOT NULL,
  evidence      TEXT DEFAULT '[]',
  trin          INTEGER,
  updated_at    TEXT DEFAULT (datetime('now')),
  UNIQUE(session_id, theme)
);

CREATE INDEX IF NOT EXISTS idx_themes_forloeb ON theme_scores(forloeb_id, theme);

-- ── 6. Progress Snapshots ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS progress_snapshots (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  forloeb_id    TEXT NOT NULL REFERENCES forloeb(id),
  rolle         TEXT NOT NULL,
  trin          INTEGER NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('ikke-startet', 'i-gang', 'afsluttet')),
  depth_score   REAL DEFAULT 0.0,
  key_insights  TEXT DEFAULT '[]',
  carry_forward TEXT DEFAULT '[]',
  updated_at    TEXT DEFAULT (datetime('now')),
  UNIQUE(forloeb_id, rolle, trin)
);

-- ============================================================
-- FÆRDIG! Tabellerne er klar til brug med D1.
-- ============================================================
