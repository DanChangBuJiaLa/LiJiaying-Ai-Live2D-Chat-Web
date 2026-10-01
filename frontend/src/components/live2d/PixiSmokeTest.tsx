import { useEffect, useRef } from 'react';
import { Application, Graphics, VERSION } from 'pixi.js';

export interface RendererStatus {
  ok: boolean;
  message: string;
}

export interface PixiSmokeTestProps {
  onStatus?: (status: RendererStatus) => void;
}

/**
 * PixiJS 最简渲染自检：画一个粉色圆点，证明渲染管线在当前浏览器可用。
 * 正式的 Live2DStage 会在第 6 步替换本组件。
 */
export function PixiSmokeTest({ onStatus }: PixiSmokeTestProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;

  useEffect(() => {
    let app: Application | null = null;
    let disposed = false;

    try {
      app = new Application({
        width: 240,
        height: 150,
        antialias: true,
        backgroundAlpha: 0,
      });

      const blob = new Graphics();
      blob.beginFill(0xffb8c8);
      blob.drawCircle(120, 78, 44);
      blob.endFill();
      blob.beginFill(0xffe3a3);
      blob.drawCircle(120, 78, 20);
      blob.endFill();
      app.stage.addChild(blob);

      const canvas = app.view as HTMLCanvasElement;
      if (containerRef.current && !disposed) {
        containerRef.current.appendChild(canvas);
      }

      onStatusRef.current?.({ ok: true, message: `PixiJS ${VERSION} 渲染正常` });
    } catch (error) {
      onStatusRef.current?.({
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      });
    }

    return () => {
      disposed = true;
      app?.destroy(true, { children: true });
    };
  }, []);

  return <div ref={containerRef} className="h-[150px] w-[240px]" />;
}
