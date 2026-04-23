'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';

export default function NewRecipePage() {
  const { dict } = useLocale();
  const d = dict.newRecipe;
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    miso_type: '',
    koji_ratio: '',
    salt_ratio: '',
    soybean_variety: '',
    water_content: '',
    fermentation_duration: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          miso_type: form.miso_type || undefined,
          koji_ratio: form.koji_ratio ? Number(form.koji_ratio) : undefined,
          salt_ratio: form.salt_ratio ? Number(form.salt_ratio) : undefined,
          soybean_variety: form.soybean_variety || undefined,
          water_content: form.water_content ? Number(form.water_content) : undefined,
          fermentation_duration: form.fermentation_duration || undefined,
          notes: form.notes || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      router.push('/recipes');
    } catch (err) {
      setError(err instanceof Error ? err.message : d.errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '36rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div className="animate-in" style={{ marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '0.6rem' }}>{d.label}</div>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '2.8rem',
            fontWeight: 300,
            color: 'hsl(35, 25%, 88%)',
            lineHeight: 1.1,
          }}
        >
          {d.heading}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="animate-in delay-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <label htmlFor="name" className="field-label">{d.name}</label>
            <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={d.namePlaceholder} className="field-input" />
          </div>

          <div>
            <label htmlFor="description" className="field-label">{d.description}</label>
            <input id="description" type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={d.descriptionPlaceholder} className="field-input" />
          </div>

          <div>
            <label htmlFor="miso_type" className="field-label">{d.misoType}</label>
            <input id="miso_type" type="text" value={form.miso_type} onChange={(e) => setForm({ ...form, miso_type: e.target.value })} placeholder={d.misoTypePlaceholder} className="field-input" />
          </div>

          <div
            style={{
              borderTop: '1px solid hsl(25, 18%, 14%)',
              paddingTop: '1.5rem',
            }}
          >
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(30, 68%, 45%)', marginBottom: '1.5rem' }}>
              Recipe parameters
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label htmlFor="koji_ratio" className="field-label">{d.kojiRatio}</label>
                  <input id="koji_ratio" type="number" value={form.koji_ratio} onChange={(e) => setForm({ ...form, koji_ratio: e.target.value })} placeholder={d.kojiRatioPlaceholder} className="field-input" />
                </div>
                <div>
                  <label htmlFor="salt_ratio" className="field-label">{d.saltRatio}</label>
                  <input id="salt_ratio" type="number" value={form.salt_ratio} onChange={(e) => setForm({ ...form, salt_ratio: e.target.value })} placeholder={d.saltRatioPlaceholder} className="field-input" />
                </div>
              </div>

              <div>
                <label htmlFor="soybean_variety" className="field-label">{d.soybeanVariety}</label>
                <input id="soybean_variety" type="text" value={form.soybean_variety} onChange={(e) => setForm({ ...form, soybean_variety: e.target.value })} placeholder={d.soybeanVarietyPlaceholder} className="field-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label htmlFor="water_content" className="field-label">{d.waterContent}</label>
                  <input id="water_content" type="number" value={form.water_content} onChange={(e) => setForm({ ...form, water_content: e.target.value })} placeholder={d.waterContentPlaceholder} className="field-input" />
                </div>
                <div>
                  <label htmlFor="fermentation_duration" className="field-label">{d.fermentationDuration}</label>
                  <input id="fermentation_duration" type="text" value={form.fermentation_duration} onChange={(e) => setForm({ ...form, fermentation_duration: e.target.value })} placeholder={d.fermentationDurationPlaceholder} className="field-input" />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="field-label">{d.notes}</label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={d.notesPlaceholder}
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
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'hsl(30, 68%, 50%)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'hsl(25, 18%, 22%)'; }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.875rem 1.25rem', background: 'hsl(4, 50%, 8%)', border: '1px solid hsl(4, 50%, 22%)', fontFamily: 'var(--font-lora), serif', fontSize: '0.875rem', color: 'hsl(4, 65%, 58%)' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
            <Link href="/recipes" style={{ flex: 1 }}>
              <span className="btn-outline" style={{ width: '100%' }}>{d.cancel}</span>
            </Link>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
              {loading ? d.submitting : d.submit}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
