# Scriba — AI Writing Assistant

Scriba is an AI-powered writing partner that guides you through the writing
lifecycle with three agent modes:

- **Generate** — co-create a full piece from a one-line idea
- **Optimize** — rewrite messy text into clean, professional copy
- **Summarize** — distill long text into key points

Built with **Next.js (Pages Router) + React**. The AI layer is **vendor-neutral**:
it calls any **OpenAI-compatible** endpoint (e.g. the agnes relay), with an
optional Google Gemini fallback. No proprietary cloud lock-in.

## How Scriba uses AI

Scriba sends the user's prompt plus a mode-specific system instruction to an
LLM and returns the result. The three modes simply swap the system prompt:

| Mode | Role |
|------|------|
| generate | Collaborative co-writer that expands a rough idea |
| optimize | Professional editor that polishes messy text |
| summarize | Extracts the key points from long text |

Any OpenAI-compatible model works out of the box via environment variables.

### Live web grounding (optional)
In **Generate** mode you can tick **"🌐 Ground with live web (SerpApi)"** to ground the
draft in real-time search results. This calls the SerpApi Google Search API through
`/api/search` and injects the top results as context. It is **env-gated**: set
`SERPAPI_API_KEY` to enable it; without the key the toggle simply does nothing and the
app falls back to pure LLM generation.

### Persistent memory across sessions (HydraDB — Hack Hydra 2026)

Scriba **remembers the user across sessions** via [HydraDB](https://hydradb.com), a
graph-based memory & context-retrieval engine. On every generation it:

1. **Retrieves** relevant past interactions (`POST /query`, `type=memory`) and
   injects them as context, so the writing partner personalizes tone and recalls
   the user's stated preferences.
2. **Stores** the new interaction (`POST /context/ingest`, `type=memory`) so future
   sessions can recall it.

This is the core of our **"Memory and Context Retrieval"** track submission to
**Hack Hydra 2026** (HydraDB $10k open-source hackathon). HydraDB is **meaningfully
integrated into the product's core writing loop**, not bolted on. The integration is
**graceful**: if `HYDRA_DB_API_KEY` is absent or HydraDB is unreachable, Scriba
silently falls back to stateless generation — memory is an enhancement, never a
hard dependency.

See `lib/hydradb.js` for the minimal REST client and `pages/api/generate.js` for the
retrieve-before / store-after wiring.

## Tech Stack

- Next.js 15 (Pages Router) + React 19
- OpenAI-compatible chat completions API (agnes relay / any endpoint)
- Optional: Google Gemini via `@google/genai`
- HydraDB (graph memory & context retrieval) — `lib/hydradb.js`

## Prerequisites

- Node.js 20+
- An OpenAI-compatible API key (e.g. agnes) — set `OPENAI_API_KEY`
- Optional: `GEMINI_API_KEY` for the Gemini fallback

## Local Development

```bash
npm install

# .env.local
# OPENAI_API_KEY=your_key
# OPENAI_API_BASE=https://your-openai-compatible-endpoint/v1   # optional
# OPENAI_MODEL=gpt-3.5-turbo                                    # optional

npm run dev
# http://localhost:3000
```

## Environment Variables

| Var | Required | Default | Notes |
|-----|----------|---------|-------|
| `OPENAI_API_KEY` | yes* | — | Any OpenAI-compatible key |
| `OPENAI_API_BASE` | no | `https://api.openai.com/v1` | Point to agnes or another endpoint |
| `OPENAI_MODEL` | no | `gpt-3.5-turbo` | Model name |
| `GEMINI_API_KEY` | no | — | Optional fallback |
| `SERPAPI_API_KEY` | no | — | Enables live web grounding in Generate mode |
| `HYDRA_DB_API_KEY` | no* | — | Enables cross-session memory via HydraDB |
| `HYDRADB_DATABASE` | no | `default-tenant` | HydraDB database/tenant id |
| `HYDRADB_COLLECTION` | no | `scriba-memory` | Memory collection (sub-tenant) |
| `HYDRADB_BASE_URL` | no | `https://api.hydradb.com` | HydraDB API base |

\* At least one AI provider key is required. `HYDRA_DB_API_KEY` is required only for the memory feature (Hack Hydra 2026).

## Deploy

Deploy to Vercel or any Node host. Set the env vars above. The memory feature
needs only a HydraDB API key — no self-hosted database. See `architecture.svg`
for the request flow.

## License

MIT — see [LICENSE](./LICENSE).
