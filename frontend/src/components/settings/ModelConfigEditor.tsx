import { useCallback, useState } from 'react';
import { LLM_PROVIDER_PRESETS, type ModelConfig, type ModelConfigDraft } from '@shared';
import { testModelConnection } from '../../services/modelApi';
import { LlmStep, type ConnectionTestState } from '../onboarding/steps/LlmStep';

export const EMPTY_MODEL_DRAFT: ModelConfigDraft = {
  provider: 'mock',
  apiUrl: LLM_PROVIDER_PRESETS.mock.apiUrl,
  apiKey: '',
  modelName: LLM_PROVIDER_PRESETS.mock.modelName,
  contextWindow: 20,
};

export function toDraft(config: ModelConfig): ModelConfigDraft {
  return {
    provider: config.provider,
    apiUrl: config.apiUrl,
    apiKey: config.apiKey,
    modelName: config.modelName,
    contextWindow: config.contextWindow,
  };
}

export interface ModelConfigEditorProps {
  /** 编辑已有配置时传入，新建时为 null */
  initial: ModelConfig | null;
  onSubmit: (draft: ModelConfigDraft) => Promise<void>;
  onCancel: () => void;
}

/** 新增 / 编辑模型配置的表单：改任何字段都会让上一次的测试结果失效 */
export function ModelConfigEditor({ initial, onSubmit, onCancel }: ModelConfigEditorProps) {
  const [draft, setDraft] = useState<ModelConfigDraft>(() =>
    initial ? toDraft(initial) : EMPTY_MODEL_DRAFT,
  );
  const [testState, setTestState] = useState<ConnectionTestState>({ status: 'idle', message: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const patch = useCallback((changes: Partial<ModelConfigDraft>) => {
    setDraft((previous) => ({ ...previous, ...changes }));
    setTestState({ status: 'idle', message: '' });
  }, []);

  const runTest = useCallback(async () => {
    setTestState({ status: 'testing', message: '' });
    try {
      const result = await testModelConnection(draft);
      setTestState({
        status: result.ok ? 'ok' : 'fail',
        message:
          result.latencyMs === undefined
            ? result.message
            : `${result.message}（${result.latencyMs} ms）`,
      });
    } catch (cause) {
      setTestState({
        status: 'fail',
        message: cause instanceof Error ? cause.message : String(cause),
      });
    }
  }, [draft]);

  const save = useCallback(async () => {
    setSaving(true);
    setError('');
    try {
      await onSubmit(draft);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setSaving(false);
    }
  }, [draft, onSubmit]);

  const canSave = testState.status === 'ok' && !saving;

  return (
    <div className="flex flex-col gap-4 rounded-panel bg-white/55 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm text-ink-deep">{initial ? '编辑模型配置' : '新增模型配置'}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-3 py-1 text-[11px] text-ink-soft transition hover:bg-white hover:text-ink"
        >
          取消
        </button>
      </div>

      <LlmStep
        draft={draft}
        onChange={patch}
        testState={testState}
        onTest={() => void runTest()}
        testHint="保存前需要先让测试连接通过"
      />

      {error ? <p className="text-xs text-pink-deep">出错了：{error}</p> : null}

      <button
        type="button"
        onClick={() => void save()}
        disabled={!canSave}
        className="rounded-full bg-pink px-5 py-2.5 text-xs text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-pink-deep hover:shadow-lift disabled:cursor-not-allowed disabled:bg-pink/45 disabled:hover:translate-y-0"
      >
        {saving ? '保存中…' : initial ? '保存修改' : '保存并激活'}
      </button>
    </div>
  );
}
