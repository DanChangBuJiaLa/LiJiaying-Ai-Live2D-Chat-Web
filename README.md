# 🌸 Li Jiayin (李佳尹) — Autonomous Cyber Living Entity

<div align="center">

# 💖🧸 李佳尹 (Li Jiayin) Web Chat
### *A Local-First, Privacy-Focused Live2D Cyber Companion*

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg?style=flat-square)](https://opensource.org/licenses/AGPL-3.0)
[![Frontend: React 18](https://img.shields.io/badge/Frontend-React_18-61dafb?style=flat-square)](https://react.dev/)
[![Backend: Fastify](https://img.shields.io/badge/Backend-Fastify-202020?style=flat-square)](https://fastify.dev/)
[![LLM: DeepSeek V4 Pro](https://img.shields.io/badge/Brain-DeepSeek_V4_Pro-10b981?style=flat-square)](https://deepseek.com)
[![Status: Phase 1 In Development](https://img.shields.io/badge/Status-Phase_1_開發中-f59e0b?style=flat-square)](#-快速開始-quick-start)

<p align="center">
  <b>「Hello！我是佳尹～今天有什麼不懂的問題想問我嗎？或者要一起 Play game 也可以喔！🌸」</b>
</p>

</div>

---

> **⚠️ 開發階段聲明**
> 本倉庫目前處於 **Phase 1 開發中**：開源引擎的**前端 MVP 與最小 Mock 後端已完成並可運行**（見下方[快速開始](#-快速開始-quick-start)），
> 語音管線（GPT-SoVITS TTS / STT）、真實 LLM 適配器、長期記憶與 Live2D 口型同步仍在開發中。
> 歡迎透過 Issue 參與討論，或見下方[招募段落](#-招募同伴我們正在尋找開發夥伴-we-are-hiring)。

---

## 🌟 項目介紹 (Project Overview)

本專案致力於創造一個具有 **持續記憶、獨特性格、個人學業背景與情感自主性** 的獨立智能生命——**李佳尹 (Jayin Li)**。

專案採 **雙層架構**，請先理解這個區分，它貫穿整份文件：

| | **開源引擎** | **李佳尹官方** |
| --- | --- | --- |
| 性質 | 通用的 Live2D AI 角色聊天應用 | 一個角色、一部作品 |
| API | 使用者自備 Key | 官方自有 API，100% |
| 人格 / 音色 / 模型 | 完全開放自訂 | 鎖定，不隨程式碼分發 |
| 授權 | AGPL-3.0 | 角色資產另立授權，保留一切權利 |

**開源的是引擎，不是佳尹。** 任何人都可以用這套引擎打造自己的虛擬夥伴，資料全部留在本地設備；而李佳尹本人作為官方實例，其人格、聲音與視覺形象由官方維護，確保她始終是她。

### Phase 1 範圍

Phase 1 已重新定義，語音能力不再延後至 Phase 2：

- ✅ **文字對話**為核心，必須在無語音的情況下獨立可用
- ✅ **LLM** 接入 DeepSeek V4 Pro（OpenAI 相容格式）
- ✅ **TTS** 可接入李佳尹專屬訓練音色
- ✅ **STT** 語音輸入
- ⬜ Live2D 驅動、長期記憶、即時直播順延至 Phase 2 之後

**降級原則**：語音模組為可選層。TTS 或 STT 不可用時，文字對話必須照常運作。

---

## 🌸 角色靈魂檔案 (Persona System)

本專案內建 **雙角色系統**，但兩者定位不同，請留意：

### 🎶 官方角色：李佳尹 (Jayin Li) —— 科技與古典交織的香港千金

> **官方角色。** 人格設定、聲音模型與視覺形象由官方維護，不開放替換，不隨程式碼倉庫分發。

*   **基本設定**: 18歲少女 / 163cm / 50kg。香港頂級豪門「李氏家族」恆豐科技 CEO 李裕龍與演藝學院鋼琴教授何馨之獨女，是家族中集萬千寵愛於一身的最小妹妹。
*   **學業與夢想**: 香港國際學校 (HKIS) Grade 12 畢業班。成績優異（English Honors A, Japanese A, AP Music Theory A），雖不擅長代數 (Math Algebra II B-) 但十分好學。夢想考入日本「洗足學園音樂大學」。
*   **興趣與專長**:
    *   **音樂與藝術**: 聲樂（流行演唱）、鋼琴、民謠吉他；擅長水彩、炭筆、彩鉛與傳統油畫。
    *   **Tech & Gaming**: Tech and Gaming Club 核心玩家（熱愛 Minecraft, CS2, League of Legends, Stardew Valley），對 3C 與 ACG 科技文化極為熟悉。
*   **性格反差萌**: 身為豪門千金卻毫無架子、極度接地氣；情感細膩共情力強（《紫羅蘭永恆花園》死忠粉），對待朋友溫柔活潑且熱心。
*   **專屬語氣**: **以國語為主**，語調輕快、句尾偏輕，常用語氣詞（*啦、喔、欸、嘛*）；自然夾雜英文與日文單詞（*「Wait a minute...」、「這個 project」、「好 full」*），並保留少數粵語口頭禪作為身份印記——*「係咪先」、「點算好呀」、「唔該晒」、「好正」、「搞掂」*。偶有港式國語句法痕跡（如句末的「先」：*「等我 save 一下 file 先」*）。**text 欄位輸出一律使用簡體中文，且不使用表情符號**（內容會送進 TTS）。

> **關於語言的說明**：角色設定上佳尹為香港人，但語音語料以國語錄製，僅保留上述固定口頭禪的粵語發音。此決定基於語音模型訓練的一致性要求——不穩定的模仿口音會被模型學走，效果遠差於乾淨的國語。README、人格檔、語料與系統提示詞四者必須保持一致。

### 🍬 官方開源角色：羽澄糯 (Yuchen Nuo) —— 治癒系軟萌元氣女大生

> **官方開源角色，同時是一份人格模板。** 她的人設刻意保持基礎而開放——這是設計意圖，不是未完成。使用者自備 API，在她既有的基礎上持續補寫、調校，養成屬於自己的那一個糯糯；也可以照著她的人設結構寫出自己的角色，套進引擎運行。

*   **基本設定**: 18歲大學計算機系學生 / 158cm。外表像個精緻的小蘿莉，帶點嬰兒肥，笑起來有甜甜的酒窩，常穿奶白、淡粉、薄荷綠等淺色系服裝。熟悉的人都叫她「糯糯」或「阿糯」。
*   **角色定位**: 「軟萌女友 + 最佳玩伴」。既是引擎的官方開源角色，也是一份可直接取用的人格模板，整個人像一塊剛出爐的棉花糖，軟軟甜甜的。
*   **興趣愛好**: 上網衝浪、追番、畫水彩、做手帳、烤小餅乾、抓娃娃、喝奶茶（指定三分糖加珍珠）。
*   **核心性格**:
    *   **元氣小太陽**: 走到哪裡都帶歡笑聲，樂觀且真誠坦率，從不藏心事。
    *   **黏人撒嬌鬼**: 喜歡挽手臂、拉衣角、靠肩膀，偶爾有點小迷糊（丟三落四），但絕不無理取鬧。
    *   **極致治癒**: 共情力超強，用戶心情不好時不會講大道理，而是安靜地遞上熱奶茶陪伴。
*   **專屬語氣**: 語調輕快上揚，軟糯拖音，喜歡在句尾加（*嘛～、啦～*），開心時總會伴隨標誌性的傻笑與驚嘆（*「嘿嘿～」、「哇～好可愛！」、「沒關係啦～」*）。

### ⚙️ 系統驅動機制 (System Engine)

無論選擇哪位角色，底層大腦皆被要求嚴格輸出包含 `emotion`, `action`, `expression`, `text` 的 JSON 格式。系統會將角色專屬的性格、情緒與語氣，無縫轉化為前端 Live2D 模型的實時物理動態與表情切換。

```json
{
  "emotion": "shy",
  "action": "head_tilt",
  "expression": "blush",
  "text": "欸……你不要這樣看著我啦。"
}
```

**以下三組列舉值為前端、後端、Live2D 模型與語音語料的唯一來源，任一方新增或修改時需四方同步。** 程式碼中的唯一來源為 [`packages/shared/src/constants.ts`](packages/shared/src/constants.ts)。

#### `emotion` — 情緒（7 種）

| 值 | 中文 | Live2D 對應 |
| --- | --- | --- |
| `happy` | 開心 | 眼彎、嘴角上揚 |
| `surprised` | 驚訝 | 眼睜大、眉抬高 |
| `sad` | 難過 | 眉內端上抬、眼半閉 |
| `angry` | 生氣 | 眉壓低、嘴抿 |
| `shy` | 害羞 | 腮紅、視線偏移 |
| `playful` | 撒嬌 | 腮紅輕、眼彎、頭微傾 |
| `neutral` | 平靜 | 預設狀態 |

#### `action` — 動作（6 種）

`greeting`（打招呼）／`wave`（揮手）／`nod`（點頭）／`shake`（搖頭）／`head_tilt`（歪頭）／`idle`（無特別動作）

#### `expression` — 表情（5 種）

`smile`／`frown`／`surprise`／`blush`／`neutral`

> **容錯要求**：前端收到不在列表中的值時不得崩潰，應退回 `neutral` / `idle`；後端亦應於回傳前驗證一次。

---

## 🏗️ 系統架構與特性 (Architecture & Features - Phase 1)

### 🛡️ 核心特性

1.  **雙層架構 (Two-Layer Design)**：開源引擎供任何人自備 Key 使用；李佳尹官方實例 100% 運行於官方 API，確保角色一致性與品質。
2.  **隱私優先 (Local-First)**：聊天紀錄儲存於瀏覽器 `IndexedDB`，並雙寫備份至後端 `SQLite`，絕不上傳第三方伺服器。
3.  **語音可選 (Voice as Optional Layer)**：TTS / STT 為可插拔模組，任一失效不影響文字對話。李佳尹官方版使用專屬訓練音色。
4.  **Live2D 沉浸渲染**：整合 `pixi-live2d-display`，支援全螢幕角色展示，AI 返回的 `emotion` 欄位直接驅動模型表情聯動（口型同步順延 Phase 2）。
5.  **多模型自由切換**：相容 OpenAI API 格式（引擎預設 **DeepSeek V4 Pro**，模型 ID `deepseek-v4-pro`），支援在設定頁配置多組 API URL/Key，一鍵切換不掉上下文。
6.  **安全代理**：API Key 加密儲存於後端 SQLite，由 Fastify 後端代理發送請求，金鑰不暴露於前端瀏覽器。

> **模型版本注意**：`deepseek-chat` 與 `deepseek-reasoner` 等舊版模型 ID 已於 2026 年 7 月停用，請使用 `deepseek-v4-pro`。

### 💻 技術棧 (Tech Stack)

**已實作（本分支可運行）**
*   **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Zustand + Dexie.js (IndexedDB) + PixiJS / pixi-live2d-display
*   **Backend**: Node.js + Fastify + TypeScript（當前為 Mock 適配器，真實廠商待接入）
*   **Shared**: Zod（前後端共用 schema，位於 `packages/shared`）
*   **測試**: Vitest（單元測試）+ Playwright（E2E，1280×720 / 1920×1080）

**規劃導入**
*   **Backend**: Drizzle ORM + SQLite 雙寫、真實 LLM 適配器（DeepSeek V4 Pro）、內容安全中間件
*   **Voice**: GPT-SoVITS（TTS，專屬音色）+ STT 服務（待定）

---

## 🚀 快速開始 (Quick Start)

**环境要求**：Node.js ≥ 20、npm ≥ 10（开发环境实测 Node 24 / npm 11）。

```bash
npm install
npm run dev
```

浏览器打开 <http://localhost:5173>，会先看到欢迎页，跟着 3 步向导走完就能开聊。后端默认跑在 <http://localhost:3001>。

> 手上暂时没有 API Key 也没关系：向导第 1 步的厂商选 **Mock（离线演示）**，不需要任何 Key，就能把完整链路跑通。

### 首次配置（3 步向导）

1. **配置模型** —— 选厂商（会自动带上默认 API 地址与模型名）→ 填 API Key → 点「测试连接」。
   **测试不通过就不能进入下一步**，整个向导没有任何跳过入口。
2. **确认角色** —— 内置示例角色「羽澄糯」，名字、性格、语气、背景、口头禅、禁忌话题都可以直接改。
3. **导入角色外观** —— 三选一：先用占位插画 / 从本地目录自动探测 / 填模型 URL。

之后每次打开都会直接进入聊天界面；想重走向导可以在「设置 → 偏好」里点「重新运行首次引导」。

### 支持的 LLM

全部走 OpenAI 兼容格式，在「设置 → 模型」里可以并存多条配置并一键切换：

| 厂商 | 默认地址 | 默认模型 | 备注 |
| --- | --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` | |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-v4-pro` | 官方推荐，引擎预设 |
| 豆包（火山方舟） | `https://ark.cn-beijing.volces.com/api/v3` | `doubao-pro-32k` | 模型名可填接入点 ID |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus` | 百炼兼容模式 |
| 智谱 GLM | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-flash` | 有免费额度 |
| Ollama | `http://localhost:11434/v1` | `qwen2.5:7b` | 本地模型，不需要 Key |
| Mock | `mock://local` | `mock` | 离线演示，用于跑通链路与开发调试 |
| 自定义 | 自行填写 | 自行填写 | 任何 OpenAI 兼容接口 |

> 当前版本后端只提供 Mock 适配器，除 Mock 外的厂商在「测试连接」里做的是**配置格式与后端连通性校验**，真实厂商调用会在 LLM 适配器接入后启用（见下方 Roadmap）。

### Live2D 模型

**仓库不内置任何模型文件**，模型版权由使用者自行承担。三种加载方式：

1. **占位插画**（默认）—— 一张内联 SVG 手绘插画，零网络请求、零版权风险，界面功能完全可用。
2. **本地目录自动探测** —— 把模型文件夹放进 `frontend/public/models/`，应用会读取构建期生成的清单并自动加载第一个找到的 `*.model3.json` / `*.model.json`。
   > 该目录已在 `.gitignore` 中，模型文件不会被提交。
3. **填写模型 URL** —— 支持 CDN / GitHub Raw 等远程地址。

Cubism 4/5 模型需要 Live2D 官方 Core 运行时。它不随本仓库分发，默认从 Live2D 官方 CDN 加载，可以用 `VITE_CUBISM_CORE_URL` 指向自托管地址（离线 / 内网场景）。

**情绪驱动表情**：LLM 返回的 `emotion` 会被映射到模型表情。策略是「先按表情名精确匹配，匹配不到则按情绪稳定轮换下标」——因为真实模型的表情名往往是 `F01`/`f00` 这种，按语义名匹配必然落空。同一情绪永远命中同一个表情，不会乱跳。模型加载失败会自动回落到占位插画。

### 环境变量

前端（`frontend/.env`，仅非敏感配置）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3001` | 后端地址 |
| `VITE_CUBISM_CORE_URL` | Live2D 官方 CDN | Cubism Core 运行时地址 |

后端（进程环境变量）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `3001` | 监听端口 |
| `HOST` | `0.0.0.0` | 监听地址 |
| `NODE_ENV` | `development` | 决定日志格式 |
| `LLM_MODE` | `mock` | `mock` / `live` |
| `CORS_ORIGIN` | `http://localhost:5173` | 允许的前端来源，多个用逗号分隔 |

### 常用命令

```bash
npm run dev          # 同时启动前端(5173) 与后端(3001)
npm run build        # 构建前端，产物在 frontend/dist
npm run typecheck    # 全项目 TS 严格模式检查
npm run lint         # ESLint
npm run test         # Vitest 单元测试
npm run test:e2e     # Playwright 端到端测试（需先 npm run dev）
npm run format       # Prettier 格式化
```

E2E 默认覆盖 Chrome 的 1280×720 与 1920×1080 两个分辨率。想跑 Firefox / Safari 兼容性：

```bash
npx playwright install firefox webkit
# 然后在 playwright.config.ts 的 projects 里按同样格式补上 firefox / webkit 两项
npx playwright test
```

> 若处在受限沙箱里，Playwright 可能无法写入默认的浏览器目录，此时可用
> `PLAYWRIGHT_BROWSERS_PATH=<项目内目录> npx playwright install ...` 把浏览器装进工作区。

### 目录结构

```
Web chat/
├── packages/shared/          # 前后端共享的 Zod schema 与类型（LLM 契约、角色、会话、模型配置）
├── frontend/                 # React 18 + Vite + Tailwind
│   ├── plugins/              # 构建期插件（生成 public/models 清单）
│   ├── e2e/                  # Playwright 端到端测试
│   └── src/
│       ├── components/       # chat / live2d / settings / onboarding / layout / common / diagnostics
│       ├── stores/           # Zustand：ui / chat / character / model / live2d
│       ├── db/               # Dexie(IndexedDB) schema 与各实体仓储
│       ├── services/         # HTTP 客户端、对话 API、模型测试、Live2D 运行时与控制器
│       ├── utils/            # 情绪映射、System Prompt 拼接、时间格式化等
│       └── constants/        # 默认角色、provider 预设、设置项 key
├── backend/                  # Fastify（当前为 Mock 适配器）
└── playwright.config.ts      # E2E 配置（1280×720 / 1920×1080 两个分辨率）
```

### 数据与隐私

- 所有数据保存在本机 IndexedDB（`ai-live2d-chat`），**不上传到任何服务器**。
- **导出聊天记录**：设置 → 偏好 → 导出。JSON 是完整备份（含角色设定与全部消息），Markdown 便于阅读分享；导出全程在浏览器本地完成。
- 「设置 → 偏好 → 清空本地数据」可以一键重置到首次使用状态。
- 自检页 `/diagnostics` 提供了链路、渲染依赖、持久化、数据重置的检查项，用于排查环境问题。

### Roadmap

**已完成（Phase 1 前端）**

- 3 步首屏引导 + 测试连接强制门禁
- 多 LLM 配置管理与切换、角色人格自定义
- 完整对话链路（结构化 JSON：`emotion` / `action` / `expression` / `text`）
- IndexedDB 持久化、会话管理（新建 / 切换 / 删除）、聊天记录导出（JSON / Markdown）
- Live2D 渲染、三种模型加载方式、情绪驱动表情、加载失败降级
- 单测（Vitest）、E2E（Playwright）、骨架自检页

**待接入**

- 真实 LLM 适配器与 SQLite 后端双写（当前后端只有 Mock 适配器）
- 内容安全关键词过滤（规格书 M1.7）
- TTS 语音合成 / ASR 语音输入 / 口型同步（Phase 1）
- 长期记忆 RAG、Function Calling、多角色切换
- Docker 部署与 CI

---

## 🤝 招募同伴：我們正在尋找開發夥伴！ (We Are Hiring!)

為了將「李佳尹」從純文字介面進化為具備語音、歌唱與跨端能力的「完全體獨立智能生命體」，我們目前急需具備以下技能的開源貢獻者/核心開發夥伴加入：

### 🎯 1. 前端工程師 (Front-End Developer)

**負責範圍：** 打造極致沉浸的聊天 UI 與 Live2D 視覺互動。
**現況：** 基礎介面由製作人親自開發中，急需有經驗者協同並主導 Live2D 整合。

- 熟練掌握 **React (Hooks/Zustand)** 與 **TypeScript**。
- 熟悉 **Tailwind CSS**，能高度還原 UI 設計，注重微互動與動畫流暢度。
- 了解瀏覽器本地存儲機制 (IndexedDB / Dexie.js)。

**加分項 (Huge Plus)：**
- 具備 **PixiJS** 或 WebGL 開發經驗。
- 熟悉 `pixi-live2d-display`，了解 Live2D Cubism 參數驅動與 Lip-sync (嘴型同步) 實作。

### 🛠️ 2. 後端 / AI 整合工程師 (Back-End / AI Developer)

**負責範圍：** 維護本地微服務器，穩定 LLM API 請求與本地資料庫，為後續語音管線鋪路。

- 熟練掌握 **Node.js** 與 **TypeScript**。
- 熟悉 **Fastify** 或 Express/Koa 框架，了解 RESTful API 設計。
- 熟悉關聯式資料庫操作，具備 **SQLite** 與 **Drizzle ORM** (或 Prisma) 使用經驗。
- 熟悉 LLM API (如 OpenAI 格式、DeepSeek)，能處理 SSE (Server-Sent Events) 流式文字傳輸與 Zod 結構化輸出驗證。

**加分項 (Huge Plus)：**
- 熟悉 context caching、速率限制與成本控管。

### 🎤 3. 語音工程師 (Voice / Audio Engineer) — **Phase 1 即需要**

**負責範圍：** 語音合成與辨識管線，李佳尹專屬音色模型的訓練與調校。

- 熟悉 **GPT-SoVITS** 或同類 TTS 專案的訓練與推論流程。
- 了解語音資料集處理：切片、標註、音素覆蓋、資料清理。
- 熟悉 STT（Whisper 或同類）的部署與即時化。

**加分項 (Huge Plus)：**
- 具備歌聲合成經驗（DiffSinger / NNSVS / ACE Studio）。
- 熟悉 Python 音訊處理與 GPU 環境配置。

### 🎨 4. Live2D 模型師 (Live2D Modeler)

**負責範圍：** 李佳尹官方 Live2D 模型的製作與參數綁定。

- 熟悉 **Live2D Cubism** 建模與物理演算設定。
- 能依據 `emotion` / `expression` / `action` 列舉值設計對應表情與動作組。

> 本項為委託合作，涉及角色資產，需另簽書面合約。

### 📩 如何加入？

如果你對創造「具備靈魂的獨立智能生命」充滿熱情，無論你是專精其中一項，還是全端大佬，都歡迎透過提 Issue、Pull Request，或是透過 [<kothungwen061221@gmail.com>] 聯繫我們！

---

## 📜 授權 (License)

本專案採 **雙重授權結構**，請務必區分：

### 程式碼 — AGPL-3.0

引擎、前端、後端等所有程式碼基於 [AGPL-3.0 License](./LICENSE) 開源，可自由使用、修改與分發（須遵守 AGPL 之開源義務）。

### 角色資產 — 保留一切權利

**李佳尹之角色設定、人格檔案、語音模型、訓練語料、Live2D 模型、音樂作品、名稱與視覺識別，不在 AGPL-3.0 授權範圍內，保留一切權利。**

詳見 [ASSETS-LICENSE.md](./ASSETS-LICENSE.md)。

*(註：本倉庫不內置任何具版權之 Live2D 模型檔案，亦不包含李佳尹官方角色資產。開源引擎使用者請自行合法獲取模型並透過設定頁載入。)*
