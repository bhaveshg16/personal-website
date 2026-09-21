# AI Portfolio

Personal portfolio website with an embedded AI assistant. Visitors (typically
recruiters) can ask the assistant questions about my work — answers are grounded
in a curated knowledge pack and every claim cites its source.

Design doc: [docs/plans/2026-09-21-ai-portfolio-design.md](docs/plans/2026-09-21-ai-portfolio-design.md)

## How it works

- `content/` holds all facts about me: `profile.md`, `faq.md`, `experience/*.md`,
  `projects/*.md`, and `site.config.ts` (socials, suggested questions, and the
  **allowlist of GitHub repos** the assistant may know about).
- `scripts/ingest.ts` runs before `dev`/`build`: it compiles the content plus
  GitHub repo metadata/READMEs into `src/generated/knowledge.json`.
- `/api/chat` streams answers from Gemini Flash (free tier) via the Vercel AI
  SDK, with the whole knowledge pack in the system prompt — no vector DB.
- The chat UI renders `[cite:id]` markers as numbered links to the evidence.
- Per-visitor rate limiting (Upstash Redis, free tier) keeps the public endpoint
  within a $0 budget.

## Setup

```bash
cp .env.example .env.local   # then fill in GOOGLE_GENERATIVE_AI_API_KEY
npm install
npm run dev
```

Get a free Gemini key at https://aistudio.google.com/apikey.

## Editing your info

1. Edit the markdown in `content/` (files are marked with `EDIT ME`).
2. Add repos to `githubRepos` in `content/site.config.ts` (format `owner/repo`).
3. `npm run ingest` (or just restart dev / redeploy) to rebuild the knowledge pack.

## Commands

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Ingest content, then start the dev server     |
| `npm run build`  | Ingest content, then production build         |
| `npm test`       | Unit tests (Vitest)                           |
| `npm run ingest` | Rebuild `src/generated/knowledge.json` only   |

## Deploy (Vercel)

1. Push to GitHub, import the repo in Vercel.
2. Set env vars: `GOOGLE_GENERATIVE_AI_API_KEY` (required),
   `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (recommended),
   `GITHUB_TOKEN` (optional, build-time only).
3. Deploy — ingestion runs automatically via `prebuild`.
