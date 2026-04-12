-- ============================================================
-- AI Engine — Supabase Migration
-- Kør i: Supabase → SQL Editor → New Query → Run
-- FORUDSÆTNING: organisations + forloeb tabeller eksisterer allerede
-- ============================================================

-- ── 1. Udvid eksisterende forloeb-tabel ───────────────────────

ALTER TABLE public.forloeb
  ADD COLUMN IF NOT EXISTS aktiv_rolle TEXT DEFAULT 'skoleleder',
  ADD COLUMN IF NOT EXISTS samlet_progress SMALLINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_summary JSONB DEFAULT '{}';

-- Indsæt en default website-sessions bucket (til chatbot uden forløb)
-- KRÆVER: Mindst én organisation i organisations-tabellen (fra supabase-setup.sql)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.organisations LIMIT 1) THEN
    INSERT INTO public.forloeb (id, org_id, navn, maal, data)
    SELECT 'website-default',
           (SELECT id FROM public.organisations LIMIT 1),
           'Website chatbot sessions',
           '',
           '{}'
    WHERE NOT EXISTS (SELECT 1 FROM public.forloeb WHERE id = 'website-default');
  ELSE
    RAISE NOTICE 'ADVARSEL: Ingen organisationer fundet. Kør supabase-setup.sql først, derefter denne migration igen.';
  END IF;
END $$;

-- ── 2. Sessions ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  forloeb_id    TEXT        NOT NULL REFERENCES public.forloeb(id),
  source        TEXT        NOT NULL CHECK (source IN ('website', 'app', 'forloeb')),
  rolle         TEXT        CHECK (rolle IN ('skoleleder', 'ledelsesteam', 'bestyrelse')),
  trin          SMALLINT,
  mode          TEXT        CHECK (mode IN ('forberedelse', 'beslutning', 'opfolgning')),
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  ended_at      TIMESTAMPTZ,
  message_count SMALLINT    DEFAULT 0,
  context_blob  JSONB       DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_sessions_forloeb ON public.sessions(forloeb_id);

-- ── 3. Messages ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID        NOT NULL REFERENCES public.sessions(id),
  role          TEXT        NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content       TEXT        NOT NULL,
  tokens_in     SMALLINT,
  tokens_out    SMALLINT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_session ON public.messages(session_id, created_at);

-- ── 4. Extracted Keywords ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.extracted_keywords (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID        NOT NULL REFERENCES public.sessions(id),
  message_id    UUID        REFERENCES public.messages(id),
  keyword       TEXT        NOT NULL,
  category      TEXT,
  weight        REAL        DEFAULT 1.0,
  trin          SMALLINT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_keywords_session ON public.extracted_keywords(session_id);

-- ── 5. Theme Scores ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.theme_scores (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID        NOT NULL REFERENCES public.sessions(id),
  forloeb_id    TEXT        NOT NULL REFERENCES public.forloeb(id),
  theme         TEXT        NOT NULL,
  score         REAL        NOT NULL,
  evidence      TEXT[],
  trin          SMALLINT,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, theme)
);
CREATE INDEX IF NOT EXISTS idx_themes_forloeb ON public.theme_scores(forloeb_id, theme);

-- ── 6. Progress Snapshots ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.progress_snapshots (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  forloeb_id    TEXT        NOT NULL REFERENCES public.forloeb(id),
  rolle         TEXT        NOT NULL,
  trin          SMALLINT    NOT NULL,
  status        TEXT        NOT NULL CHECK (status IN ('ikke-startet', 'i-gang', 'afsluttet')),
  depth_score   REAL        DEFAULT 0.0,
  key_insights  TEXT[],
  carry_forward TEXT[],
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(forloeb_id, rolle, trin)
);

-- ── 7. RLS-politikker ─────────────────────────────────────────

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_snapshots ENABLE ROW LEVEL SECURITY;

-- Adgang for anon (via Supabase anon key)
CREATE POLICY "anon_sessions_all" ON public.sessions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_messages_all" ON public.messages FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_keywords_all" ON public.extracted_keywords FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_themes_all" ON public.theme_scores FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_progress_all" ON public.progress_snapshots FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- FÆRDIG! Tabellerne er klar til brug.
-- ============================================================
