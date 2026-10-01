import clsx from 'clsx';
import { useState } from 'react';
import { LLM_PROVIDER_LABELS, type ModelConfig } from '@shared';
import { useChatStore } from '../../stores/chatStore';
import { useModelStore } from '../../stores/modelStore';
import { ModelConfigEditor } from './ModelConfigEditor';

/** 设置 · 模型页：多配置增删改 + 一键切换（切换会同步记录到当前会话，上下文不丢） */
export function ModelSettingsTab() {
  const configs = useModelStore((state) => state.configs);
  const activeId = useModelStore((state) => state.activeId);
  const add = useModelStore((state) => state.add);
  const update = useModelStore((state) => state.update);
  const remove = useModelStore((state) => state.remove);
  const switchModel = useChatStore((state) => state.switchModel);

  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const editingConfig: ModelConfig | null =
    editingId && editingId !== 'new'
      ? (configs.find((config) => config.id === editingId) ?? null)
      : null;

  if (editingId) {
    return (
      <ModelConfigEditor
        initial={editingConfig}
        onCancel={() => setEditingId(null)}
        onSubmit={async (draft) => {
          if (editingConfig) {
            await update(editingConfig.id, draft);
          } else {
            const created = await add(draft);
            await switchModel(created.id);
          }
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-ink-soft">
          共 {configs.length} 条配置 · 切换模型不会丢失当前对话上下文
        </p>
        <button
          type="button"
          onClick={() => setEditingId('new')}
          className="shrink-0 rounded-full bg-white/80 px-4 py-1.5 text-xs text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          新增配置
        </button>
      </div>

      {configs.length === 0 ? (
        <p className="rounded-bubble bg-white/50 px-4 py-6 text-center text-xs text-ink-soft">
          还没有模型配置，点「新增配置」添加一个吧
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {configs.map((config) => {
          const isActive = config.id === activeId;
          const isPendingDelete = config.id === pendingDeleteId;

          return (
            <li
              key={config.id}
              className={clsx(
                'flex flex-col gap-2 rounded-bubble px-4 py-3 transition',
                isActive ? 'bg-pink-soft/75 shadow-soft' : 'bg-white/55',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm text-ink-deep">
                    {LLM_PROVIDER_LABELS[config.provider]}
                    {isActive ? (
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-pink-deep">
                        当前使用
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate text-[11px] text-ink-soft">{config.modelName}</span>
                  <span className="truncate text-[10px] text-ink-soft/80">{config.apiUrl}</span>
                </div>
                <span className="shrink-0 text-[10px] text-ink-soft">
                  上下文 {config.contextWindow} 条
                </span>
              </div>

              {isPendingDelete ? (
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-ink-deep">删除这条配置？</span>
                  <span className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        void remove(config.id);
                        setPendingDeleteId(null);
                      }}
                      className="rounded-full bg-pink-deep px-3 py-1 text-white transition hover:bg-pink-deep/85"
                    >
                      删除
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
                      className="rounded-full bg-white/85 px-3 py-1 text-ink transition hover:bg-white"
                    >
                      取消
                    </button>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {!isActive ? (
                    <button
                      type="button"
                      onClick={() => void switchModel(config.id)}
                      className="rounded-full bg-pink px-3.5 py-1 text-[11px] text-white transition hover:bg-pink-deep"
                    >
                      设为当前
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setEditingId(config.id)}
                    className="rounded-full bg-white/85 px-3.5 py-1 text-[11px] text-ink transition hover:bg-white"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(config.id)}
                    className="rounded-full bg-white/85 px-3.5 py-1 text-[11px] text-ink-soft transition hover:bg-white hover:text-pink-deep"
                  >
                    删除
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
