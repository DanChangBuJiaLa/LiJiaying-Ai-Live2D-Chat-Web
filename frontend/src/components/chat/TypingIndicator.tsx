export interface TypingIndicatorProps {
  characterName: string;
}

/** 「思考中」气泡：三个跳动的小圆点 */
export function TypingIndicator({ characterName }: TypingIndicatorProps) {
  return (
    <div className="flex animate-fade-in items-center gap-2 px-1">
      <span className="glass-panel flex items-center gap-1.5 rounded-bubble rounded-bl-md px-4 py-3 shadow-soft">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 animate-dot-bounce rounded-full bg-pink-deep"
            style={{ animationDelay: `${index * 160}ms` }}
          />
        ))}
      </span>
      <span className="text-[11px] text-ink-soft">{characterName}正在想…</span>
    </div>
  );
}
