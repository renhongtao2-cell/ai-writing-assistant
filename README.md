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

## Tech Stack

- Next.js 15 (Pages Router) + React 19
- OpenAI-compatible chat completions API (agnes relay / any endpoint)
- Optional: Google Gemini via `@google/genai`

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

\* At least one provider key is required.

## Deploy

Deploy to Vercel or any Node host. Set the env vars above — the app needs no
database. See `architecture.svg` for the request flow.

## License

MIT — see [LICENSE](./LICENSE).
