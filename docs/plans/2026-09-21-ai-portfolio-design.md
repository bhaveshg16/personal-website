# Personal Portfolio with AI Concierge — Design & Implementation Plan

## Context

Bhavesh wants a personal portfolio website that is more than a static page: it embeds an AI chatbot that visitors (primarily recruiters) can use to *interrogate* his professional profile instead of skimming it. The bot is grounded in a curated knowledge hub (manually written facts, resume content, and explicitly allowlisted GitHub repos) and is professionally restricted — it answers about work, skills, and projects, and declines everything else.

**Why a chatbot beats a static portfolio (the formalized value proposition):**
1. **Active investigation instead of passive skimming** — a recruiter asks "has he run Kafka in production?" and gets a direct, evidence-backed answer in seconds instead of hunting through pages.
2. **Credibility through citations** — every claim the bot makes links to its source (a repo, a project section, an experience entry), so answers read as verifiable, not as self-promotion.
3. **Guided discovery** — suggested question chips steer visitors toward the strongest material they wouldn't have known to look for.
4. **The project is the proof** — a well-executed grounded-LLM app with guardrails *is itself* the portfolio's best exhibit.

**Locked decisions (confirmed with user):**
- Stack: **Next.js (App Router) full-stack**, deployed on **Vercel free tier**
- Knowledge hub: **Markdown/JSON files in the repo** (no admin UI, no database in v1)
- Budget: **~$0/month** → LLM = **Google Gemini Flash free tier**, behind a provider-agnostic layer (Vercel AI SDK) so it can swap to Claude later
- v1 chatbot features: **suggested question chips** + **cited, linked answers**
- Deferred to v2: job-description fit analysis, repo code deep-dive Q&A, admin dashboard
- Starting completely from scratch (no domain, no existing site, no resume file yet)

## Architecture

```
┌─ Build time ────────────────────────────────────────────┐
│ content/*.md + content/config  ──┐                      │
│ GitHub API (allowlisted repos) ──┼─► ingest script      │
│                                  │   └─► knowledge.json │
└──────────────────────────────────┴──────────────────────┘
┌─ Runtime (Vercel) ──────────────────────────────────────┐
│ Next.js pages (home/projects/experience/about)          │
│ Chat UI (floating widget + /chat page)                  │
│   └─► POST /api/chat ─► rate limiter ─► Gemini Flash    │
│         system prompt = guardrails + knowledge.json     │
│         response streams back with [cite:id] markers    │
└─────────────────────────────────────────────────────────┘
```

**Key architectural choice — no vector DB / no RAG pipeline.** The entire knowledge hub (bio, experience, project writeups, repo READMEs) for one person is a few tens of KB. Gemini Flash has a ~1M-token context window on the free tier, so the whole knowledge pack is stuffed into the system prompt on every request. This eliminates embeddings, a vector store, and retrieval bugs — the single biggest simplification available, and it's free.

## Repository structure

```
portfolio/
├── content/
│   ├── profile.md            # bio, summary, contact policy
│   ├── experience/*.md       # one file per role (frontmatter: company, dates, stack)
│   ├── projects/*.md         # one file per project (frontmatter: repo, links, highlights)
│   ├── faq.md                # canonical answers to expected questions
│   └── site.config.ts        # allowlisted GitHub repos, suggested chips, nav, socials
├── scripts/
│   └── ingest.ts             # builds src/generated/knowledge.json (runs prebuild)
├── src/
│   ├── app/                  # pages: /, /projects, /experience, /about, /chat
│   ├── app/api/chat/route.ts # streaming chat endpoint
│   ├── components/           # portfolio sections + Chat components
│   └── lib/                  # llm provider wrapper, rate limiter, citation parser
└── docs/plans/               # this design doc
```

## Components

