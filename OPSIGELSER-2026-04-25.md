# Opsigelser — Strategiskskole.dk
**Dato:** 2026-04-25 · **Mål:** Ingen aktive betalingsaftaler ud over domæne.

---

## 🎯 SAMLET LISTE — alt der rør website + app

Jeg har skannet: kodebase (alle 60+ filer), package.json (3 stk), Cloudflare worker secrets (4 stk), Vercel API (env vars + domains + integrations + storage), git-historik (38 commits), live deployerede endpoints, DNS/MX-records, og alle HTML-sider for tredjeparts scripts.

### Resultat:

| # | Tjeneste | Status | Action |
|---|----------|--------|--------|
| 1 | **Vercel** (Hobby) | ✅ Gratis bekræftet via API | Ingen |
| 2 | **Cloudflare Workers** (`strategi-chat`) | ✅ Free bekræftet via wrangler | Ingen |
| 3 | **Cloudflare D1** (`strategiskskole-ai`) | ✅ Free (2.4 MB) | Ingen |
| 4 | **GitHub Pages** (website) | ✅ Gratis altid | Ingen |
| 5 | **Microsoft Clarity** (`wepwurhvb7`) | ✅ Gratis altid | Ingen |
| 6 | **Google Tag Manager / GA4** (`G-G141P75SPZ`) | ✅ Gratis altid | Ingen |
| 7 | **LinkedIn Insight Tag** | ✅ Gratis altid | Ingen |
| 8 | **Google Fonts / cdnjs** | ✅ Gratis altid | Ingen |
| 9 | 🔴 **Anthropic API** (`ANTHROPIC_API_KEY`) | **AKTIV NØGLE i Cloudflare** | **Opsig + slet kort** |
| 10 | 🟡 **Groq API** (`GROQ_API_KEY`) | Aktiv nøgle (gratis tier mulig) | Opsig + slet kort |
| 11 | 🟡 **Formspree** (`xlgadeyb`) | Bruges på `kontakt.html` — gratis op til 50/md | Tjek plan |
| 12 | 🟡 **Supabase** (tk10-app) | Bruges via `NEXT_PUBLIC_SUPABASE_URL` | Tjek plan |
| 13 | 🟡 **one.com** (mail-host for `@strategiskskole.dk`) | MX peger på one.com | **Bevares hvis du vil have email** ELLER opsig |
| 14 | 🟡 **Domæne `strategiskskole.dk`** | Sandsynligvis hos one.com | **BEVARES** (auto-renew ON) |
| 15 | 🟡 **Canva Pro** (Brand Kit `kAEw2ybOvuw`) | Sandsynligvis Pro | Opsig |
| 16 | 🟡 **OpenAI / ChatGPT Plus** | Ukendt | Tjek |
| 17 | 🟡 **GitHub Copilot** | Ukendt | Tjek |
| 18 | 🟡 **Google Workspace / One** | Ukendt | Tjek |
| 19 | 🟡 **Microsoft 365** | Ukendt | Tjek |

### Forklaring på status-ikoner:
- ✅ **Bekræftet gratis** af mig via API/CLI — du behøver ikke gøre noget
- 🔴 **Aktivt betalt og bruges af koden** — skal opsiges + kort slettes
- 🟡 **Kan ikke bekræftes uden login** — du skal tjekke

---

## 🤖 Det jeg HAR gjort (automatisk)

### 1. Bekræftet gratis via API
- ✅ Vercel: `plan:hobby`, `cancelation:null`, `excessBillingEnabled:false`, 0 storage stores, 0 integrations
- ✅ Vercel project `strategiskskole-vite`: 0 env vars, 2 domains (gratis subdomain + custom)
- ✅ Cloudflare Workers + D1 + KV (tom) + R2 (deaktiveret) — alle Free
- ✅ Live worker svarer `{"ai":"workers-ai","db":"d1"}` — bruger Workers AI gratis

### 2. Skannet kode
- ✅ 0 payment-SDK'er (stripe/paypal/mobilepay/etc.) i hele repoet
- ✅ Alle tredjeparts-scripts kortlagt (ovenfor)
- ✅ Git-historik tjekket — ingen skjulte betalings-integrationer

### 3. Identificeret 🔴/🟡 tjenester der kræver din opsigelse

---

## 🔴 SKAL OPSIGES — Anthropic API (mest kritisk)

**Hvad jeg så:** Cloudflare Worker har secret `ANTHROPIC_API_KEY` + koden i `ai-engine-worker/src/ai/workers-ai.js:10-83` indeholder fald-tilbage til `https://api.anthropic.com/v1/messages` hvis modelChoice er "claude". Live-versionen bruger Workers AI lige nu, men nøglen er aktiv hos Anthropic, og du modtager fakturaer (set i Gmail).

**Opsig her:**
1. **Disable nøglen i Cloudflare først** (forhindrer fakturering hvis kode-flag flipper):
   ```
   npx wrangler secret delete ANTHROPIC_API_KEY --name strategi-chat
   ```
   (Jeg kan gøre dette for dig — sig "slet anthropic-key" så kører jeg det)

