import { useEffect, useRef, useState } from 'react';
import { Live2DStageController } from '../../services/live2d/modelController';
import { useLive2dStore } from '../../stores/live2dStore';

export interface Live2DCanvasProps {
  url: string;
}

function toMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/**
 * 挂载 pixi 画布并加载 Live2D 模型。
 * 这里只负责生命周期；加载失败会把错误写进 live2dStore，由 Live2DStage 决定回落占位插画。
 */
export function Live2DCanvas({ url }: Live2DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Live2DStageController | null>(null);
  const [mounted, setMounted] = useState(false);

  // 挂载 pixi 应用（生命周期内只做一次）
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const controller = new Live2DStageController();
    controllerRef.current = controller;
    let disposed = false;

    controller
      .mount(container)
      .then(() => {
        if (!disposed) {
          setMounted(true);
        }
      })
      .catch((cause: unknown) => {
        if (!disposed) {
          useLive2dStore.getState().setModelStatus('error', toMessage(cause));
        }
      });

    const observer = new ResizeObserver(() => controller.resize());
    observer.observe(container);

    return () => {
      disposed = true;
      observer.disconnect();
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  // 加载模型（url 变化或点「重新加载」时重新拉取）
  const reloadToken = useLive2dStore((state) => state.reloadToken);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!mounted || !controller) {
      return;
    }

    let disposed = false;
    const { setModelStatus, setAppliedExpression } = useLive2dStore.getState();
    setModelStatus('loading');

    controller
      .loadModel(url)
      .then(async () => {
        if (disposed) {
          return;
        }
        setModelStatus('ready');

        const { emotion, expression } = useLive2dStore.getState();
        const applied = await controller.applyEmotion(emotion, expression);
        if (!disposed) {
          setAppliedExpression(applied);
        }
      })
      .catch((cause: unknown) => {
        if (!disposed) {
          setModelStatus('error', toMessage(cause));
        }
      });

    return () => {
      disposed = true;
    };
  }, [mounted, url, reloadToken]);

  // 情绪变化 → 切换表情（并在模型自带同名动作组时播放动作）
  const emotion = useLive2dStore((state) => state.emotion);
  const expression = useLive2dStore((state) => state.expression);
  const action = useLive2dStore((state) => state.action);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!mounted || !controller || !controller.hasModel) {
      return;
    }

    let disposed = false;
    const { setAppliedExpression } = useLive2dStore.getState();

    void controller.applyEmotion(emotion, expression).then((applied) => {
      if (!disposed) {
        setAppliedExpression(applied);
      }
    });
    void controller.applyAction(action);

    return () => {
      disposed = true;
    };
  }, [mounted, emotion, expression, action]);

  return <div ref={containerRef} className="h-full w-full" />;
}
