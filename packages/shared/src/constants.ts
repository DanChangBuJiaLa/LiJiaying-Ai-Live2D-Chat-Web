/**
 * 全局常量：情绪 / 表情 / 动作 / LLM 厂商
 * 这些枚举是 LLM 结构化输出契约的一部分（见 项目规格说明书 3.3）。
 */

/** LLM 返回的情绪分类（已知集合，实际接受任意字符串） */
export const EMOTIONS = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'shy'] as const;

/** LLM 返回的表情名 */
export const EXPRESSIONS = [
  'smile',
  'frown',
  'surprise',
  'blush',
  'pout',
  'cry',
  'neutral',
] as const;

/** LLM 返回的动作名 */
export const ACTIONS = [
  'greeting',
  'wave',
  'nod',
  'shake',
  'head_tilt',
  'jump',
  'hug',
  'idle',
] as const;

/** 支持的 LLM 厂商（全部走 OpenAI 兼容格式；mock 用于开发与降级兜底） */
export const LLM_PROVIDERS = [
  'openai',
  'deepseek',
  'doubao',
  'qwen',
  'zhipu',
  'ollama',
  'mock',
  'custom',
] as const;

/** 厂商展示名，供设置页下拉框使用 */
export const LLM_PROVIDER_LABELS: Record<(typeof LLM_PROVIDERS)[number], string> = {
  openai: 'OpenAI',
  deepseek: 'DeepSeek',
  doubao: '豆包（火山方舟）',
  qwen: '通义千问',
  zhipu: '智谱 GLM',
  ollama: 'Ollama（本地）',
  mock: 'Mock（离线演示）',
  custom: '自定义（OpenAI 兼容）',
};

export type KnownEmotion = (typeof EMOTIONS)[number];
export type KnownExpression = (typeof EXPRESSIONS)[number];
export type KnownAction = (typeof ACTIONS)[number];
export type LLMProvider = (typeof LLM_PROVIDERS)[number];

export interface LlmProviderPreset {
  /** 默认 API 地址（OpenAI 兼容格式，通常以 /v1 结尾） */
  apiUrl: string;
  /** 默认模型名 */
  modelName: string;
  /** 是否必须填 API Key（本地模型不需要） */
  requiresApiKey: boolean;
  /** 当前版本能否做真实连通性校验（Mock 走真实链路，其余厂商适配器后续版本接入） */
  testableRemotely: boolean;
  hint: string;
}

/** 厂商预设：选中厂商后自动填好地址与模型名，降低首次配置成本 */
export const LLM_PROVIDER_PRESETS: Record<LLMProvider, LlmProviderPreset> = {
  openai: {
    apiUrl: 'https://api.openai.com/v1',
    modelName: 'gpt-4o-mini',
    requiresApiKey: true,
    testableRemotely: false,
    hint: '官方 API 地址，Key 以 sk- 开头',
  },
  deepseek: {
    apiUrl: 'https://api.deepseek.com/v1',
    modelName: 'deepseek-chat',
    requiresApiKey: true,
    testableRemotely: false,
    hint: '性价比高，推荐首次接入使用',
  },
  doubao: {
    apiUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    modelName: 'doubao-pro-32k',
    requiresApiKey: true,
    testableRemotely: false,
    hint: '火山方舟，模型名填「接入点 ID」也可以',
  },
  qwen: {
    apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelName: 'qwen-plus',
    requiresApiKey: true,
    testableRemotely: false,
    hint: '阿里云百炼的 OpenAI 兼容模式',
  },
  zhipu: {
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4',
    modelName: 'glm-4-flash',
    requiresApiKey: true,
    testableRemotely: false,
    hint: 'glm-4-flash 有免费额度',
  },
  ollama: {
    apiUrl: 'http://localhost:11434/v1',
    modelName: 'qwen2.5:7b',
    requiresApiKey: false,
    testableRemotely: false,
    hint: '本地模型，不需要 API Key，先把 Ollama 跑起来',
  },
  mock: {
    apiUrl: 'mock://local',
    modelName: 'mock',
    requiresApiKey: false,
    testableRemotely: true,
    hint: '离线演示模型，不需要任何 Key，用来先跑通整条链路',
  },
  custom: {
    apiUrl: '',
    modelName: '',
    requiresApiKey: true,
    testableRemotely: false,
    hint: '任何 OpenAI 兼容接口，自行填写地址与模型名',
  },
};
