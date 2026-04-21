'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBatchPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    started_at: new Date().toISOString().split('T')[0],
    soybeanVariety: '',
    kojRatio: '',
    saltRatio: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const recipe_json = {
        soybeanVariety: form.soybeanVariety || undefined,
        kojRatio: form.kojRatio ? Number(form.kojRatio) : undefined,
        saltRatio: form.saltRatio ? Number(form.saltRatio) : undefined,
        notes: form.notes || undefined,
      };

      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          started_at: form.started_at,
          recipe_json,
        }),
      });

      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      router.push(`/batches/${json.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'バッチの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">新規バッチ作成</h1>
      <p className="text-muted-foreground mb-8">新しい味噌バッチの情報を入力してください</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">バッチ名 *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="例: 2024年 春仕込み"
            className="w-full border rounded px-3 py-2 bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">仕込み開始日 *</label>
          <input
            type="date"
            required
            value={form.started_at}
            onChange={(e) => setForm({ ...form, started_at: e.target.value })}
            className="w-full border rounded px-3 py-2 bg-background"
          />
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">レシピ情報（任意）</h3>
          <div>
            <label className="block text-xs font-medium mb-1">大豆品種</label>
            <input
              type="text"
              value={form.soybeanVariety}
              onChange={(e) => setForm({ ...form, soybeanVariety: e.target.value })}
              placeholder="例: 鶴の子大豆"
              className="w-full border rounded px-3 py-2 text-sm bg-background"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">麹歩合 (%)</label>
              <input
                type="number"
                value={form.kojRatio}
                onChange={(e) => setForm({ ...form, kojRatio: e.target.value })}
                placeholder="例: 10"
                className="w-full border rounded px-3 py-2 text-sm bg-background"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">塩分比 (%)</label>
              <input
                type="number"
                value={form.saltRatio}
                onChange={(e) => setForm({ ...form, saltRatio: e.target.value })}
                placeholder="例: 12"
                className="w-full border rounded px-3 py-2 text-sm bg-background"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">メモ</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="特記事項など"
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm bg-background resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="border border-destructive/50 bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? '作成中...' : 'バッチを作成'}
          </button>
        </div>
      </form>
    </div>
  );
}
