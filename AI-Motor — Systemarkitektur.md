# AI-Motor — Strategiskskole.dk

## Systemarkitektur for fælles AI-backend

Version 2.0 — April 2026
Status: Udviklingsklar specifikation
**Pris: 0 kr./md** — hele stakken kører på gratis tiers

> **OBS: Terminologi-afvigelse.** `chatbot-worker.js` bruger trin-navnene Analyse/Organisering. `tk10-app/lib/data/model.ts` bruger Klarhed/Struktur. Denne specifikation følger model.ts (Klarhed/Struktur) som autoritativ kilde. Chatbot-workeren skal opdateres ved migrering.

---

## 1. Samlet systemarkitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        KLIENTER                                 │
│                                                                 │
│   strategiskskole.dk    tk10-app (Next.js)    digitalt-forloeb  │
│   [chatbot.js]          [React 19 / PWA]      [HTML embedded]   │
│        │                      │                      │          │
└────────┼──────────────────────┼──────────────────────┼──────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Cloudflare Workers)               │
│                                                                 │
│   /api/chat          → ChatHandler                              │
│   /api/session       → SessionHandler                           │
│   /api/progress      → ProgressHandler                          │
│   /api/keywords      → KeywordHandler                           │
│   /api/themes        → ThemeHandler                             │
│                                                                 │
│   Auth: org_kode + session_token                                │
│   CORS: strategiskskole.dk, *.vercel.app                       │
│   Rate limit: 30 req/min per session                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
     ┌──────────┐ ┌────────────┐ ┌──────────────┐
     │ Supabase │ │ CF Workers │ │ Cloudflare   │
     │ (data)   │ │ AI (LLM)   │ │ KV (cache)   │
     │ gratis   │ │ gratis     │ │ gratis       │
     └──────────┘ └────────────┘ └──────────────┘
```

### Designprincipper

- **En backend, tre klienter.** Alle klienter rammer samme Cloudflare Worker. Klienttype sendes som `source`-header (`website`, `app`, `forloeb`).
- **Session-centrisk.** Hver brugerinteraktion tilhører en session. Sessions tilhører et forløb. Forløb tilhører en organisation.
- **Stateless Worker, stateful Supabase.** Workeren er ren logik — al tilstand lever i Supabase.
- **AI som pipeline.** Hvert kald kører gennem: context assembly → prompt build → Workers AI → response parse → data extraction → persist.
- **100% gratis.** Cloudflare Workers AI (inkluderet i free tier), Supabase Free, Cloudflare KV Free. Ingen eksterne API-nøgler med fakturering.

### Gratis-begrænsninger og hvordan vi håndterer dem

| Tjeneste | Free Tier Grænse | Vores forbrug (50 forløb/md) | Margin |
|----------|-----------------|------------------------------|--------|
| CF Workers | 100.000 req/dag | ~600 req/dag | 166x |
| CF Workers AI | 10.000 neurons/dag* | ~5.000 neurons/dag | 2x |
| CF KV | 100.000 reads/dag | ~2.000 reads/dag | 50x |
| Supabase | 500 MB database | ~50 MB | 10x |
| Supabase | 50.000 rows | ~15.000 rows | 3x |
| GitHub Pages | Ubegrænset | Statisk site | ∞ |

*\*Neurons er Cloudflare's enhed for AI-forbrug. 10.000/dag rækker til ~300 Llama-8B-kald med korte prompts.*

**Safeguard ved neuron-grænse:** Hvis Workers AI-kvoten er opbrugt, falder systemet automatisk tilbage til regelbaseret extraction + template-svar (se sektion 4.6).

---

## 2. Datamodel (Supabase / PostgreSQL)

### 2.1 ER-diagram

```
organisations 1──* forloeb 1──* sessions 1──* messages
                                    │
                                    └──* extracted_keywords
                                    └──* theme_scores
                                    └──* progress_snapshots
```

### 2.2 Tabeller

```sql
-- Eksisterende tabel (beholdes som den er)
-- organisations (id UUID, navn TEXT, kode TEXT UNIQUE, oprettet TIMESTAMPTZ)

-- Eksisterende tabel (udvides)
ALTER TABLE public.forloeb
  ADD COLUMN IF NOT EXISTS aktiv_rolle TEXT DEFAULT 'skoleleder',
  ADD COLUMN IF NOT EXISTS samlet_progress SMALLINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_summary JSONB DEFAULT '{}';

-- NY: Sessions — én per samtaleforløb
CREATE TABLE public.sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  forloeb_id    TEXT        NOT NULL REFERENCES public.forloeb(id),
  source        TEXT        NOT NULL CHECK (source IN ('website', 'app', 'forloeb')),
  rolle         TEXT        CHECK (rolle IN ('skoleleder', 'ledelsesteam', 'bestyrelse')),
  trin          SMALLINT,   -- 1-6, NULL for frit chatbot-spørgsmål
  mode          TEXT        CHECK (mode IN ('forberedelse', 'beslutning', 'opfolgning')),
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  ended_at      TIMESTAMPTZ,
  message_count SMALLINT    DEFAULT 0,
  context_blob  JSONB       DEFAULT '{}'  -- akkumuleret kontekst fra sessionen
);
CREATE INDEX idx_sessions_forloeb ON public.sessions(forloeb_id);

