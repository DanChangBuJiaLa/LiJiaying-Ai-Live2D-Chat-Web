import type { FastifyPluginAsync } from 'fastify';
import {
  LLM_PROVIDER_LABELS,
  LLM_PROVIDER_PRESETS,
  ModelConfigDraftSchema,
  type ModelTestResponse,
} from '@shared';
import { mockChat } from '../services/llm/mockAdapter';

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function fail(message: string): ModelTestResponse {
  return { ok: false, mode: 'format-only', message };
}

export const modelRoutes: FastifyPluginAsync = async (app) => {
  /**
   * 模型连接测试（向导第 1 步的强制校验入口）。
   * mock 厂商会真的跑一次完整对话链路；
   * 其余厂商当前版本只校验配置格式 + 后端连通性（真实厂商适配器后续版本接入）。
   */
  app.post('/api/models/test', async (request, reply) => {
    const parsed = ModelConfigDraftSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        error: 'INVALID_REQUEST',
        message: '模型配置格式不合法',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const config = parsed.data;
    const preset = LLM_PROVIDER_PRESETS[config.provider];

    if (config.provider === 'mock') {
      const startedAt = Date.now();
      const response = await mockChat('你好呀');
      return {
        ok: true,
        mode: 'mock',
        message: `Mock 模型链路正常，返回情绪「${response.emotion}」`,
        latencyMs: Date.now() - startedAt,
      } satisfies ModelTestResponse;
    }

    if (!isHttpUrl(config.apiUrl)) {
      return fail('API 地址必须是 http/https 开头的完整地址');
    }

    if (!config.modelName.trim()) {
      return fail('请填写模型名');
    }

    if (preset.requiresApiKey && !config.apiKey.trim()) {
      return fail(`${LLM_PROVIDER_LABELS[config.provider]} 需要填写 API Key`);
    }

    return {
      ok: true,
      mode: 'format-only',
      message: '配置格式校验通过，后端连通正常。该厂商的真实连通性校验会在 LLM 适配器接入后启用。',
    } satisfies ModelTestResponse;
  });
};
