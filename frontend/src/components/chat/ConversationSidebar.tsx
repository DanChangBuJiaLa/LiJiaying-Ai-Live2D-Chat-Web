import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ChatBubbleIcon, CloseIcon, PlusIcon, TrashIcon } from '../common/Icon';
import { IconButton } from '../common/IconButton';
import { useCharacterStore } from '../../stores/characterStore';
import { useChatStore } from '../../stores/chatStore';
import { useUiStore } from '../../stores/uiStore';
import { formatSidebarTime } from '../../utils/time';

/** 左侧会话抽屉：新建 / 切换 / 删除（删除走行内二次确认，不弹原生 confirm） */
export function ConversationSidebar() {
  const open = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  const conversations = useChatStore((state) => state.conversations);
  const activeId = useChatStore((state) => state.activeConversationId);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const removeConversation = useChatStore((state) => state.removeConversation);
  const createConversation = useChatStore((state) => state.createConversation);
  const characterName = useCharacterStore((state) => state.character?.name ?? '角色');

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const asideRef = useRef<HTMLElement>(null);

  // 收起时用 inert 让抽屉彻底不可聚焦、不可点击（保留滑出动画）
  useEffect(() => {
    const element = asideRef.current;
    if (!element) {
      return;
    }
    if (open) {
      element.removeAttribute('inert');
    } else {
      element.setAttribute('inert', '');
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPendingDeleteId(null);
    }
  }, [open]);

  const handleCreate = () => {
    void createConversation();
    setSidebarOpen(false);
  };

  const handleSelect = (id: string) => {
    void selectConversation(id);
    setSidebarOpen(false);
  };

  return (
    <>
      <div
        aria-hidden
        onClick={() => setSidebarOpen(false)}
        className={clsx(
          'fixed inset-0 z-40 bg-ink-deep/15 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        ref={asideRef}
        aria-label="会话列表"
        className={clsx(
          'glass-panel fixed left-0 top-0 z-50 flex h-full w-[300px] flex-col',
          'rounded-r-panel border-r border-white/70 shadow-frosted',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <header className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg text-ink-deep">会话</h2>
          <IconButton label="收起会话列表" onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </IconButton>
        </header>

        <div className="px-4">
          <button
            type="button"
            onClick={handleCreate}
            className="flex w-full items-center justify-center gap-2 rounded-bubble border border-dashed border-pink/70 bg-white/50 px-4 py-2.5 text-sm text-ink transition duration-200 hover:-translate-y-0.5 hover:border-pink hover:bg-pink-soft/60 hover:shadow-soft"
          >
            <PlusIcon size={16} />
            新建会话
          </button>
        </div>

        <nav className="scroll-soft mt-3 flex-1 overflow-y-auto px-3 pb-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <ChatBubbleIcon className="text-ink-soft/60" />
              <p className="text-xs leading-relaxed text-ink-soft">
                还没有会话
                <br />
                点上面的「新建会话」开始吧～
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeId;
                const isPendingDelete = conversation.id === pendingDeleteId;

                return (
                  <li key={conversation.id}>
                    <div
                      className={clsx(
                        'group flex items-center gap-1 rounded-bubble px-3 py-2 transition duration-200',
                        isActive ? 'bg-pink-soft/70 shadow-soft' : 'hover:bg-white/60',
                      )}
                    >
                      {isPendingDelete ? (
                        <div className="flex flex-1 items-center justify-between gap-2 text-xs">
                          <span className="text-ink-deep">删除这条会话？</span>
                          <span className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                void removeConversation(conversation.id);
                                setPendingDeleteId(null);
                              }}
                              className="rounded-full bg-pink-deep px-2.5 py-1 text-white transition hover:bg-pink-deep/85"
                            >
                              删除
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(null)}
                              className="rounded-full bg-white/80 px-2.5 py-1 text-ink transition hover:bg-white"
                            >
                              取消
                            </button>
                          </span>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSelect(conversation.id)}
                            className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
                          >
                            <span className="w-full truncate text-sm text-ink-deep">
                              {conversation.title}
                            </span>
                            <span className="text-[10px] text-ink-soft">
                              {formatSidebarTime(conversation.updatedAt)}
                            </span>
                          </button>
                          <button
                            type="button"
                            aria-label={`删除会话：${conversation.title}`}
                            onClick={() => setPendingDeleteId(conversation.id)}
                            className="shrink-0 rounded-full p-1.5 text-ink-soft opacity-0 transition hover:bg-white hover:text-pink-deep focus-visible:opacity-100 group-hover:opacity-100"
                          >
                            <TrashIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <footer className="border-t border-white/60 px-5 py-3">
          <p className="text-[10px] leading-relaxed text-ink-soft">
            当前角色：{characterName}
            <br />
            会话数据仅保存在本机 IndexedDB
          </p>
        </footer>
      </aside>
    </>
  );
}