-- NY: Messages — hver besked i en session
CREATE TABLE public.messages (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID        NOT NULL REFERENCES public.sessions(id),
  role          TEXT        NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content       TEXT        NOT NULL,
  tokens_in     SMALLINT,
  tokens_out    SMALLINT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_session ON public.messages(session_id, created_at);

-- NY: Extracted Keywords — nøgleord fra brugerens egne svar
CREATE TABLE public.extracted_keywords (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID        NOT NULL REFERENCES public.sessions(id),
  message_id    UUID        REFERENCES public.messages(id),
  keyword       TEXT        NOT NULL,
  category      TEXT,       -- 'tema', 'problem', 'maal', 'handling', 'person', 'struktur'
  weight        REAL        DEFAULT 1.0,
  trin          SMALLINT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_keywords_session ON public.extracted_keywords(session_id);
CREATE INDEX idx_keywords_forloeb ON public.extracted_keywords(session_id, keyword);

-- NY: Theme Scores — temaklassifikation per session
CREATE TABLE public.theme_scores (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID        NOT NULL REFERENCES public.sessions(id),
  forloeb_id    TEXT        NOT NULL REFERENCES public.forloeb(id),
  theme         TEXT        NOT NULL,
  score         REAL        NOT NULL,  -- 0.0 – 1.0
  evidence      TEXT[],     -- brugerens egne formuleringer
  trin          SMALLINT,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, theme)
);
CREATE INDEX idx_themes_forloeb ON public.theme_scores(forloeb_id, theme);

-- NY: Progress Snapshots — progression per forløb/trin
CREATE TABLE public.progress_snapshots (
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
```

### 2.3 RLS-politikker

```sql
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "session_access" ON public.sessions
  FOR ALL TO anon
  USING (
    forloeb_id IN (
      SELECT id FROM public.forloeb
      WHERE org_id IN (SELECT id FROM public.organisations)
    )
  );

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "message_access" ON public.messages
  FOR ALL TO anon
  USING (session_id IN (SELECT id FROM public.sessions));

-- Keywords, Themes, Progress: Tilsvarende cascade via forloeb_id/session_id
```

---

## 3. Backend-flow

### 3.1 Request lifecycle

```
Klient → Worker → Route → Handler → Pipeline → Response

1. CORS-check (origin whitelist)
2. Auth-check (org_kode + session_token fra header)
3. Route til handler baseret på path
4. Handler kører AI-pipeline
5. Persist resultater i Supabase
6. Returner response til klient
```

### 3.2 Chat-handler (hovedflow)

```javascript
// Pseudokode: ChatHandler — Cloudflare Workers AI

async function handleChat(request, env, ctx) {
  const { session_id, message, source, rolle, trin, mode } = await request.json()

  // 1. Hent session-kontekst
  const session = await supabase.from('sessions').select('*').eq('id', session_id).single()
  const history = await supabase.from('messages')
    .select('role, content')
    .eq('session_id', session_id)
    .order('created_at')
    .limit(20)

  // 2. Hent forløbskontekst (carry-forward fra tidligere trin)
  const priorInsights = await supabase.from('progress_snapshots')
    .select('trin, key_insights, carry_forward')
    .eq('forloeb_id', session.forloeb_id)
    .eq('rolle', rolle)
    .lt('trin', trin)
    .order('trin')

  // 3. Hent temaer for forløbet
  const themes = await supabase.from('theme_scores')
    .select('theme, score, evidence')
    .eq('forloeb_id', session.forloeb_id)
    .gte('score', 0.3)
    .order('score', { ascending: false })
    .limit(10)

  // 4. Hent nøgleord fra denne session
  const keywords = await supabase.from('extracted_keywords')
    .select('keyword, category, weight')
    .eq('session_id', session_id)
    .order('weight', { ascending: false })
    .limit(20)

  // 5. Byg system prompt
  const systemPrompt = buildSystemPrompt({
    source, rolle, trin, mode, priorInsights, themes, keywords
  })

  // 6. Kald Cloudflare Workers AI
  const model = selectModel(source)
  const response = await env.AI.run(model, {
    messages: [
      { role: 'system', content: systemPrompt },
      ...history.data.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ],
    max_tokens: selectMaxTokens(source),
    temperature: 0.7
  })

  // 7. Persist brugerbesked + AI-svar
  await supabase.from('messages').insert([
    { session_id, role: 'user', content: message },
    { session_id, role: 'assistant', content: response.response }
  ])

  // 8. Kør extraction pipeline (asynkron)
  ctx.waitUntil(
    extractionPipeline(env, session_id, session.forloeb_id, message, trin, rolle)
  )

  // 9. Returner svar
  return jsonResponse({ reply: response.response, session_id })
}
```

### 3.3 Extraction pipeline — hybrid AI + regelbaseret

Kerneinnovation: extraction kører som **hybrid** — regelbaseret først (gratis, instant), AI-beriget derefter (hvis neuron-kvote tillader).

```javascript
async function extractionPipeline(env, sessionId, forloebId, userMsg, trin, rolle) {
  // Fase 1: Regelbaseret (altid, instant, gratis)
  const ruleKeywords = extractKeywordsRule(userMsg, trin)
  const ruleThemes = classifyThemesRule(userMsg)

  await persistKeywords(sessionId, ruleKeywords, trin)
  await persistThemes(sessionId, forloebId, ruleThemes, trin)

  // Fase 2: AI-beriget (hvis kvote tillader)
  try {
    const aiKeywords = await extractKeywordsAI(env, userMsg, trin)
    const aiInsights = await extractInsightsAI(env, userMsg, trin)

    // Merge: AI-keywords supplerer regel-keywords (dedupliker)
    await mergeKeywords(sessionId, aiKeywords, trin)
    await updateProgress(forloebId, rolle, trin, sessionId, aiInsights)
  } catch (e) {
    // Workers AI kvote opbrugt — regel-extraction er allerede persisteret
    console.log('AI extraction skipped:', e.message)
    // Fallback: beregn progress fra beskedlængde alene
    await updateProgressRule(forloebId, rolle, trin, sessionId, userMsg)
  }
}
```

---

## 4. AI-logik

### 4.1 Context Assembly — intelligent genbrug af data

Systemprompten bygges dynamisk. Identisk logik uanset om AI-backend er Workers AI eller andet:

```javascript
function buildSystemPrompt({ source, rolle, trin, mode, priorInsights, themes, keywords }) {

  // Basisidentitet (altid med)
  let prompt = SYSTEM_IDENTITY  // Tone, regler, terminologi

  // VIGTIGT for Llama: Eksplicit instruktion om dansk sprog
  prompt += `\n\nDu SKAL svare på dansk. Al output er på dansk.`

  // Tilføj modelkontekst (trin-specifik)
  if (trin) {
    prompt += `\n\n## Aktuelt trin: ${TRIN_NAVNE[trin-1]} (Trin ${trin}/6)`
    prompt += `\nKernespørgsmål: "${TRIN_SPØRGSMÅL[trin-1]}"`
    prompt += `\nKontekst: ${TRIN_KONTEKST[trin-1]}`
    if (mode) {
      prompt += `\nMode: ${mode}`
      prompt += `\nGuidespørgsmål: ${TGUIDE[mode][trin-1].join(' | ')}`
    }
  }

  // Tilføj erkendelser fra tidligere trin (carry-forward)
  if (priorInsights?.length > 0) {
    prompt += `\n\n## Kontekst fra tidligere trin`
    prompt += `\nBrug dette aktivt — henvis til brugerens egne ord og erkendelser:`
    for (const snap of priorInsights) {
      prompt += `\n\nTrin ${snap.trin} (${TRIN_NAVNE[snap.trin-1]}):`
      if (snap.key_insights?.length) {
        prompt += `\n  Erkendelser: ${snap.key_insights.join('; ')}`
      }
      if (snap.carry_forward?.length) {
        prompt += `\n  Videreført: ${snap.carry_forward.join('; ')}`
      }
    }
  }

  // Tilføj temaer (tværgående mønstre)
  if (themes?.length > 0) {
    prompt += `\n\n## Identificerede temaer i dette forløb`
    prompt += `\nDisse temaer er fremtrædende baseret på brugerens input:`
    for (const t of themes) {
      prompt += `\n- ${t.theme} (styrke: ${(t.score * 100).toFixed(0)}%)`
      if (t.evidence?.length) {
        prompt += ` — brugerens ord: "${t.evidence[0]}"`
      }
    }
  }

  // Tilføj brugerens nøgleord (eget sprog)
  if (keywords?.length > 0) {
    prompt += `\n\n## Brugerens eget sprog`
    prompt += `\nBrug disse ord og vendinger aktivt i dine svar:`
    const grouped = groupBy(keywords, 'category')
    for (const [cat, kws] of Object.entries(grouped)) {
      prompt += `\n  ${cat}: ${kws.map(k => k.keyword).join(', ')}`
    }
  }

  // Kilde-specifik instruktion
  if (source === 'website') {
    prompt += `\n\n## Kontekst: Hjemmesidechatbot`
    prompt += `\nKort, skærpende, max 150 ord. Stil ét opfølgende spørgsmål.`
    prompt += `\nHenvis til relevant side på strategiskskole.dk hvis relevant.`
  } else if (source === 'app') {
    prompt += `\n\n## Kontekst: Tirsdag kl. 10-appen`
    prompt += `\nDu er procesguide i appen. Vær konkret og handlingsorienteret.`
    prompt += `\nHenvis til proceskortets spørgsmål. Foreslå beslutninger og handlinger.`
  } else if (source === 'forloeb') {
    prompt += `\n\n## Kontekst: Digitalt procesforløb`
    prompt += `\nFacilitér et dybt refleksionsforløb. Stil skærpende spørgsmål.`
    prompt += `\nBrug brugerens egne ord. Byg videre på tidligere trin.`
  }

  return prompt
}
```

### 4.2 Keyword Extraction — hybrid tilgang

**Fase 1: Regelbaseret (altid kører, 0 cost)**

```javascript
// Regelbaseret keyword extraction — kører ALTID, ingen AI-afhængighed
function extractKeywordsRule(userMessage, trin) {
  const keywords = []
  const msg = userMessage.toLowerCase()

  // 1. N-gram extraction: Find substantiv-fraser (2-4 ord)
  //    Simpel heuristik: ord mellem tegnsætning der ikke er stopord
  const STOPORD = new Set([
    'jeg', 'vi', 'det', 'den', 'de', 'er', 'var', 'har', 'have', 'at',
    'og', 'i', 'på', 'med', 'for', 'til', 'fra', 'om', 'som', 'en',
    'et', 'ikke', 'men', 'der', 'kan', 'skal', 'vil', 'også', 'så',
    'når', 'hvad', 'hvor', 'hvordan', 'hvorfor', 'noget', 'nogen',
    'alle', 'meget', 'mere', 'bare', 'helt', 'godt', 'rigtig',
    'faktisk', 'egentlig', 'lidt', 'tror', 'synes', 'mener'
  ])

  const sentences = msg.split(/[.!?;]/).filter(s => s.trim().length > 10)
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/)
    const contentWords = words.filter(w => !STOPORD.has(w) && w.length > 2)

    // Bigrammer og trigrammer fra indholdsbærende ord
    for (let i = 0; i < contentWords.length; i++) {
      if (contentWords[i + 1]) {
        keywords.push({
          keyword: `${contentWords[i]} ${contentWords[i + 1]}`,
          category: 'auto',
          weight: 0.5
        })
      }
    }
  }

  // 2. Kategorisér via ordlister
  const CATEGORY_PATTERNS = {
    problem: /stress|konflikt|udfordr|svært|problem|frustr|presset|overbelast|sygemelding|opsigel/,
    struktur: /struktur|møde|koordin|ansvar|rolle|fordeling|organiser|ramme|system/,
    maal: /mål|ønsk|vision|vil gerne|drøm|ambitio|strategi|retning|priorit/,
    handling: /beslut|gør|handling|skridt|næste|implementer|ændre|igangsæt/,
    person: /leder|lærer|bestyrelse|forældre|elev|medarbejder|team|kollega/,
    tema: /kultur|identitet|tillid|kommunikation|samarbejde|udvikling|forandring/
  }

  for (const kw of keywords) {
    for (const [cat, pattern] of Object.entries(CATEGORY_PATTERNS)) {
      if (pattern.test(kw.keyword)) {
        kw.category = cat
        kw.weight = 0.7
        break
      }
    }
  }

  // 3. Udtræk direkte citater (sætninger med "jeg/vi" + verbum)
  const directQuotes = sentences.filter(s =>
    /\b(jeg|vi)\s+(tror|mener|oplever|føler|ser|tænker|har|synes)\b/.test(s.trim())
  )
  for (const quote of directQuotes) {
    keywords.push({
      keyword: quote.trim().slice(0, 80),  // Max 80 tegn
      category: 'citat',
      weight: 0.9  // Høj vægt — brugerens egne ord
    })
  }

  // Deduplicer og returner top 10
  return deduplicateKeywords(keywords).slice(0, 10)
}
```

**Fase 2: AI-beriget (kører når kvote tillader)**

```javascript
async function extractKeywordsAI(env, userMessage, trin) {
  const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: `Du er en dansk tekst-analysator. Udtræk nøgleord fra brugerens besked.
        Returner KUN et JSON-array, intet andet.
        Format: [{"keyword": "...", "category": "tema|problem|maal|handling|person|struktur", "weight": 0.0-1.0}]
        Fokusér på brugerens EGNE formuleringer, ikke generiske termer.
        Max 5 nøgleord. Svar KUN med JSON.` },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 200,
    temperature: 0.3  // Lav temperatur for struktureret output
  })

  try {
    return JSON.parse(result.response)
  } catch {
    return []  // Ugyldigt JSON — ignorer
  }
}
```

### 4.3 Theme Classification — regelbaseret med AI-boost

**Taksonomi og pattern-matching:**

```javascript
const THEME_TAXONOMY = {
  'ledelsesidentitet': {
    patterns: /ledelsesidentitet|hvem er jeg som leder|min rolle|lederrolle|personlig ledelse|lederstil/,
    related: ['personlig', 'identitet', 'rolle', 'autoritet', 'legitimitet']
  },
  'strategisk retning': {
    patterns: /strategisk retning|vision|mission|retning|kurs|mål|prioriter|fokus/,
    related: ['strategi', 'retning', 'prioritet', 'vision', 'mål']
  },
  'mødekultur': {
    patterns: /mødekultur|møder|dagsorden|beslutning i møde|mødestruktur|referater/,
    related: ['møde', 'dagsorden', 'beslutning', 'drøftelse', 'referat']
  },
  'medarbejdermodstand': {
    patterns: /modstand|forandring.*modstand|skepti|ikke med|bremseklods|uenig/,
    related: ['modstand', 'skeptisk', 'uenig', 'bremse', 'forandring']
  },
  'kommunikation': {
    patterns: /kommunikation|dialog|information|budskab|tydelig|utydelig|formidl/,
    related: ['kommunikation', 'dialog', 'budskab', 'tydelig', 'formidling']
  },
  'bestyrelsessamarbejde': {
    patterns: /bestyrelse|governance|bestyrelsesform|bestyrelses/,
    related: ['bestyrelse', 'governance', 'formandsrolle', 'generalforsamling']
  },
  'tidspres': {
    patterns: /tid.*pres|travl|har ikke tid|overvældet|for mange|kapacitet/,
    related: ['tid', 'pres', 'travlt', 'kapacitet', 'overbelastning']
  },
  'forandringstræthed': {
    patterns: /træt|udbrændt|forandrings.*træt|endnu en|projekt.*træt|opgivenhed/,
    related: ['træthed', 'udbrændt', 'opgivelse', 'forandringstræt']
  },
  'delegation': {
    patterns: /delegat|uddelegere|fordel.*ansvar|give.*ansvar|slippe.*kontrol/,
    related: ['delegation', 'ansvar', 'fordeling', 'kontrol', 'tillid']
  },
  'faglig ledelse': {
    patterns: /faglig ledelse|didaktik|undervisning|pædagogisk|faglighed/,
    related: ['faglig', 'didaktisk', 'pædagogisk', 'undervisning', 'læringsmål']
  },
  'relationsarbejde': {
    patterns: /relation|tillid|samarbejde|konflikthåndtering|trivsel|psykologisk tryghed/,
    related: ['relation', 'tillid', 'samarbejde', 'konflikt', 'trivsel']
  },
  'strukturel uklarhed': {
    patterns: /uklar|hvem gør hvad|rolle.*uklar|ansvar.*uklar|forvirr|mangler struktur/,
    related: ['uklarhed', 'rolle', 'ansvar', 'struktur', 'forvirring']
  },
  'prioritering': {
    patterns: /priorit|vælge.*fra|fokus|sige nej|afgræns|for mange bolde/,
    related: ['prioritering', 'afgrænsning', 'fokus', 'fravalg', 'bolde']
  },
  'forankring i praksis': {
    patterns: /forankr|praksis|hverdag|tirsdag kl|implementer|fasthold|vedligehold/,
    related: ['forankring', 'praksis', 'hverdag', 'implementering', 'fastholdelse']
  },
  'personlig ledelsesudvikling': {
    patterns: /personlig udvikling|lederudvikling|refleksion|coaching|sparring|selvindsigt/,
    related: ['udvikling', 'refleksion', 'sparring', 'coaching', 'indsigt']
  }
}

