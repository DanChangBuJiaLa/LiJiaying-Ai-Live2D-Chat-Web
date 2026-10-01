import { ACTIONS, EMOTIONS, EXPRESSIONS } from '@shared';
import type { ChatContextMessage, Character, MessageRole } from '@shared';

/** 默认保留最近多少条消息作为上下文（用户可在模型配置里覆盖） */
export const DEFAULT_CONTEXT_WINDOW = 20;

export type PersonaSource = Pick<
  Character,
  'name' | 'personality' | 'tone' | 'background' | 'catchphrase' | 'taboos'
>;

// 枚举值直接取自 @shared 的唯一来源，避免 Prompt 文案与前后端契约漂移
const OUTPUT_FORMAT = [
  '【输出要求】必须严格返回 JSON，不要 Markdown 代码块，不要多余解释，格式：',
  '{',
  `  "emotion": "${EMOTIONS.join('|')} 中选一个（按你回复的语气选最匹配的）",`,
  `  "action": "${ACTIONS.join('|')} 中选一个（按当前动作场景选）",`,
  `  "expression": "${EXPRESSIONS.join('|')} 中选一个（与 emotion 对应）",`,
  '  "text": "回复内容（严格按上面的语气风格，1-3 句话为主，不要太长；撒娇/害羞时可以加省略号、语气词、括号表情）"',
  '}',
].join('\n');

function section(title: string, body: string): string {
  const trimmed = body.trim();
  return trimmed ? `【${title}】\n${trimmed}` : '';
}

/** 根据角色人格拼装 System Prompt（结构见 项目规格说明书 4.4） */
export function buildSystemPrompt(character: PersonaSource): string {
  const blocks = [
    `你是「${character.name}」。`,
    section('身份背景', character.background),
    section('核心性格', `（扮演时必须保持人设一致，不能跳出角色）\n${character.personality}`),
    section('语气风格', `（日常对话用「日常聊天」模式，根据 emotion 自动切换）\n${character.tone}`),
    section('口头禅/高频词', character.catchphrase),
    section('重要约束', character.taboos),
    OUTPUT_FORMAT,
  ];

  return blocks.filter(Boolean).join('\n\n');
}

export interface BuildContextParams {
  systemPrompt: string;
  /** 历史消息（不含 system），按时间正序 */
  history: Array<{ role: MessageRole; content: string }>;
  contextWindow?: number;
}

/**
 * 组装发给 LLM 的上下文：
 * system 消息置顶 + 最近 N 条历史（第一版策略为直接截断早期消息）。
 */
export function buildContextMessages({
  systemPrompt,
  history,
  contextWindow = DEFAULT_CONTEXT_WINDOW,
}: BuildContextParams): ChatContextMessage[] {
  const limit = contextWindow > 0 ? contextWindow : DEFAULT_CONTEXT_WINDOW;
  const conversation = history
    .filter((message) => message.role !== 'system')
    .slice(-limit)
    .map((message) => ({ role: message.role, content: message.content }));

  return [{ role: 'system', content: systemPrompt }, ...conversation];
}
