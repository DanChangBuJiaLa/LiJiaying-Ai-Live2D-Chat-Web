import { z } from 'zod';

const ManifestSchema = z.object({
  models: z.array(z.string()),
});

const MANIFEST_URL = `${import.meta.env.BASE_URL}models/manifest.json`;

/**
 * 读取 `public/models` 目录下的模型清单。
 * 清单由构建期 Vite 插件（plugins/modelsManifestPlugin.ts）生成，
 * 浏览器无法直接列举目录，这是「本地目录自动探测」的实现方式。
 */
export async function fetchModelManifest(): Promise<string[]> {
  try {
    const response = await fetch(MANIFEST_URL, { cache: 'no-store' });
    if (!response.ok) {
      return [];
    }

    const parsed = ManifestSchema.safeParse(await response.json());
    return parsed.success ? parsed.data.models : [];
  } catch {
    // 清单不存在时按「目录里没有模型」处理，由调用方回落到占位插画
    return [];
  }
}