function classifyThemesRule(userMessage) {
  const msg = userMessage.toLowerCase()
  const results = []

  for (const [theme, config] of Object.entries(THEME_TAXONOMY)) {
    let score = 0

    // Direkte pattern match → høj score
    if (config.patterns.test(msg)) {
      score += 0.5
    }

    // Relaterede ord → inkrementel score
    const relatedHits = config.related.filter(word => msg.includes(word))
    score += relatedHits.length * 0.15

    // Cap score ved 1.0
    score = Math.min(1.0, score)

    if (score >= 0.3) {
      // Find evidence: den sætning der matchede bedst
      const sentences = msg.split(/[.!?]/).filter(s => s.length > 10)
      const evidence = sentences.find(s =>
        config.patterns.test(s) || config.related.some(w => s.includes(w))
      ) || ''

      results.push({ theme, score: Math.round(score * 100) / 100, evidence: evidence.trim() })
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 4)
}
```

### 4.4 Progression tracking

```javascript
async function updateProgress(forloebId, rolle, trin, sessionId, aiInsights) {
  const { data: existing } = await supabase.from('progress_snapshots')
    .select('*')
    .eq('forloeb_id', forloebId)
    .eq('rolle', rolle)
    .eq('trin', trin)
    .single()

  // Beregn dybde-score baseret på antal interaktioner
  const { count } = await supabase.from('messages')
    .select('id', { count: 'exact' })
    .eq('session_id', sessionId)

  const depthScore = Math.min(1.0, (count || 0) * 0.15)

  await supabase.from('progress_snapshots').upsert({
    forloeb_id: forloebId,
    rolle,
    trin,
    status: depthScore >= 0.6 ? 'i-gang' : 'ikke-startet',
    depth_score: depthScore,
    key_insights: [
      ...(existing?.key_insights || []),
      ...(aiInsights?.insights || [])
    ].slice(-10),
    carry_forward: aiInsights?.carry_forward || existing?.carry_forward || []
  }, { onConflict: 'forloeb_id,rolle,trin' })
}

// Fallback uden AI — bruger regelbaseret insight extraction
async function updateProgressRule(forloebId, rolle, trin, sessionId, userMessage) {
  const { count } = await supabase.from('messages')
    .select('id', { count: 'exact' })
    .eq('session_id', sessionId)

  const depthScore = Math.min(1.0, (count || 0) * 0.15)

  // Simpel insight extraction: tag sætninger med "jeg/vi + verbum"
  const insights = userMessage
    .split(/[.!?]/)
    .filter(s => /\b(jeg|vi)\s+(har|ser|oplever|tror|mener|vil)\b/i.test(s))
    .map(s => s.trim().slice(0, 100))
    .slice(0, 3)

  await supabase.from('progress_snapshots').upsert({
    forloeb_id: forloebId,
    rolle,
    trin,
    status: depthScore >= 0.6 ? 'i-gang' : 'ikke-startet',
    depth_score: depthScore,
    key_insights: insights
  }, { onConflict: 'forloeb_id,rolle,trin' })
}
```

**AI-beriget insight extraction (når kvote tillader):**

```javascript
async function extractInsightsAI(env, userMessage, trin) {
  const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: `Du er en dansk refleksionsanalytiker.
        Udtræk 1-3 centrale erkendelser fra beskeden i konteksten af
        Tirsdag kl. 10-modellen®, Trin ${trin} (${TRIN_NAVNE[trin-1]}).
        Returner KUN JSON: {"insights": ["..."], "carry_forward": ["..."]}
        insights = hvad brugeren har erkendt
        carry_forward = hvad der er vigtigt at huske i næste trin
        Svar KUN med JSON.` },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 200,
    temperature: 0.3
  })

  try {
    return JSON.parse(result.response)
  } catch {
    return { insights: [], carry_forward: [] }
  }
}
```

### 4.5 Model-valg per kilde

| Kilde | Model | Max tokens | Neurons* | Begrundelse |
|-------|-------|------------|----------|-------------|
| `website` (chatbot) | `@cf/meta/llama-3.1-8b-instruct` | 250 | ~15 | Hurtig, kortere svar, lavt forbrug |
| `app` (procesguide) | `@cf/meta/llama-3.1-8b-instruct` | 400 | ~20 | Balance mellem dybde og forbrug |
| `forloeb` (refleksion) | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | 600 | ~50 | Dybere refleksion, bedre dansk |
| Extraction (keywords) | `@cf/meta/llama-3.1-8b-instruct` | 150 | ~10 | Struktureret output |
| Extraction (insights) | `@cf/meta/llama-3.1-8b-instruct` | 150 | ~10 | Struktureret output |

*\*Neuron-estimater er ca. tal. 10.000 neurons/dag ≈ 200-300 kald med 8B-modellen.*

```javascript
function selectModel(source) {
  return source === 'forloeb'
    ? '@cf/meta/llama-3.3-70b-instruct-fp8-fast'  // Dybere refleksion
    : '@cf/meta/llama-3.1-8b-instruct'              // Hurtig, billig
}

