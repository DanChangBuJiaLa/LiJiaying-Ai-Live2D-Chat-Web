import { describe, expect, it } from 'vitest';
import type { Conversation, Message } from '@shared';
import {
  buildConversationExport,
  conversationToMarkdown,
  exportTimestamp,
  sanitizeFileName,
} from './conversationExport';

const conversation: Conversation = {
  id: 'c1',
  title: '今天有点累',
  characterId: 'char-1',
  activeModelId: 'model-1',
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:10:00.000Z',
};

const messages: Message[] = [
  {
    id: 'm1',
    conversationId: 'c1',
    role: 'user',
    content: '今天有点累',
    createdAt: '2026-10-01T00:05:00.000Z',
  },
  {
    id: 'm2',
    conversationId: 'c1',
    role: 'assistant',
    content: '我不太会安慰人，但我可以听你说。',
    emotion: 'sad',
    createdAt: '2026-10-01T00:06:00.000Z',
  },
];

describe('buildConversationExport', () => {
  it('带上角色设定与会话消息，作为完整本地备份', () => {
    const payload = buildConversationExport(
      null,
      [{ conversation, messages }],
      '2026-10-02T00:00:00.000Z',
    );

    expect(payload.app).toBe('Ai-Live2D Chat');
    expect(payload.exportedAt).toBe('2026-10-02T00:00:00.000Z');
    expect(payload.conversations).toHaveLength(1);
    expect(payload.conversations[0]?.title).toBe('今天有点累');
    expect(payload.conversations[0]?.messages).toHaveLength(2);
  });

  it('没有会话时也能导出空结构', () => {
    const payload = buildConversationExport(null, []);
    expect(payload.conversations).toEqual([]);
  });
});

describe('conversationToMarkdown', () => {
  it('输出标题、元信息与逐条消息', () => {
    const markdown = conversationToMarkdown(conversation, messages, '羽澄糯');

    expect(markdown).toContain('# 今天有点累');
    expect(markdown).toContain('- 角色：羽澄糯');
    expect(markdown).toContain('- 消息数：2');
    expect(markdown).toContain('**你**');
    expect(markdown).toContain('今天有点累');
    expect(markdown).toContain('羽澄糯');
    expect(markdown).toContain('我不太会安慰人，但我可以听你说。');
  });

  it('带上情绪标签，并能识别同义词', () => {
    const markdown = conversationToMarkdown(conversation, messages, '羽澄糯');
    expect(markdown).toContain('难过');
  });

  it('跳过 system 消息', () => {
    const markdown = conversationToMarkdown(
      conversation,
      [
        {
          id: 'm0',
          conversationId: 'c1',
          role: 'system',
          content: 'SYSTEM PROMPT 不应该出现在导出里',
          createdAt: '2026-10-01T00:00:00.000Z',
        },
        ...messages,
      ],
      '羽澄糯',
    );

    expect(markdown).not.toContain('SYSTEM PROMPT');
    expect(markdown).toContain('- 消息数：3');
  });
});

describe('exportTimestamp', () => {
  it('生成适合放进文件名的本地时间戳', () => {
    expect(exportTimestamp(new Date(2026, 9, 2, 1, 30))).toBe('2026-10-02_0130');
  });
});

describe('sanitizeFileName', () => {
  it('把非法字符与空白替换成下划线', () => {
    expect(sanitizeFileName('a/b:c*d?e"f<g>h|i j')).toBe('a_b_c_d_e_f_g_h_i_j');
  });

  it('空标题回落到默认名', () => {
    expect(sanitizeFileName('   ')).toBe('conversation');
    expect(sanitizeFileName('')).toBe('conversation');
  });

  it('过长的标题会被截断', () => {
    expect(sanitizeFileName('x'.repeat(100))).toHaveLength(40);
  });
});
