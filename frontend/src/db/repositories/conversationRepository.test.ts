import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ChatDatabase } from '../index';
import { addMessage, countMessages, listMessages } from './messageRepository';
import {
  createConversation,
  deleteConversation,
  getLatestConversation,
  listConversations,
  renameConversation,
  touchConversation,
} from './conversationRepository';

let database: ChatDatabase;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeEach(async () => {
  database = new ChatDatabase(`test-conversations-${Date.now()}-${Math.random()}`);
  await database.open();
});

afterEach(async () => {
  await database.delete();
});

describe('conversationRepository', () => {
  it('创建会话并写入 IndexedDB，重新读取依然存在', async () => {
    const created = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );

    expect(created.title).toBe('新的会话');

    const list = await listConversations(database);
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(created.id);
  });

  it('用首条用户消息重命名标题，空标题回落到默认值', async () => {
    const created = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );

    await renameConversation(created.id, '  今天天气怎么样  ', database);
    expect((await listConversations(database))[0]?.title).toBe('今天天气怎么样');

    await renameConversation(created.id, '   ', database);
    expect((await listConversations(database))[0]?.title).toBe('新的会话');
  });

  it('按 updatedAt 倒序返回，最近活跃的排最前', async () => {
    const first = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );
    await sleep(5);
    const second = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );

    expect((await listConversations(database)).map((item) => item.id)).toEqual([
      second.id,
      first.id,
    ]);

    await sleep(5);
    await touchConversation(first.id, database);

    expect((await listConversations(database))[0]?.id).toBe(first.id);
    expect((await getLatestConversation(database))?.id).toBe(first.id);
  });

  it('删除会话时级联删除其消息，不影响其它会话', async () => {
    const keep = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );
    const remove = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );

    await addMessage({ conversationId: keep.id, role: 'user', content: '保留的消息' }, database);
    await addMessage({ conversationId: remove.id, role: 'user', content: '待删除 1' }, database);
    await addMessage(
      { conversationId: remove.id, role: 'assistant', content: '待删除 2' },
      database,
    );

    await deleteConversation(remove.id, database);

    expect(await listConversations(database)).toHaveLength(1);
    expect(await countMessages(remove.id, database)).toBe(0);
    expect(await countMessages(keep.id, database)).toBe(1);
  });
});

describe('messageRepository', () => {
  it('按时间正序读回消息，并保留情绪字段', async () => {
    const conversation = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );

    await addMessage(
      { conversationId: conversation.id, role: 'user', content: '第一条' },
      database,
    );
    await sleep(5);
    await addMessage(
      {
        conversationId: conversation.id,
        role: 'assistant',
        content: '第二条',
        emotion: 'happy',
        action: 'jump',
        expression: 'smile',
      },
      database,
    );

    const messages = await listMessages(conversation.id, database);

    expect(messages.map((message) => message.content)).toEqual(['第一条', '第二条']);
    expect(messages[1]?.emotion).toBe('happy');
    expect(messages[1]?.expression).toBe('smile');
    expect(messages.every((message) => message.id && message.createdAt)).toBe(true);
  });

  it('消息按会话隔离，不会串到其它会话', async () => {
    const a = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );
    const b = await createConversation(
      { characterId: 'char-1', activeModelId: 'model-1' },
      database,
    );

    await addMessage({ conversationId: a.id, role: 'user', content: 'A 的消息' }, database);
    await addMessage({ conversationId: b.id, role: 'user', content: 'B 的消息' }, database);

    expect((await listMessages(a.id, database)).map((message) => message.content)).toEqual([
      'A 的消息',
    ]);
    expect((await listMessages(b.id, database)).map((message) => message.content)).toEqual([
      'B 的消息',
    ]);
  });
});
