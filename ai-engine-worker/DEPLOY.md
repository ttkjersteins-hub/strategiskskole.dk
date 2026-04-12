# Deploy Guide — AI Engine Worker

## Forudsætninger

- Node.js installeret (v18+)
- Cloudflare-konto (gratis)
- Supabase-projekt (eksisterende)

## Trin 1: Supabase — Kør migration

1. Åbn Supabase Dashboard → SQL Editor → New Query
2. Kopiér indholdet af `supabase-migration.sql`
3. Klik **Run**
4. Verificér: 5 nye tabeller (sessions, messages, extracted_keywords, theme_scores, progress_snapshots)

## Trin 2: Cloudflare — Installer Wrangler

```bash
npm install -g wrangler
wrangler login
```

## Trin 3: Cloudflare KV — Opret namespace

```bash
wrangler kv namespace create CACHE
```

Kopiér det returnerede `id` og indsæt i `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "DIT-KV-NAMESPACE-ID"
```

## Trin 4: Konfigurér wrangler.toml

Åbn `wrangler.toml` og erstat:
- `REPLACE_WITH_KV_NAMESPACE_ID` → dit KV namespace ID fra trin 3
- `REPLACE_WITH_SUPABASE_URL` → din Supabase Project URL (fra Supabase → Settings → API)

## Trin 5: Sæt secrets

```bash
cd ai-engine-worker
wrangler secret put SUPABASE_ANON_KEY
```
Indtast din Supabase anon public key (fra Supabase → Settings → API → anon public).

## Trin 6: Deploy

```bash
npm install
wrangler deploy
```

Wrangler returnerer en URL, f.eks.:
```
https://ai-engine-worker.DITBRUGERNAVN.workers.dev
```

## Trin 7: Test

```bash
# Health check
curl https://ai-engine-worker.DITBRUGERNAVN.workers.dev/api/health

# Test chat (gammel chatbot-format — bagudkompatibelt)
curl -X POST https://ai-engine-worker.DITBRUGERNAVN.workers.dev/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://strategiskskole.dk" \
  -d '{"message": "Hvad er Tirsdag kl. 10-modellen?"}'

# Test nyt API-format
curl -X POST https://ai-engine-worker.DITBRUGERNAVN.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://strategiskskole.dk" \
  -d '{"message": "Vi har udfordringer med mødekultur", "source": "website"}'
```

## Trin 8: Opdater chatbot.js

I din chatbot.js på strategiskskole.dk, skift worker-URL:

```javascript
// FØR:
const WORKER_URL = 'https://chatbot-worker.DITBRUGERNAVN.workers.dev'

// EFTER:
const WORKER_URL = 'https://ai-engine-worker.DITBRUGERNAVN.workers.dev'
```

Chatbotten virker umiddelbart — den nye worker understøtter det gamle POST / format.

## Trin 9: Custom domain (valgfrit)

I Cloudflare Dashboard → Workers → ai-engine-worker → Settings → Triggers:
- Tilføj custom domain: `api.strategiskskole.dk`

---

## Priser

| Komponent | Grænse | Pris |
|-----------|--------|------|
| Workers requests | 100.000/dag | Gratis |
| Workers AI (Llama) | 10.000 neurons/dag | Gratis |
| KV Storage | 100.000 reads/dag | Gratis |
| Supabase | 500 MB, 50k rows | Gratis |

## Fejlfinding

**"Workers AI returned 429"** → Daglig neuron-kvote opbrugt. Systemet falder automatisk til template-svar. Nulstilles ved midnat UTC.

**"Session ikke fundet"** → Supabase migration er ikke kørt, eller forloeb_id matcher ikke. Tjek at `website-default` rækken eksisterer i forloeb-tabellen.

**Tomt svar fra AI** → Llama kan give tomt svar ved korte/uklare inputs. Fallback-systemet fanger dette og returnerer template-spørgsmål i stedet.