function selectMaxTokens(source) {
  switch (source) {
    case 'website': return 250
    case 'app':     return 400
    case 'forloeb': return 600
    default:        return 300
  }
}
```

### 4.6 Fallback: Template-svar når AI-kvote er opbrugt

```javascript
// Hvis Workers AI returnerer 429 (rate limited), faldt systemet til template-svar
const FALLBACK_TEMPLATES = {
  1: { // Spejling
    forberedelse: [
      'Hvad er det, du faktisk ser ske i hverdagen lige nu?',
      'Hvis du skulle beskrive situationen for en kollega — hvad ville du sige?',
      'Hvad er det vigtigste at have overblik over inden næste skridt?'
    ],
    beslutning: [
      'Hvad er I enige om at kalde den aktuelle situation?',
      'Hvad er den fælles forståelse I vil arbejde ud fra?'
    ],
    opfolgning: [
      'Hvad har ændret sig siden sidst?',
      'Hvad er ikke ændret — og hvad siger det?'
    ]
  },
  2: { // Klarhed
    forberedelse: [
      'Hvad er problemet bag det problem, du ser?',
      'Hvad er du usikker på, som bør drøftes?'
    ],
    // ... tilsvarende for alle trin og modes
  }
  // ... trin 3-6
}

function getFallbackResponse(trin, mode, messageIndex) {
  const templates = FALLBACK_TEMPLATES[trin]?.[mode] || []
  const idx = messageIndex % templates.length
  return templates[idx] || 'Fortæl mere om hvad du ser i den konkrete situation.'
}
```

---

## 5. Teknologistak

| Lag | Teknologi | Pris | Begrundelse |
|-----|-----------|------|-------------|
| **Frontend — hjemmeside** | Statisk HTML/JS (GitHub Pages) | Gratis | Eksisterende |
| **Frontend — app** | Next.js 15 / React 19 / Tailwind 4 | Gratis | Eksisterende tk10-app |
| **Frontend — forløb** | Embedded HTML eller Next.js route | Gratis | Del af tk10-app |
| **API Gateway** | Cloudflare Workers (Free) | Gratis | 100k req/dag |
| **AI / LLM** | Cloudflare Workers AI (Free) | Gratis | 10k neurons/dag, Llama 3 |
| **Database** | Supabase Free Tier | Gratis | 500 MB, 50k rows |
| **Cache** | Cloudflare KV (Free) | Gratis | 100k reads/dag |
| **Auth** | Org-kode + session-token | Gratis | Ingen ekstern tjeneste |
| **Monitoring** | Supabase Dashboard + CF Analytics | Gratis | Inkluderet |

### Samlet pris

| Post | Pris |
|------|------|
| Cloudflare Workers Free | 0 kr. |
| Cloudflare Workers AI Free | 0 kr. |
| Cloudflare KV Free | 0 kr. |
| Supabase Free Tier | 0 kr. |
| GitHub Pages | 0 kr. |
| **Total** | **0 kr./md** |

### Hvornår rammer vi grænsen?

Workers AI's 10.000 neurons/dag er den strammeste grænse. Med nuværende arkitektur:

- 1 chatbesked = ~15-50 neurons (afhængigt af model)
- 1 extraction = ~10 neurons
- 1 forløbs-session (5 beskeder) = ~150 neurons

**Kapacitet: ~50-60 samtidige forløbs-sessions per dag.** Rigeligt til MVP og de første 50 organisationer. Ved behov skaleres til Cloudflare Workers Paid ($5/md) med 10x kapacitet — men det er V2.

---

## 6. MVP-version

### 6.1 Scope: Hvad bygges først

**MVP = Fælles chat-endpoint med hybrid extraction og session-persistering.**

| Feature | MVP | V2 | V3 |
|---------|-----|----|----|
| Unified `/api/chat` endpoint | X | | |
| Session-oprettelse og -persistering | X | | |
| Beskedhistorik (messages-tabel) | X | | |
| Regelbaseret keyword extraction | X | | |
| Carry-forward mellem trin | X | | |
| Source-specifik system prompt | X | | |
| Template-fallback ved kvote-grænse | X | | |
| AI-beriget keyword extraction | X | | |
| AI-beriget theme classification | | X | |
| Progress depth scoring med AI | | X | |
| Admin dashboard (tema-oversigt) | | | X |
| PDF-rapport pr. forløb | | | X |
| Realtime sync (Supabase Realtime) | | | X |

### 6.2 MVP-implementeringsplan

```
Uge 1:  Database — Kør SQL-migrationer i Supabase
        Worker — Ny worker med /api/chat, /api/session
        Workers AI — Opsæt AI-binding i wrangler.toml
        Test — Chatbot via Workers AI med dansk prompt

