import type { FastifyPluginAsync } from 'fastify';
import { HealthResponseSchema } from '@shared';
import { env } from '../config/env';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/health', async () => {
    return HealthResponseSchema.parse({
      status: 'ok',
      service: 'ai-live2d-chat-backend',
      version: '0.1.0',
      llmMode: env.LLM_MODE,
      uptime: Math.round(process.uptime()),
    });
  });
};
