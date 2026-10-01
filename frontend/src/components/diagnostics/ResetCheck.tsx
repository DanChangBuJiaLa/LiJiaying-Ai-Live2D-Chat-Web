import { useCallback, useState } from 'react';
import { clearAllLocalData } from '../../db/repositories/maintenanceRepository';
import { DiagnosticCard, type DiagnosticState } from './DiagnosticCard';

/**
 * 本地数据重置：清空 IndexedDB 后刷新，应用应回到「欢迎页 → 3 步向导」。
 * 对应验收项：清空配置后打开应用必须走完向导才能进入聊天。
 */
export function ResetCheck() {
  const [state, setState] = useState<DiagnosticState>('idle');
  const [pending, setPending] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [error, setError] = useState('');

  const reset = useCallback(async () => {
    setState('checking');
    setError('');
    try {
      await clearAllLocalData();
      setState('ok');
      setCleared(true);
      // 先渲染「已清空」状态再跳转，避免点击与页面跳转抢跑
      window.setTimeout(() => window.location.assign('/'), 900);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setState('error');
    }
  }, []);

  return (
    <DiagnosticCard
      title="5. 本地数据重置"
      description="清空 IndexedDB 并回到首次使用状态，用于验证引导流程的强制门禁"
      state={state}
    >
      {cleared ? (
        <p role="status" className="animate-fade-in text-xs text-ink-deep">
          ✓ 本地数据已清空，正在回到首页…
        </p>
      ) : pending ? (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-ink-deep">会删除全部会话、角色、模型配置与设置，确定继续？</span>
          <button
            type="button"
            onClick={() => void reset()}
            className="rounded-full bg-pink-deep px-4 py-1.5 text-white transition hover:bg-pink-deep/85"
          >
            确认清空
          </button>
          <button
            type="button"
            onClick={() => setPending(false)}
            className="rounded-full bg-white/80 px-4 py-1.5 text-ink transition hover:bg-white"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPending(true)}
          className="rounded-full bg-white/80 px-5 py-2 text-xs text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          清空本地数据并重走引导
        </button>
      )}

      {error ? <p className="mt-3 text-xs text-pink-deep">{error}</p> : null}

      <p className="mt-3 text-xs text-ink-soft">
        清空后刷新页面应停在欢迎页，必须走完 3 步向导（含测试连接）才能进入聊天。
      </p>
    </DiagnosticCard>
  );
}
