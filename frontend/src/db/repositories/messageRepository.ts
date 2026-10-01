import type { Message } from '@shared';
import { createId } from '../../utils/id';
import { nowIso } from '../../utils/time';
import { db, type ChatDatabase } from '../index';

/** 新增消息时的入参：id 与 createdAt 可省略，由仓储层补齐 */
export type NewMessage = Omit<Message, 'id' | 'createdAt'> & {
  id?: string;
  createdAt?: string;
};

/** 按时间正序列出某个会话的全部消息 */
export async function listMessages(
  conversationId: string,
  database: ChatDatabase = db,
): Promise<Message[]> {
  return database.messages.where('conversationId').equals(conversationId).sortBy('createdAt');
}

export async function countMessages(
  conversationId: string,
  database: ChatDatabase = db,
): Promise<number> {
  return database.messages.where('conversationId').equals(conversationId).count();
}

export async function addMessage(input: NewMessage, database: ChatDatabase = db): Promise<Message> {
  const { id, createdAt, ...rest } = input;
  const message: Message = {
    ...rest,
    id: id ?? createId(),
    createdAt: createdAt ?? nowIso(),
  };

  await database.messages.add(message);
  return message;
}

export async function addMessages(
  inputs: NewMessage[],
  database: ChatDatabase = db,
): Promise<Message[]> {
  const messages = inputs.map((input) => {
    const { id, createdAt, ...rest } = input;
    return { ...rest, id: id ?? createId(), createdAt: createdAt ?? nowIso() } satisfies Message;
  });

  await database.messages.bulkAdd(messages);
  return messages;
}

export async function deleteMessage(id: string, database: ChatDatabase = db): Promise<void> {
  await database.messages.delete(id);
}
