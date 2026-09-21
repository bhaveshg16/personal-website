---
id: proj-ai-portfolio
title: AI-Powered Portfolio (this site)
repo: ""
link: "/"
stack: [Next.js, TypeScript, Vercel AI SDK, Gemini]
featured: true
order: 1
---

This website itself. A Next.js portfolio with an embedded AI assistant that
answers visitor questions about Bhavesh, grounded in a curated knowledge pack
(profile, experience, projects, and allowlisted GitHub repos) compiled at build
time.

Highlights:

- No vector database: the whole knowledge pack fits in the model's context,
  eliminating a RAG pipeline entirely.
- Every answer cites its source — claims link back to the repo or page section
  that backs them.
- Guardrailed for professional topics only, with per-visitor rate limiting so a
  public LLM endpoint stays within a $0 budget.
