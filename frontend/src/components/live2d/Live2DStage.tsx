import clsx from 'clsx';
import { useResolvedModelUrl } from '../../hooks/useResolvedModelUrl';
import { useLive2dStore } from '../../stores/live2dStore';
import { Live2DCanvas } from './Live2DCanvas';
import { StagePlaceholder } from './StagePlaceholder';

export interface Live2DStageProps {
  /** 无模型时显示的引导文案 */
  hint?: string;
}

/**
 * 全屏角色舞台（主视觉层）。
 * 优先渲染真实的 Live2D 模型；未导入 / 加载失败时回落到占位插画（立项文档 2.3 的降级要求）。
 * 情绪光晕由 LLM 返回的 emotion 驱动，与模型表情同步变化。
 */
export function Live2DStage({ hint }: Live2DStageProps) {
  const glow = useLive2dStore((state) => state.glow);
  const emotion = useLive2dStore((state) => state.emotion);
  const modelStatus = useLive2dStore((state) => state.modelStatus);
  const modelError = useLive2dStore((state) => state.modelError);
  const appliedExpression = useLive2dStore((state) => state.appliedExpression);
  const requestReload = useLive2dStore((state) => state.requestReload);

  const { url, status: resolveStatus } = useResolvedModelUrl();

  const modelReady = modelStatus === 'ready';
  const showPlaceholder = !url || modelStatus === 'error';
  const loading = Boolean(url) && !modelReady && modelStatus !== 'error';

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* 情绪光晕：随 LLM 返回的 emotion 变色 */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 68%)` }}
      />

      {/* 角色区域：底部留出聊天条的位置。用 min() 兜住大屏——否则 4K/1080p 下会留出一大块空白 */}
      <div className="absolute inset-x-0 bottom-[min(20vh,160px)] top-0 flex items-center justify-center">
        {/* 真实模型层常驻挂载，加载完成后淡入，避免切换时闪一下 */}
        {url ? (
          <div
            className={clsx(
              'absolute inset-0 transition-opacity duration-700',
              modelReady ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Live2DCanvas url={url} />
          </div>
        ) : null}

        {showPlaceholder ? (
          <div className="relative flex animate-fade-in flex-col items-center gap-4">
            <StagePlaceholder />
            {hint ? (
              <p className="max-w-sm text-center text-xs leading-relaxed text-ink-soft">{hint}</p>
            ) : null}
            {modelError ? (
              <div className="flex flex-col items-center gap-2">
                <p className="max-w-sm text-center text-xs text-pink-deep">
                  模型加载失败，已切换到占位插画：{modelError}
                </p>
                <button
                  type="button"
                  onClick={requestReload}
                  className="rounded-full bg-white/80 px-4 py-1.5 text-[11px] text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  重新加载模型
                </button>
              </div>
            ) : null}
            {resolveStatus === 'resolving' ? (
              <p className="text-xs text-ink-soft">正在检查本地模型目录…</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* 加载中提示 */}
      {loading && !showPlaceholder ? (
        <p className="absolute inset-x-0 top-1/2 text-center text-xs text-ink-soft">
          正在加载 Live2D 模型…
        </p>
      ) : null}

      {/* 模型状态徽标：让「情绪驱动表情」的变化可被确认 */}
      {modelReady ? (
        <div className="absolute bottom-[min(24vh,192px)] left-5 z-10 flex animate-fade-in items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-[10px] text-ink-soft shadow-soft">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: glow }}
            aria-hidden
          />
          情绪 {emotion}
          {appliedExpression ? ` · 表情 ${appliedExpression}` : ' · 该模型无表情文件'}
        </div>
      ) : null}

      {/* 底部渐隐，保证聊天区的文字在角色之上依然可读 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[48vh] bg-gradient-to-t from-cream/90 via-cream/50 to-transparent"
      />
    </div>
  );
}
