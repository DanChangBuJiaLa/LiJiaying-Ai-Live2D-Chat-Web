import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/** 侧栏开关 */
export function MenuIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

/** 新建会话 */
export function PlusIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** 设置齿轮 */
export function GearIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3.1" />
      <circle cx="12" cy="12" r="7.4" />
      <path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" />
    </svg>
  );
}

/** 发送 */
export function SendIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3.6 11.2l15.1-6.9c1-.5 2 .5 1.6 1.5l-6.6 15.2c-.4 1-1.9 1-2.3 0l-2.2-5.3-5.3-2.2c-1-.4-1-1.9-.3-2.3z" />
    </svg>
  );
}

/** 删除会话 */
export function TrashIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 7h16M9.5 7V5.5A1.5 1.5 0 0111 4h2a1.5 1.5 0 011.5 1.5V7M6.5 7l.8 11.2A2 2 0 009.3 20h5.4a2 2 0 002-1.8L17.5 7M10.5 11v5M13.5 11v5" />
    </svg>
  );
}

/** 关闭 */
export function CloseIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** 空状态：会话气泡 */
export function ChatBubbleIcon({ size = 32, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5a9.6 9.6 0 01-2.6-.35L5 21l1.2-3.4A6.8 6.8 0 014 12.5C4 8.9 7.6 6 12 6s8 2.9 8 6.5z" />
    </svg>
  );
}

/** 装饰用心心 */
export function HeartIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 20.4l-1.3-1.2C6.1 15.1 3 12.3 3 8.8 3 6.1 5.1 4 7.8 4c1.5 0 3 .7 4.2 2 1.2-1.3 2.7-2 4.2-2C18.9 4 21 6.1 21 8.8c0 3.5-3.1 6.3-7.7 10.4L12 20.4z" />
    </svg>
  );
}
