import { describe, expect, it } from 'vitest';
import { pickExpressionIndex } from './live2dExpression';

const definitions = [
  { Name: 'f00' },
  { Name: 'f01' },
  { Name: 'f02' },
  { Name: 'f03' },
  { Name: 'f04' },
  { Name: 'F05' },
];

describe('pickExpressionIndex', () => {
  it('模型没有表情文件时返回 -1（调用方据此降级）', () => {
    expect(pickExpressionIndex([], 'smile', 'happy')).toBe(-1);
  });

  it('优先按表情名精确匹配，忽略大小写', () => {
    expect(pickExpressionIndex(definitions, 'f02', 'happy')).toBe(2);
    expect(pickExpressionIndex(definitions, ' F05 ', 'happy')).toBe(5);
  });

  it('模型没有同名表情时，按情绪固定顺序取模轮换', () => {
    // happy=0, sad=1, angry=2 → 与「至少 happy/sad/neutral 三档可切换」的验收一致
    expect(pickExpressionIndex(definitions, 'smile', 'happy')).toBe(0);
    expect(pickExpressionIndex(definitions, 'cry', 'sad')).toBe(1);
    expect(pickExpressionIndex(definitions, 'pout', 'angry')).toBe(2);
    expect(pickExpressionIndex(definitions, 'blush', 'shy')).toBe(4);
  });

  it('表情数量少于情绪档位时取模，不会越界', () => {
    const few = [{ Name: 'a' }, { Name: 'b' }];
    expect(pickExpressionIndex(few, 'blush', 'shy')).toBe(0);
    expect(pickExpressionIndex(few, 'cry', 'sad')).toBe(1);
  });

  it('未识别的情绪回落到第一个表情', () => {
    expect(pickExpressionIndex(definitions, 'unknown', '某种奇怪情绪')).toBe(0);
  });
});
