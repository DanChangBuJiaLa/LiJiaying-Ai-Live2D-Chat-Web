import { z } from 'zod';
import { MessageRoleSchema } from './llm';

/** 会话元数据 */
export const ConversationSchema = z.object({
  id: z.string().min(1),
  title: z.string().default('新的会话'),
  characterId: z.string().min(1),
  activeModelId: z.string().default(''),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 消息明细（assistant 消息携带情绪/动作/表情字段） */
export const MessageSchema = z.object({
  id: z.string().min(1),
  conversationId: z.string().min(1),
  role: MessageRoleSchema,
  content: z.string(),
  emotion: z.string().optional(),
  action: z.string().optional(),
  expression: z.string().optional(),
  toolCalls: z.array(z.unknown()).optional(),
  createdAt: z.string(),
});

export type Conversation = z.infer<typeof ConversationSchema>;
export type Message = z.infer<typeof MessageSchema>;
