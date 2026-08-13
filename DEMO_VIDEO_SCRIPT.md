# Demo Video Script — Pixel Forge AI Hackathon (≤3 min)

> No cloud-vendor requirement — just show Scriba working as an AI writing assistant.
> English narration (or English captions). Screen-record + voiceover.

## 0:00–0:15  Intro
- Screen: Scriba homepage (live URL or localhost:3000)
- Narration: "Scriba is an AI writing assistant that helps you generate, optimize, and summarize text through three simple modes."

## 0:15–0:55  Generate
- Screen: Generate tab → type a rough idea → click → watch output → Copy
- Narration: "Pick Generate, give it one rough idea, and it co-writes a complete piece with you."

## 0:55–1:35  Optimize
- Screen: Optimize tab → paste messy text → show polished result
- Narration: "Optimize acts as your editor and cleans up messy copy."

## 1:35–2:10  Summarize
- Screen: Summarize tab → paste a long article → show key points
- Narration: "Summarize distills long text into the key points."

## 2:10–2:40  How the AI works (vendor-neutral)
- Screen: open `pages/api/generate.js`, highlight the OpenAI-compatible `fetch` + the system-prompt swap
- Narration: "Under the hood Scriba calls any OpenAI-compatible LLM through a small API route — no vendor lock-in."

## 2:40–3:00  Wrap
- Narration: "Scriba — an AI writing assistant built for the Pixel Forge AI Hackathon."

## Recording tips
- Generate English voiceover with `edge-tts` (Aria voice), then mux with `ffmpeg`.
- Upload to YouTube as **Public** (or a streamable link) and paste the URL into the Devpost submission.
