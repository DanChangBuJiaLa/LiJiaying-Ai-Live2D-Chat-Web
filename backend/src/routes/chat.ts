import type { FastifyPluginAsync } from 'fastify';
import { nanoid } from 'nanoid';
import { ChatRequestSchema, type ChatResponse } from '@shared';
import { mockChat } from '../services/llm/mockAdapter';

export const chatRoutes: FastifyPluginAsync = async (app) => {
  app.post('/api/chat', async (request, reply) => {
    const parsed = ChatRequestSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        error: 'INVALID_REQUEST',
        message: '请求体不符合 ChatRequest 契约',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { conversationId, messages } = parsed.data;
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');

    if (!lastUserMessage) {
      return reply.code(400).send({
        error: 'NO_USER_MESSAGE',
        message: '上下文里至少需要一条用户消息',
      });
    }

    const response = await mockChat(lastUserMessage.content);

    const payload: ChatResponse = {
      response,
      conversationId,
      messageId: nanoid(),
      createdAt: new Date().toISOString(),
    };

    return payload;
  });
};
