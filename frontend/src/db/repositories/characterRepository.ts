import type { Character, CharacterDraft } from '@shared';
import { DEFAULT_CHARACTER } from '../../constants/defaultCharacter';
import { createId } from '../../utils/id';
import { nowIso } from '../../utils/time';
import { db, type ChatDatabase } from '../index';

export async function listCharacters(database: ChatDatabase = db): Promise<Character[]> {
  return database.characters.orderBy('updatedAt').reverse().toArray();
}

export async function getCharacter(
  id: string,
  database: ChatDatabase = db,
): Promise<Character | undefined> {
  return database.characters.get(id);
}

/**
 * 保证库里至少有一条角色记录（第一版固定 1 个角色）。
 * 首次启动时用内置「羽澄糯」初始化，实现开箱即用。
 */
export async function ensureDefaultCharacter(database: ChatDatabase = db): Promise<Character> {
  const existing = await database.characters.orderBy('updatedAt').reverse().first();
  if (existing) {
    return existing;
  }

  const now = nowIso();
  const character: Character = {
    ...DEFAULT_CHARACTER,
    id: createId(),
    createdAt: now,
    updatedAt: now,
  };

  await database.characters.add(character);
  return character;
}

/** 新建角色（第一版未开放多角色入口，保留接口供 Phase 2 使用） */
export async function createCharacter(
  draft: CharacterDraft,
  database: ChatDatabase = db,
): Promise<Character> {
  const now = nowIso();
  const character: Character = { ...draft, id: createId(), createdAt: now, updatedAt: now };
  await database.characters.add(character);
  return character;
}

/** 更新已有角色的人格设定（不存在时自动新建） */
export async function saveCharacter(
  id: string,
  draft: CharacterDraft,
  database: ChatDatabase = db,
): Promise<Character> {
  const now = nowIso();
  const existing = await database.characters.get(id);

  const character: Character = {
    ...draft,
    id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await database.characters.put(character);
  return character;
}

export async function deleteCharacter(id: string, database: ChatDatabase = db): Promise<void> {
  await database.characters.delete(id);
}
