'use client';

import { useState } from 'react';
import type { KnowledgeTranslationResult } from '@/types';

const EXAMPLES = [
  '塩は多めに入れると腐らない',
  '天地返しは満月の夜にやると良い',
  '怒りながら味噌を仕込むと発酵が悪くなる',
  '夏の暑い時期に仕込む「暑仕込み」は難しい',
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
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div className="animate-in" style={{ marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>
          Knowledge Translation
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
          職人知識翻訳
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.9rem',
            lineHeight: 1.75,
            color: 'hsl(35, 15%, 52%)',
          }}
        >
          職人の経験則・暗黙知を、発酵化学の科学言語に翻訳します。
        </p>
      </div>

      <div className="animate-in delay-1">
        {/* Journal-style textarea */}
        <div
          style={{
            marginBottom: '1.25rem',
            borderBottom: '1px solid hsl(25, 18%, 16%)',
            paddingBottom: '1.25rem',
          }}
        >
          <label
            htmlFor="knowledge-input"
            style={{
              display: 'block',
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'hsl(30, 68%, 45%)',
              marginBottom: '1rem',
            }}
          >
            職人の言葉
          </label>
          <textarea
            id="knowledge-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: 塩は多めに入れると腐らない"
            rows={5}
            onFocus={(e) => { e.target.style.outline = '2px solid hsl(30, 68%, 50%)'; }}
            onBlur={(e) => { e.target.style.outline = '2px solid transparent'; }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: '2px solid transparent',
              outlineOffset: '4px',
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '1.4rem',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'hsl(35, 20%, 80%)',
              lineHeight: 1.6,
              resize: 'none',
              caretColor: 'hsl(30, 68%, 50%)',
            }}
          />
        </div>

        {/* Example quotes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'hsl(35, 15%, 38%)',
              marginBottom: '0.75rem',
            }}
          >
            例文を試す
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleTranslate(ex)}
                style={{
                  fontFamily: 'var(--font-lora), serif',
                  fontSize: '0.78rem',
                  fontStyle: 'italic',
                  color: 'hsl(35, 15%, 48%)',
                  background: 'transparent',
                  border: '1px solid hsl(25, 18%, 18%)',
                  padding: '0.4rem 0.875rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = 'hsl(30, 68%, 55%)';
                  el.style.borderColor = 'hsl(30, 55%, 30%)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = 'hsl(35, 15%, 48%)';
                  el.style.borderColor = 'hsl(25, 18%, 18%)';
                }}
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleTranslate()}
          disabled={!input.trim() || loading}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? '翻訳中...' : '科学的に解明する'}
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: '1.5rem',
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
        <div
          className="animate-in"
          style={{
            marginTop: '3rem',
            borderTop: '1px solid hsl(25, 18%, 14%)',
            paddingTop: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* Original quote */}
          <blockquote
            style={{
              borderLeft: '2px solid hsl(30, 68%, 40%)',
              paddingLeft: '1.25rem',
              margin: 0,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1.5rem',
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'hsl(35, 20%, 72%)',
                lineHeight: 1.5,
              }}
            >
              「{result.originalKnowledge}」
            </p>
          </blockquote>

          {/* Scientific explanation */}
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>科学的説明</div>
            <p
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.9rem',
                lineHeight: 1.85,
                color: 'hsl(35, 18%, 68%)',
              }}
            >
              {result.scientificExplanation}
            </p>
          </div>

          {/* Chemistry */}
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>発酵化学</div>
            <div className="chemistry-block">{result.chemistry}</div>
          </div>

          {/* Practical advice */}
          {result.practicalAdvice.length > 0 && (
            <div>
              <div className="section-label" style={{ marginBottom: '1rem' }}>実践的アドバイス</div>
              <ol
                style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                {result.practicalAdvice.map((advice, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      padding: '0.6rem 0',
                      borderBottom: '1px solid hsl(25, 18%, 12%)',
                      fontFamily: 'var(--font-lora), serif',
                      fontSize: '0.875rem',
                      lineHeight: 1.65,
                      color: 'hsl(35, 15%, 62%)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: '1.1rem',
                        color: 'hsl(30, 68%, 45%)',
                        lineHeight: 1.4,
                        minWidth: '1.2rem',
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* References */}
          {result.references && result.references.length > 0 && (
            <div>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>関連する発酵科学の概念</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.references.map((ref, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      background: 'hsl(25, 30%, 8%)',
                      border: '1px solid hsl(25, 18%, 16%)',
                      color: 'hsl(35, 15%, 58%)',
                      padding: '0.3rem 0.75rem',
                    }}
                  >
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
