# Hack Hydra 2026 — Submission Brief (Scriba)

> Track: **Memory and Context Retrieval** · Repo: `renhongtao2-cell/ai-writing-assistant`
> Submission page: https://internshala.com/competitions/hack-hydra-2026-hydradb-10000-prize-pool/
> Deadline: **2026-08-20 23:59 PT** = Beijing 2026-08-21 14:59

## What we built
Scriba is an AI writing partner (Generate / Optimize / Summarize). For Hack Hydra we
gave it **persistent, graph-backed memory** using HydraDB — integrated into the core
writing loop, not bolted on.

### How HydraDB is "meaningfully integrated" (hard requirement ✅)
Every generation in `pages/api/generate.js` now does:
1. **Retrieve** — `POST /query` (`type=memory`) pulls relevant past interactions and
   injects them as `RELEVANT MEMORY FROM PAST SESSIONS` context, so Scriba personalizes
   tone and recalls the user's stated preferences across sessions.
2. **Store** — `POST /context/ingest` (`type=memory`) persists the new interaction so
   future sessions can recall it. HydraDB's `infer:true` extracts structured facts
   ("User prefers concise, punchy writing") into its knowledge graph.

Client: `lib/hydradb.js` (typed fetch wrapper, graceful degradation — memory is an
enhancement, never a hard dependency).

## Why this fits "Memory and Context Retrieval"
- Agent memory is the product's differentiator, not a demo afterthought.
- Demonstrates hybrid retrieval over a memory corpus with graph context.
- Vendor-neutral LLM (agnes / OpenAI-compatible) + HydraDB as the memory substrate.

## How to run
```bash
npm install
# .env.local
# OPENAI_API_KEY=...            # agnes / any OpenAI-compatible
# OPENAI_API_BASE=https://apihub.agnes-ai.com/v1
# OPENAI_MODEL=agnes-2.5-flash
# HYDRA_DB_API_KEY=sk_live_...  # enables memory (Hack Hydra requirement)
npm run dev   # http://localhost:3000
```
Memory is **env-gated**: without `HYDRA_DB_API_KEY` the app still works (stateless).

## Submission checklist
- [x] Public GitHub repo with source + README (setup + license = MIT)
- [x] HydraDB meaningfully integrated (retrieve-before / store-after)
- [ ] Record ≤3 min demo video showing: generate text → it remembers a stated
      preference in a later session (memory retrieval in action)
- [ ] Validate `api.hydradb.com` reachability from the submission network (China:
      test locally — sandbox test passed, China network not yet confirmed)
- [ ] Fill the official internshala submission form (repo + video + form)

## Notes / risks
- HydraDB free plan = single pre-provisioned tenant `default-tenant`; creating a new
  DB returns "accepted" but is not immediately ingestable. We default to `default-tenant`.
- Ingestion is asynchronous (~20–30s to index); retrieval waits for indexing.
- **China network**: `api.hydradb.com` must be reachable from the demo environment.
  Verified reachable + key valid from the build sandbox; confirm from your machine.
