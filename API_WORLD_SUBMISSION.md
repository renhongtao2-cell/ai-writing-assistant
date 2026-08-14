# API World 2026 — Devpost Submission Package

- **Event**: DevNetwork [API + Cloud + AI] Hackathon 2026 (co-located with API World 2026)
- **Deadline**: 2026-09-03, 10:00 AM PT
- **Devpost**: https://api-cloud-ai-hackathon-2026.devpost.com/
- **Format**: Online + In-Person (Santa Clara). Online track = build from anywhere.
- **Eligibility**: **Open to everyone** (no student requirement, no geographic lock).

---

## Copy-paste fields for the Devpost submission form

> Fill the `{{ }}` placeholders with your live URL / repo / video once they exist.

**Project title**
```
Scriba — AI Writing Assistant (API + Cloud + AI)
```

**One-line summary / tagline**
```
A three-mode AI writing assistant that turns rough ideas into publish-ready text, powered by an OpenAI-compatible API in the cloud and optionally grounded by live SerpApi search.
```

**Try it out (live URL)**
```
{{ VERCEL_LIVE_URL }}
```

**Code repository**
```
{{ GITHUB_PUBLIC_URL }}
```

**Video demo**
```
{{ YOUTUBE_OR_STREAMABLE_URL }}
```

**Built with (tags)**
```
Next.js, React, OpenAI API, SerpApi, Vercel, JavaScript
```

---

## Story (paste into the Devpost "Story" sections)

### Inspiration
Most AI writing tools are either locked to one vendor or silent about where the text comes
from. We wanted a writing partner that is (a) vendor-neutral, (b) runs entirely in the
cloud with no setup, and (c) can ground its output in real, current facts instead of
guessing. API World's "API + Cloud + AI" theme was the perfect frame: Scriba is literally
an API-driven, cloud-hosted, AI-powered app.

### What it does
Scriba guides you through the writing lifecycle with three modes:
- **Generate** — co-write a complete piece from a one-line idea.
- **Optimize** — rewrite messy text into clean, professional copy.
- **Summarize** — distill long text into key points.

In Generate mode you can enable **live web grounding**: Scriba queries the SerpApi search
API and cites real sources inline, so drafts are fact-checked, not fabricated.

### How we built it
- **Frontend**: Next.js (Pages Router) + React.
- **AI layer (the API)**: a small serverless route (`/api/generate`) calls any
  **OpenAI-compatible** chat-completions endpoint — here the **agnes** relay — with an
  optional Gemini fallback. Vendor-neutral by design.
- **Cloud (the Cloud)**: deployed as a serverless app on **Vercel**; no database required.
- **Live search (the AI + API)**: `/api/search` calls **SerpApi** when `SERPAPI_API_KEY`
  is set, returning the top 5 results that are injected as grounding context.
- Everything is MIT-licensed and open source.

### Challenges we ran into
Keeping the AI layer truly vendor-neutral while still being trivial to deploy. We solved it
with an env-driven provider swap (agnes / OpenAI / Gemini) and a graceful SerpApi fallback
that degrades to pure-LLM generation when no search key is present.

### Accomplishments that we're proud of
A clean, dependency-light writing assistant that anyone can fork and run with their own
API key in minutes — and a web-grounding feature that makes AI writing citeable.

### What we learned
How little code it takes to wire multiple APIs (LLM + search) into one coherent cloud
experience, and how sponsor APIs (like SerpApi) turn a generic app into a targeted,
prize-eligible submission.

### What's next
- Multi-document grounding and source export.
- More modes (translate, rewrite-for-tone).
- A public API so other tools can embed Scriba's writing pipeline.

---

## Sponsor prize strategy — SerpApi "Best AI Use Case" ($3,000)

This is the highest-value, lowest-effort sponsor prize to target:

- **Prize**: 1st $2,000 (cash + $1,000 SerpApi credit) / 2nd $1,000.
- **Requirement**: genuinely use SerpApi. Scriba's live-web-grounding feature does exactly
  this via `/api/search` → injected into `/api/generate`.
- **To activate**: add `SERPAPI_API_KEY` to your Vercel env (free tier: 100 searches/mo).
  Without it the app still works; with it the "🌐 Ground with live web" toggle produces
  cited, fact-checked drafts — exactly the "Best AI Use Case" story.
- **In the submission**: select the **SerpApi – Best AI Use Case** challenge when you submit,
  and mention the grounding feature in the demo video (see DEMO_VIDEO_SCRIPT.md, 2:25–2:50).

Other sponsor challenges (name.com, Nutrient, Perfect Corp, Doctavian) require their SDKs;
submit to Overall regardless, and add SerpApi for the strong side-prize angle.

---

## Required submission assets — checklist

- [x] Public open-source repo with visible MIT LICENSE → **DONE**
- [x] App runs on an OpenAI-compatible LLM (agnes) → **DONE** (`pages/api/generate.js`)
- [x] Live-web-grounding via SerpApi, env-gated → **DONE** (`pages/api/search.js` + UI toggle)
- [x] README + demo script rewritten for API World → **DONE**
- [ ] **Make the GitHub repo PUBLIC** (Settings → Visibility)
- [ ] **Deploy to Vercel** and get a hosted URL — set env vars below
- [ ] **Add `SERPAPI_API_KEY`** to Vercel (free tier) to enable the sponsor-prize feature
- [ ] **Record a ~3-min demo video** (script: `DEMO_VIDEO_SCRIPT.md`) → YouTube Public / streamable
- [ ] **Fill the Devpost form** using the copy above; select the SerpApi challenge

## Env vars for the live demo (Vercel)
```
OPENAI_API_KEY=<your agnes key>
OPENAI_API_BASE=https://<your agnes endpoint>/v1
OPENAI_MODEL=<model name>
SERPAPI_API_KEY=<your serpapi key>     # enables the $3,000 sponsor-prize feature
# GEMINI_API_KEY=  (optional fallback, not required)
```
