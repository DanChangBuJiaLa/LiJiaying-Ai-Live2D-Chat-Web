/** IndexedDB settings 表的 key 集中管理，避免各处硬编码字符串 */
export const SETTINGS_KEYS = {
  /** 用户已从欢迎页点过「开始使用」 */
  onboardingStarted: 'onboarding.started',
  /** 首次引导三步已走完 */
  onboardingCompleted: 'onboarding.completed',
  /** Live2D 模型来源：placeholder | directory | url */
  live2dSource: 'live2d.source',
  /** UI 偏好（侧栏开合等） */
  uiPreferences: 'ui.preferences',
} as const;

export type Live2dSource = 'placeholder' | 'directory' | 'url';

const LIVE2D_SOURCES: readonly Live2dSource[] = ['placeholder', 'directory', 'url'];

/** 把设置里读到的字符串收敛成合法的模型来源 */
export function toLive2dSource(value: string | null): Live2dSource {
  return LIVE2D_SOURCES.includes(value as Live2dSource) ? (value as Live2dSource) : 'placeholder';
}
