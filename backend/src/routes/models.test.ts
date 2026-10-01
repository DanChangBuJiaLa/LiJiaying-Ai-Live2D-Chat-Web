import Fastify from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { modelRoutes } from './models';

let app: ReturnType<typeof Fastify>;

beforeAll(async () => {
  app = Fastify();
  await app.register(modelRoutes);
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

const baseDraft = {
  provider: 'mock',
  apiUrl: 'mock://local',
  apiKey: '',
  modelName: 'mock',
  contextWindow: 20,
};

describe('POST /api/models/test', () => {
  it('mock 厂商会真实跑通一次对话链路', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/models/test',
      payload: baseDraft,
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.ok).toBe(true);
    expect(body.mode).toBe('mock');
    expect(typeof body.latencyMs).toBe('number');
  });

  it('非 mock 厂商填全配置时通过格式校验', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/models/test',
      payload: {
        provider: 'deepseek',
        apiUrl: 'https://api.deepseek.com/v1',
        apiKey: 'sk-test',
        modelName: 'deepseek-chat',
        contextWindow: 20,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.ok).toBe(true);
    expect(body.mode).toBe('format-only');
  });

  it('缺少 API Key 时不通过（向导门禁会拦住）', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/models/test',
      payload: {
        provider: 'deepseek',
        apiUrl: 'https://api.deepseek.com/v1',
        apiKey: '',
        modelName: 'deepseek-chat',
        contextWindow: 20,
      },
    });

    const body = response.json();
    expect(body.ok).toBe(false);
    expect(body.message).toContain('API Key');
  });

  it('API 地址不是 http(s) 时不通过', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/models/test',
      payload: {
        provider: 'custom',
        apiUrl: 'ftp://example.com',
        apiKey: 'sk-test',
        modelName: 'x',
        contextWindow: 20,
      },
    });

    const body = response.json();
    expect(body.ok).toBe(false);
    expect(body.message).toContain('http');
  });

  it('本地模型不需要 API Key', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/models/test',
      payload: {
        provider: 'ollama',
        apiUrl: 'http://localhost:11434/v1',
        apiKey: '',
        modelName: 'qwen2.5:7b',
        contextWindow: 20,
      },
    });

    expect(response.json().ok).toBe(true);
  });

  it('请求体不合法时返回 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/models/test',
      payload: { provider: 'not-a-provider' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe('INVALID_REQUEST');
  });
});
