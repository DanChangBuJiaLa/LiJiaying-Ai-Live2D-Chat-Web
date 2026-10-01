import { useEffect, useState } from 'react';
import type { CharacterDraft } from '@shared';
import { DEFAULT_CHARACTER } from '../../constants/defaultCharacter';
import { useCharacterStore } from '../../stores/characterStore';
import { CharacterStep } from '../onboarding/steps/CharacterStep';

function toDraft(source: {
  name: string;
  personality: string;
  tone: string;
  background: string;
  catchphrase: string;
  taboos: string;
  ttsVoiceId?: string;
  live2dModelPath?: string;
}): CharacterDraft {
  return {
    name: source.name,
    personality: source.personality,
    tone: source.tone,
    background: source.background,
    catchphrase: source.catchphrase,
    taboos: source.taboos,
    ttsVoiceId: source.ttsVoiceId,
    live2dModelPath: source.live2dModelPath,
  };
}

/** 设置 · 角色页：编辑角色人格（与向导第 2 步共用同一套表单） */
export function CharacterSettingsTab() {
  const character = useCharacterStore((state) => state.character);
  const save = useCharacterStore((state) => state.save);

  const [draft, setDraft] = useState<CharacterDraft>(() =>
    character ? toDraft(character) : DEFAULT_CHARACTER,
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState('');

  // 角色从 IndexedDB 载入后同步进本地草稿
  useEffect(() => {
    if (character) {
      setDraft(toDraft(character));
    }
  }, [character]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await save(draft);
      setSavedAt(Date.now());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <CharacterStep
        draft={draft}
        onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
      />

      {error ? <p className="text-xs text-pink-deep">保存失败：{error}</p> : null}
      {savedAt && !saving ? (
        <p className="text-xs text-ink-soft" role="status">
          ✓ 已保存，下一条消息就会用上新的设定
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving || !draft.name.trim()}
        className="rounded-full bg-pink px-5 py-2.5 text-xs text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-pink-deep hover:shadow-lift disabled:cursor-not-allowed disabled:bg-pink/45 disabled:hover:translate-y-0"
      >
        {saving ? '保存中…' : '保存角色设定'}
      </button>
    </div>
  );
}
