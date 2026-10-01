import { useEffect, useState } from 'react';
import { SETTINGS_KEYS, toLive2dSource } from '../constants/settingsKeys';
import { getActiveModelConfig } from '../db/repositories/modelConfigRepository';
import { getSetting } from '../db/repositories/settingsRepository';
import { useCharacterStore } from '../stores/characterStore';
import { useChatStore } from '../stores/chatStore';
import { useLive2dStore } from '../stores/live2dStore';
import { useModelStore } from '../stores/modelStore';
import { useUiStore, type AppView } from '../stores/uiStore';

/**
 * 应用启动引导：
 * 1) 从 IndexedDB 恢复角色 / 模型配置 / 会话 / UI 偏好 / Live2D 模型设置；
 * 2) 决定初始视图 —— 没有可用模型时强制回到引导流程（清空配置后必须重走向导）。
 */
export function useAppBootstrap(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await Promise.all([
        useCharacterStore.getState().load(),
        useModelStore.getState().load(),
        useChatStore.getState().load(),
        useUiStore.getState().hydrate(),
      ]);

      const [activeConfig, onboardingStarted, live2dSourceRaw] = await Promise.all([
        getActiveModelConfig(),
        getSetting(SETTINGS_KEYS.onboardingStarted),
        getSetting(SETTINGS_KEYS.live2dSource),
      ]);

      if (cancelled) {
        return;
      }

      // Live2D 模型设置：来源存 settings，地址存在角色记录里
      const character = useCharacterStore.getState().character;
      useLive2dStore.getState().setSource(toLive2dSource(live2dSourceRaw));
      useLive2dStore.getState().setModelPath(character?.live2dModelPath ?? null);

      const view: AppView = activeConfig
        ? 'chat'
        : onboardingStarted === 'true'
          ? 'wizard'
          : 'welcome';

      useUiStore.getState().setView(view);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
