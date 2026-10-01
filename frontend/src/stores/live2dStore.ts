import { create } from 'zustand';
import type { Live2dSource } from '../constants/settingsKeys';
import { resolveEmotion } from '../utils/emotion';

export type ModelLoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface Live2dState {
  /** 当前情绪档位（已归一化） */
  emotion: string;
  /** 当前表情名 */
  expression: string;
  /** 当前动作名 */
  action: string;
  /** 情绪主题色，用于角色区域光晕 */
  glow: string;
  /** Live2D 模型地址（URL 或 /models/ 下的相对路径） */
  modelPath: string | null;
  /** 模型来源：占位插画 / 本地目录自动探测 / 手填 URL */
  source: Live2dSource;
  modelStatus: ModelLoadStatus;
  modelError: string | null;
  /** 实际应用到模型上的表情名，便于界面反馈与排查 */
  appliedExpression: string | null;
  /** 自增令牌：变化时强制重新加载同一个模型（「重新加载」按钮用） */
  reloadToken: number;
  /** 由 LLM 返回值驱动表情/动作切换；模型显式给出的 expression/action 优先，缺省则按 emotion 推导 */
  setEmotion: (emotion: string, explicit?: { expression?: string; action?: string }) => void;
  setModelPath: (path: string | null) => void;
  setSource: (source: Live2dSource) => void;
  setModelStatus: (status: ModelLoadStatus, error?: string | null) => void;
  setAppliedExpression: (label: string | null) => void;
  requestReload: () => void;
  reset: () => void;
}

const NEUTRAL = resolveEmotion('neutral');

export const useLive2dStore = create<Live2dState>()((set) => ({
  emotion: NEUTRAL.emotion,
  expression: NEUTRAL.expression,
  action: NEUTRAL.action,
  glow: NEUTRAL.glow,
  modelPath: null,
  source: 'placeholder',
  modelStatus: 'idle',
  modelError: null,
  appliedExpression: null,
  reloadToken: 0,

  setEmotion: (emotion, explicit) => {
    const visual = resolveEmotion(emotion);
    set({
      emotion: visual.emotion,
      expression: explicit?.expression?.trim() || visual.expression,
      action: explicit?.action?.trim() || visual.action,
      glow: visual.glow,
    });
  },

  setModelPath: (path) => set({ modelPath: path }),

  setSource: (source) => set({ source }),

  setModelStatus: (status, error = null) => set({ modelStatus: status, modelError: error }),

  setAppliedExpression: (label) => set({ appliedExpression: label }),

  requestReload: () => set((state) => ({ reloadToken: state.reloadToken + 1 })),

  reset: () =>
    set({
      emotion: NEUTRAL.emotion,
      expression: NEUTRAL.expression,
      action: NEUTRAL.action,
      glow: NEUTRAL.glow,
    }),
}));
