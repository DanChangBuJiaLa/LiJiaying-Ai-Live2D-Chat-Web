import { nanoid } from 'nanoid';

/** 生成短 ID（URL 安全） */
export function createId(): string {
  return nanoid();
}

/** 带前缀的 ID，便于日志与调试时区分实体类型 */
export function createPrefixedId(prefix: string): string {
  return `${prefix}_${nanoid(12)}`;
}
