import { describe, expect, it } from 'vitest';
import type { MessageRole } from '@shared';
import { DEFAULT_CHARACTER } from '../constants/defaultCharacter';
import { buildContextMessages, buildSystemPrompt, DEFAULT_CONTEXT_WINDOW } from './systemPrompt';

describe('buildSystemPrompt', () => {
  it('包含角色名与全部人格段落', () => {
    const prompt = buildSystemPrompt(DEFAULT_CHARACTER);

    expect(prompt).toContain('你是「羽澄糯」');
    expect(prompt).toContain('【身份背景】');
    expect(prompt).toContain('【核心性格】');
    expect(prompt).toContain('【语气风格】');
    expect(prompt).toContain('【口头禅/高频词】');
    expect(prompt).toContain('【重要约束】');
    expect(prompt).toContain('【输出要求】');
  });

  it('强制要求结构化 JSON 且含四个字段', () => {
    const prompt = buildSystemPrompt(DEFAULT_CHARACTER);

    expect(prompt).toContain('"emotion"');
    expect(prompt).toContain('"action"');
    expect(prompt).toContain('"expression"');
    expect(prompt).toContain('"text"');
    expect(prompt).toContain('不要 Markdown 代码块');
  });

  it('省略为空的人格段落，不留下空标题', () => {
    const prompt = buildSystemPrompt({
      name: '测试角色',
      personality: '安静',
      tone: '',
      background: '',
      catchphrase: '',
      taboos: '',
    });

    expect(prompt).toContain('你是「测试角色」');
    expect(prompt).toContain('【核心性格】');
    expect(prompt).not.toContain('【身份背景】');
    expect(prompt).not.toContain('【口头禅/高频词】');
  });
});

describe('buildContextMessages', () => {
  const systemPrompt = 'SYSTEM';

  it('system 消息永远置顶，历史按原顺序跟随', () => {
    const result = buildContextMessages({
      systemPrompt,
      history: [
        { role: 'user' as MessageRole, content: '你好' },
        { role: 'assistant' as MessageRole, content: '你好呀' },
        { role: 'user' as MessageRole, content: '在吗' },
      ],
    });

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ role: 'system', content: systemPrompt });
    expect(result.at(-1)).toEqual({ role: 'user', content: '在吗' });
  });

  it('超过上下文窗口时只保留最近 N 条', () => {
    const history = Array.from({ length: 10 }, (_, index) => ({
      role: 'user' as MessageRole,
      content: `消息 ${index}`,
    }));

    const result = buildContextMessages({ systemPrompt, history, contextWindow: 3 });

    expect(result).toHaveLength(4);
    expect(result[1]?.content).toBe('消息 7');
    expect(result.at(-1)?.content).toBe('消息 9');
  });

  it('过滤掉历史里混入的 system 消息并回落到默认窗口', () => {
    const result = buildContextMessages({
      systemPrompt,
      history: [
        { role: 'system' as MessageRole, content: '旧的 system' },
        { role: 'user' as MessageRole, content: '你好' },
      ],
      contextWindow: 0,
    });

    expect(result).toHaveLength(2);
    expect(result[0]?.content).toBe(systemPrompt);
    expect(result[1]?.content).toBe('你好');
    expect(DEFAULT_CONTEXT_WINDOW).toBeGreaterThan(0);
  });
});
