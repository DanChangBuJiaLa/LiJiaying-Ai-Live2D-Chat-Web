import { describe, expect, it } from 'vitest';
import { emotionToAction, emotionToExpression, resolveEmotion } from './emotion';

describe('resolveEmotion', () => {
  it('识别标准情绪值并给出对应表情/动作', () => {
    expect(resolveEmotion('happy').expression).toBe('smile');
    expect(resolveEmotion('happy').action).toBe('jump');
    expect(resolveEmotion('sad').expression).toBe('cry');
    expect(resolveEmotion('neutral').action).toBe('idle');
  });

  it('把同义词与大小写差异收敛到同一档', () => {
    expect(resolveEmotion('Happy').emotion).toBe('happy');
    expect(resolveEmotion('JOYFUL').emotion).toBe('happy');
    expect(resolveEmotion(' 害羞 ').emotion).toBe('shy');
    expect(resolveEmotion('委屈').emotion).toBe('sad');
  });

  it('无法识别或字段缺失时回落到 neutral，而不是抛错', () => {
    const fallback = resolveEmotion('某种模型自创的奇怪情绪');
    expect(fallback.emotion).toBe('neutral');
    expect(resolveEmotion(undefined).emotion).toBe('neutral');
    expect(resolveEmotion(null).emotion).toBe('neutral');
    expect(resolveEmotion('').emotion).toBe('neutral');
  });

  it('同义词匹配是整串精确匹配，不会因子串误判', () => {
    // 「兴奋」是 happy 的同义词，但整句并不等于「兴奋」
    expect(resolveEmotion('兴奋到模糊但其实是 emo').emotion).toBe('neutral');
  });

  it('提供便捷函数只取表情与动作', () => {
    expect(emotionToExpression('shy')).toBe('blush');
    expect(emotionToAction('angry')).toBe('shake');
    expect(emotionToExpression('unknown-value')).toBe('neutral');
  });
});
