import { Application, Ticker } from 'pixi.js';
import { pickExpressionIndex } from '../../utils/live2dExpression';
import { importLive2DModel } from './cubismRuntime';

type Live2DModelInstance = InstanceType<
  (typeof import('pixi-live2d-display/cubism4'))['Live2DModel']
>;

/**
 * 舞台控制器：负责 pixi Application 与 Live2D 模型的生命周期。
 * 只在这里碰 pixi / pixi-live2d-display，React 组件只做挂载与订阅。
 */
export class Live2DStageController {
  private app: Application | null = null;
  private model: Live2DModelInstance | null = null;
  private container: HTMLElement | null = null;
  private destroyed = false;

  get hasModel(): boolean {
    return this.model !== null;
  }

  async mount(container: HTMLElement): Promise<void> {
    if (this.destroyed || this.app) {
      return;
    }

    const app = new Application({
      width: Math.max(container.clientWidth, 1),
      height: Math.max(container.clientHeight, 1),
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
    });

    const canvas = app.view as HTMLCanvasElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    this.app = app;
    this.container = container;
  }

  async loadModel(url: string): Promise<void> {
    if (this.destroyed) {
      throw new Error('舞台已销毁');
    }
    if (!this.app) {
      throw new Error('舞台尚未挂载');
    }

    // Cubism Core 运行时与 window.PIXI 都在 importLive2DModel 内处理好
    const { Live2DModel } = await importLive2DModel();
    Live2DModel.registerTicker(Ticker);

    const model = await Live2DModel.from(url, { autoInteract: false });

    if (this.destroyed) {
      model.destroy();
      return;
    }

    this.model?.destroy();
    this.model = model;
    this.app.stage.addChild(model);
    this.layout();
  }

  /** 容器尺寸变化后调用 */
  resize(): void {
    const { app, container } = this;
    if (!app || !container) {
      return;
    }

    app.renderer.resize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1));
    this.layout();
  }

  /**
   * 用情绪驱动模型表情。
   * 具体选第几个表情由 pickExpressionIndex 决定（先按名字匹配，否则按情绪稳定轮换）。
   * @returns 实际生效的表情名，没有可用表情时返回 null
   */
  async applyEmotion(emotion: string, expressionName: string): Promise<string | null> {
    const model = this.model;
    if (!model) {
      return null;
    }

    const definitions = model.internalModel?.motionManager?.expressionManager?.definitions ?? [];
    const index = pickExpressionIndex(definitions, expressionName, emotion);
    if (index < 0) {
      return null;
    }

    const applied = await model.expression(index);
    if (!applied) {
      return null;
    }

    return definitions[index]?.Name ?? `表情 #${index + 1}`;
  }

  /** 模型自带与 action 同名的动作组时播放（多数模型没有，属于尽力而为，失败静默） */
  async applyAction(action: string): Promise<void> {
    const model = this.model;
    if (!model) {
      return;
    }

    const definitions = model.internalModel?.motionManager?.definitions ?? {};
    const wanted = action.trim().toLowerCase();
    const matched = Object.keys(definitions).find((group) => group.toLowerCase() === wanted);

    if (matched) {
      await model.motion(matched);
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.model?.destroy();
    this.model = null;
    this.app?.destroy(true, { children: true });
    this.app = null;
    this.container = null;
  }

  /** 让模型完整居中并贴合舞台高度 */
  private layout(): void {
    const { app, model } = this;
    if (!app || !model) {
      return;
    }

    const stageWidth = app.screen.width;
    const stageHeight = app.screen.height;

    model.scale.set(1);
    const baseWidth = model.width || 1;
    const baseHeight = model.height || 1;

    const scale = Math.min((stageWidth * 0.62) / baseWidth, (stageHeight * 0.94) / baseHeight);
    model.scale.set(scale);

    model.x = (stageWidth - model.width) / 2;
    // 底部略微下沉，视觉上更像"站在舞台里"而不是浮在空中
    model.y = stageHeight - model.height * 0.96;
  }
}
