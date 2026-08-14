# Demo Video Script — API World 2026 [API + Cloud + AI] Hackathon (≤3 min)

> Theme: **API + Cloud + AI**. Show Scriba as (1) an AI writing assistant, (2) wired to a
> cloud-hosted OpenAI-compatible API, (3) grounded by the SerpApi search API, and
> (4) exporting docs through the Nutrient Web SDK.
> English narration (or English captions). Screen-record + voiceover.

## Full English voiceover (read aloud verbatim)

**0:00–0:12 — Intro**
> "Hi, I'm Hongtao. This is Scriba — an AI writing assistant I built for the API World 2026
> Hackathon, the DevNetwork API plus Cloud plus AI challenge. Scriba helps you generate,
> optimize, and summarize text in three simple modes."

**0:12–0:45 — Generate (core AI)**
> "Let's start with Generate. I'll type one rough idea — say, a tagline for a passive-income
> newsletter. With a single click, Scriba co-writes a complete, polished draft with me.
> Behind the scenes this is a cloud API call to an OpenAI-compatible model, so there's
> no vendor lock-in."

**0:45–1:10 — Optimize**
> "Next, Optimize. I'll paste some messy, rambling copy. Scriba acts as my editor and
> rewrites it into clean, professional text — perfect for fixing rough drafts fast."

**1:10–1:35 — Summarize**
> "Then Summarize. I'll drop in a long article, and Scriba distills it into the key points —
> a tight, scannable summary in just seconds."

**1:35–2:00 — API + Cloud + AI story (judges care about this)**
> "Now the part the judges care about: the API, Cloud, and AI theme. Scriba runs as a
> Next.js app on Vercel. Its core calls any OpenAI-compatible LLM through a small
> serverless API route — here, the agnes relay. It's fully cloud-hosted, and I can swap
> providers just by changing one environment variable."

**2:00–2:25 — SerpApi live web grounding (sponsor prize angle)**
> "Here's a sponsor integration. I'll tick 'Ground with live web' — that calls the SerpApi
> search API to pull real Google results, and Scriba fact-checks its draft with cited
> sources in real time. That's our Best Use of SerpApi angle."

**2:25–2:45 — Nutrient PDF export (sponsor prize angle)**
> "And one more: I'll click 'Export as PDF', and Scriba generates a document, then opens it
> in the Nutrient Web SDK viewer — where I can annotate and export it right in the browser.
> That's our Best Use of Nutrient angle, running fully client-side."

**2:45–3:00 — Wrap**
> "Scriba — an AI writing assistant built on APIs, in the cloud, with AI. Three modes, two
> sponsor APIs, zero vendor lock-in. Built for API World 2026."

## Recording tips
- Total ~380 words → at a calm 130–150 wpm this lands at ~2:35–2:55. Stay under 3:00.
- Generate English voiceover with `edge-tts` (Aria voice), then mux with `ffmpeg`.
- Upload to YouTube as **Public** (or a streamable link) and paste the URL into the Devpost submission.
- When submitting on Devpost, tick BOTH sponsor challenges: **SerpApi – Best AI Use Case**
  and **Nutrient – Best Document Use**.
