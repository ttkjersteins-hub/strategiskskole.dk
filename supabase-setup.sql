-- ============================================================
-- Strategiskskole App — Supabase SQL Setup
-- Kør dette i: Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. Organisations-tabel (én række per kunde)
CREATE TABLE IF NOT EXISTS public.organisations (
  id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  navn    TEXT        NOT NULL,
  kode    TEXT        NOT NULL UNIQUE,
  oprettet TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Forløb-tabel (data per organisation)
CREATE TABLE IF NOT EXISTS public.forloeb (
  id        TEXT        PRIMARY KEY,
  org_id    UUID        NOT NULL REFERENCES public.organisations(id),
  navn      TEXT        NOT NULL DEFAULT '',
  maal      TEXT        NOT NULL DEFAULT '',
  data      JSONB       NOT NULL DEFAULT '{}',
  oprettet  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opdateret TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for hurtige opslag per org
CREATE INDEX IF NOT EXISTS forloeb_org_id_idx ON public.forloeb(org_id);

-- 3. Row Level Security (RLS)
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forloeb       ENABLE ROW LEVEL SECURITY;

-- Anon kan slå org op (til kode-validering)
CREATE POLICY "anon_select_orgs" ON public.organisations
  FOR SELECT TO anon USING (true);

-- Anon kan læse, oprette og opdatere forløb
CREATE POLICY "anon_select_forloeb" ON public.forloeb
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_forloeb" ON public.forloeb
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_forloeb" ON public.forloeb
  FOR UPDATE TO anon USING (true);

-- 4. Indsæt de 20 organisations-koder
INSERT INTO public.organisations (navn, kode) VALUES
  ('Ulven',       'Ulven47291'),
  ('Ræven',       'Ræven83150'),
  ('Hejren',      'Hejren62438'),
  ('Odderen',     'Odderen15873'),
  ('Grævlingen',  'Grævlingen90462'),
  ('Storkens',    'Storkens34817'),
  ('Hasens',      'Hasens71205'),
  ('Kronhjorten', 'Kronhjorten58639'),
  ('Svanens',     'Svanens26481'),
  ('Mejsen',      'Mejsen43970'),
  ('Ørnen',       'Ørnen67324'),
  ('Bæveren',     'Bæveren19056'),
  ('Isfuglen',    'Isfuglen85713'),
  ('Dådyret',     'Dådyret30148'),
  ('Musvågen',    'Musvågen74592'),
  ('Pinsvinet',   'Pinsvinet42867'),
  ('Tranen',      'Tranen96314'),
  ('Lærken',      'Lærken53029'),
  ('Hjejlen',     'Hjejlen18746'),
  ('Rørhøgen',    'Rørhøgen61483')
ON CONFLICT (kode) DO NOTHING;

-- Færdig! Kopiér nu Project URL og anon key fra:
-- Supabase → Settings → API → Project URL + anon public key