Uge 2:  Extraction — Regelbaseret keywords + AI-boost
        Carry-forward — Context assembly med priorInsights
        Fallback — Template-svar når kvote er opbrugt
        Integration — Opdater chatbot.js til ny worker

Uge 3:  App-integration — Opdater tk10-app til /api/chat
        Forløb — Tilslut digitalt-forloeb.html til /api/chat
        Test — End-to-end flow med alle tre klienter

Uge 4:  Tuning — Justér system prompts for Llama (dansk kvalitet)
        Edge cases — Timeout-håndtering, fejlhåndtering, retry
        Deploy — Produktion på Cloudflare Workers
```

### 6.3 Filstruktur (Worker)

```
ai-engine-worker/
├── src/
│   ├── index.js              ← Entry point, routing
│   ├── handlers/
│   │   ├── chat.js           ← ChatHandler (hovedflow)
│   │   ├── session.js        ← SessionHandler (opret/hent)
│   │   └── progress.js       ← ProgressHandler (status)
│   ├── ai/
│   │   ├── prompt-builder.js ← buildSystemPrompt()
│   │   ├── workers-ai.js     ← env.AI.run() wrapper + fallback
│   │   ├── extraction.js     ← Regelbaseret + AI keyword extraction
│   │   └── fallback.js       ← Template-svar og regel-extraction
│   ├── data/
│   │   ├── supabase.js       ← Supabase client
│   │   ├── model.js          ← TRIN_NAVNE, TGUIDE, TAXONOMY
│   │   └── system-prompt.js  ← Basis system prompt
│   └── utils/
│       ├── auth.js           ← Org-kode validering
│       ├── cors.js           ← CORS middleware
│       └── rate-limit.js     ← KV-baseret rate limiting
├── wrangler.toml             ← AI-binding konfiguration
└── package.json
```

### 6.4 wrangler.toml

```toml
name = "ai-engine-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"

