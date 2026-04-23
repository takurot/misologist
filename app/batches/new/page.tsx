'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';

export default function NewBatchPage() {
  const { dict } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('recipeId');

  const todayString = (() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  })();

  const [form, setForm] = useState({
    name: '',
    started_at: todayString,
    soybeanVariety: '',
    kojRatio: '',
    saltRatio: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;
    fetch(`/api/recipes/${recipeId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) return;
        const r = json.data;
        setForm((prev) => ({
          ...prev,
          soybeanVariety: r.soybean_variety ?? prev.soybeanVariety,
          kojRatio: r.koji_ratio != null ? String(r.koji_ratio) : prev.kojRatio,
          saltRatio: r.salt_ratio != null ? String(r.salt_ratio) : prev.saltRatio,
          notes: r.notes ?? prev.notes,
        }));
      })
      .catch(() => undefined);
  }, [recipeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          started_at: form.started_at,
          recipe_json: {
            soybeanVariety: form.soybeanVariety || undefined,
            kojRatio: form.kojRatio ? Number(form.kojRatio) : undefined,
            saltRatio: form.saltRatio ? Number(form.saltRatio) : undefined,
            notes: form.notes || undefined,
          },
        }),
      });

      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      router.push(`/batches/${json.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.newBatch.errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '36rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div className="animate-in" style={{ marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '0.6rem' }}>New Batch</div>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '2.8rem',
            fontWeight: 300,
            color: 'hsl(35, 25%, 88%)',
            lineHeight: 1.1,
          }}
        >
          {dict.newBatch.heading}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="animate-in delay-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Required fields */}
          <div>
            <label htmlFor="name" className="field-label">{dict.newBatch.name}</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={dict.newBatch.namePlaceholder}
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="started_at" className="field-label">{dict.newBatch.startedAt}</label>
            <input
              id="started_at"
              type="date"
              required
              value={form.started_at}
              onChange={(e) => setForm({ ...form, started_at: e.target.value })}
              className="field-input"
            />
          </div>

          {/* Recipe section */}
          <div
            style={{
              borderTop: '1px solid hsl(25, 18%, 14%)',
              paddingTop: '1.5rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'hsl(30, 68%, 45%)',
                marginBottom: '1.5rem',
              }}
            >
              {dict.newBatch.recipeSection}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="soybeanVariety" className="field-label">{dict.newBatch.soybeanVariety}</label>
                <input
                  id="soybeanVariety"
                  type="text"
                  value={form.soybeanVariety}
                  onChange={(e) => setForm({ ...form, soybeanVariety: e.target.value })}
                  placeholder={dict.newBatch.soybeanVarietyPlaceholder}
                  className="field-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label htmlFor="kojRatio" className="field-label">{dict.newBatch.kojiRatio}</label>
                  <input
                    id="kojRatio"
                    type="number"
                    value={form.kojRatio}
                    onChange={(e) => setForm({ ...form, kojRatio: e.target.value })}
                    placeholder={dict.newBatch.kojiRatioPlaceholder}
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="saltRatio" className="field-label">{dict.newBatch.saltRatio}</label>
                  <input
                    id="saltRatio"
                    type="number"
                    value={form.saltRatio}
                    onChange={(e) => setForm({ ...form, saltRatio: e.target.value })}
                    placeholder={dict.newBatch.saltRatioPlaceholder}
                    className="field-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="field-label">{dict.newBatch.notes}</label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={dict.newBatch.notesPlaceholder}
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid hsl(25, 18%, 22%)',
                    padding: '0.4rem 0 0.5rem',
                    fontFamily: 'var(--font-lora), serif',
                    fontSize: '0.875rem',
                    color: 'hsl(35, 25%, 85%)',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'hsl(30, 68%, 50%)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'hsl(25, 18%, 22%)'; }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '0.875rem 1.25rem',
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

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
            <Link href="/batches" style={{ flex: 1 }}>
              <span className="btn-outline" style={{ width: '100%' }}>{dict.newBatch.cancel}</span>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? dict.newBatch.submitting : dict.newBatch.submit}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
