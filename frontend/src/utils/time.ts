/** 当前时间的 ISO 字符串（全项目统一的时间戳格式） */
export function nowIso(): string {
  return new Date().toISOString();
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

/** 会话侧栏用的简短时间：今天显示 HH:mm，昨天显示「昨天」，更早显示 MM/DD */
export function formatSidebarTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, now)) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return '昨天';
  }

  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

/** 消息气泡下方的完整时间：HH:mm */
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
