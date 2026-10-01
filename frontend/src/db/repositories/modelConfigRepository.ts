import type { ModelConfig, ModelConfigDraft } from '@shared';
import { createId } from '../../utils/id';
import { nowIso } from '../../utils/time';
import { db, type ChatDatabase } from '../index';

/** 列出全部模型配置（最近创建的排前面） */
export async function listModelConfigs(database: ChatDatabase = db): Promise<ModelConfig[]> {
  return database.modelConfigs.orderBy('createdAt').reverse().toArray();
}

export async function getModelConfig(
  id: string,
  database: ChatDatabase = db,
): Promise<ModelConfig | undefined> {
  return database.modelConfigs.get(id);
}

/** 当前激活的模型配置（isActive 不能建索引，这里走全表查询） */
export async function getActiveModelConfig(
  database: ChatDatabase = db,
): Promise<ModelConfig | undefined> {
  return database.modelConfigs.filter((config) => config.isActive).first();
}

/** 新增模型配置；若当前没有任何激活配置，则新配置自动激活 */
export async function createModelConfig(
  draft: ModelConfigDraft,
  database: ChatDatabase = db,
): Promise<ModelConfig> {
  const active = await getActiveModelConfig(database);
  const config: ModelConfig = {
    ...draft,
    id: createId(),
    isActive: !active,
    createdAt: nowIso(),
  };

  await database.modelConfigs.add(config);
  return config;
}

export async function updateModelConfig(
  id: string,
  draft: ModelConfigDraft,
  database: ChatDatabase = db,
): Promise<ModelConfig | undefined> {
  const existing = await database.modelConfigs.get(id);
  if (!existing) {
    return undefined;
  }

  const updated: ModelConfig = { ...existing, ...draft };
  await database.modelConfigs.put(updated);
  return updated;
}

/** 切换激活模型：只会有一条 isActive = true */
export async function setActiveModelConfig(id: string, database: ChatDatabase = db): Promise<void> {
  await database.transaction('rw', database.modelConfigs, async () => {
    const all = await database.modelConfigs.toArray();
    await database.modelConfigs.bulkPut(
      all.map((config) => ({ ...config, isActive: config.id === id })),
    );
  });
}

export async function deleteModelConfig(id: string, database: ChatDatabase = db): Promise<void> {
  await database.transaction('rw', database.modelConfigs, async () => {
    const target = await database.modelConfigs.get(id);
    await database.modelConfigs.delete(id);

    if (!target?.isActive) {
      return;
    }

    // 删掉的是当前激活配置时，顺位激活最近的一条，避免出现「无可用模型」
    const [next] = await database.modelConfigs.orderBy('createdAt').reverse().toArray();
    if (next) {
      await database.modelConfigs.put({ ...next, isActive: true });
    }
  });
}
