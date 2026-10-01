import { useCallback, useEffect, useState } from 'react';
import { CUBISM_CORE_URL, importLive2DModel } from '../../services/live2d/cubismRuntime';
import { PixiSmokeTest, type RendererStatus } from '../live2d/PixiSmokeTest';
import { DiagnosticCard, type DiagnosticState } from './DiagnosticCard';

interface SubCheck {
  state: DiagnosticState;
  message: string;
}

const INITIAL: SubCheck = { state: 'checking', message: '检测中……' };

function toMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/**
 * 渲染依赖自检：
 * 1) PixiJS 渲染管线是否可用
 * 2) Cubism Core 运行时能否加载（Live2D 官方运行时不随仓库分发，默认走 CDN）
 * 3) pixi-live2d-display（CJS 包）在 Vite 下能否正常导入
 */
export function RendererCheck() {
  const [pixi, setPixi] = useState<SubCheck>(INITIAL);
  const [core, setCore] = useState<SubCheck>(INITIAL);
  const [live2d, setLive2d] = useState<SubCheck>(INITIAL);

  const handlePixiStatus = useCallback((status: RendererStatus) => {
    setPixi({ state: status.ok ? 'ok' : 'error', message: status.message });
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const module = await importLive2DModel();
        const hasModel = typeof module.Live2DModel === 'function';

        if (!cancelled) {
          setCore({ state: 'ok', message: 'Cubism Core 运行时已就绪' });
          setLive2d({
            state: hasModel ? 'ok' : 'error',
            message: hasModel
              ? 'Live2DModel 导入成功（尚未加载真实模型文件）'
              : '模块已加载，但找不到 Live2DModel 导出',
          });
        }
      } catch (cause) {
        if (cancelled) return;
        const message = toMessage(cause);
        setCore({ state: 'error', message: `${message}\n（当前地址：${CUBISM_CORE_URL}）` });
        setLive2d({ state: 'error', message: 'Cubism Core 未就绪，Live2DModel 暂不可用' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const subChecks = [pixi, core, live2d];
  const overall: DiagnosticState = subChecks.some((item) => item.state === 'error')
    ? 'error'
    : subChecks.every((item) => item.state === 'ok')
      ? 'ok'
      : 'checking';

  const rows: Array<{ label: string; check: SubCheck }> = [
    { label: 'PixiJS 渲染', check: pixi },
    { label: 'Cubism Core', check: core },
    { label: 'Live2DModel', check: live2d },
  ];

  return (
    <DiagnosticCard
      title="3. 渲染依赖（PixiJS + Live2D）"
      description="验证 PixiJS 6 / Cubism Core / pixi-live2d-display 三层依赖"
      state={overall}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PixiSmokeTest onStatus={handlePixiStatus} />
        <ul className="flex-1 space-y-2 text-xs">
          {rows.map((row) => (
            <li key={row.label}>
              <span className="text-ink-soft">{row.label}：</span>
              <span
                className={row.check.state === 'error' ? 'text-pink-deep' : 'text-ink'}
                style={{ whiteSpace: 'pre-line' }}
              >
                {row.check.message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DiagnosticCard>
  );
}