[[kv_namespaces]]
binding = "CACHE"
id = "xxxxx"

[vars]
SUPABASE_URL = "https://xxxxx.supabase.co"
ALLOWED_ORIGINS = "https://strategiskskole.dk"

# Secrets (sættes via `wrangler secret put`):
# SUPABASE_ANON_KEY
```

---

## 7. Konkret brugerflow — eksempel

### Scenarie: Skoleleder Mette, Trin 1 (Spejling), digitalt forløb

**Trin A — Session starter**

```
POST /api/session
{
  "forloeb_id": "abc-123",
  "source": "forloeb",
  "rolle": "skoleleder",
  "trin": 1,
  "mode": "forberedelse"
}
→ { "session_id": "sess-789" }
```

**Trin B — Første besked**

```
POST /api/chat
{
  "session_id": "sess-789",
  "message": "Vi har haft tre lærere der er gået ned med stress det seneste halvår,
               og jeg har svært ved at sætte ord på hvad det egentlig handler om."
}
```

AI-motoren gør nu:

1. **Context assembly**: Trin 1 (Spejling), mode=forberedelse, ingen priorInsights (første trin), ingen keywords endnu.

2. **Prompt build**: System prompt inkluderer Spejling-kontekst + guidespørgsmål fra TGUIDE + `Du SKAL svare på dansk.`

3. **Workers AI response** (Llama 70B, forløb-kontekst):

> "Tre lærere på et halvt år — det er et mønster, ikke et tilfælde. Inden vi leder efter løsninger: Hvad er det, du faktisk ser ske i hverdagen, når du kigger på de tre situationer? Var der noget fælles i det, de stod i — opgaver, relationer, forventninger?"

4. **Hybrid extraction** (asynkron):
   - Regelbaseret (instant):
     - Keywords: `["tre lærere" (person, 0.7), "gået ned med stress" (problem, 0.7)]`
     - Themes: `[{theme: "strukturel uklarhed", score: 0.3}]`
   - AI-beriget (Llama 8B):
     - Keywords: `["stresssygemeldinger" (problem, 0.9), "svært at sætte ord på" (problem, 0.7)]`
     - Insights: `["Oplever mønster i stresssygemeldinger men mangler sprog for årsagen"]`
   - Merged resultat: 4 keywords + 1 tema + 1 insight

**Trin C — Opfølgende besked**

```
POST /api/chat
{
  "session_id": "sess-789",
  "message": "De var alle tre i inklusionsopgaver. Jeg tror det handler om at vi
               ikke har en klar struktur for hvem der gør hvad når det bliver svært."
}
```

Nu hentes carry-forward data:

1. **Keywords** fra forrige besked: "stresssygemeldinger", "tre lærere", "svært at sætte ord på"
2. **Themes** "strukturel uklarhed" har score 0.3 (regel) + ny match → opdateret til 0.65
3. System prompten inkluderer brugerens eget sprog + temaer

4. **AI response** bruger aktivt Mettes egne ord:

> "Du siger 'ikke en klar struktur for hvem der gør hvad når det bliver svært' — det er en præcis observation. Inklusionsopgaven ender ofte hos den enkelte lærer, men den er sjældent en soloopgave. Hvem i dit ledelsesteam har ansvar for at koordinere, når inklusionen presser?"

**Trin D — Mette går videre til Trin 2 (Klarhed)**

Ny session oprettes. Context assembly henter automatisk fra progress_snapshots:

```
## Kontekst fra tidligere trin

