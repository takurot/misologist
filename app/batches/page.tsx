'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { formatDate, formatDaysElapsed } from '@/lib/i18n';
import type { Batch } from '@/types';

const statusColors = {
  active: { color: 'hsl(145, 55%, 45%)', bg: 'hsl(145, 40%, 8%)' },
  completed: { color: 'hsl(210, 55%, 55%)', bg: 'hsl(210, 40%, 8%)' },
  failed: { color: 'hsl(4, 65%, 50%)', bg: 'hsl(4, 40%, 8%)' },
};

export default function BatchesPage() {
  const { dict, locale } = useLocale();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/batches')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setBatches(json.data);
        else setFetchError(json.error ?? dict.batches.fetchError);
      })
      .catch(() => setFetchError(dict.common.networkError))
      .finally(() => setLoading(false));
  }, [dict.batches.fetchError, dict.common.networkError]);

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
            {dict.batches.heading}
          </h1>
        </div>
        <Link href="/batches/new">
          <span className="btn-outline">{dict.batches.newBatch}</span>
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
          {dict.common.loading}
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
            {dict.batches.empty}
          </p>
          <Link href="/batches/new">
            <span className="btn-primary">{dict.batches.emptyCta}</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {batches.map((batch, idx) => {
            const days = Math.floor(
              (Date.now() - new Date(batch.started_at).getTime()) / (1000 * 60 * 60 * 24)
            );
            const cfg = statusColors[batch.status];

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
                        {formatDate(batch.started_at, locale)} {dict.batches.startSuffix}
                      </span>
                      <span style={{ color: 'hsl(30, 68%, 42%)' }}>{formatDaysElapsed(days, locale)}</span>
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
                      {dict.batches.statuses[batch.status]}
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
