import { useCallback, useState } from 'react';
import type { ChatResponse } from '@shared';
import { sendChatMessage } from '../../services/chatApi';
import { DiagnosticCard, type DiagnosticState } from './DiagnosticCard';

/** 自检用的假 ID，第 2 步接入 IndexedDB 后会被真实会话/配置 ID 取代 */
const DIAG_CONVERSATION_ID = 'diagnostics-conversation';
const DIAG_MODEL_ID = 'diagnostics-model';

export function ChatLinkCheck() {
  const [input, setInput] = useState('你好呀，糯糯！');
  const [state, setState] = useState<DiagnosticState>('idle');
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [error, setError] = useState('');
  const sending = state === 'checking';

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text) {
      setState('error');
      setError('请输入内容后再发送');
      return;
    }

    setState('checking');
    setError('');
    try {
      const response = await sendChatMessage({
        conversationId: DIAG_CONVERSATION_ID,
        modelConfigId: DIAG_MODEL_ID,
        messages: [{ role: 'user', content: text }],
      });
      setResult(response);
      setState('ok');
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : String(cause));
      setState('error');
    }
  }, [input]);

  return (
    <DiagnosticCard
      title="2. 对话全链路（Mock LLM）"
      description="POST /api/chat → 结构化 JSON 解析 → 气泡渲染"
      state={state}
      onRetry={state === 'error' ? () => void send() : undefined}
    >
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void send();
          }}
          placeholder="说点什么…"
          className="flex-1 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm text-ink placeholder:text-ink-soft/70 focus:border-pink focus:outline-none"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending}
          className="rounded-full bg-pink px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-pink-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? '发送中' : '发送'}
        </button>
      </div>

      {state === 'idle' ? (
        <p className="mt-3 text-xs text-ink-soft">点击「发送」，验证后端返回的结构化 JSON。</p>
      ) : null}

      {state === 'error' ? <p className="mt-3 text-xs text-pink-deep">{error}</p> : null}

      {result ? (
        <div className="mt-4 space-y-3">
          <div className="flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-pink-soft px-4 py-2 text-sm text-ink-deep">
              {input}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-cream-deep px-4 py-2 text-sm text-ink-deep">
              {result.response.text}
            </p>
          </div>
          <pre className="overflow-x-auto rounded-2xl bg-ink-deep/90 p-3 font-mono text-[11px] leading-relaxed text-cream">
            {JSON.stringify(result.response, null, 2)}
          </pre>
          <p className="font-mono text-[11px] text-ink-soft">
            conversationId: {result.conversationId} · messageId: {result.messageId}
          </p>
        </div>
      ) : null}
    </DiagnosticCard>
  );
}
