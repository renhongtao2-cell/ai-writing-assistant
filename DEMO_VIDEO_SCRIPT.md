# 录屏脚本（中文说明版）— API World 2026 [API + Cloud + AI]

> 主题：API + Cloud + AI。展示 Scriba 作为 AI 写作助手，接入云端 OpenAI 兼容 API（agnes），并用 SerpApi 联网检索 + Nutrient PDF 导出。
> 视频总时长 ≤ 3 分钟。
> 下面**中文是给你看的说明**，**英文句子是要念出来/展示出来的内容**，直接复制即可。
> （英文旁白音频已生成在 `demo_narration.mp3`，嫌自己念麻烦也可以直接把那段音频当画外音。）

---

## 0:00–0:12  开场
- **演示**：打开 Scriba 首页（live URL `https://ai-writing-assistant-ten.vercel.app` 或本地 `localhost:3000`），录屏。
- **念/展示（英文）**：
  > Hi, I'm Hongtao. This is Scriba — an AI writing assistant I built for the API World 2026 Hackathon, the DevNetwork API plus Cloud plus AI challenge. Scriba helps you generate, optimize, and summarize text in three simple modes.

## 0:12–0:45  Generate（核心 AI）
- **演示**：切到 Generate 标签 → 输入一个粗糙想法（如 passive-income newsletter 的标语）→ 点生成 → 展示输出 → 点 Copy。
- **念/展示（英文）**：
  > Let's start with Generate. I'll type one rough idea — say, a tagline for a passive-income newsletter. With a single click, Scriba co-writes a complete, polished draft with me. Behind the scenes this is a cloud API call to an OpenAI-compatible model, so there's no vendor lock-in.

## 0:45–1:10  Optimize
- **演示**：切到 Optimize 标签 → 粘贴一段乱糟糟的文字 → 展示润色后的结果。
- **念/展示（英文）**：
  > Next, Optimize. I'll paste some messy, rambling copy. Scriba acts as my editor and rewrites it into clean, professional text — perfect for fixing rough drafts fast.

## 1:10–1:35  Summarize
- **演示**：切到 Summarize 标签 → 粘贴一篇长文 → 展示提炼出的要点。
- **念/展示（英文）**：
  > Then Summarize. I'll drop in a long article, and Scriba distills it into the key points — a tight, scannable summary in just seconds.

## 1:35–2:00  API + Cloud + AI 主题（评委看重）
- **演示**：打开 `pages/api/generate.js`，高亮那段 OpenAI 兼容的 `fetch` 调用。
- **念/展示（英文）**：
  > Now the part the judges care about: the API, Cloud, and AI theme. Scriba runs as a Next.js app on Vercel. Its core calls any OpenAI-compatible LLM through a small serverless API route — here, the agnes relay. It's fully cloud-hosted, and I can swap providers just by changing one environment variable.

## 2:00–2:25  SerpApi 联网检索（冲 $3,000 分奖）
- **演示**：回到 Generate 标签 → 勾选「🌐 Ground with live web (SerpApi)」→ 运行 → 展示带 [1][2] 引用的结果。
- **念/展示（英文）**：
  > Here's a sponsor integration. I'll tick 'Ground with live web' — that calls the SerpApi search API to pull real Google results, and Scriba fact-checks its draft with cited sources in real time. That's our Best Use of SerpApi angle.

## 2:25–2:45  Nutrient PDF 导出（冲 $1,500 分奖）
- **演示**：点「📄 Export as PDF」→ 生成文档 → 在 Nutrient 查看器里批注 / 导出。
- **念/展示（英文）**：
  > And one more: I'll click 'Export as PDF', and Scriba generates a document, then opens it in the Nutrient Web SDK viewer — where I can annotate and export it right in the browser. That's our Best Use of Nutrient angle, running fully client-side.

## 2:45–3:00  结尾
- **念/展示（英文）**：
  > Scriba — an AI writing assistant built on APIs, in the cloud, with AI. Three modes, two sponsor APIs, zero vendor lock-in. Built for API World 2026.

---

## 录制要点（中文）
- 总时长控制在 3 分钟内。若直接用 `demo_narration.mp3` 当旁白，音频已 2:10，对着画面放就行。
- 配音两种选法：① 直接用我生成的 `demo_narration.mp3`（最省事，Aria 英文女声）② 自己照上面英文句念（更自然）。
- 上传 YouTube 设 **Public**，链接贴进 Devpost 提交。
- Devpost 提交时**两个 sponsor 挑战都要勾**：`SerpApi – Best AI Use Case` 和 `Nutrient – Best Document Use`。
- 录完把视频发我（或丢进 `demo_raw\` 目录），回"合成"，我用 `merge_voiceover.py` 把旁白合进去出成品 mp4。
