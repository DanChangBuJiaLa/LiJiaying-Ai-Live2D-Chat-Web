import { z } from 'zod';

/** 角色人格设定（第一版只有 1 条默认记录） */
export const CharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, '角色名不能为空'),
  /** 性格描述 */
  personality: z.string().default(''),
  /** 语气风格 */
  tone: z.string().default(''),
  /** 身份背景 */
  background: z.string().default(''),
  /** 口头禅 */
  catchphrase: z.string().default(''),
  /** 禁忌话题 */
  taboos: z.string().default(''),
  /** 火山引擎 TTS 音色 ID（Phase 2 使用） */
  ttsVoiceId: z.string().optional(),
  /** Live2D 模型路径或 URL */
  live2dModelPath: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 新建 / 编辑角色时提交的字段（id 与时间戳由存储层生成） */
export const CharacterDraftSchema = CharacterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Character = z.infer<typeof CharacterSchema>;
export type CharacterDraft = z.infer<typeof CharacterDraftSchema>;
