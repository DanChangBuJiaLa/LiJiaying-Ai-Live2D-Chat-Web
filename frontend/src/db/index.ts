import Dexie, { type Table } from 'dexie';
import type { Character, Conversation, Message, ModelConfig } from '@shared';

/** settings 表为简单 KV，存 UI 偏好等零散配置 */
export interface SettingRecord {
  key: string;
  value: string;
}

/**
 * 前端主存储（IndexedDB）。
 * 数据全部留在用户本机，不上传任何服务器。
 * 注意：IndexedDB 不能给布尔值建索引，因此 isActive 不建索引，切换激活用查询完成。
 */
export class ChatDatabase extends Dexie {
  conversations!: Table<Conversation, string>;
  messages!: Table<Message, string>;
  characters!: Table<Character, string>;
  modelConfigs!: Table<ModelConfig, string>;
  settings!: Table<SettingRecord, string>;

  constructor(name = 'ai-live2d-chat') {
    super(name);
    this.version(1).stores({
      conversations: 'id, updatedAt, characterId',
      messages: 'id, conversationId, createdAt',
      characters: 'id, updatedAt',
      modelConfigs: 'id, provider, createdAt',
      settings: 'key',
    });
  }
}

export const db = new ChatDatabase();
