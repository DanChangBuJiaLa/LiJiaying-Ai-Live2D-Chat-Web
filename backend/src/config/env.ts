import { z } from 'zod';

/**
 * 后端环境变量（Zod 校验，缺失即报错）
 * 通过 process.env 读取，不依赖 dotenv（Docker / npm script 注入）。
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3001),
  /** mock = 离线演示回复；live = 真实 LLM（第一版后端尚未实现，仍走 mock） */
  LLM_MODE: z.enum(['mock', 'live']).default('mock'),
  /** 允许跨域的前端地址，多个用英文逗号分隔 */
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export const env = EnvSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((item) => item.trim())
  .filter(Boolean);
