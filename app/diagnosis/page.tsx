'use client';

import { useState } from 'react';
import { PhotoUpload } from '@/components/diagnosis/PhotoUpload';
import { MetadataForm } from '@/components/diagnosis/MetadataForm';
import { DiagnosisResult } from '@/components/diagnosis/DiagnosisResult';
import type { DiagnosisResult as DiagnosisResultType } from '@/types';

export default function DiagnosisPage() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<DiagnosisResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (base64: string, type: 'image/jpeg' | 'image/png' | 'image/webp') => {
    setImageBase64(base64);
    setMediaType(type);
    setResult(null);
    setError(null);
  };

  const handleDiagnose = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mediaType, ...metadata }),
      });

      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '診断に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div className="animate-in" style={{ marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>
          Emergency Triage
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '2.8rem',
            fontWeight: 300,
            color: 'hsl(35, 25%, 88%)',
            lineHeight: 1.1,
            marginBottom: '0.75rem',
          }}
        >
          緊急発酵診断
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.9rem',
            lineHeight: 1.75,
            color: 'hsl(35, 15%, 52%)',
          }}
        >
          味噌の写真をアップロード。Claude Opus 4.7が発酵状態を診断し、<br />
          カビの種別・化学的根拠・具体的対処法をまとめて提示します。
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="animate-in delay-1">
          <PhotoUpload onImageSelect={handleImageSelect} />
        </div>

        <div className="animate-in delay-2">
          <MetadataForm onChange={(data) => setMetadata((prev) => ({ ...prev, ...data }))} />
        </div>

        <div className="animate-in delay-3">
          <button
            onClick={handleDiagnose}
            disabled={!imageBase64 || loading}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BubbleLoader />
                診断中...
              </span>
            ) : (
              '診断する'
            )}
          </button>
        </div>

        {error && (
          <div
            style={{
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

        {result && (
          <div style={{ borderTop: '1px solid hsl(25, 18%, 14%)', paddingTop: '2rem' }}>
            <DiagnosisResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}

function BubbleLoader() {
  return (
    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'currentColor',
            animation: `bubble 1.4s ease-in-out ${i * 0.22}s infinite`,
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );
}
