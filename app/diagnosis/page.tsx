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

  const handleMetadataChange = (data: Record<string, unknown>) => {
    setMetadata((prev) => ({ ...prev, ...data }));
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">緊急発酵診断</h1>
      <p className="text-muted-foreground mb-8">
        味噌の写真をアップロードして、AIによる発酵状態の診断を受けます
      </p>

      <div className="space-y-6">
        <PhotoUpload onImageSelect={handleImageSelect} />
        <MetadataForm onChange={handleMetadataChange} />

        <button
          onClick={handleDiagnose}
          disabled={!imageBase64 || loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '診断中...' : '診断する'}
        </button>

        {error && (
          <div className="border border-destructive/50 bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {result && <DiagnosisResult result={result} />}
      </div>
    </div>
  );
}
