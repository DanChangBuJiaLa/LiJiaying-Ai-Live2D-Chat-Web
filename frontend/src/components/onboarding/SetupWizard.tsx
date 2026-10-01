import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { LLM_PROVIDER_PRESETS, type CharacterDraft, type ModelConfigDraft } from '@shared';
import { DEFAULT_CHARACTER } from '../../constants/defaultCharacter';
import { SETTINGS_KEYS, type Live2dSource } from '../../constants/settingsKeys';
import { setSetting } from '../../db/repositories/settingsRepository';
import { testModelConnection } from '../../services/modelApi';
import { useCharacterStore } from '../../stores/characterStore';
import { useChatStore } from '../../stores/chatStore';
import { useLive2dStore } from '../../stores/live2dStore';
import { useModelStore } from '../../stores/modelStore';
import { useUiStore } from '../../stores/uiStore';
import { AtmosphereBackground } from '../layout/AtmosphereBackground';
import { WizardStepper } from './WizardStepper';
import { CharacterStep } from './steps/CharacterStep';
import { LlmStep, type ConnectionTestState } from './steps/LlmStep';
import { ModelStep } from './steps/ModelStep';

const STEPS = [
  { title: '配置模型', desc: 'API 与 Key' },
  { title: '确认角色', desc: '人格设定' },
  { title: '导入角色外观', desc: 'Live2D 模型' },
] as const;

/** 首次引导 3 步向导。第 1 步测试连接不通过则无法继续（没有任何跳过入口） */
export function SetupWizard() {
  const step = useUiStore((state) => state.wizardStep);
  const setWizardStep = useUiStore((state) => state.setWizardStep);
  const setView = useUiStore((state) => state.setView);

  const character = useCharacterStore((state) => state.character);
  const saveCharacter = useCharacterStore((state) => state.save);
  const addModel = useModelStore((state) => state.add);

  const [llmDraft, setLlmDraft] = useState<ModelConfigDraft>(() => ({
    provider: 'mock',
    apiUrl: LLM_PROVIDER_PRESETS.mock.apiUrl,
    apiKey: '',
    modelName: LLM_PROVIDER_PRESETS.mock.modelName,
    contextWindow: 20,
  }));
  const [testState, setTestState] = useState<ConnectionTestState>({ status: 'idle', message: '' });
  const [characterDraft, setCharacterDraft] = useState<CharacterDraft>(
    () => character ?? DEFAULT_CHARACTER,
  );
  const [live2dSource, setLive2dSource] = useState<Live2dSource>('placeholder');
  const [modelUrl, setModelUrl] = useState('');
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');

  const patchLlm = useCallback((patch: Partial<ModelConfigDraft>) => {
    setLlmDraft((previous) => ({ ...previous, ...patch }));
    // 配置一改，之前的测试结果就不再可信
    setTestState({ status: 'idle', message: '' });
  }, []);

  const runTest = useCallback(async () => {
    setTestState({ status: 'testing', message: '' });
    try {
      const result = await testModelConnection(llmDraft);
      setTestState({
        status: result.ok ? 'ok' : 'fail',
        message:
          result.latencyMs === undefined
            ? result.message
            : `${result.message}（${result.latencyMs} ms）`,
      });
    } catch (cause) {
      setTestState({
        status: 'fail',
        message: cause instanceof Error ? cause.message : String(cause),
      });
    }
  }, [llmDraft]);

  const finish = useCallback(async () => {
    setFinishing(true);
    setError('');

    try {
      const created = await addModel(llmDraft);
      // 重新运行引导时，确保新配置就是当前激活模型
      await useChatStore.getState().switchModel(created.id);

      const live2dModelPath =
        live2dSource === 'url' && modelUrl.trim() ? modelUrl.trim() : undefined;

      await saveCharacter({ ...characterDraft, live2dModelPath });

      useLive2dStore.getState().setSource(live2dSource);
      useLive2dStore.getState().setModelPath(live2dModelPath ?? null);

      await setSetting(SETTINGS_KEYS.live2dSource, live2dSource);
      await setSetting(SETTINGS_KEYS.onboardingCompleted, 'true');

      setView('chat');

      // 首次进入时让角色说一句开场白（本地生成，不消耗 API）
      if (useChatStore.getState().conversations.length === 0) {
        await useChatStore
          .getState()
          .greetInNewConversation(`嗨～我是${characterDraft.name}，终于见到你啦！嘿嘿～`);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setFinishing(false);
    }
  }, [addModel, characterDraft, live2dSource, llmDraft, modelUrl, saveCharacter, setView]);

  const isLastStep = step === STEPS.length - 1;
  const canAdvance = step === 0 ? testState.status === 'ok' : true;

  return (
    <div className="relative grid h-full place-items-center overflow-y-auto px-6 py-10">
      <AtmosphereBackground />

      <div className="glass-panel w-full max-w-2xl animate-rise-in rounded-panel px-7 py-7 shadow-frosted">
        <header className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="text-2xl text-ink-deep">快速开始</h1>
            <span className="text-[10px] text-ink-soft">3 步之后就能开聊</span>
          </div>
          <WizardStepper current={step} steps={STEPS} />
        </header>

        <div className="mt-5 min-h-[280px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 ? (
                <LlmStep
                  draft={llmDraft}
                  onChange={patchLlm}
                  testState={testState}
                  onTest={() => void runTest()}
                />
              ) : null}

              {step === 1 ? (
                <CharacterStep
                  draft={characterDraft}
                  onChange={(patch) => setCharacterDraft((previous) => ({ ...previous, ...patch }))}
                />
              ) : null}

              {step === 2 ? (
                <ModelStep
                  source={live2dSource}
                  onSourceChange={setLive2dSource}
                  modelUrl={modelUrl}
                  onModelUrlChange={setModelUrl}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="mt-6 flex flex-col gap-3">
          {error ? <p className="text-xs text-pink-deep">出错了：{error}</p> : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setWizardStep(step - 1)}
              disabled={step === 0 || finishing}
              className="rounded-full bg-white/70 px-5 py-2 text-xs text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              上一步
            </button>

            <div className="flex items-center gap-3">
              {!canAdvance ? (
                <span className="text-[10px] text-pink-deep">请先让「测试连接」通过</span>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (isLastStep) {
                    void finish();
                  } else {
                    setWizardStep(step + 1);
                  }
                }}
                disabled={!canAdvance || finishing}
                className="rounded-full bg-pink px-7 py-2 text-xs text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-pink-deep hover:shadow-lift disabled:cursor-not-allowed disabled:bg-pink/45 disabled:hover:translate-y-0"
              >
                {finishing ? '正在保存…' : isLastStep ? '完成，开始聊天' : '下一步'}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
