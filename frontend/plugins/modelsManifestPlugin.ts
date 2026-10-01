import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const MODEL_FILE_PATTERN = /\.model3?\.json$/i;
const MANIFEST_ROUTE = '/models/manifest.json';

function collectModelFiles(dir: string, root: string, acc: string[] = []): string[] {
  let entries: fs.Dirent[];

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectModelFiles(fullPath, root, acc);
      continue;
    }

    if (MODEL_FILE_PATTERN.test(entry.name)) {
      const relative = path.relative(root, fullPath).split(path.sep).join('/');
      acc.push(`/models/${relative}`);
    }
  }

  return acc;
}

export interface ModelsManifestOptions {
  /** 绝对路径：frontend/public/models */
  modelsDir: string;
}

/**
 * 生成 `public/models` 的模型清单，供「本地目录自动探测」使用。
 * - dev：中间件直接响应 /models/manifest.json（避免手动维护文件）
 * - build：作为静态资源写入 dist/models/manifest.json
 */
export function modelsManifestPlugin({ modelsDir }: ModelsManifestOptions): Plugin {
  const buildManifest = (): string => {
    const models = collectModelFiles(modelsDir, modelsDir).sort();
    return JSON.stringify({ models }, null, 2);
  };

  return {
    name: 'ai-live2d:models-manifest',

    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = request.url?.split('?')[0];
        if (url !== MANIFEST_ROUTE) {
          next();
          return;
        }

        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(buildManifest());
      });
    },

    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'models/manifest.json',
        source: buildManifest(),
      });
    },
  };
}
