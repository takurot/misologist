'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Batch } from '@/types';

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/batches')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setBatches(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusLabel = {
    active: '仕込み中',
    completed: '完成',
    failed: '失敗',
  };

  const statusColor = {
    active: 'text-green-700 bg-green-100',
    completed: 'text-blue-700 bg-blue-100',
    failed: 'text-red-700 bg-red-100',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">バッチ管理</h1>
          <p className="text-muted-foreground">味噌バッチの長期管理とAIエージェント監視</p>
        </div>
        <Link
          href="/batches/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          新規バッチ
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">読み込み中...</div>
      ) : batches.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <p className="text-muted-foreground mb-4">まだバッチがありません</p>
          <Link href="/batches/new" className="text-primary hover:underline text-sm">
            最初のバッチを作成する
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {batches.map((batch) => {
            const days = Math.floor(
              (Date.now() - new Date(batch.started_at).getTime()) / (1000 * 60 * 60 * 24)
            );
            return (
              <Link key={batch.id} href={`/batches/${batch.id}`}>
                <div className="border rounded-lg p-4 bg-card hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold">{batch.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        仕込み開始: {new Date(batch.started_at).toLocaleDateString('ja-JP')} ({days}日経過)
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[batch.status]}`}
                    >
                      {statusLabel[batch.status]}
                    </span>
                  </div>
                  {batch.recipe_json && (
                    <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                      {batch.recipe_json.soybeanVariety && (
                        <span>大豆: {batch.recipe_json.soybeanVariety}</span>
                      )}
                      {batch.recipe_json.kojRatio && (
                        <span>麹歩合: {batch.recipe_json.kojRatio}%</span>
                      )}
                      {batch.recipe_json.saltRatio && (
                        <span>塩分: {batch.recipe_json.saltRatio}%</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
