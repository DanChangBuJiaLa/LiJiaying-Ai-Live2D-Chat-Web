import { useEffect, useRef } from 'react';
import { ChatBubbleIcon, CloseIcon } from '../common/Icon';
import { useCharacterStore } from '../../stores/characterStore';
import { useChatStore } from '../../stores/chatStore';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

/** 浮在角色之上的消息区：滚动到底部、空状态、错误提示都在这里收口 */
export function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const status = useChatStore((state) => state.status);
  const error = useChatStore((state) => state.error);
  const clearError = useChatStore((state) => state.clearError);
  const characterName = useCharacterStore((state) => state.character?.name ?? '角色');

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, status]);

  return (
    <div className="scroll-soft flex max-h-[52vh] flex-col gap-3 overflow-y-auto px-1 pb-2 pt-2">
      {messages.length === 0 && status !== 'sending' ? (
        <div className="glass-panel mx-auto flex max-w-md animate-rise-in flex-col items-center gap-2 rounded-panel px-6 py-5 text-center shadow-soft">
          <ChatBubbleIcon className="text-pink-deep" />
          <p className="font-display text-base text-ink-deep">和 {characterName} 打个招呼吧～</p>
          <p className="text-xs leading-relaxed text-ink-soft">
            所有对话都保存在你自己的电脑里，不会上传到任何服务器。
          </p>
        </div>
      ) : null}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} characterName={characterName} />
      ))}

      {status === 'sending' ? <TypingIndicator characterName={characterName} /> : null}

      {status === 'error' && error ? (
        <div className="mx-auto flex max-w-md animate-rise-in items-start gap-2 rounded-bubble bg-pink-soft/90 px-4 py-2.5 text-xs text-ink-deep shadow-soft">
          <span className="flex-1 leading-relaxed">出错了：{error}</span>
          <button
            type="button"
            onClick={clearError}
            aria-label="关闭错误提示"
            className="mt-0.5 shrink-0 text-ink-soft transition hover:text-ink-deep"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
}
