-- ============================================================
-- Shared Knowledge — D1 Migration
-- Delt vidensbase der gør AI'en klogere over tid
-- Kør i: Cloudflare Dashboard → D1 → Console → Paste → Execute
-- ============================================================

CREATE TABLE IF NOT EXISTS shared_knowledge (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tema          TEXT NOT NULL,
  trin          INTEGER,
  rolle         TEXT CHECK (rolle IN ('skoleleder', 'ledelsesteam', 'bestyrelse', NULL)),
  type          TEXT NOT NULL CHECK (type IN ('indsigt', 'godt_svar', 'scenarie', 'spørgsmål')),
  indhold       TEXT NOT NULL,
  kontekst      TEXT DEFAULT '',
  kilde         TEXT DEFAULT 'simulering',
  kvalitet      REAL DEFAULT 1.0,
  brugt_antal   INTEGER DEFAULT 0,
  created_at    TEXT DEFAULT (datetime('now')),
  updated_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sk_tema ON shared_knowledge(tema);
CREATE INDEX IF NOT EXISTS idx_sk_trin ON shared_knowledge(trin);
CREATE INDEX IF NOT EXISTS idx_sk_type ON shared_knowledge(type);
CREATE INDEX IF NOT EXISTS idx_sk_rolle ON shared_knowledge(rolle);
