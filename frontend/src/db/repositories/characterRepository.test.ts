import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ChatDatabase } from '../index';
import { ensureDefaultCharacter, listCharacters, saveCharacter } from './characterRepository';

let database: ChatDatabase;

beforeEach(async () => {
  database = new ChatDatabase(`test-characters-${Date.now()}-${Math.random()}`);
  await database.open();
});

afterEach(async () => {
  await database.delete();
});

describe('characterRepository', () => {
  it('首次调用写入内置角色「羽澄糯」，保证开箱即用', async () => {
    const character = await ensureDefaultCharacter(database);

    expect(character.name).toBe('羽澄糯');
    expect(character.personality.length).toBeGreaterThan(0);
    expect(character.tone.length).toBeGreaterThan(0);
    expect(character.id).toBeTruthy();
  });

  it('重复调用不会重复创建角色', async () => {
    const first = await ensureDefaultCharacter(database);
    const second = await ensureDefaultCharacter(database);

    expect(second.id).toBe(first.id);
    expect(await listCharacters(database)).toHaveLength(1);
  });

  it('保存人格设定后更新内容并保留 createdAt', async () => {
    const original = await ensureDefaultCharacter(database);

    const updated = await saveCharacter(
      original.id,
      {
        name: '糯糯',
        personality: '更粘人了',
        tone: '软糯',
        background: original.background,
        catchphrase: original.catchphrase,
        taboos: original.taboos,
      },
      database,
    );

    expect(updated.name).toBe('糯糯');
    expect(updated.personality).toBe('更粘人了');
    expect(updated.createdAt).toBe(original.createdAt);

    const reloaded = await listCharacters(database);
    expect(reloaded).toHaveLength(1);
    expect(reloaded[0]?.name).toBe('糯糯');
  });

  it('保存不存在的角色时自动新建', async () => {
    await saveCharacter(
      'manual-id',
      {
        name: '临时角色',
        personality: '',
        tone: '',
        background: '',
        catchphrase: '',
        taboos: '',
      },
      database,
    );

    const list = await listCharacters(database);
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe('manual-id');
    expect(list[0]?.createdAt).toBe(list[0]?.updatedAt);
  });
});
