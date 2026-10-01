import { create } from 'zustand';
import { getJsonSetting, setJsonSetting } from '../db/repositories/settingsRepository';

export type AppView = 'welcome' | 'wizard' | 'chat';

export const WIZARD_STEP_COUNT = 3;

interface UiPreferences {
  sidebarOpen: boolean;
}

const UI_PREFERENCES_KEY = 'ui.preferences';

const DEFAULT_PREFERENCES: UiPreferences = {
  sidebarOpen: false,
};

interface UiState {
  /** 当前顶层视图：欢迎页 / 引导向导 / 聊天主界面 */
  view: AppView;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  /** 向导步骤下标，0 起 */
  wizardStep: number;
  setView: (view: AppView) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSettingsOpen: (open: boolean) => void;
  toggleSettings: () => void;
  setWizardStep: (step: number) => void;
  nextWizardStep: () => void;
  prevWizardStep: () => void;
  resetWizard: () => void;
  /** 从 IndexedDB 恢复 UI 偏好 */
  hydrate: () => Promise<void>;
}

export const useUiStore = create<UiState>()((set, get) => ({
  view: 'welcome',
  sidebarOpen: DEFAULT_PREFERENCES.sidebarOpen,
  settingsOpen: false,
  wizardStep: 0,

  setView: (view) => set({ view }),

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
    void setJsonSetting(UI_PREFERENCES_KEY, { ...DEFAULT_PREFERENCES, sidebarOpen: open });
  },

  toggleSidebar: () => get().setSidebarOpen(!get().sidebarOpen),

  setSettingsOpen: (open) => set({ settingsOpen: open }),

  toggleSettings: () => set({ settingsOpen: !get().settingsOpen }),

  setWizardStep: (step) => set({ wizardStep: Math.min(Math.max(step, 0), WIZARD_STEP_COUNT - 1) }),

  nextWizardStep: () => get().setWizardStep(get().wizardStep + 1),

  prevWizardStep: () => get().setWizardStep(get().wizardStep - 1),

  resetWizard: () => set({ wizardStep: 0 }),

  hydrate: async () => {
    const preferences = await getJsonSetting<UiPreferences>(
      UI_PREFERENCES_KEY,
      DEFAULT_PREFERENCES,
    );
    set({ sidebarOpen: preferences.sidebarOpen });
  },
}));
