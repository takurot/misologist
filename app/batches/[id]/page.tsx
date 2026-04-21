'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BatchWithLogs, DailyAction } from '@/types';

const actionTypeLabel: Record<DailyAction['type'], string> = {
  tenchi_gaeshi: '天地返し',
  weather_response: '天候対応',
  salt_tasting: '塩梅確認',
  observation: '観察',
  warning: '警告',
};

const priorityStyle = {
  high: { accent: 'hsl(4, 65%, 50%)', bg: 'hsl(4, 50%, 8%)' },
  medium: { accent: 'hsl(38, 75%, 48%)', bg: 'hsl(35, 40%, 8%)' },
  low: { accent: 'hsl(145, 55%, 40%)', bg: 'hsl(145, 40%, 7%)' },
};

const FERMENTATION_STAGES = ['初期発酵', '中期発酵', '後期発酵', '熟成'];

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
        else setError(json.error ?? 'バッチの取得に失敗しました');
      })
      .catch(() => setError('ネットワークエラーが発生しました'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const runAgentSession = async () => {
    setAgentLoading(true);
    setError(null);
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

  if (loading) {
    return (
      <div
        style={{
          padding: '4rem 0',
          textAlign: 'center',
          fontFamily: 'var(--font-lora), serif',
          fontSize: '0.875rem',
          color: 'hsl(35, 15%, 42%)',
        }}
      >
        読み込み中...
      </div>
    );
  }
  if (error && !batch) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'hsl(4, 65%, 55%)', fontFamily: 'var(--font-lora), serif' }}>{error}</p>
      </div>
    );
  }
  if (!batch) return null;

  const days = Math.floor(
    (Date.now() - new Date(batch.started_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const agentState = batch.agent_session?.agent_state;
  const actions = agentState?.actions ?? [];

  const stageIndex = FERMENTATION_STAGES.indexOf(agentState?.fermentationStage ?? '');

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Back link */}
      <div className="animate-in" style={{ marginBottom: '2rem' }}>
        <Link href="/batches">
          <span
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'hsl(35, 15%, 40%)',
              transition: 'color 0.2s',
            }}
          >
            ← Batches
          </span>
        </Link>
      </div>

      {/* Header */}
      <div className="animate-in delay-1" style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '2.8rem',
            fontWeight: 300,
            color: 'hsl(35, 25%, 88%)',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}
        >
          {batch.name}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.85rem',
            color: 'hsl(35, 15%, 48%)',
          }}
        >
          {new Date(batch.started_at).toLocaleDateString('ja-JP')} 仕込み開始 ·{' '}
          <span style={{ color: 'hsl(30, 68%, 45%)' }}>{days}日経過</span>
        </p>
      </div>

      {/* Stats row */}
      <div
        className="animate-in delay-2"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 0,
          borderTop: '1px solid hsl(25, 18%, 14%)',
          borderLeft: '1px solid hsl(25, 18%, 14%)',
          marginBottom: '2.5rem',
        }}
      >
        {[
          { label: '発酵ステージ', value: agentState?.fermentationStage ?? '—' },
          {
            label: '予想完成日',
            value: agentState?.completionDate
              ? new Date(agentState.completionDate).toLocaleDateString('ja-JP')
              : '—',
          },
          { label: '観察ログ', value: `${batch.logs?.length ?? 0} 件` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              padding: '1.25rem 1.5rem',
              borderRight: '1px solid hsl(25, 18%, 14%)',
              borderBottom: '1px solid hsl(25, 18%, 14%)',
            }}
          >
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>{label}</div>
            <div
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1.3rem',
                fontWeight: 400,
                color: 'hsl(35, 20%, 80%)',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Fermentation stage progress */}
      {stageIndex >= 0 && (
        <div className="animate-in delay-2" style={{ marginBottom: '2.5rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>発酵ステージ</div>
          <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
            {FERMENTATION_STAGES.map((stage, i) => {
              const isActive = i === stageIndex;
              const isPast = i < stageIndex;
              return (
                <div
                  key={stage}
                  style={{
                    flex: 1,
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    background: isActive
                      ? 'hsl(30, 50%, 10%)'
                      : isPast
                      ? 'hsl(25, 30%, 8%)'
                      : 'transparent',
                    borderTop: `2px solid ${
                      isActive ? 'hsl(30, 68%, 50%)' : isPast ? 'hsl(30, 40%, 25%)' : 'hsl(25, 18%, 16%)'
                    }`,
                    transition: 'all 0.3s',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontSize: '0.65rem',
                      letterSpacing: '0.08em',
                      color: isActive
                        ? 'hsl(30, 68%, 55%)'
                        : isPast
                        ? 'hsl(35, 15%, 48%)'
                        : 'hsl(35, 12%, 32%)',
                    }}
                  >
                    {stage}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agent assessment */}
      {agentState?.lastAssessment && (
        <div
          className="animate-in delay-3"
          style={{
            padding: '1.25rem',
            background: 'hsl(25, 30%, 7%)',
            borderLeft: '2px solid hsl(30, 68%, 40%)',
            marginBottom: '2.5rem',
          }}
        >
          <div className="section-label" style={{ marginBottom: '0.6rem' }}>AIエージェントの評価</div>
          <p
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.9rem',
              lineHeight: 1.75,
              color: 'hsl(35, 15%, 62%)',
            }}
          >
            {agentState.lastAssessment}
          </p>
        </div>
      )}

      {/* Action timeline */}
      {actions.length > 0 && (
        <div className="animate-in delay-3" style={{ marginBottom: '2.5rem' }}>
          <div className="section-label" style={{ marginBottom: '1.25rem' }}>推奨アクション</div>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: '1.75rem',
                top: '0.8rem',
                bottom: '0.8rem',
                width: '1px',
                background: 'hsl(25, 18%, 16%)',
              }}
            />
            <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {actions.map((action, i) => {
                const ps = priorityStyle[action.priority];
                return (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {/* Dot */}
                    <div
                      style={{
                        width: '3.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexShrink: 0,
                        paddingTop: '0.6rem',
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: ps.accent,
                          boxShadow: `0 0 6px ${ps.accent}80`,
                        }}
                      />
                    </div>
                    {/* Content */}
                    <div
                      style={{
                        flex: 1,
                        padding: '0.875rem 1.25rem',
                        background: ps.bg,
                        borderLeft: `2px solid ${ps.accent}60`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.4rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-lora), serif',
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: ps.accent,
                          }}
                        >
                          {actionTypeLabel[action.type]}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-cormorant), Georgia, serif',
                            fontSize: '1.05rem',
                            fontWeight: 400,
                            color: 'hsl(35, 20%, 80%)',
                          }}
                        >
                          {action.title}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-lora), serif',
                          fontSize: '0.82rem',
                          lineHeight: 1.65,
                          color: 'hsl(35, 12%, 52%)',
                        }}
                      >
                        {action.description}
                      </p>
                      {action.scheduledDate && (
                        <div
                          style={{
                            marginTop: '0.4rem',
                            fontFamily: 'var(--font-lora), serif',
                            fontSize: '0.65rem',
                            letterSpacing: '0.1em',
                            color: 'hsl(35, 12%, 40%)',
                          }}
                        >
                          {new Date(action.scheduledDate).toLocaleDateString('ja-JP')}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'hsl(4, 50%, 8%)',
            border: '1px solid hsl(4, 50%, 22%)',
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.875rem',
            color: 'hsl(4, 65%, 58%)',
          }}
        >
          {error}
        </div>
      )}

      {/* Agent trigger */}
      <div className="animate-in delay-4">
        <button
          onClick={runAgentSession}
          disabled={agentLoading}
          className="btn-outline"
          style={{ width: '100%' }}
        >
          {agentLoading ? 'AIエージェント実行中...' : 'AIエージェントで今日のアクションを確認'}
        </button>
      </div>
    </div>
  );
}
