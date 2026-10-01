import { AtmosphereBackground } from '../layout/AtmosphereBackground';
import { StagePlaceholder } from '../live2d/StagePlaceholder';
import { HeartIcon } from '../common/Icon';

export interface WelcomeScreenProps {
  onStart: () => void;
}

const HIGHLIGHTS = [
  { emoji: '🔒', text: '聊天记录只存在你自己电脑上，不上传任何服务器' },
  { emoji: '🎨', text: '全屏 Live2D 角色 + 情绪驱动表情联动' },
  { emoji: '🧩', text: 'OpenAI / DeepSeek / Ollama 等模型自由切换' },
];

/** 欢迎页：首次打开的唯一入口，点「开始使用」进入 3 步向导 */
export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative grid h-full place-items-center overflow-y-auto px-6 py-10">
      <AtmosphereBackground />

      <div className="glass-panel w-full max-w-2xl animate-rise-in rounded-panel px-8 py-9 text-center shadow-frosted">
        <div className="flex justify-center">
          <StagePlaceholder className="h-[26vh] max-h-[220px]" />
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-soft">
          Ai-Live2D Chat
        </p>
        <h1 className="mt-3 text-3xl leading-snug text-ink-deep">
          和你的 Live2D 角色
          <br />
          聊聊天吧
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          一个本地数据优先的二次元虚拟角色聊天应用。填一次 API Key，之后每次打开都能直接开聊。
        </p>

        <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-left">
          {HIGHLIGHTS.map((item, index) => (
            <li
              key={item.text}
              className="animate-rise-in rounded-bubble bg-white/60 px-4 py-2.5 text-xs leading-relaxed text-ink"
              style={{ animationDelay: `${120 + index * 90}ms` }}
            >
              <span className="mr-2" aria-hidden>
                {item.emoji}
              </span>
              {item.text}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onStart}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-pink px-9 py-3 text-sm text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-pink-deep hover:shadow-lift"
        >
          <HeartIcon size={16} aria-hidden />
          开始使用
        </button>

        <p className="mt-5 text-[10px] text-ink-soft/80">开源 · AGPL-3.0 · 数据全部保存在本地</p>
      </div>
    </div>
  );
}
