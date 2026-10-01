import * as PIXI from 'pixi.js';

/**
 * Live2D Cubism Core 运行时（Cubism 4/5 模型必需）。
 * 该文件属于 Live2D 官方运行时，不随本仓库分发：
 * 默认从官方 CDN 加载，可通过 VITE_CUBISM_CORE_URL 指向自托管地址（离线 / 内网场景）。
 */
const DEFAULT_CUBISM_CORE_URL =
  'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js';

export const CUBISM_CORE_URL = import.meta.env.VITE_CUBISM_CORE_URL ?? DEFAULT_CUBISM_CORE_URL;

let corePromise: Promise<void> | null = null;

/** 加载 Cubism Core，同一页面只会真正加载一次 */
export function loadCubismCore(): Promise<void> {
  if (window.Live2DCubismCore) {
    return Promise.resolve();
  }

  if (corePromise) {
    return corePromise;
  }

  corePromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CUBISM_CORE_URL;
    script.async = true;

    script.onload = () => {
      if (window.Live2DCubismCore) {
        resolve();
      } else {
        reject(new Error('Cubism Core 脚本已加载，但未注入 Live2DCubismCore 全局对象'));
      }
    };

    script.onerror = () => {
      reject(new Error(`Cubism Core 加载失败：${CUBISM_CORE_URL}`));
    };

    document.head.appendChild(script);
  }).catch((error: unknown) => {
    // 失败时不缓存，允许用户改完配置后重试
    corePromise = null;
    throw error;
  });

  return corePromise;
}

/**
 * 取到 Live2DModel 类。
 * 使用 cubism4 子入口（而非包根入口），避免在缺少 Cubism 2 运行时的情况下直接抛错。
 */
export async function importLive2DModel(): Promise<typeof import('pixi-live2d-display/cubism4')> {
  await loadCubismCore();

  // pixi-live2d-display 内部通过全局 PIXI 取 Ticker，必须先挂到 window 上
  (window as Window & { PIXI?: typeof PIXI }).PIXI = PIXI;

  return import('pixi-live2d-display/cubism4');
}
