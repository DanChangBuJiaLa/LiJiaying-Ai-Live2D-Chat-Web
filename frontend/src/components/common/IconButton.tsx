import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 无障碍标签，同时作为 title 提示 */
  label: string;
  active?: boolean;
  children: ReactNode;
}

/** 圆形毛玻璃图标按钮：顶栏与面板头部统一使用 */
export function IconButton({ label, active, className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={clsx(
        'glass-panel grid h-10 w-10 place-items-center rounded-full text-ink shadow-soft',
        'transition duration-200 hover:-translate-y-0.5 hover:text-ink-deep hover:shadow-lift',
        'active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        active && 'text-pink-deep ring-1 ring-pink/60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