Trin 1 (Spejling):
  Erkendelser: Oplever mønster i stresssygemeldinger; Inklusionsopgaver som fælles stressfaktor
  Videreført: Inklusionsopgaver som fælles stressfaktor; Manglende koordineringsstruktur
```

AI åbner Trin 2 med reference til Trin 1:

> "I Spejlingen fandt du et mønster: tre stressramte lærere, alle i inklusionsopgaver, og en manglende struktur for hvem der gør hvad. Nu handler det om at gå dybere: Er det inklusionen i sig selv — eller er det måden, I som ledelsesteam fordeler ansvar og opfølgning på?"

---

## 8. API-kontrakt

### POST /api/session

```typescript
// Request
{
  forloeb_id: string
  source: 'website' | 'app' | 'forloeb'
  rolle?: 'skoleleder' | 'ledelsesteam' | 'bestyrelse'
  trin?: number       // 1-6
  mode?: 'forberedelse' | 'beslutning' | 'opfolgning'
}

// Response
{
  session_id: string
  welcome_message?: string  // Kun for forløb-source
}
```

### POST /api/chat

```typescript
// Request
{
  session_id: string
  message: string
  source: 'website' | 'app' | 'forloeb'
}

// Response
{
  reply: string
  session_id: string
  keywords?: string[]       // Kun returneret til app-klienten
  theme_hint?: string       // Fremhævet tema, kun til forløb-klienten
  fallback?: boolean        // true hvis template-svar blev brugt
}
```

### GET /api/progress/:forloeb_id

```typescript
// Response
{
  forloeb_id: string
  roller: {
    skoleleder: TrinProgress[]
    ledelsesteam: TrinProgress[]
    bestyrelse: TrinProgress[]
  }
  top_themes: { theme: string, score: number }[]
  total_sessions: number
}

