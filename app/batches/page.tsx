'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Batch } from '@/types';

const statusConfig = {
  active: { label: '仕込み中', color: 'hsl(145, 55%, 45%)', bg: 'hsl(145, 40%, 8%)' },
  completed: { label: '完成', color: 'hsl(210, 55%, 55%)', bg: 'hsl(210, 40%, 8%)' },
  failed: { label: '失敗', color: 'hsl(4, 65%, 50%)', bg: 'hsl(4, 40%, 8%)' },
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/batches')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setBatches(json.data);
        else setFetchError(json.error ?? 'バッチ一覧の取得に失敗しました');
      })
      .catch(() => setFetchError('ネットワークエラーが発生しました'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div
        className="animate-in"
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: '0.6rem' }}>Batch Monitor</div>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '2.8rem',
              fontWeight: 300,
              color: 'hsl(35, 25%, 88%)',
              lineHeight: 1.1,
            }}
          >
            バッチ管理
          </h1>
        </div>
        <Link href="/batches/new">
          <span className="btn-outline">新規バッチ</span>
        </Link>
      </div>

      {loading ? (
        <div
          style={{
            padding: '4rem 0',
            textAlign: 'center',
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.875rem',
            color: 'hsl(35, 15%, 42%)',
            letterSpacing: '0.08em',
          }}
        >
          読み込み中...
        </div>
      ) : fetchError ? (
        <div
          style={{
            padding: '2rem',
            background: 'hsl(4, 50%, 8%)',
            border: '1px solid hsl(4, 50%, 22%)',
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.875rem',
            color: 'hsl(4, 65%, 58%)',
          }}
        >
          {fetchError}
        </div>
      ) : batches.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid hsl(25, 18%, 14%)',
            background: 'hsl(25, 30%, 7%)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 300,
              color: 'hsl(35, 15%, 45%)',
              marginBottom: '1.25rem',
            }}
          >
            まだバッチがありません
          </p>
          <Link href="/batches/new">
            <span className="btn-primary">最初のバッチを仕込む</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {batches.map((batch, idx) => {
            const days = Math.floor(
              (Date.now() - new Date(batch.started_at).getTime()) / (1000 * 60 * 60 * 24)
            );
            const cfg = statusConfig[batch.status];

            return (
              <Link key={batch.id} href={`/batches/${batch.id}`} style={{ textDecoration: 'none' }}>
                <article
                  className={`animate-in delay-${Math.min(idx + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem 0',
                    borderBottom: '1px solid hsl(25, 18%, 13%)',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'hsl(25, 30%, 8%)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: '1.4rem',
                        fontWeight: 400,
                        color: 'hsl(35, 25%, 85%)',
                        lineHeight: 1.2,
                        marginBottom: '0.35rem',
                      }}
                    >
                      {batch.name}
                    </h2>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1.25rem',
                        fontFamily: 'var(--font-lora), serif',
                        fontSize: '0.78rem',
                        color: 'hsl(35, 15%, 45%)',
                      }}
                    >
                      <span>
                        {new Date(batch.started_at).toLocaleDateString('ja-JP')} 仕込み
                      </span>
                      <span style={{ color: 'hsl(30, 68%, 42%)' }}>{days}日経過</span>
                      {batch.recipe_json?.soybeanVariety && (
                        <span>{batch.recipe_json.soybeanVariety}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-lora), serif',
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: cfg.color,
                        background: cfg.bg,
                        padding: '0.3rem 0.7rem',
                        border: `1px solid ${cfg.color}40`,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
