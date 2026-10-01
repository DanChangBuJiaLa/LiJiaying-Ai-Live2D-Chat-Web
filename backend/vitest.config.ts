import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const sharedSrcDir = path.resolve(rootDir, '../packages/shared/src');

export default defineConfig({
  resolve: {
    alias: [
      // 与 frontend 保持一致：共享契约包为源码直出
      { find: /^@shared$/, replacement: path.resolve(sharedSrcDir, 'index.ts') },
      { find: /^@shared\/(.*)$/, replacement: `${sharedSrcDir}/$1` },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
