import { db, type ChatDatabase } from '../index';

/** 读取一个 KV 设置项 */
export async function getSetting(key: string, database: ChatDatabase = db): Promise<string | null> {
  const record = await database.settings.get(key);
  return record?.value ?? null;
}

export async function setSetting(
  key: string,
  value: string,
  database: ChatDatabase = db,
): Promise<void> {
  await database.settings.put({ key, value });
}

export async function deleteSetting(key: string, database: ChatDatabase = db): Promise<void> {
  await database.settings.delete(key);
}

/** 读取 JSON 设置项（解析失败时回落到默认值） */
export async function getJsonSetting<T>(
  key: string,
  fallback: T,
  database: ChatDatabase = db,
): Promise<T> {
  const raw = await getSetting(key, database);
  if (raw === null) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJsonSetting(
  key: string,
  value: unknown,
  database: ChatDatabase = db,
): Promise<void> {
  await setSetting(key, JSON.stringify(value), database);
}
