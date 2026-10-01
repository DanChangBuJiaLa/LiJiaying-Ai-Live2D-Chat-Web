import clsx from 'clsx';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SendIcon } from '../common/Icon';

export interface ChatDockProps {
  onSend: (text: string) => void;
  sending?: boolean;
  /** 无可用模型等场景下禁用输入 */
  disabled?: boolean;
  disabledHint?: string;
  placeholder?: string;
}

const MAX_TEXTAREA_HEIGHT = 132;

/** 底部毛玻璃聊天条：Enter 发送，Shift + Enter 换行，自动长高 */
export function ChatDock({
  onSend,
  sending = false,
  disabled = false,
  disabledHint,
  placeholder = '请输入消息…',
}: ChatDockProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !sending && !disabled;

  const submit = () => {
    const text = value.trim();
    if (!text || sending || disabled) {
      return;
    }
    setValue('');
    onSend(text);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {disabled && disabledHint ? (
        <p className="animate-fade-in text-center text-xs text-ink-soft">{disabledHint}</p>
      ) : null}

      <div
        data-testid="chat-dock"
        className={clsx(
          'glass-dock flex items-end gap-2 rounded-blob border border-white/70 p-2 shadow-frosted',
          'animate-rise-in transition duration-300 focus-within:shadow-lift',
          disabled && 'opacity-70',
        )}
        style={{ animationDelay: '160ms' }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled || sending}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="聊天输入框"
          className={clsx(
            'scroll-soft max-h-[132px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-relaxed',
            'text-ink-deep placeholder:text-ink-soft/70 focus:outline-none',
            'disabled:cursor-not-allowed',
          )}
        />

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="发送消息"
          className={clsx(
            'mb-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full text-white',
            'transition duration-200',
            canSend
              ? 'bg-pink shadow-soft hover:-translate-y-0.5 hover:bg-pink-deep hover:shadow-lift'
              : 'cursor-not-allowed bg-pink/45',
          )}
        >
          <SendIcon size={18} />
        </button>
      </div>

      <p className="text-center text-[10px] text-ink-soft/70">
        Enter 发送 · Shift + Enter 换行 · 数据仅保存在本地
      </p>
    </div>
  );
}
