import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { modelsManifestPlugin } from './plugins/modelsManifestPlugin';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const sharedSrcDir = path.resolve(rootDir, '../packages/shared/src');

export default defineConfig({
  plugins: [
    react(),
    // 生成 public/models 的模型清单，支撑「本地目录自动探测」
    modelsManifestPlugin({ modelsDir: path.resolve(rootDir, 'public/models') }),
  ],
  resolve: {
    alias: [
      // 共享契约包为「源码直出」，用别名指向 TS 源码，避免额外的构建步骤
      { find: /^@shared$/, replacement: path.resolve(sharedSrcDir, 'index.ts') },
      { find: /^@shared\/(.*)$/, replacement: `${sharedSrcDir}/$1` },
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // 这些目录会频繁写入大文件/临时文件（模型二进制、Playwright 下载产物），
      // 不排除的话 watcher 会因 Windows 文件锁（EBUSY: watch）直接把 dev server 搞崩。
      ignored: [
        '**/public/models/**',
        '**/e2e/.artifacts/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/*.crdownload',
      ],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
