import { create } from 'zustand';
import type { ModelConfig, ModelConfigDraft } from '@shared';
import {
  createModelConfig,
  deleteModelConfig,
  getActiveModelConfig,
  listModelConfigs,
  setActiveModelConfig,
  updateModelConfig,
} from '../db/repositories/modelConfigRepository';
import type { LoadStatus } from './characterStore';

interface ModelState {
  configs: ModelConfig[];
  /** 当前激活的模型配置 id */
  activeId: string | null;
  status: LoadStatus;
  error: string | null;
  load: () => Promise<void>;
  add: (draft: ModelConfigDraft) => Promise<ModelConfig>;
  update: (id: string, draft: ModelConfigDraft) => Promise<void>;
  remove: (id: string) => Promise<void>;
  activate: (id: string) => Promise<void>;
}

export const useModelStore = create<ModelState>()((set, get) => ({
  configs: [],
  activeId: null,
  status: 'idle',
  error: null,

  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const [configs, active] = await Promise.all([listModelConfigs(), getActiveModelConfig()]);
      set({ configs, activeId: active?.id ?? null, status: 'ready' });
    } catch (cause) {
      set({
        status: 'error',
        error: cause instanceof Error ? cause.message : String(cause),
      });
    }
  },

  add: async (draft) => {
    const config = await createModelConfig(draft);
    set({
      configs: [...get().configs, config],
      activeId: config.isActive ? config.id : get().activeId,
    });
    return config;
  },

  update: async (id, draft) => {
    const updated = await updateModelConfig(id, draft);
    if (updated) {
      set({ configs: get().configs.map((config) => (config.id === id ? updated : config)) });
    }
  },

  remove: async (id) => {
    await deleteModelConfig(id);
    const configs = await listModelConfigs();
    set({ configs, activeId: configs.find((config) => config.isActive)?.id ?? null });
  },

  activate: async (id) => {
    await setActiveModelConfig(id);
    set({
      activeId: id,
      configs: get().configs.map((config) => ({ ...config, isActive: config.id === id })),
    });
  },
}));

/** 取当前激活的模型配置（供非组件环境使用，例如 chatStore） */
export function selectActiveConfig(state: {
  configs: ModelConfig[];
  activeId: string | null;
}): ModelConfig | undefined {
  return state.configs.find((config) => config.id === state.activeId);
}

/** 组件内使用：读取当前激活配置 */
export function useActiveModelConfig(): ModelConfig | undefined {
  return useModelStore((state) => selectActiveConfig(state));
}
