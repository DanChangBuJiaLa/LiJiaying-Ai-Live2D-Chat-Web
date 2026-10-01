import { create } from 'zustand';
import type { Character, CharacterDraft } from '@shared';
import {
  ensureDefaultCharacter,
  saveCharacter as saveCharacterRecord,
} from '../db/repositories/characterRepository';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface CharacterState {
  character: Character | null;
  status: LoadStatus;
  error: string | null;
  /** 启动时调用：没有角色则用内置「羽澄糯」初始化 */
  load: () => Promise<void>;
  save: (draft: CharacterDraft) => Promise<void>;
}

export const useCharacterStore = create<CharacterState>()((set, get) => ({
  character: null,
  status: 'idle',
  error: null,

  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const character = await ensureDefaultCharacter();
      set({ character, status: 'ready' });
    } catch (cause) {
      set({
        status: 'error',
        error: cause instanceof Error ? cause.message : String(cause),
      });
    }
  },

  save: async (draft) => {
    const current = get().character;
    if (!current) {
      set({ error: '角色尚未初始化' });
      return;
    }

    try {
      const character = await saveCharacterRecord(current.id, draft);
      set({ character });
    } catch (cause) {
      set({ error: cause instanceof Error ? cause.message : String(cause) });
    }
  },
}));
