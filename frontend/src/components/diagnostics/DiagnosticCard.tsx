import clsx from 'clsx';
import type { ReactNode } from 'react';

export type DiagnosticState = 'idle' | 'checking' | 'ok' | 'error';

const STATE_META: Record<DiagnosticState, { dot: string; label: string; text: string }> = {
  idle: { dot: 'bg-ink-soft/40', label: '待触发', text: 'text-ink-soft' },
  checking: { dot: 'bg-yolk', label: '检测中', text: 'text-ink-soft' },
  ok: { dot: 'bg-mint', label: '通过', text: 'text-ink' },
  error: { dot: 'bg-pink-deep', label: '失败', text: 'text-pink-deep' },
};

export interface DiagnosticCardProps {
  title: string;
  description?: string;
  state: DiagnosticState;
  children?: ReactNode;
  onRetry?: () => void;
}

export function DiagnosticCard({
  title,
  description,
  state,
  children,
  onRetry,
}: DiagnosticCardProps) {
  const meta = STATE_META[state];

  return (
    <section className="rounded-blob border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-ink-deep">{title}</h2>
          {description ? <p className="mt-1 text-xs text-ink-soft">{description}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={clsx('h-2.5 w-2.5 rounded-full', meta.dot)} />
          <span className={clsx('text-xs font-medium', meta.text)}>{meta.label}</span>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full bg-cream-deep px-3 py-1 text-xs text-ink transition hover:bg-pink-soft"
            >
              重试
            </button>
          ) : null}
        </div>
      </header>
      {children ? <div className="mt-4 text-sm text-ink">{children}</div> : null}
    </section>
  );
}
