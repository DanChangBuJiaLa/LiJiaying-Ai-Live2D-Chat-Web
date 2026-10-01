import { useCallback, useEffect, useState } from 'react';
import { listConversations } from '../../db/repositories/conversationRepository';
import { ensureDefaultCharacter } from '../../db/repositories/characterRepository';
import { listMessages } from '../../db/repositories/messageRepository';
import { useCharacterStore } from '../../stores/characterStore';
import { useChatStore } from '../../stores/chatStore';
import { selectActiveConfig, useModelStore } from '../../stores/modelStore';
import { DiagnosticCard, type DiagnosticState } from './DiagnosticCard';

interface PersistenceStats {
  characterName: string;
  conversationCount: number;
  conversationTitle: string;
  messageCount: number;
  lastMessage: string;
}

/** 直接从 IndexedDB 读，不看内存状态——这样刷新页面后的数字才有证明力 */
async function readStats(): Promise<PersistenceStats> {
  const character = await ensureDefaultCharacter();
  const conversations = await listConversations();
  const [latest] = conversations;
  const messages = latest ? await listMessages(latest.id) : [];

  return {
    characterName: character.name,
    conversationCount: conversations.length,
    conversationTitle: latest?.title ?? '（暂无会话）',
    messageCount: messages.length,
    lastMessage: messages.at(-1)?.content ?? '',
  };
}

function toMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

export function PersistenceCheck() {
  const [state, setState] = useState<DiagnosticState>('checking');
  const [stats, setStats] = useState<PersistenceStats | null>(null);
  const [input, setInput] = useState('你好呀，糯糯，今天也要开开心心的！');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setState('checking');
    setError('');
    try {
      setStats(await readStats());
      setState('ok');
    } catch (cause) {
      setError(toMessage(cause));
      setState('error');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** 走真实链路：角色/模型 store → chatStore.sendMessage → Dexie 落库 */
  const runFullChat = useCallback(async () => {
    setState('checking');
    setError('');

    try {
      await useCharacterStore.getState().load();
      await useModelStore.getState().load();

      if (!selectActiveConfig(useModelStore.getState())) {
        await useModelStore.getState().add({
          provider: 'mock',
          apiUrl: 'mock://local',
          apiKey: '',
          modelName: 'mock',
          contextWindow: 20,
        });
      }

      await useChatStore.getState().sendMessage(input);

      const chatError = useChatStore.getState().error;
      if (chatError) {
        throw new Error(chatError);
      }

      setStats(await readStats());
      setState('ok');
    } catch (cause) {
      setError(toMessage(cause));
      setState('error');
    }
  }, [input]);

  return (
    <DiagnosticCard
      title="4. IndexedDB 持久化 + 对话落库"
      description="走真实 store 链路写入 Dexie，再直接从 IndexedDB 读回"
      state={state}
      onRetry={state === 'error' ? () => void refresh() : undefined}
    >
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm text-ink focus:border-pink focus:outline-none"
        />
        <button
          type="button"
          onClick={() => void runFullChat()}
          disabled={state === 'checking'}
          className="rounded-full bg-mint px-5 py-2 text-sm font-medium text-ink-deep shadow-soft transition hover:bg-mint/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'checking' ? '处理中' : '发送并落库'}
        </button>
      </div>

      {stats ? (
        <ul className="mt-4 space-y-1 font-mono text-xs">
          <li>角色：{stats.characterName}</li>
          <li>会话数：{stats.conversationCount}</li>
          <li>当前会话：{stats.conversationTitle}</li>
          <li>消息数：{stats.messageCount}</li>
          <li className="break-all">最后一条：{stats.lastMessage || '（无）'}</li>
        </ul>
      ) : null}

      {error ? <p className="mt-3 text-xs text-pink-deep">{error}</p> : null}

      <p className="mt-3 text-xs text-ink-soft">
        刷新页面后上面的数字应保持不变——说明数据来自 IndexedDB，而不是内存状态。
      </p>
    </DiagnosticCard>
  );
}
