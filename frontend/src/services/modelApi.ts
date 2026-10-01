import { ModelTestResponseSchema, type ModelConfigDraft, type ModelTestResponse } from '@shared';
import { HTTPError } from 'ky';
import { httpClient } from './httpClient';

/**
 * 调用后端做模型连接测试（向导第 1 步的强制校验）。
 * mock 厂商会真实跑通一次对话链路；其余厂商当前只校验配置格式与后端连通性。
 */
export async function testModelConnection(draft: ModelConfigDraft): Promise<ModelTestResponse> {
  try {
    const payload: unknown = await httpClient.post('api/models/test', { json: draft }).json();
    return ModelTestResponseSchema.parse(payload);
  } catch (cause) {
    if (cause instanceof HTTPError) {
      throw new Error(`请求失败（HTTP ${cause.response.status}）。请确认后端已启动：npm run dev`);
    }
    throw cause;
  }
}
