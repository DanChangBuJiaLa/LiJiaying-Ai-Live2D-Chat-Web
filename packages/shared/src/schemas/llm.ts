import { z } from 'zod';

/** 对话消息角色 */
export const MessageRoleSchema = z.enum(['system', 'user', 'assistant']);

/** 发送给 LLM 的上下文消息（精简结构，仅 role + content） */
export const ChatContextMessageSchema = z.object({
  role: MessageRoleSchema,
  content: z.string(),
});

/**
 * LLM 结构化输出契约（固定，前后端必须同步）
 * emotion / action / expression 给默认值兜底，避免模型漏字段导致前端崩。
 */
export const LLMResponseSchema = z.object({
  emotion: z.string().default('neutral'),
  action: z.string().default('idle'),
  expression: z.string().default('neutral'),
  text: z.string(),
  tool_calls: z
    .array(
      z.object({
        name: z.string(),
        arguments: z.record(z.unknown()),
      }),
    )
    .optional(),
});

/** POST /api/chat 请求体 */
export const ChatRequestSchema = z.object({
  conversationId: z.string().min(1),
  modelConfigId: z.string().min(1),
  messages: z.array(ChatContextMessageSchema).min(1),
});

/** POST /api/chat 响应体 */
export const ChatResponseSchema = z.object({
  response: LLMResponseSchema,
  conversationId: z.string(),
  messageId: z.string(),
  createdAt: z.string(),
});

/** GET /api/health 响应体 */
export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  version: z.string(),
  llmMode: z.enum(['mock', 'live']),
  uptime: z.number(),
});

export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type ChatContextMessage = z.infer<typeof ChatContextMessageSchema>;
export type LLMResponse = z.infer<typeof LLMResponseSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
