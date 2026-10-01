/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 地址，默认 http://localhost:3001 */
  readonly VITE_API_URL?: string;
  /** Live2D Cubism Core 运行时地址，默认走 Live2D 官方 CDN */
  readonly VITE_CUBISM_CORE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Cubism Core 运行时通过全局对象注入，pixi-live2d-display 依赖它 */
  Live2DCubismCore?: unknown;
}
