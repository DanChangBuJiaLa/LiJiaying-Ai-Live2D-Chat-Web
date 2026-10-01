import type { KnownAction, KnownExpression } from '@shared';

/** 归一化后的情绪档位（LLM 可能返回任意字符串，都会被收敛到规格书定案的 7 档） */
export type EmotionKey = 'happy' | 'sad' | 'angry' | 'surprised' | 'shy' | 'playful' | 'neutral';

/**
 * 固定顺序，用于在模型没有命名表情时按下标稳定轮换（同一情绪永远命中同一个表情）。
 * 顺序本身不承载语义，只要保持不变，表情就不会在不同对话间跳动。
 */
export const EMOTION_ORDER: readonly EmotionKey[] = [
  'happy',
  'sad',
  'angry',
  'surprised',
  'shy',
  'neutral',
  'playful',
];

export interface EmotionVisual {
  emotion: EmotionKey;
  /** 对应的 Live2D 表情名 */
  expression: KnownExpression;
  /** 对应的 Live2D 动作名 */
  action: KnownAction;
  /** 情绪主题色，用于角色区域光晕与气泡描边 */
  glow: string;
  /** 中文标签（调试面板与无障碍朗读使用） */
  label: string;
}

const TABLE: Record<EmotionKey, EmotionVisual> = {
  happy: { emotion: 'happy', expression: 'smile', action: 'wave', glow: '#FFE3A3', label: '开心' },
  sad: { emotion: 'sad', expression: 'frown', action: 'idle', glow: '#C7DCEF', label: '难过' },
  angry: {
    emotion: 'angry',
    expression: 'frown',
    action: 'shake',
    glow: '#F79CB0',
    label: '生气',
  },
  surprised: {
    emotion: 'surprised',
    expression: 'surprise',
    action: 'head_tilt',
    glow: '#FFE3A3',
    label: '惊讶',
  },
  shy: { emotion: 'shy', expression: 'blush', action: 'head_tilt', glow: '#FFB8C8', label: '害羞' },
  playful: {
    emotion: 'playful',
    expression: 'blush',
    action: 'head_tilt',
    glow: '#FFD1B8',
    label: '撒娇',
  },
  neutral: {
    emotion: 'neutral',
    expression: 'neutral',
    action: 'idle',
    glow: '#F6EDE4',
    label: '平静',
  },
};

/** 同义词表（含英文与中文），把模型返回的任意情绪描述收敛成 EmotionKey */
const SYNONYMS: Record<string, EmotionKey> = {
  happy: 'happy',
  joy: 'happy',
  joyful: 'happy',
  glad: 'happy',
  excited: 'happy',
  cheerful: 'happy',
  delight: 'happy',
  开心: 'happy',
  高兴: 'happy',
  快乐: 'happy',
  兴奋: 'happy',
  开心雀跃: 'happy',

  sad: 'sad',
  sorrow: 'sad',
  down: 'sad',
  upset: 'sad',
  cry: 'sad',
  lonely: 'sad',
  难过: 'sad',
  伤心: 'sad',
  失落: 'sad',
  委屈: 'sad',

  angry: 'angry',
  mad: 'angry',
  annoyed: 'angry',
  irritated: 'angry',
  生气: 'angry',
  愤怒: 'angry',
  不满: 'angry',

  surprised: 'surprised',
  surprise: 'surprised',
  shocked: 'surprised',
  amazed: 'surprised',
  astonished: 'surprised',
  惊讶: 'surprised',
  震惊: 'surprised',
  吃惊: 'surprised',

  shy: 'shy',
  bashful: 'shy',
  embarrassed: 'shy',
  blush: 'shy',
  害羞: 'shy',
  娇羞: 'shy',
  羞: 'shy',

  playful: 'playful',
  coquettish: 'playful',
  mischievous: 'playful',
  撒娇: 'playful',
  撒嬌: 'playful',
  卖萌: 'playful',
  俏皮: 'playful',

  neutral: 'neutral',
  calm: 'neutral',
  normal: 'neutral',
  idle: 'neutral',
  plain: 'neutral',
  平静: 'neutral',
  中性: 'neutral',
  正常: 'neutral',
};

/**
 * 把 LLM 返回的 emotion 字段解析成可直接驱动 Live2D 的视觉指令。
 * 未识别的一律回落到 neutral，保证前端永远不会因为脏字段崩掉。
 */
export function resolveEmotion(raw: string | null | undefined): EmotionVisual {
  if (!raw) {
    return TABLE.neutral;
  }

  const trimmed = raw.trim();
  const key = SYNONYMS[trimmed.toLowerCase()] ?? SYNONYMS[trimmed];

  return key ? TABLE[key] : TABLE.neutral;
}

/** 仅取表情名（Live2D 表情控制器用） */
export function emotionToExpression(raw: string | null | undefined): KnownExpression {
  return resolveEmotion(raw).expression;
}

/** 仅取动作名 */
export function emotionToAction(raw: string | null | undefined): KnownAction {
  return resolveEmotion(raw).action;
}
