import { useEffect, useState } from 'react';
import { fetchModelManifest } from '../services/live2d/modelManifest';
import { useLive2dStore } from '../stores/live2dStore';

export interface ResolvedModel {
  /** 最终要加载的模型地址，null 表示当前没有模型可用 */
  url: string | null;
  status: 'resolving' | 'ready' | 'empty';
}

/**
 * 根据「模型来源」解析出最终要加载的模型地址：
 * - url：直接用设置里填的地址
 * - directory：读取 public/models 清单并取第一个
 * - placeholder：不加载，直接走占位插画
 */
export function useResolvedModelUrl(): ResolvedModel {
  const source = useLive2dStore((state) => state.source);
  const modelPath = useLive2dStore((state) => state.modelPath);
  const [resolved, setResolved] = useState<ResolvedModel>({ url: null, status: 'resolving' });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (source === 'url') {
        const url = modelPath?.trim() ?? '';
        if (!cancelled) {
          setResolved({ url: url || null, status: url ? 'ready' : 'empty' });
        }
        return;
      }

      if (source === 'directory') {
        const models = await fetchModelManifest();
        const [first] = models;
        if (!cancelled) {
          setResolved({ url: first ?? null, status: first ? 'ready' : 'empty' });
        }
        return;
      }

      if (!cancelled) {
        setResolved({ url: null, status: 'empty' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, modelPath]);

  return resolved;
}
