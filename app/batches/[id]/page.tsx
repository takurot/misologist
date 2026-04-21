'use client';

import { useEffect, useState } from 'react';
import type { BatchWithLogs, DailyAction } from '@/types';

const actionTypeLabel: Record<DailyAction['type'], string> = {
  tenchi_gaeshi: '天地返し',
  weather_response: '天候対応',
  salt_tasting: '塩梅確認',
  observation: '観察',
  warning: '警告',
};

const priorityColor = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
};

export default function BatchDetailPage({ params }: { params: { id: string } }) {
  const [batch, setBatch] = useState<BatchWithLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [agentLoading, setAgentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/batches/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setBatch(json.data);
        else setError(json.error);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const runAgentSession = async () => {
    setAgentLoading(true);
    try {
      const res = await fetch('/api/agent-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: params.id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      const refreshed = await fetch(`/api/batches/${params.id}`).then((r) => r.json());
      if (refreshed.success) setBatch(refreshed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エージェント実行に失敗しました');
    } finally {
      setAgentLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">読み込み中...</div>;
  if (error) return <div className="text-center py-12 text-destructive">{error}</div>;
  if (!batch) return null;

  const days = Math.floor(
    (Date.now() - new Date(batch.started_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const agentState = batch.agent_session?.agent_state;
  const actions = agentState?.actions ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{batch.name}</h1>
        <p className="text-muted-foreground">
          仕込み開始: {new Date(batch.started_at).toLocaleDateString('ja-JP')} ({days}日経過)
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground">発酵ステージ</p>
          <p className="font-semibold">{agentState?.fermentationStage ?? '未診断'}</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground">予想完成日</p>
          <p className="font-semibold">
            {agentState?.completionDate
              ? new Date(agentState.completionDate).toLocaleDateString('ja-JP')
              : '未診断'}
          </p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground">観察ログ数</p>
          <p className="font-semibold">{batch.logs?.length ?? 0}件</p>
        </div>
      </div>

      {agentState?.lastAssessment && (
        <div className="border rounded-lg p-4 bg-card mb-6">
          <h3 className="font-medium mb-2">AIエージェントの評価</h3>
          <p className="text-sm text-muted-foreground">{agentState.lastAssessment}</p>
        </div>
      )}

      {actions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">推奨アクション</h3>
          <div className="space-y-2">
            {actions.map((action, i) => (
              <div
                key={i}
                className={`border-l-4 pl-4 py-2 bg-card rounded-r-lg ${priorityColor[action.priority]}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    {actionTypeLabel[action.type]}
                  </span>
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{action.description}</p>
                {action.scheduledDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    実施日: {new Date(action.scheduledDate).toLocaleDateString('ja-JP')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={runAgentSession}
        disabled={agentLoading}
        className="w-full border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/5 disabled:opacity-50 transition-colors"
      >
        {agentLoading ? 'AIエージェント実行中...' : 'AIエージェントで今日のアクションを確認'}
      </button>
    </div>
  );
}
