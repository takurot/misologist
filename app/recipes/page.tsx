'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import type { Recipe, ReverseEngineeringResult } from '@/types';

export default function RecipesPage() {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const d = dict.recipes;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [flavorInput, setFlavorInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<ReverseEngineeringResult | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/recipes')
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error);
        setRecipes(json.data);
      })
      .catch((err) => setFetchError(err instanceof Error ? err.message : d.fetchError))
      .finally(() => setFetchLoading(false));
  }, [d.fetchError]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flavorInput.trim()) return;
    setGenerating(true);
    setGenerateError(null);
    setGenerated(null);
    try {
      const res = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetFlavor: flavorInput, locale }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setGenerated(json.data);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : d.aiErrorFallback);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generated) return;
    setSaving(true);
    try {
      const { recommendedParameters } = generated;
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: generated.targetFlavor.slice(0, 80),
          description: generated.expectedOutcome,
          koji_ratio: recommendedParameters.kojRatio,
          salt_ratio: recommendedParameters.saltRatio,
          soybean_variety: recommendedParameters.soybeanVariety,
          fermentation_duration: recommendedParameters.fermentationDuration,
          notes: generated.reasoning,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setRecipes((prev) => [...prev, json.data]);
      setGenerated(null);
      setFlavorInput('');
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : d.aiErrorFallback);
    } finally {
      setSaving(false);
    }
  };

  const templates = recipes.filter((r) => r.is_template);
  const myRecipes = recipes.filter((r) => !r.is_template);

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div className="animate-in" style={{ marginBottom: '3rem' }}>
        <div className="section-label" style={{ marginBottom: '0.6rem' }}>{d.label}</div>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '2.8rem',
            fontWeight: 300,
            color: 'hsl(35, 25%, 88%)',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
        >
          {d.heading}
        </h1>
        <p style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.9rem', color: 'hsl(35, 15%, 58%)', maxWidth: '36rem' }}>
          {d.description}
        </p>
      </div>

      {/* AI generation panel */}
      <div
        className="animate-in delay-1"
        style={{
          background: 'hsl(25, 30%, 8%)',
          border: '1px solid hsl(25, 18%, 14%)',
          padding: '2rem',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'hsl(30, 68%, 45%)',
            marginBottom: '1.25rem',
          }}
        >
          ✦ {d.aiSection}
        </div>
        <form onSubmit={handleGenerate}>
          <label
            htmlFor="flavor-input"
            className="field-label"
            style={{ display: 'block', marginBottom: '0.5rem' }}
          >
            {d.aiInputLabel}
          </label>
          <textarea
            id="flavor-input"
            value={flavorInput}
            onChange={(e) => setFlavorInput(e.target.value)}
            placeholder={d.aiInputPlaceholder}
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
              marginBottom: '1.25rem',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'hsl(30, 68%, 50%)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'hsl(25, 18%, 22%)'; }}
          />
          <button
            type="submit"
            disabled={generating || !flavorInput.trim()}
            className="btn-primary"
          >
            {generating ? d.aiLoading : d.aiSubmit}
          </button>
        </form>

        {generateError && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'hsl(4, 50%, 8%)', border: '1px solid hsl(4, 50%, 22%)', fontFamily: 'var(--font-lora), serif', fontSize: '0.875rem', color: 'hsl(4, 65%, 58%)' }}>
            {generateError}
          </div>
        )}

        {generated && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid hsl(25, 18%, 14%)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1rem' }}>
              {generated.recommendedParameters.kojRatio != null && (
                <div>
                  <div className="field-label">{d.kojiRatio}</div>
                  <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', color: 'hsl(35, 25%, 88%)' }}>
                    {generated.recommendedParameters.kojRatio}%
                  </div>
                </div>
              )}
              {generated.recommendedParameters.saltRatio != null && (
                <div>
                  <div className="field-label">{d.saltRatio}</div>
                  <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', color: 'hsl(35, 25%, 88%)' }}>
                    {generated.recommendedParameters.saltRatio}%
                  </div>
                </div>
              )}
              {generated.recommendedParameters.fermentationDuration && (
                <div>
                  <div className="field-label">{d.fermentationDuration}</div>
                  <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'hsl(35, 25%, 88%)' }}>
                    {generated.recommendedParameters.fermentationDuration}
                  </div>
                </div>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.85rem', color: 'hsl(35, 15%, 55%)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {generated.reasoning}
            </p>
            <button
              onClick={handleSaveGenerated}
              disabled={saving}
              className="btn-outline"
            >
              {saving ? '...' : d.saveGenerated}
            </button>
          </div>
        )}
      </div>

      {/* Starter templates */}
      <div className="animate-in delay-2" style={{ marginBottom: '3rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'hsl(30, 68%, 45%)',
            marginBottom: '1.25rem',
          }}
        >
          {d.browseSection}
        </div>
        {fetchLoading ? (
          <p style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.875rem', color: 'hsl(35, 15%, 45%)' }}>
            {dict.common.loading}
          </p>
        ) : fetchError ? (
          <p style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.875rem', color: 'hsl(4, 65%, 58%)' }}>
            {fetchError}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))', gap: '1rem' }}>
            {templates.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} dict={d} onUse={() => router.push(`/batches/new?recipeId=${recipe.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* My recipes */}
      <div className="animate-in delay-3">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'hsl(30, 68%, 45%)',
            }}
          >
            {d.mySection}
          </div>
          <Link href="/recipes/new" className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
            + {d.newRecipe}
          </Link>
        </div>
        {!fetchLoading && myRecipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px solid hsl(25, 18%, 14%)' }}>
            <p style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.875rem', color: 'hsl(35, 15%, 45%)', marginBottom: '1rem' }}>
              {d.empty}
            </p>
            <Link href="/recipes/new" className="btn-primary" style={{ fontSize: '0.8rem' }}>
              {d.emptyCta}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))', gap: '1rem' }}>
            {myRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} dict={d} onUse={() => router.push(`/batches/new?recipeId=${recipe.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  dict: d,
  onUse,
}: {
  recipe: Recipe;
  dict: ReturnType<typeof useLocale>['dict']['recipes'];
  onUse: () => void;
}) {
  return (
    <div
      style={{
        background: 'hsl(25, 30%, 7%)',
        border: '1px solid hsl(25, 18%, 14%)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div>
        {recipe.miso_type && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'hsl(30, 68%, 45%)',
              fontFamily: 'var(--font-lora), serif',
              marginBottom: '0.4rem',
            }}
          >
            {recipe.miso_type}
          </span>
        )}
        <h3
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '1.3rem',
            fontWeight: 400,
            color: 'hsl(35, 25%, 88%)',
            lineHeight: 1.2,
          }}
        >
          {recipe.name}
        </h3>
        {recipe.description && (
          <p style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.8rem', color: 'hsl(35, 15%, 50%)', marginTop: '0.3rem', lineHeight: 1.5 }}>
            {recipe.description}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {recipe.koji_ratio != null && (
          <div>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(35, 15%, 40%)' }}>{d.kojiRatio}</div>
            <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', color: 'hsl(35, 25%, 75%)' }}>{recipe.koji_ratio}%</div>
          </div>
        )}
        {recipe.salt_ratio != null && (
          <div>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(35, 15%, 40%)' }}>{d.saltRatio}</div>
            <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', color: 'hsl(35, 25%, 75%)' }}>{recipe.salt_ratio}%</div>
          </div>
        )}
        {recipe.fermentation_duration && (
          <div>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(35, 15%, 40%)' }}>{d.fermentationDuration}</div>
            <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem', color: 'hsl(35, 25%, 75%)' }}>{recipe.fermentation_duration}</div>
          </div>
        )}
      </div>

      <button onClick={onUse} className="btn-outline" style={{ fontSize: '0.75rem', marginTop: 'auto' }}>
        {d.useRecipe}
      </button>
    </div>
  );
}
