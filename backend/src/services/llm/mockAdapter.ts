import type { LLMResponse } from '@shared';

/**
 * Mock LLM 适配器（第一版后端唯一的"模型"）
 * 作用：让前端在没有任何 API Key 的情况下也能跑通完整对话链路。
 * 后续接入真实 LLM 时，本文件会被 services/llm/openaiCompatible.ts 替换，
 * 调用方（routes/chat.ts）接口保持不变。
 */

interface MockRule {
  pattern: RegExp;
  reply: LLMResponse;
}

const REPLIES: Record<string, LLMResponse> = {
  greeting: {
    emotion: 'happy',
    action: 'greeting',
    expression: 'smile',
    text: '哇～你来啦！我等你好久了哦，嘿嘿～今天也要开开心心的！',
  },
  comfort: {
    emotion: 'neutral',
    action: 'nod',
    expression: 'neutral',
    text: '嗯嗯……我不太会安慰人，但我可以听你说。你慢慢讲，我不着急的。',
  },
  sad: {
    emotion: 'sad',
    action: 'idle',
    expression: 'frown',
    text: '嗯……我没事……（吸鼻子）只是有一点点想哭，你不用管我啦……',
  },
  shy: {
    emotion: 'shy',
    action: 'head_tilt',
    expression: 'blush',
    text: '唔……你别、别一直看着我啦……我脸好烫……好吧，有一点点想你。',
  },
  happy: {
    emotion: 'happy',
    action: 'jump',
    expression: 'smile',
    text: '好耶！你这么一说我也超级开心的！嘿嘿～今天能量补充完毕！',
  },
  curious: {
    emotion: 'surprised',
    action: 'head_tilt',
    expression: 'surprise',
    text: '真的吗？我跟你讲哦，我刚刚看到一只超——可爱的猫咪，想给你看！',
  },
  idle: {
    emotion: 'neutral',
    action: 'idle',
    expression: 'neutral',
    text: '嗯嗯，我在听～你想到什么就说什么，我陪着你。',
  },
};

const RULES: MockRule[] = [
  {
    pattern: /(难过|伤心|想哭|哭了|委屈|不开心|好累|很累|有点累|疲惫|压力|崩溃|emo)/i,
    reply: REPLIES.comfort as LLMResponse,
  },
  {
    pattern: /(你好|您好|哈喽|hi|hello|在吗|早上好|晚上好|早安|晚安)/i,
    reply: REPLIES.greeting as LLMResponse,
  },
  { pattern: /(喜欢|爱你|想你|心动)/, reply: REPLIES.shy as LLMResponse },
  { pattern: /(哈哈|嘿嘿|好耶|太棒|开心|好玩)/, reply: REPLIES.happy as LLMResponse },
  {
    pattern: /(坏消息|吵架|生气|讨厌我|不想理你)/,
    reply: REPLIES.sad as LLMResponse,
  },
  { pattern: /(什么|为什么|怎么|吗？|\?)/, reply: REPLIES.curious as LLMResponse },
];

/** 稳定哈希：同样的输入永远拿到同样的回复，方便测试与复现 */
function stableHash(text: string): number {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 1_000_000_007;
  }
  return hash;
}

function pickReply(userInput: string): LLMResponse {
  for (const rule of RULES) {
    if (rule.pattern.test(userInput)) {
      return { ...rule.reply };
    }
  }
  const fallbackKeys = ['idle', 'happy', 'curious', 'comfort'];
  const key = fallbackKeys[stableHash(userInput) % fallbackKeys.length] as string;
  return { ...(REPLIES[key] as LLMResponse) };
}

/** 模拟真实模型的思考耗时，避免前端 Loading 态一闪而过 */
function thinkingDelay(): Promise<void> {
  const delay = 320 + Math.floor(Math.random() * 480);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function mockChat(userInput: string): Promise<LLMResponse> {
  await thinkingDelay();
  return pickReply(userInput);
}
