import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ChatDatabase } from '../index';
import {
  createModelConfig,
  deleteModelConfig,
  getActiveModelConfig,
  listModelConfigs,
  setActiveModelConfig,
  updateModelConfig,
} from './modelConfigRepository';

let database: ChatDatabase;

const baseDraft = {
  provider: 'mock' as const,
  apiUrl: 'mock://local',
  apiKey: '',
  modelName: 'mock',
  contextWindow: 20,
};

beforeEach(async () => {
  database = new ChatDatabase(`test-models-${Date.now()}-${Math.random()}`);
  await database.open();
});

afterEach(async () => {
  await database.delete();
});

describe('modelConfigRepository', () => {
  it('第一条配置自动激活，后续新增不会抢占', async () => {
    const first = await createModelConfig(baseDraft, database);
    const second = await createModelConfig(
      { ...baseDraft, provider: 'deepseek', modelName: 'deepseek-chat' },
      database,
    );

    expect(first.isActive).toBe(true);
    expect(second.isActive).toBe(false);
    expect((await getActiveModelConfig(database))?.id).toBe(first.id);
  });

  it('切换激活后全局只保留一条 isActive（切换模型不丢上下文的前提）', async () => {
    const first = await createModelConfig(baseDraft, database);
    const second = await createModelConfig(
      { ...baseDraft, provider: 'openai', modelName: 'gpt-4o-mini' },
      database,
    );

    await setActiveModelConfig(second.id, database);

    const configs = await listModelConfigs(database);
    expect(configs.filter((config) => config.isActive)).toHaveLength(1);
    expect((await getActiveModelConfig(database))?.id).toBe(second.id);
    expect(first.id).not.toBe(second.id);
  });

  it('更新配置内容但保留 id 与激活状态', async () => {
    const config = await createModelConfig(baseDraft, database);

    const updated = await updateModelConfig(
      config.id,
      { ...baseDraft, modelName: 'mock-v2', contextWindow: 8 },
      database,
    );

    expect(updated?.modelName).toBe('mock-v2');
    expect(updated?.contextWindow).toBe(8);
    expect(updated?.isActive).toBe(true);
    expect(updated?.createdAt).toBe(config.createdAt);
  });

  it('删除当前激活配置时顺位激活剩余配置', async () => {
    const first = await createModelConfig(baseDraft, database);
    const second = await createModelConfig(
      { ...baseDraft, provider: 'ollama', modelName: 'qwen2.5' },
      database,
    );

    await deleteModelConfig(first.id, database);

    const active = await getActiveModelConfig(database);
    expect(active?.id).toBe(second.id);
    expect(await listModelConfigs(database)).toHaveLength(1);
  });

  it('删除非激活配置不影响当前激活项', async () => {
    const first = await createModelConfig(baseDraft, database);
    const second = await createModelConfig(
      { ...baseDraft, provider: 'zhipu', modelName: 'glm-4-flash' },
      database,
    );

    await deleteModelConfig(second.id, database);

    expect((await getActiveModelConfig(database))?.id).toBe(first.id);
  });
});
