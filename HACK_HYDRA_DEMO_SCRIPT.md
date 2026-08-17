# Hack Hydra 2026 — Demo 视频脚本（≤3 分钟）

> 目标赛道：**Memory and Context Retrieval**
> 核心卖点：HydraDB 被「有意义集成」进写作助手的核心记忆功能，agnes 仍作 LLM。
> 录制建议：屏幕录制 + 旁白，语速正常，总时长控制在 2:30–3:00。

---

## 0:00–0:15 开场（15s）
「大家好，我是 Scriba 的作者。Scriba 是一个 AI 写作助手，今天参加 Hack Hydra 的
**Memory and Context Retrieval** 赛道。传统聊天机器人每次刷新就忘了你，而我们用
**HydraDB** 给助手装上了长期记忆——下面用一个真实场景演示。」

## 0:15–0:45 第一次会话：建立记忆（30s）
- 打开 Scriba，输入：「帮我写一段产品文案，要简短有力、口语化、别啰嗦。」
- 等生成结果出现。
- 旁白：「我刚刚交代了一个偏好：简短、口语、不啰嗦。这句话会被 Scriba 写入 HydraDB 的记忆库。」
- 切到代码/网络面板（可选），快速展示 `lib/hydradb.js` 的 `addMemory()` 调用。

## 0:45–1:30 第二次会话：跨会话召回（45s）
- **刷新页面 / 开新会话**（关键！证明不是同一次对话的上下文）。
- 输入一个全新任务：「给咖啡新品想一句 slogan。」——**不重复说任何偏好**。
- 等生成，展示输出明显是「简短、口语、有力」的风格。
- 旁白：「注意，我没再提风格要求，但 Scriba 自动从 HydraDB 召回了上一次的偏好，
  生成结果依旧符合我的写作习惯。这就是记忆检索在起作用。」

## 1:30–2:15 后台原理（45s）
- 打开 `lib/hydradb.js`，指三处：
  1. `retrieveMemories(query)` —— 生成前先从 HydraDB `POST /query` 召回相关记忆。
  2. `addMemory()` —— 生成后把本次交互写入 HydraDB `POST /context/ingest`。
  3. `default-tenant` 记忆库隔离。
- 旁白：「记忆读写都走 HydraDB 云端 API，agnes 只负责生成文本，职责清晰。」

## 2:15–3:00 收尾（45s）
- 旁白：「总结：HydraDB 不是点缀，而是 Scriba 记忆能力的核心后端——
  它被集成进『写作前回忆用户偏好、写作后沉淀偏好』的完整闭环，
  完美命中 Memory and Context Retrieval 赛道。感谢 Hack Hydra，我是 Scriba 作者。」

---

## 录制前自检清单
- [ ] 本地 `npm run dev` 跑通，且 `.env.local` 里有 `HYDRADB_API_KEY`、`OPENAI_API_KEY`
- [ ] 第一次输入偏好后，等 ~30 秒让 HydraDB 异步索引完成（否则第二次检索可能召回为空）
- [ ] 第二次会话务必**刷新页面或新开标签**，证明跨会话
- [ ] 视频导出 ≤3 分钟，含清晰旁白，上传 YouTube 设为公开并复制链接
