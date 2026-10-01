import Fastify from 'fastify';
import cors from '@fastify/cors';
import { corsOrigins, env } from './config/env';
import { logger } from './utils/logger';
import { chatRoutes } from './routes/chat';
import { healthRoutes } from './routes/health';
import { modelRoutes } from './routes/models';

// Fastify 5 起 logger 只接受配置对象，传入现成的 pino 实例需要用 loggerInstance
const app = Fastify({ loggerInstance: logger });

/** 把任意抛出物归一化成 HTTP 错误结构（Fastify 的错误回调参数为 unknown） */
function normalizeError(error: unknown): { statusCode: number; code: string; message: string } {
  const message = error instanceof Error ? error.message : String(error);

  if (error instanceof Error) {
    const statusCode =
      'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 500;
    const code = 'code' in error && typeof error.code === 'string' ? error.code : 'INTERNAL_ERROR';
    return { statusCode, code, message };
  }

  return { statusCode: 500, code: 'INTERNAL_ERROR', message };
}

await app.register(cors, { origin: corsOrigins });
await app.register(healthRoutes);
await app.register(chatRoutes);
await app.register(modelRoutes);

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  const normalized = normalizeError(error);
  reply.code(normalized.statusCode).send({
    error: normalized.code,
    message: normalized.message,
  });
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    void app.close().then(() => {
      logger.info(`收到 ${signal}，后端已优雅关闭`);
      process.exit(0);
    });
  });
}

try {
  await app.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  logger.error(error, '后端启动失败');
  process.exit(1);
}
