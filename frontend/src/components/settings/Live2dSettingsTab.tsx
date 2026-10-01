import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { SETTINGS_KEYS, type Live2dSource } from '../../constants/settingsKeys';
import { setSetting } from '../../db/repositories/settingsRepository';
import { fetchModelManifest } from '../../services/live2d/modelManifest';
import { useCharacterStore } from '../../stores/characterStore';
import { useLive2dStore } from '../../stores/live2dStore';
import { TextField } from '../common/FormField';

const SOURCE_OPTIONS: Array<{ value: Live2dSource; title: string; desc: string; emoji: string }> = [
  {
    value: 'placeholder',
    title: '先用占位插画',
    desc: '不加载模型，界面照常可用',
    emoji: '🖼',
  },
  {
    value: 'directory',
    title: '从本地目录自动探测',
    desc: '读取 frontend/public/models 下的清单，自动加载第一个找到的模型',
    emoji: '📁',
  },
  {
    value: 'url',
    title: '填写模型 URL',
    desc: '支持远程链接 / CDN / GitHub Raw 地址',
    emoji: '🔗',
  },
];

/** 设置 · 立绘页：模型来源、URL 热切换、加载状态与目录探测结果 */
export function Live2dSettingsTab() {
  const source = useLive2dStore((state) => state.source);
  const modelPath = useLive2dStore((state) => state.modelPath);
  const modelStatus = useLive2dStore((state) => state.modelStatus);
  const modelError = useLive2dStore((state) => state.modelError);
  const emotion = useLive2dStore((state) => state.emotion);
  const appliedExpression = useLive2dStore((state) => state.appliedExpression);
  const requestReload = useLive2dStore((state) => state.requestReload);

  const [draftSource, setDraftSource] = useState<Live2dSource>(source);
  const [draftUrl, setDraftUrl] = useState(modelPath ?? '');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [manifestModels, setManifestModels] = useState<string[] | null>(null);

  useEffect(() => {
    setDraftSource(source);
    setDraftUrl(modelPath ?? '');
  }, [source, modelPath]);

  const refreshManifest = useCallback(async () => {
    setManifestModels(await fetchModelManifest());
  }, []);

  useEffect(() => {
    void refreshManifest();
  }, [refreshManifest]);

  const dirty =
    draftSource !== source || (draftSource === 'url' && draftUrl.trim() !== (modelPath ?? ''));

  const apply = async () => {
    setSaving(true);
    try {
      const path = draftSource === 'url' && draftUrl.trim() ? draftUrl.trim() : undefined;

      await setSetting(SETTINGS_KEYS.live2dSource, draftSource);

      const character = useCharacterStore.getState().character;
      if (character) {
        await useCharacterStore.getState().save({
          name: character.name,
          personality: character.personality,
          tone: character.tone,
          background: character.background,
          catchphrase: character.catchphrase,
          taboos: character.taboos,
          ttsVoiceId: character.ttsVoiceId,
          live2dModelPath: path,
        });
      }

      useLive2dStore.getState().setSource(draftSource);
      useLive2dStore.getState().setModelPath(path ?? null);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  const statusLabel: Record<typeof modelStatus, string> = {
    idle: '未加载',
    loading: '加载中',
    ready: '已加载',
    error: '加载失败',
  };

  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="模型来源" className="flex flex-col gap-2.5">
        <span className="text-xs text-ink">模型来源</span>
        {SOURCE_OPTIONS.map((option) => {
          const active = draftSource === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setDraftSource(option.value)}
              className={clsx(
                'flex items-start gap-3 rounded-bubble px-4 py-3 text-left transition duration-200',
                active
                  ? 'bg-pink-soft/80 ring-2 ring-pink'
                  : 'bg-white/55 hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft',
              )}
            >
              <span className="text-lg leading-none" aria-hidden>
                {option.emoji}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm text-ink-deep">{option.title}</span>
                <span className="text-[11px] leading-relaxed text-ink-soft">{option.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {draftSource === 'url' ? (
        <TextField
          label="模型地址"
          hint="指向 .model3.json / .model.json"
          value={draftUrl}
          onChange={(event) => setDraftUrl(event.target.value)}
          placeholder="https://example.com/model/xxx.model3.json"
          spellCheck={false}
        />
      ) : null}

      {draftSource === 'directory' ? (
        <div className="rounded-bubble bg-white/55 px-4 py-3 text-[11px] leading-relaxed text-ink-soft">
          <div className="flex items-center justify-between gap-2">
            <span>
              已探测到的模型：{manifestModels === null ? '检测中…' : `${manifestModels.length} 个`}
            </span>
            <button
              type="button"
              onClick={() => void refreshManifest()}
              className="rounded-full bg-white/85 px-3 py-1 text-[10px] text-ink transition hover:bg-white"
            >
              重新探测
            </button>
          </div>
          {manifestModels && manifestModels.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-0.5">
              {manifestModels.map((item) => (
                <li key={item} className="truncate font-mono text-[10px]">
                  {item}
                </li>
              ))}
            </ul>
          ) : manifestModels ? (
            <p className="mt-2">
              目录里没有模型文件。把模型文件夹放进 <code>frontend/public/models/</code>{' '}
              后点「重新探测」。
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void apply()}
          disabled={!dirty || saving}
          className="rounded-full bg-pink px-5 py-2.5 text-xs text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-pink-deep hover:shadow-lift disabled:cursor-not-allowed disabled:bg-pink/45 disabled:hover:translate-y-0"
        >
          {saving ? '应用中…' : '应用'}
        </button>
        <button
          type="button"
          onClick={requestReload}
          className="rounded-full bg-white/80 px-4 py-2.5 text-xs text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          重新加载
        </button>
        {savedAt && !dirty ? (
          <span className="text-[10px] text-ink-soft" role="status">
            ✓ 已应用
          </span>
        ) : null}
      </div>

      <dl className="flex flex-col gap-1 rounded-bubble bg-white/55 px-4 py-3 text-[11px]">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">加载状态</dt>
          <dd className={modelStatus === 'error' ? 'text-pink-deep' : 'text-ink'}>
            {statusLabel[modelStatus]}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">当前表情</dt>
          <dd className="text-ink">
            {appliedExpression ?? (modelStatus === 'ready' ? '该模型无表情文件' : '—')}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">当前情绪</dt>
          <dd className="text-ink">{emotion}</dd>
        </div>
        {modelError ? (
          <p className="mt-1 break-all text-pink-deep">加载错误：{modelError}</p>
        ) : null}
      </dl>

      <p className="text-[10px] leading-relaxed text-ink-soft">
        模型版权由使用者自行承担，本仓库不内置任何模型文件。
      </p>
    </div>
  );
}