type TrinProgress = {
  trin: number
  status: 'ikke-startet' | 'i-gang' | 'afsluttet'
  depth_score: number
  key_insights: string[]
}
```

---

## 9. Migrationsstrategi fra nuværende arkitektur

### Nuværende tilstand

- `chatbot-worker.js`: Enkelt CF Worker, Anthropic Claude API (hardcodet nøgle), inline system prompt, ingen persistering
- `tk10-app`: localStorage-baseret, ingen AI-integration, ingen @supabase/supabase-js
- `digitalt-forloeb.html`: Statisk HTML, ingen backend

### Migrationsskridt

1. **Deploy ny Worker** som `ai-engine-worker` med Workers AI binding (eksisterende chatbot kører parallelt)
2. **Fjern hardcodet Anthropic API-nøgle** — ingen ekstern API-afhængighed mere
3. **Opdater chatbot.js** til at kalde `/api/session` ved åbning og `/api/chat` per besked — fallback til gammel worker hvis fejl
4. **Tilføj `@supabase/supabase-js`** til tk10-app (`npm install @supabase/supabase-js`)
5. **Byg AI-panel** i tk10-app som kalder `/api/chat` med `source: 'app'`
6. **Opdater digitalt-forloeb.html** med embedded chat-widget der kalder `/api/chat` med `source: 'forloeb'`
7. **Kør begge workers** i 2 uger, monitér kvalitet og neuron-forbrug
8. **Skift DNS** når ny worker er stabil

---

## 10. Sikkerhed og skalerbarhed

### Sikkerhed

- **Ingen eksterne API-nøgler** — Workers AI kører internt i Cloudflare, ingen faktureringsrisiko
- **Ingen brugerdata i Worker-kode** — alt i Supabase med RLS
- **Supabase-nøgler** som Cloudflare Worker secrets (`wrangler secret put`)
- **Rate limiting** via Cloudflare KV: 30 req/min per session, 200 req/dag per org
- **Input sanitering**: Max 2000 tegn per besked, strip HTML
- **Ingen PII i keywords/themes** — extraction-prompten instruerer AI til at anonymisere

### Skalerbarhed

| Grænse | Free Tier | Paid ($5/md) | Paid ($25/md) |
|--------|-----------|--------------|---------------|
| Workers requests | 100k/dag | 10M/md | 10M/md |
| Workers AI neurons | 10k/dag | 100k/dag | 100k/dag |
| Supabase storage | 500 MB | 8 GB | 8 GB |
| KV reads | 100k/dag | 10M/md | 10M/md |

**Skaleringssti:** Start gratis → $5/md når 50+ daglige sessions → $25/md (Supabase Pro) når 500+ organisationer. Arkitekturen ændrer sig ikke — kun konfiguration.

### Monitoring

- **Neuron-forbrug**: Cloudflare Dashboard → Workers AI → Usage (tjek dagligt i MVP-fase)
- **Fallback-rate**: Log `fallback: true` i messages-tabellen — alert hvis >20%
- **Latency**: CF Analytics per route
- **Database**: Supabase Dashboard → row count, storage
