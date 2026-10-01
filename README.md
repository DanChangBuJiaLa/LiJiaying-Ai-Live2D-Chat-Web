# Ai-Live2D Chat Web

> 基于 Live2D 的 AI 虚拟角色 Web 聊天应用 | AI Virtual Character Chat with Live2D

一个开源的、**本地数据优先**的二次元 Live2D 虚拟角色聊天应用。用户自备 LLM API Key，角色设定与聊天记录全部留在本机。

| 维度 | 说明 |
| --- | --- |
| 🔒 真·本地优先 | 聊天记录存本机 IndexedDB，不上传任何服务器；API Key 也不进浏览器代码 |
| 🎨 全屏 Live2D 沉浸 | 不是侧边小头像，是全屏角色 + 毛玻璃聊天条，情绪驱动表情联动 |
| 🧩 LLM 自由切换 | 多配置管理，OpenAI / DeepSeek / 豆包 / 通义 / 智谱 / Ollama / Mock 一键切，上下文不丢 |
| 🚀 Clone 即跑 | 3 步向导开聊；没有 Key 就选「Mock 离线演示」先看效果 |
| 📦 Monorepo 工程化 | npm workspaces + TS 严格模式 + Vitest 单测 + Playwright E2E |

---

## 快速开始

**环境要求**：Node.js ≥ 20、npm ≥ 10（开发环境实测 Node 24 / npm 11）。

```bash
npm install
npm run dev
```

浏览器打开 <http://localhost:5173>，会先看到欢迎页，跟着 3 步向导走完就能开聊。后端默认跑在 <http://localhost:3001>。

> 手上暂时没有 API Key 也没关系：向导第 1 步的厂商选 **Mock（离线演示）**，不需要任何 Key，就能把完整链路跑通。

## 首次配置（3 步向导）

1. **配置模型** —— 选厂商（会自动带上默认 API 地址与模型名）→ 填 API Key → 点「测试连接」。
   **测试不通过就不能进入下一步**，整个向导没有任何跳过入口。
2. **确认角色** —— 内置示例角色「羽澄糯」，名字、性格、语气、背景、口头禅、禁忌话题都可以直接改。
3. **导入角色外观** —— 三选一：先用占位插画 / 从本地目录自动探测 / 填模型 URL。

之后每次打开都会直接进入聊天界面；想重走向导可以在「设置 → 偏好」里点「重新运行首次引导」。

## 支持的 LLM

全部走 OpenAI 兼容格式，在「设置 → 模型」里可以并存多条配置并一键切换：

| 厂商 | 默认地址 | 备注 |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | |
| DeepSeek | `https://api.deepseek.com/v1` | 性价比高，推荐先接这个 |
| 豆包（火山方舟） | `https://ark.cn-beijing.volces.com/api/v3` | 模型名可填接入点 ID |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | 百炼兼容模式 |
| 智谱 GLM | `https://open.bigmodel.cn/api/paas/v4` | glm-4-flash 有免费额度 |
| Ollama | `http://localhost:11434/v1` | 本地模型，不需要 Key |
| Mock | `mock://local` | 离线演示，用于跑通链路与开发调试 |
| 自定义 | 自行填写 | 任何 OpenAI 兼容接口 |

> 当前版本后端只提供 Mock 适配器，除 Mock 外的厂商在「测试连接」里做的是**配置格式与后端连通性校验**，真实厂商调用会在 LLM 适配器接入后启用（见下方 Roadmap）。

## Live2D 模型

**仓库不内置任何模型文件**，模型版权由使用者自行承担。三种加载方式：

1. **占位插画**（默认）—— 一张内联 SVG 手绘插画，零网络请求、零版权风险，界面功能完全可用。
2. **本地目录自动探测** —— 把模型文件夹放进 `frontend/public/models/`，应用会读取构建期生成的清单并自动加载第一个找到的 `*.model3.json` / `*.model.json`。
   > 该目录已在 `.gitignore` 中，模型文件不会被提交。
3. **填写模型 URL** —— 支持 CDN / GitHub Raw 等远程地址。

Cubism 4/5 模型需要 Live2D 官方 Core 运行时。它不随本仓库分发，默认从 Live2D 官方 CDN 加载，可以用 `VITE_CUBISM_CORE_URL` 指向自托管地址（离线 / 内网场景）。

**情绪驱动表情**：LLM 返回的 `emotion` 会被映射到模型表情。策略是「先按表情名精确匹配，匹配不到则按情绪稳定轮换下标」——因为真实模型的表情名往往是 `F01`/`f00` 这种，按语义名匹配必然落空。同一情绪永远命中同一个表情，不会乱跳。模型加载失败会自动回落到占位插画。

## 环境变量

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

## 常用命令

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

## 目录结构

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

## 数据与隐私

- 所有数据保存在本机 IndexedDB（`ai-live2d-chat`），**不上传到任何服务器**。
- **导出聊天记录**：设置 → 偏好 → 导出。JSON 是完整备份（含角色设定与全部消息），Markdown 便于阅读分享；导出全程在浏览器本地完成。
- 「设置 → 偏好 → 清空本地数据」可以一键重置到首次使用状态。
- 自检页 `/diagnostics` 提供了链路、渲染依赖、持久化、数据重置的检查项，用于排查环境问题。

## Roadmap

**已完成（Phase 1 前端）**

- 3 步首屏引导 + 测试连接强制门禁
- 多 LLM 配置管理与切换、角色人格自定义
- 完整对话链路（结构化 JSON：`emotion` / `action` / `expression` / `text`）
- IndexedDB 持久化、会话管理（新建 / 切换 / 删除）、聊天记录导出（JSON / Markdown）
- Live2D 渲染、三种模型加载方式、情绪驱动表情、加载失败降级
- 骨架自检页、单测（Vitest）、E2E（Playwright）

**待接入**

- 真实 LLM 适配器与 SQLite 后端双写（当前后端只有 Mock 适配器）
- 内容安全关键词过滤（规格书 M1.7）
- TTS 语音合成 / ASR 语音输入 / 口型同步（Phase 2）
- 多角色切换、Function Calling（Phase 2）
- Docker 部署与 CI（M-F）

## 许可

[AGPL-3.0](./LICENSE)
