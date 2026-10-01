import clsx from 'clsx';
import type { Live2dSource } from '../../../constants/settingsKeys';
import { TextField } from '../../common/FormField';

export interface ModelStepProps {
  source: Live2dSource;
  onSourceChange: (source: Live2dSource) => void;
  modelUrl: string;
  onModelUrlChange: (url: string) => void;
}

const OPTIONS: Array<{ value: Live2dSource; title: string; desc: string; emoji: string }> = [
  {
    value: 'placeholder',
    title: '先用占位插画',
    desc: '跳过导入，之后随时可以在设置里换成真实模型',
    emoji: '🖼',
  },
  {
    value: 'directory',
    title: '从本地目录自动探测',
    desc: '把模型文件夹放进 frontend/public/models，启动时自动加载第一个找到的模型',
    emoji: '📁',
  },
  {
    value: 'url',
    title: '填写模型 URL',
    desc: '支持远程链接 / CDN / GitHub Raw 地址',
    emoji: '🔗',
  },
];

/** 向导第 3 步：选择 Live2D 模型来源（三种方式，仓库不内置任何模型文件） */
export function ModelStep({ source, onSourceChange, modelUrl, onModelUrlChange }: ModelStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="模型来源" className="flex flex-col gap-2.5">
        <span className="text-xs text-ink">模型来源</span>

        {OPTIONS.map((option) => {
          const active = source === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSourceChange(option.value)}
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

      {source === 'url' ? (
        <TextField
          label="模型地址"
          hint="指向 .model3.json / .model.json"
          value={modelUrl}
          onChange={(event) => onModelUrlChange(event.target.value)}
          placeholder="https://example.com/model/xxx.model3.json"
          spellCheck={false}
        />
      ) : null}

      <p className="text-[10px] leading-relaxed text-ink-soft">
        模型版权由使用者自行承担，本仓库不内置任何模型文件。
      </p>
    </div>
  );
}
