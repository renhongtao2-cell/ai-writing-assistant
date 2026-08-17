# Hack Hydra 录制脚本（照着录 · 旁白后加 · v2 无 F12 版）

> **怎么用**：打开录屏 → 按下面时间轴操作 → 不用念英文（旁白 ren老大 之后用 TTS 合成）。
> 总时长目标 **1:30–2:30**（≤3:00）。
> 前置：`npm run dev` 跑起来，浏览器开 **http://localhost:3000**，`.env.local` 有 `OPENAI_API_KEY` + `HYDRADB_API_KEY`。
> **v2 改动**：不用 F12 了（HydraDB 请求在服务端发出，浏览器 Network 抓不到）。改为界面上现成的绿色 **🧠 HydraDB Memory 徽章** 直接证明集成。

---

## ⏱ 时间轴（对着录）

| 时间 | 操作 | 要点 / 对应旁白 |
|------|------|----------------|
| **0:00–0:15** | 打开 localhost:3000，停留展示 Scriba 主界面（Generate / Optimize / Summarize 三标签 + 顶部 "Powered by agnes + HydraDB · Hack Hydra 2026"）。鼠标点一下标签制造动态 | 让评委看清产品与主题。对应旁白【Intro】 |
| **0:15–0:45** | 切 **Generate**，输入框写：`Write a product pitch. Keep it short, punchy, and conversational — no corporate fluff.` → 点 **Generate** → 等结果 → **向下滚动，停在那条绿色「🧠 HydraDB Memory」徽章上**，念/展示「this interaction saved ✓」 | 第一段会话：设偏好 + 写入记忆。对应旁白【First session】 |
| **0:45–1:00** | 不操作，停在结果页约几秒（你本机索引几秒就好，无需硬等 30s） | 让记忆落库 |
| **1:00–1:15** | **Ctrl+R 刷新页面**；停顿展示「页面已重载、输入框为空、记忆徽章消失」 | ⭐ **生死点①：必须刷新**，证明跨会话 |
| **1:15–1:45** | 仍 Generate，输入全新任务：`Write a slogan for a new cold-brew coffee.`（**绝口不提偏好**）→ 点 **Generate** → 结果出现后**滚动到绿色徽章**，展示「recalled 1 past interaction(s) → personalizing tone」+ 输出明显简短口语 | ⭐ **生死点②：跨会话召回**，demo 核心。对应旁白【Second session】 |
| **1:45–2:15** | 鼠标**指一下绿色徽章**，口播/字幕解释：召回了上次偏好、本次也写回 HydraDB（database: default-tenant） | 证明真集成 HydraDB，无需 F12。对应旁白【Under the hood】 |
| **2:15–2:30** | 回到主界面，自然停留 2 秒 → **停止录制** | 收尾。对应旁白【Close】 |

---

## 🚨 两大生死点（录前默念）
1. **刷新页面**（1:00 那步）—— 不刷新 = 同会话上下文，评委判假。
2. **第二次生成后绿色徽章显示「recalled N past interaction(s)」** —— 不显示 = 召回证据缺失（刷新后徽章应在第二次结果里出现）。

## ✅ 录完交付
- 存为 **`demo_hydra_raw.mp4`**，放 `E:\xiangmu\tuiguang\ai-writing-assistant\`
- 跟 ren老大说「视频好了」→ 我跑 `add_narration.py`：edge-tts 生成英文旁白 + ffmpeg 合成 → 输出 `demo_hydra_final.mp4`
- 你上传 YouTube 设 **Public**，链接填进 internshala 表单

## 🔎 自检清单
- [ ] 第二次结果上方绿色徽章写「recalled 1 past interaction(s) → personalizing tone」
- [ ] 第一段结果上方徽章写「this interaction saved ✓」
- [ ] 总时长 ≤ 3:00，画面无别账号/隐私
- [ ] 文件命名 `demo_hydra_raw.mp4`
