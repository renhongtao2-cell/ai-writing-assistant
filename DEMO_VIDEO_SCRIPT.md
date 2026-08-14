# Demo Video Script — API World 2026 [API + Cloud + AI] Hackathon (≤3 min)

> Theme: **API + Cloud + AI**. Show Scriba as (1) an AI writing assistant, (2) wired to a
> cloud-hosted OpenAI-compatible API, (3) optionally grounded by the SerpApi search API.
> English narration (or English captions). Screen-record + voiceover.

## 0:00–0:15  Intro
- Screen: Scriba homepage (live URL or localhost:3000)
- Narration: "Scriba is an AI writing assistant that helps you generate, optimize, and
  summarize text through three simple modes — built for the API World 2026 hackathon."

## 0:15–0:50  Generate (core AI)
- Screen: Generate tab → type a rough idea → click → watch output → Copy
- Narration: "Pick Generate, give it one rough idea, and it co-writes a complete piece with you."

## 0:50–1:25  Optimize
- Screen: Optimize tab → paste messy text → show polished result
- Narration: "Optimize acts as your editor and cleans up messy copy."

## 1:25–1:55  Summarize
- Screen: Summarize tab → paste a long article → show key points
- Narration: "Summarize distills long text into the key points."

## 1:55–2:25  The API + Cloud + AI story (judges care about this)
- Screen: open `pages/api/generate.js`, highlight the OpenAI-compatible `fetch`
- Narration: "Under the hood Scriba calls any OpenAI-compatible LLM — here the agnes relay —
  through a small cloud API route on Vercel. No vendor lock-in."

## 2:25–2:50  Bonus: SerpApi live web grounding (sponsor prize angle)
- Screen: Generate tab → tick "🌐 Ground with live web (SerpApi)" → run → show cited facts
- Narration: "Turn on web grounding and Scriba pulls live results from the SerpApi search API
  to fact-check its draft in real time."

## 2:50–3:00  Wrap
- Narration: "Scriba — an AI writing assistant built on APIs, in the cloud, with AI. For API World 2026."

## Recording tips
- Generate English voiceover with `edge-tts` (Aria voice), then mux with `ffmpeg`.
- Upload to YouTube as **Public** (or a streamable link) and paste the URL into the Devpost submission.
