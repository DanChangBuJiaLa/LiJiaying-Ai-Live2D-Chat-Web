import { Link } from 'react-router-dom';
import { BackendCheck } from './BackendCheck';
import { ChatLinkCheck } from './ChatLinkCheck';
import { PersistenceCheck } from './PersistenceCheck';
import { RendererCheck } from './RendererCheck';
import { ResetCheck } from './ResetCheck';
import { AtmosphereBackground } from '../layout/AtmosphereBackground';

/**
 * 骨架自检页（/diagnostics）。
 * 用于验证链路而不是产品功能，后续新增能力时继续在这里补检查项。
 */
export function DiagnosticsPage() {
  return (
    <div className="relative h-full overflow-y-auto">
      <AtmosphereBackground />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
        <header className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink-soft">
            Diagnostics
          </p>
          <h1 className="mt-3 text-3xl text-ink-deep">Ai-Live2D Chat 骨架自检</h1>
          <p className="mt-2 text-sm text-ink-soft">
            前后端连通 · PixiJS / Live2D 依赖 · Mock 对话链路 · IndexedDB 持久化
          </p>
          <Link
            className="mt-4 inline-block rounded-full bg-white/70 px-5 py-2 text-sm text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            to="/"
          >
            返回聊天界面
          </Link>
        </header>

        <BackendCheck />
        <RendererCheck />
        <ChatLinkCheck />
        <PersistenceCheck />
        <ResetCheck />

        <footer className="pt-2 text-center font-mono text-[11px] text-ink-soft">
          数据全部保存在本地 · AGPL-3.0
        </footer>
      </main>
    </div>
  );
}
