import { useCallback, useEffect, useState } from 'react';
import type { HealthResponse } from '@shared';
import { fetchHealth } from '../../services/chatApi';
import { API_BASE_URL } from '../../services/httpClient';
import { DiagnosticCard, type DiagnosticState } from './DiagnosticCard';

export function BackendCheck() {
  const [state, setState] = useState<DiagnosticState>('checking');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState('');

  const run = useCallback(async () => {
    setState('checking');
    setError('');
    try {
      setHealth(await fetchHealth());
      setState('ok');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setState('error');
    }
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  return (
    <DiagnosticCard
      title="1. 后端连通性"
      description={`GET ${API_BASE_URL}/api/health`}
      state={state}
      onRetry={() => void run()}
    >
      {state === 'ok' && health ? (
        <ul className="space-y-1 font-mono text-xs">
          <li>service: {health.service}</li>
          <li>version: {health.version}</li>
          <li>llmMode: {health.llmMode}</li>
          <li>uptime: {health.uptime}s</li>
        </ul>
      ) : null}
      {state === 'error' ? (
        <p className="text-xs text-pink-deep">
          无法连接后端，请确认已执行 <code>npm run dev</code>：{error}
        </p>
      ) : null}
      {state === 'checking' ? <p className="text-xs text-ink-soft">正在请求后端……</p> : null}
    </DiagnosticCard>
  );
}