2. **Opsig Anthropic-konto:** https://console.anthropic.com/settings/billing
   - Cancel plan
   - Sæt **Auto-recharge OFF**
   - Slet payment method
   - Konto: sandsynligvis `tk@feldballe-friskole.dk` (kvitteringer set i den mail)

**Status:** ☐ wrangler secret slettet  ☐ Anthropic plan opsagt  ☐ kort slettet

---

## 🟡 SKAL TJEKKES — i prioriteret rækkefølge

### 12. Supabase
- Link: https://supabase.com/dashboard/projects
- Konto: `strategiskskole@gmail.com`
- Tjek: Står projekterne på **Free**? (Pro = $25/md)
- Opsig: Project Settings → Billing → Change plan → Free
- ☐

### 11. Formspree (form på kontakt.html)
- Link: https://formspree.io/forms
- Form ID: `xlgadeyb`
- Tjek: Står den på **Free** (50 submissions/md) eller Basic ($10/md)?
- ☐

### 10. Groq API
- Link: https://console.groq.com/settings/billing
- Tjek: Står du på Free, eller har du angivet kort?
- Slet kort, hvis det er der.
- ☐

### 13–14. one.com (domæne + email)
- Link: https://www.one.com/admin (login med kunde-login)
- Konto: ukendt — find login-mail i din inbox eller bank-træk
- **Domæne:** BEVARES — bekræft auto-renew ON
- **Email-hosting (`@strategiskskole.dk`):** koster typisk 20–50 kr/md per postkasse. Vil du beholde mailen? Hvis nej → opsig.
- ☐ Domæne auto-renew ON  ☐ Email-beslutning truffet

### 15. Canva
- Link: https://www.canva.com/account/billing-and-plans
- Konto: `strategiskskole@gmail.com`
- Tjek: Pro/Teams (99 kr/md eller 999 kr/år)
- Opsig: Cancel subscription. Brand Kit beholdes på gratis plan.
- ☐

### 16. OpenAI / ChatGPT Plus
- ChatGPT: https://chatgpt.com/#settings → Manage subscription
- API: https://platform.openai.com/account/billing/overview
- Konto: `ttkjersteins@gmail.com` ELLER `strategiskskole@gmail.com`
- ☐

### 17. GitHub Copilot
- Link: https://github.com/settings/billing/summary
- ☐

### 18. Google Workspace / Google One
- https://admin.google.com → Billing
- https://one.google.com/storage
- ☐

### 19. Microsoft 365
- https://account.microsoft.com/services
- ☐

---

## 💳 Slet betalingskort efter opsigelse

For hver tjeneste der opsiges: **slet kortet** så det ikke kan genaktiveres ved fejl.

| Tjeneste | Slet kort her |
|----------|---------------|
| Anthropic | https://console.anthropic.com/settings/billing → Payment methods |
| Groq | https://console.groq.com/settings/billing |
| OpenAI | https://platform.openai.com/account/billing/payment-methods |
| Canva | https://www.canva.com/account/billing-and-plans |
| GitHub | https://github.com/settings/billing/payment_information |
| Supabase | Project Settings → Billing → Payment methods |
| Formspree | https://formspree.io/account/billing |

---

## 📋 SLUTBEKRÆFTELSE

Når alle ☐ ovenfor er ✅, send mig en besked: **"alle opsagt"**, så markerer jeg filen.

> **"Jeg bekræfter, at jeg har opsagt alle aftaler der kræver økonomisk betaling — undtagen domænet strategiskskole.dk."**

---

## ⚠️ HVAD DER GÅR I STYKKER NÅR DU OPSIGER

- **Anthropic opsiges:** chatbotten på website kører fint videre (live-versionen bruger Workers AI). Men hvis du senere vil aktivere Claude-fallback i koden, virker det ikke.
- **Groq opsiges:** ingen synlig effekt (bruges ikke live).
- **Supabase Pro→Free:** projektet pauser efter 7 dages inaktivitet, ellers fint.
- **Canva Pro→Free:** Brand Kit fungerer stadig på gratis plan.
- **one.com email opsigelse:** mailen `thomas@strategiskskole.dk` STOPPER med at virke. Overvej alternativ (fx Gmail med custom-domæne via Workers eller Cloudflare Email Routing — gratis).

---

## 🔧 Jeg kan også gøre dette for dig (sig til):

- ☐ **"slet anthropic-key"** → jeg kører `wrangler secret delete ANTHROPIC_API_KEY --name strategi-chat`
- ☐ **"slet groq-key"** → jeg kører `wrangler secret delete GROQ_API_KEY --name strategi-chat`
- ☐ **"fjern claude-fald-tilbage"** → jeg redigerer `ai-engine-worker/src/ai/workers-ai.js` så koden aldrig kalder Anthropic
- ☐ **"opsæt cloudflare email routing"** → jeg laver gratis email-forwarding fra `@strategiskskole.dk` til en gmail
