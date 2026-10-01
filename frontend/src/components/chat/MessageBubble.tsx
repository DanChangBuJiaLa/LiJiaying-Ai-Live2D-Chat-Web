import clsx from 'clsx';
import type { Message } from '@shared';
import { formatMessageTime } from '../../utils/time';
import { resolveEmotion } from '../../utils/emotion';

export interface MessageBubbleProps {
  message: Message;
  characterName: string;
}

export function MessageBubble({ message, characterName }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const visual = isUser ? null : resolveEmotion(message.emotion);

  return (
    <article className={clsx('flex animate-pop-in px-1', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx('flex max-w-[86%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}
      >
        {visual ? (
          <span className="flex items-center gap-1.5 pl-2 text-[11px] text-ink-soft">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: visual.glow }}
              aria-hidden
            />
            {characterName} · {visual.label}
          </span>
        ) : null}

        <p
          className={clsx(
            'whitespace-pre-wrap break-words rounded-bubble px-4 py-2.5 text-sm leading-relaxed text-ink-deep shadow-soft',
            isUser ? 'rounded-br-md bg-pink-soft' : 'glass-panel rounded-bl-md',
          )}
          style={visual ? { borderLeft: `3px solid ${visual.glow}` } : undefined}
        >
          {message.content}
        </p>

        <time className="px-2 text-[10px] text-ink-soft/70" dateTime={message.createdAt}>
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
    </article>
  );
}
