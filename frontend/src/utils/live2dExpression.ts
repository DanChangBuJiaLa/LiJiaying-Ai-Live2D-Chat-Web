import { EMOTION_ORDER, type EmotionKey } from './emotion';

/** 模型 model3.json 里 Expressions 的定义结构（只需要 Name） */
export interface ExpressionDefinitionLike {
  Name?: string;
}

/**
 * 决定某个情绪该套用模型里的第几个表情。
 *
 * 模型自带的表情名千奇百怪（比如 F01 / f00 / exp_01），所以策略是：
 * 1. 先按名字精确匹配（忽略大小写）——模型作者命了名就用作者的意思；
 * 2. 匹配不到就按情绪在固定顺序里的下标取模轮换，保证「不同情绪 → 不同表情」稳定可见。
 *
 * @returns 表情下标；模型没有任何表情文件时返回 -1
 */
export function pickExpressionIndex(
  definitions: readonly ExpressionDefinitionLike[],
  expressionName: string,
  emotion: string,
): number {
  if (definitions.length === 0) {
    return -1;
  }

  const wanted = expressionName.trim().toLowerCase();
  const namedIndex = definitions.findIndex(
    (definition) => definition.Name?.toLowerCase() === wanted,
  );
  if (namedIndex >= 0) {
    return namedIndex;
  }

  const order = EMOTION_ORDER.indexOf(emotion as EmotionKey);
  return (order < 0 ? 0 : order) % definitions.length;
}
