import {
  ChatResponseSchema,
  HealthResponseSchema,
  type ChatContextMessage,
  type ChatResponse,
  type HealthResponse,
} from '@shared';
import { httpClient } from './httpClient';

export interface SendChatParams {
  conversationId: string;
  modelConfigId: string;
  messages: ChatContextMessage[];
}

/** 后端健康检查 */
export async function fetchHealth(): Promise<HealthResponse> {
  const payload: unknown = await httpClient.get('api/health').json();
  return HealthResponseSchema.parse(payload);
}

/** 发送对话请求，返回结构化 LLM 响应（Zod 校验，脏数据直接抛错） */
export async function sendChatMessage(params: SendChatParams): Promise<ChatResponse> {
  const payload: unknown = await httpClient.post('api/chat', { json: params }).json();
  return ChatResponseSchema.parse(payload);
}
