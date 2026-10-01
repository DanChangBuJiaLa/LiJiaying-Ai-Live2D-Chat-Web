import clsx from 'clsx';
import {
  LLM_PROVIDERS,
  LLM_PROVIDER_LABELS,
  LLM_PROVIDER_PRESETS,
  type LLMProvider,
  type ModelConfigDraft,
} from '@shared';
import { SelectField, TextField } from '../../common/FormField';

export interface ConnectionTestState {
  status: 'idle' | 'testing' | 'ok' | 'fail';
  message: string;
}

export interface LlmStepProps {
  draft: ModelConfigDraft;
  onChange: (patch: Partial<ModelConfigDraft>) => void;
  testState: ConnectionTestState;
  onTest: () => void;
  /** 测试按钮右侧的提示文案（向导与设置面板措辞不同） */
  testHint?: string;
}

/** LLM 配置表单：向导第 1 步与设置面板共用（同一套字段与「先测试才能保存/继续」的门禁） */
export function LlmStep({
  draft,
  onChange,
  testState,
  onTest,
  testHint = '测试通过后才能进入下一步',
}: LlmStepProps) {
  const preset = LLM_PROVIDER_PRESETS[draft.provider];
  const testing = testState.status === 'testing';

  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="模型厂商"
        hint={preset.hint}
        value={draft.provider}
        onChange={(event) => {
          const provider = event.target.value as LLMProvider;
          const next = LLM_PROVIDER_PRESETS[provider];
          // 切换厂商时自动带上默认地址与模型名，减少手填成本
          onChange({ provider, apiUrl: next.apiUrl, modelName: next.modelName });
        }}
      >
        {LLM_PROVIDERS.map((provider) => (
          <option key={provider} value={provider}>
            {LLM_PROVIDER_LABELS[provider]}
          </option>
        ))}
      </SelectField>

      <TextField
        label="API 地址"
        hint="OpenAI 兼容格式，一般以 /v1 结尾"
        value={draft.apiUrl}
        onChange={(event) => onChange({ apiUrl: event.target.value })}
        placeholder="https://api.deepseek.com/v1"
        spellCheck={false}
      />

      <TextField
        label="API Key"
        hint={preset.requiresApiKey ? '必填，只保存在本机' : '该厂商不需要 Key'}
        type="password"
        autoComplete="off"
        disabled={!preset.requiresApiKey}
        value={draft.apiKey}
        onChange={(event) => onChange({ apiKey: event.target.value })}
        placeholder={preset.requiresApiKey ? 'sk-…' : '无需填写'}
        spellCheck={false}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="模型名"
          value={draft.modelName}
          onChange={(event) => onChange({ modelName: event.target.value })}
          placeholder="deepseek-chat"
          spellCheck={false}
        />
        <TextField
          label="上下文窗口"
          hint="保留最近多少条消息"
          type="number"
          min={2}
          max={200}
          value={draft.contextWindow}
          onChange={(event) => onChange({ contextWindow: Number(event.target.value) || 20 })}
        />
      </div>

      <div className="flex flex-col gap-2 rounded-bubble bg-white/55 p-3">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onTest}
            disabled={testing}
            className={clsx(
              'rounded-full px-5 py-2 text-xs text-white transition duration-200',
              testing
                ? 'cursor-wait bg-pink/50'
                : 'bg-pink hover:-translate-y-0.5 hover:bg-pink-deep hover:shadow-soft',
            )}
          >
            {testing ? '测试中…' : '测试连接'}
          </button>
          <span className="text-[10px] text-ink-soft">{testHint}</span>
        </div>

        {testState.status !== 'idle' && testState.status !== 'testing' ? (
          <p
            role="status"
            className={clsx(
              'animate-fade-in text-xs leading-relaxed',
              testState.status === 'ok' ? 'text-ink-deep' : 'text-pink-deep',
            )}
          >
            {testState.status === 'ok' ? '✓ ' : '✕ '}
            {testState.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
