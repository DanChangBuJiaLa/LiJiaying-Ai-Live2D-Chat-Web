import clsx from 'clsx';

export interface StagePlaceholderProps {
  /** 覆盖默认尺寸（默认占舞台主体高度） */
  className?: string;
}

/**
 * 未加载 Live2D 模型时的占位插画（内联 SVG）。
 * 手绘风格，零网络请求、零版权风险；导入模型后本组件会被真实模型替换。
 */
export function StagePlaceholder({ className }: StagePlaceholderProps) {
  return (
    <svg
      viewBox="0 0 240 300"
      role="img"
      aria-label="Live2D 角色占位插画"
      className={clsx(
        'w-auto animate-float drop-shadow-[0_24px_48px_rgba(160,130,130,0.28)]',
        className ?? 'h-[46vh] max-h-[440px]',
      )}
    >
      {/* 双马尾 */}
      <ellipse cx="58" cy="152" rx="26" ry="58" fill="#FFD9E2" />
      <ellipse cx="182" cy="152" rx="26" ry="58" fill="#FFD9E2" />

      {/* 身体（连衣裙） */}
      <path
        d="M120 168c-35 0-60 27-64 64-1 8 4 14 12 14h104c8 0 13-6 12-14-4-37-29-64-64-64z"
        fill="#FFF1CC"
      />
      <path d="M120 200c-10 0-18 6-18 14s8 12 18 12 18-4 18-12-8-14-18-14z" fill="#FFE3A3" />

      {/* 脖子 */}
      <rect x="110" y="146" width="20" height="26" rx="10" fill="#FFEAD9" />

      {/* 头 */}
      <circle cx="120" cy="110" r="52" fill="#FFEAD9" />

      {/* 刘海 */}
      <path
        d="M70 106c3-32 24-50 50-50s47 18 50 50c-15-15-29-21-50-21s-35 6-50 21z"
        fill="#E8C7A8"
      />

      {/* 发圈 */}
      <circle cx="72" cy="104" r="9" fill="#FFB8C8" />
      <circle cx="168" cy="104" r="9" fill="#FFB8C8" />

      {/* 眼睛 */}
      <ellipse cx="102" cy="116" rx="7" ry="9.5" fill="#6B5B57" />
      <ellipse cx="138" cy="116" rx="7" ry="9.5" fill="#6B5B57" />
      <circle cx="104.6" cy="112" r="2.4" fill="#FFFFFF" />
      <circle cx="140.6" cy="112" r="2.4" fill="#FFFFFF" />

      {/* 腮红 */}
      <ellipse cx="86" cy="132" rx="10" ry="6" fill="#FFB8C8" opacity="0.66" />
      <ellipse cx="154" cy="132" rx="10" ry="6" fill="#FFB8C8" opacity="0.66" />

      {/* 微笑 */}
      <path
        d="M113 137c3.4 4.4 10.6 4.4 14 0"
        stroke="#B98D7E"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
