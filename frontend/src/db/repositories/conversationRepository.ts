import type { Conversation } from '@shared';
import { createId } from '../../utils/id';
import { nowIso } from '../../utils/time';
import { db, type ChatDatabase } from '../index';

export const DEFAULT_CONVERSATION_TITLE = '新的会话';

/** 按最近更新时间倒序列出全部会话 */
export async function listConversations(database: ChatDatabase = db): Promise<Conversation[]> {
  return database.conversations.orderBy('updatedAt').reverse().toArray();
}

export async function getConversation(
  id: string,
  database: ChatDatabase = db,
): Promise<Conversation | undefined> {
  return database.conversations.get(id);
}

export async function getLatestConversation(
  database: ChatDatabase = db,
): Promise<Conversation | undefined> {
  const [latest] = await listConversations(database);
  return latest;
}

export interface CreateConversationInput {
  characterId: string;
  activeModelId: string;
  title?: string;
}

export async function createConversation(
  input: CreateConversationInput,
  database: ChatDatabase = db,
): Promise<Conversation> {
  const now = nowIso();
  const conversation: Conversation = {
    id: createId(),
    title: input.title?.trim() || DEFAULT_CONVERSATION_TITLE,
    characterId: input.characterId,
    activeModelId: input.activeModelId,
    createdAt: now,
    updatedAt: now,
  };

  await database.conversations.add(conversation);
  return conversation;
}

export async function renameConversation(
  id: string,
  title: string,
  database: ChatDatabase = db,
): Promise<void> {
  await database.conversations.update(id, { title: title.trim() || DEFAULT_CONVERSATION_TITLE });
}

/** 用首条用户消息生成会话标题（侧栏显示更友好） */
export async function renameConversationByFirstMessage(
  id: string,
  firstMessage: string,
  database: ChatDatabase = db,
): Promise<void> {
  const title = firstMessage.trim().replace(/\s+/g, ' ').slice(0, 24);
  await renameConversation(id, title, database);
}

export async function touchConversation(id: string, database: ChatDatabase = db): Promise<void> {
  await database.conversations.update(id, { updatedAt: nowIso() });
}

export async function setConversationActiveModel(
  id: string,
  modelConfigId: string,
  database: ChatDatabase = db,
): Promise<void> {
  await database.conversations.update(id, { activeModelId: modelConfigId, updatedAt: nowIso() });
}

/** 删除会话并级联删除其消息 */
export async function deleteConversation(id: string, database: ChatDatabase = db): Promise<void> {
  await database.transaction('rw', database.conversations, database.messages, async () => {
    await database.messages.where('conversationId').equals(id).delete();
    await database.conversations.delete(id);
  });
}
