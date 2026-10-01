import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from '../common/Icon';
import { IconButton } from '../common/IconButton';
import { useCharacterStore } from '../../stores/characterStore';
import { selectActiveConfig, useModelStore } from '../../stores/modelStore';
import { useUiStore } from '../../stores/uiStore';
import { CharacterSettingsTab } from './CharacterSettingsTab';
import { Live2dSettingsTab } from './Live2dSettingsTab';
import { ModelSettingsTab } from './ModelSettingsTab';
import { PreferencesTab } from './PreferencesTab';

type SettingsTabKey = 'model' | 'character' | 'live2d' | 'preferences';

const TABS: Array<{ key: SettingsTabKey; label: string }> = [
  { key: 'model', label: '模型' },
  { key: 'character', label: '角色' },
  { key: 'live2d', label: '立绘' },
  { key: 'preferences', label: '偏好' },
];

/** 设置抽屉：模型 / 角色 / 立绘 / 偏好 四个分区 */
export function SettingsPanel() {
  const open = useUiStore((state) => state.settingsOpen);
  const setOpen = useUiStore((state) => state.setSettingsOpen);

  const character = useCharacterStore((state) => state.character);
  const activeConfig = useModelStore((state) => selectActiveConfig(state));

  const [tab, setTab] = useState<SettingsTabKey>('model');
  const asideRef = useRef<HTMLElement>(null);

  // 收起时用 inert 让面板彻底不可聚焦、不可点击（保留滑出动画）
  useEffect(() => {
    const element = asideRef.current;
    if (!element) {
      return;
    }
    if (open) {
      element.removeAttribute('inert');
    } else {
      element.setAttribute('inert', '');
    }
  }, [open]);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={clsx(
          'fixed inset-0 z-40 bg-ink-deep/15 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        ref={asideRef}
        aria-label="设置"
        className={clsx(
          'glass-panel fixed right-0 top-0 z-50 flex h-full w-[400px] max-w-[94vw] flex-col',
          'rounded-l-panel border-l border-white/70 shadow-frosted',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg text-ink-deep">设置</h2>
            <span className="text-[10px] text-ink-soft">
              角色 {character?.name ?? '未初始化'} · 当前模型 {activeConfig?.modelName ?? '未配置'}
            </span>
          </div>
          <IconButton label="关闭设置" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </header>

        <nav aria-label="设置分区" className="flex gap-1 px-4">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              aria-current={tab === item.key}
              className={clsx(
                'flex-1 rounded-full px-3 py-1.5 text-xs transition duration-200',
                tab === item.key
                  ? 'bg-pink-soft/85 text-ink-deep shadow-soft'
                  : 'text-ink-soft hover:bg-white/60',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="scroll-soft mt-4 flex-1 overflow-y-auto px-4 pb-6">
          {tab === 'model' ? <ModelSettingsTab /> : null}
          {tab === 'character' ? <CharacterSettingsTab /> : null}
          {tab === 'live2d' ? <Live2dSettingsTab /> : null}
          {tab === 'preferences' ? <PreferencesTab /> : null}
        </div>
      </aside>
    </>
  );
}
