import clsx from 'clsx';

export interface WizardStepperProps {
  current: number;
  steps: readonly { title: string; desc: string }[];
}

/** 向导顶部步骤指示器：已完成 / 当前 / 未开始 三态 */
export function WizardStepper({ current, steps }: WizardStepperProps) {
  return (
    <ol className="flex items-stretch gap-2">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li key={step.title} className="flex flex-1 items-center gap-2">
            <div
              className={clsx(
                'flex flex-1 items-center gap-2.5 rounded-bubble px-3 py-2 transition duration-300',
                active && 'bg-pink-soft/80 shadow-soft',
                done && 'bg-mint-soft/80',
                !active && !done && 'bg-white/45',
              )}
            >
              <span
                className={clsx(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-medium',
                  active && 'bg-pink text-white',
                  done && 'bg-mint text-ink-deep',
                  !active && !done && 'bg-cream-sunk text-ink-soft',
                )}
                aria-hidden
              >
                {done ? '✓' : index + 1}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className={clsx('truncate text-xs', active ? 'text-ink-deep' : 'text-ink')}>
                  {step.title}
                </span>
                <span className="truncate text-[10px] text-ink-soft">{step.desc}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
