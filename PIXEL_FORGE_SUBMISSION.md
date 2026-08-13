# Pixel Forge AI Hackathon — Submission Plan

- **Event**: Pixel Forge AI Hackathon (Devpost)
- **Deadline**: 2026-08-22
- **Link**: https://allhackathons.com/hackathon/pixel-forge-ai-hackathon
- **Submit via**: Devpost (create account → join hackathon → submit)

## Why this one (easy win)
- Beginner Friendly, new event, expected **< 500 teams** → low competition
- **8 winning slots** (1st / 2nd / 3rd + 5 Judges Favorite) + participation certificate → easy to place
- No vendor lock; Scriba (ai-writing-assistant) fits the "AI Agent / Assistant" theme with only a minimal provider flip

## Required submission assets
- [x] Public open-source repo with a visible LICENSE → **DONE** (MIT added)
- [x] App runs on an OpenAI-compatible LLM (agnes) → **DONE** (`pages/api/generate.js` flipped to agnes-primary)
- [x] README + demo script rewritten for Pixel Forge (no Google Cloud Run framing) → **DONE**
- [ ] **Make the GitHub repo PUBLIC** (Settings → Visibility) so judges can access it
- [ ] **Deploy a live demo** (Vercel) and get a hosted URL — set the env vars below
- [ ] **Record a ~3-min demo video** (script: `DEMO_VIDEO_SCRIPT.md`) → YouTube Public or streamable link
- [ ] **Fill the Devpost submission form**: description, repo URL, live URL, demo video

## Env vars for the live demo (Vercel)
```
OPENAI_API_KEY=<your agnes key>
OPENAI_API_BASE=https://<your agnes endpoint>/v1
OPENAI_MODEL=<model name>
# GEMINI_API_KEY=  (optional fallback, not required)
```

## Demo video script
See `DEMO_VIDEO_SCRIPT.md`.