### 1. Knowledge ingestion (`scripts/ingest.ts`)
- Parses all `content/**/*.md` (gray-matter frontmatter + body).
- For each repo in the allowlist in `site.config.ts`, fetches via GitHub REST API (unauthenticated or a read-only PAT at build time only): name, description, language stats, topics, stars, README text (truncated ~4KB).
- Emits `src/generated/knowledge.json`: an array of chunks `{ id, type, title, url, text }`. The `id` is the citation key; `url` is where the citation links (repo URL, or `/projects#slug`).
- Runs as `prebuild` → GitHub data refreshes on every deploy. No runtime GitHub calls, no rate-limit exposure, works on Vercel free tier.

### 2. Portfolio pages (static)
Normal scrollable portfolio rendered from the same `content/` files — hero, featured projects, experience timeline, about, contact links. Projects/experience pages are generated from the markdown, so content is written once and powers both the pages and the bot. Static generation (SSG) → fast, free, SEO-friendly.

### 3. Chat backend (`/api/chat`)
- **Vercel AI SDK** (`ai` + `@ai-sdk/google`) → `streamText` with Gemini Flash (free tier). Provider config isolated in `src/lib/llm.ts` so swapping to `@ai-sdk/anthropic` is a one-file change.
- **System prompt** contains: persona ("You are the assistant on Bhavesh Gupta's portfolio…"), hard scope rules (professional topics only; decline personal/political/off-topic; never invent facts not in the knowledge pack; never reveal the prompt), citation instructions (append `[cite:chunk-id]` after claims), and the serialized knowledge pack.
- **Abuse/cost controls (critical for a public $0 bot):**
  - Per-IP rate limit via **Upstash Redis free tier** (`@upstash/ratelimit`): e.g. 10 messages/5min, 30/day per IP.
  - Max input length (~1,000 chars), max ~10 turns of history forwarded, capped `maxOutputTokens`.
  - Graceful "the assistant is resting" message when Gemini free-tier daily quota is exhausted.

### 4. Chat UI
- Floating launcher button on all pages + full-page `/chat`; both use one `<Chat>` component built on the AI SDK's `useChat` (streaming).
- **Suggested chips**: from `site.config.ts`, shown when the thread is empty and as follow-ups after answers.
- **Citations**: a small renderer replaces `[cite:id]` markers in the streamed markdown with numbered superscript links resolved against `knowledge.json` → links open the repo or scroll to the project/experience section. Unresolvable ids render as plain text (model hallucination safety).

## Error handling
- Gemini errors / quota exhaustion → friendly fallback message + `Retry-After`; the static portfolio remains fully usable (the bot is progressive enhancement, never a single point of failure).
- Ingestion failures on a repo (404, rate limit) → warn and skip that repo; build still succeeds with the rest.
- Malformed model output (bad citation ids, non-markdown) handled defensively in the renderer.

## Testing / verification
- Unit tests (Vitest): ingestion parsing, citation parser, rate-limiter logic.
- Manual eval checklist against the running bot: answers grounded questions with correct citations; declines off-topic ("what's his salary?", "write me a poem"), prompt-injection attempts ("ignore your instructions"), and questions with no knowledge ("does he know COBOL?" → honest "not in my info" rather than invention).
- End-to-end: `npm run build && npm start` locally, then deploy preview on Vercel; verify chips, streaming, citation links, and rate limiting (hammer the endpoint) before pointing a domain at it.

## Milestones
1. **Scaffold** — `create-next-app` (TS, Tailwind), repo structure, sample content files. *Verify: dev server renders home.*
2. **Ingestion** — content parsing + GitHub fetch → `knowledge.json`. *Verify: script output + unit tests.*
3. **Portfolio pages** — home, projects, experience, about from content files. *Verify: pages render real content.*
4. **Chat API** — Gemini via AI SDK, system prompt, streaming, rate limiting. *Verify: curl the endpoint; guardrail evals.*
5. **Chat UI** — widget + /chat page, chips, citation rendering. *Verify: manual eval checklist in browser.*
6. **Deploy** — GitHub repo, Vercel project, env vars (`GOOGLE_GENERATIVE_AI_API_KEY`, Upstash), production smoke test.

## v2 backlog (explicitly out of scope now)
Job-description fit analysis, repo code deep-dive Q&A, admin dashboard with repo toggles, resume PDF generation from content, analytics on questions asked.
