import type { Character, Conversation, Message } from '@shared';
import { resolveEmotion } from './emotion';
import { formatMessageTime } from './time';

/** 导出文件的整体结构：一份完整的本地备份 */
export interface ConversationExport {
  app: 'Ai-Live2D Chat';
  version: string;
  exportedAt: string;
  character: Character | null;
  conversations: Array<Conversation & { messages: Message[] }>;
}

export interface ExportEntry {
  conversation: Conversation;
  messages: Message[];
}

/** 组装导出数据（纯函数，方便单测） */
export function buildConversationExport(
  character: Character | null,
  entries: ExportEntry[],
  exportedAt = new Date().toISOString(),
): ConversationExport {
  return {
    app: 'Ai-Live2D Chat',
    version: '0.1.0',
    exportedAt,
    character,
    conversations: entries.map((entry) => ({
      ...entry.conversation,
      messages: entry.messages,
    })),
  };
}

/** 单个会话导出成人类可读的 Markdown */
export function conversationToMarkdown(
  conversation: Conversation,
  messages: Message[],
  characterName: string,
): string {
  const lines: string[] = [
    `# ${conversation.title}`,
    '',
    `- 角色：${characterName}`,
    `- 创建时间：${conversation.createdAt}`,
    `- 最后更新：${conversation.updatedAt}`,
    `- 消息数：${messages.length}`,
    '',
    '---',
    '',
  ];

  for (const message of messages) {
    const time = formatMessageTime(message.createdAt);

    if (message.role === 'user') {
      lines.push(`**你**（${time}）：${message.content}`, '');
      continue;
    }

    if (message.role === 'system') {
      continue;
    }

    const emotion = resolveEmotion(message.emotion).label;
    lines.push(`**${characterName}**（${time} · ${emotion}）：${message.content}`, '');
  }

  return lines.join('\n');
}

/** 触发浏览器下载（纯前端，不经过任何服务器） */
export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

/** 供文件名使用的本地时间戳：2026-10-02_0130 */
export function exportTimestamp(date = new Date()): string {
  const pad = (value: number): string => value.toString().padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `_${pad(date.getHours())}${pad(date.getMinutes())}`
  );
}

/** 会话标题可能带 / : 等字符，直接当文件名会失败 */
export function sanitizeFileName(name: string, fallback = 'conversation'): string {
  const cleaned = name
    .replace(/[\\/:*?"<>|\s]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);

  return cleaned || fallback;
}
