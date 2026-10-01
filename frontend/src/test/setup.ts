import '@testing-library/jest-dom/vitest';
// 为 Node 环境提供 IndexedDB 实现，让 Dexie 仓储层可以在测试里跑
import 'fake-indexeddb/auto';
