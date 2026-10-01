import { useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DiagnosticsPage } from './components/diagnostics/DiagnosticsPage';
import { AppShell } from './components/layout/AppShell';
import { AtmosphereBackground } from './components/layout/AtmosphereBackground';
import { SetupWizard } from './components/onboarding/SetupWizard';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { SETTINGS_KEYS } from './constants/settingsKeys';
import { setSetting } from './db/repositories/settingsRepository';
import { useAppBootstrap } from './hooks/useAppBootstrap';
import { useUiStore } from './stores/uiStore';

/** 首屏加载遮罩 */
function BootVeil() {
  return (
    <div className="relative grid h-full place-items-center">
      <AtmosphereBackground />
      <p
        className="animate-fade-in font-display text-lg text-ink-soft"
        role="status"
        aria-live="polite"
      >
        正在唤醒角色…
      </p>
    </div>
  );
}

/** 首屏分流：欢迎页 → 3 步向导 → 聊天主界面 */
function RootView() {
  const ready = useAppBootstrap();
  const view = useUiStore((state) => state.view);
  const setView = useUiStore((state) => state.setView);

  const handleStart = useCallback(async () => {
    setView('wizard');
    await setSetting(SETTINGS_KEYS.onboardingStarted, 'true');
  }, [setView]);

  if (!ready) {
    return <BootVeil />;
  }

  if (view === 'welcome') {
    return <WelcomeScreen onStart={() => void handleStart()} />;
  }

  if (view === 'wizard') {
    return <SetupWizard />;
  }

  return <AppShell />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootView />} />
      <Route path="/diagnostics" element={<DiagnosticsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
