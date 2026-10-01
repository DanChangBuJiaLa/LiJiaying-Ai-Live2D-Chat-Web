import { db, type ChatDatabase } from '../index';

/**
 * 清空全部本地数据（会话 / 消息 / 角色 / 模型配置 / 设置）。
 * 用于「重置到首次使用状态」，也是验收项「清空配置后必须重走引导」的自测入口。
 */
export async function clearAllLocalData(database: ChatDatabase = db): Promise<void> {
  await database.transaction(
    'rw',
    [
      database.conversations,
      database.messages,
      database.characters,
      database.modelConfigs,
      database.settings,
    ],
    async () => {
      await Promise.all([
        database.conversations.clear(),
        database.messages.clear(),
        database.characters.clear(),
        database.modelConfigs.clear(),
        database.settings.clear(),
      ]);
    },
  );
}
