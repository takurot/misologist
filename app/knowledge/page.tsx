'use client';

import { useState } from 'react';
import type { KnowledgeTranslationResult } from '@/types';

const EXAMPLES = [
  '塩は多めに入れると腐らない',
  '天地返しは満月の夜にやると良い',
  '怒りながら味噌を仕込むと発酵が悪くなる',
  '夏の暑い時期に仕込む「寒仕込み」より「暑仕込み」は難しい',
];

export default function KnowledgePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<KnowledgeTranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async (text?: string) => {
    const knowledge = text ?? input;
    if (!knowledge.trim()) return;

    setLoading(true);
    setError(null);
    if (text) setInput(text);

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ knowledge }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '翻訳に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">職人知識翻訳</h1>
      <p className="text-muted-foreground mb-8">
        伝統的な職人の知恵を現代の発酵化学で解明します
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">職人の知識・経験則</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: 塩は多めに入れると腐らない"
            rows={4}
            className="w-full border rounded-lg px-4 py-3 bg-background resize-none"
          />
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">例文を試す:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleTranslate(ex)}
                className="text-xs border rounded-full px-3 py-1 hover:border-primary hover:text-primary transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleTranslate()}
          disabled={!input.trim() || loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? '翻訳中...' : '科学的に解明する'}
        </button>
      </div>

      {error && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive rounded-lg p-4 text-sm mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">元の知識</h3>
            <p className="font-medium italic">「{result.originalKnowledge}」</p>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <h3 className="font-medium mb-2">科学的説明</h3>
            <p className="text-sm leading-relaxed">{result.scientificExplanation}</p>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <h3 className="font-medium mb-2">発酵化学</h3>
            <p className="text-sm font-mono bg-muted rounded p-2">{result.chemistry}</p>
          </div>

          {result.practicalAdvice.length > 0 && (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-medium mb-2">実践的アドバイス</h3>
              <ul className="space-y-1">
                {result.practicalAdvice.map((advice, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.references && result.references.length > 0 && (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-medium mb-2">関連する発酵科学の概念</h3>
              <div className="flex flex-wrap gap-2">
                {result.references.map((ref, i) => (
                  <span key={i} className="text-xs bg-muted px-3 py-1 rounded-full">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
