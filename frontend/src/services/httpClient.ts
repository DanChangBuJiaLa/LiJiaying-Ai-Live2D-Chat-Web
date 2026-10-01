import ky from 'ky';

/**
 * 后端 API 基地址。
 * 开发态默认直连本地 Fastify（3001），生产态由 VITE_API_URL 注入。
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

/**
 * 统一 HTTP 客户端。
 * 注意：ky 的 prefixUrl 要求请求路径不能以 "/" 开头，调用时写 'api/chat' 而不是 '/api/chat'。
 */
export const httpClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 60_000,
  retry: 0,
});
