# Misologist — 実装計画

**Anthropic Hackathon 2026 | 締切: 2026-04-26 20:00 EST**

---

## フェーズ概要

| Day | 日付 | フェーズ | 主要成果物 |
|-----|------|---------|-----------|
| 1 | 4/22 (Wed) | Foundation | Next.js + Supabase + 写真アップロード |
| 2 | 4/23 (Thu) | AI Core | Opus 4.7 Vision診断API |
| 3 | 4/24 (Fri) | Agents | Managed Agents バッチ監視 |
| 4 | 4/25 (Sat) | UX + Polish | 診断UI・ダッシュボード・知識翻訳 |
| 5 | 4/26 (Sun) | Submit | デモ動画・README・GitHub公開・提出 |

---

## Day 1 — Foundation（4/22）

### T1-1: プロジェクト初期化
- [ ] `npx create-next-app@14 misologist --typescript --tailwind --app` で Next.js 14 App Router セットアップ
- [ ] shadcn/ui インストール: `npx shadcn-ui@latest init`
- [ ] 必要コンポーネント追加: button, card, badge, progress, textarea, input, select, tabs
- [ ] `src/` ディレクトリ構成を feature/domain ベースで設計

**ディレクトリ構成:**
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx          # バッチ一覧ダッシュボード
│   │   └── layout.tsx
│   ├── diagnosis/
│   │   └── page.tsx          # 緊急診断ページ
│   ├── batches/
│   │   ├── [id]/page.tsx     # バッチ詳細
│   │   └── new/page.tsx      # 新規バッチ作成
│   ├── knowledge/
│   │   └── page.tsx          # 知識翻訳ページ
│   ├── api/
│   │   ├── diagnosis/route.ts
│   │   ├── batches/route.ts
│   │   ├── agent-sessions/route.ts
│   │   └── knowledge/route.ts
│   ├── layout.tsx
│   └── page.tsx              # ランディング
├── components/
│   ├── diagnosis/
│   ├── batches/
│   ├── knowledge/
│   └── shared/
├── lib/
│   ├── anthropic.ts          # Anthropic SDK クライアント
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── prompts/              # 発酵化学プロンプト定義
└── types/
    └── index.ts
```

### T1-2: Supabase セットアップ
- [ ] Supabase プロジェクト作成（misologist）
- [ ] `.env.local` に接続情報設定:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ANTHROPIC_API_KEY=
  ```
- [ ] Supabase クライアント初期化（`lib/supabase/client.ts` + `lib/supabase/server.ts`）

### T1-3: データベーススキーマ設計・作成
- [ ] Supabase SQL Editor で以下を実行:

```sql
-- バッチ（仕込み単位）
CREATE TABLE batches (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  started_at   timestamptz NOT NULL DEFAULT now(),
  recipe_json  jsonb NOT NULL DEFAULT '{}',
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 発酵ログ（写真＋診断）
CREATE TABLE logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id       uuid NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  captured_at    timestamptz NOT NULL DEFAULT now(),
  photo_url      text,
  env_json       jsonb NOT NULL DEFAULT '{}',
  diagnosis_json jsonb,
  action_json    jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- エージェントセッション（バッチ監視）
CREATE TABLE agent_sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id       uuid NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  agent_state    jsonb NOT NULL DEFAULT '{}',
  last_action_at timestamptz,
  next_action_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(batch_id)
);

-- Row Level Security（認証なしPublic API用に全許可）
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_access" ON batches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON agent_sessions FOR ALL USING (true) WITH CHECK (true);
```

- [ ] Supabase Storage バケット `fermentation-photos` 作成（Public）

### T1-4: 写真アップロードUI
- [ ] `components/diagnosis/PhotoUpload.tsx` — ドラッグ&ドロップ + クリック選択
- [ ] Supabase Storage へのアップロードユーティリティ (`lib/storage.ts`)
- [ ] 環境メタデータ入力フォーム (`components/diagnosis/MetadataForm.tsx`):
  - 仕込み日（date picker）
  - 現在温度（number input）
  - 保管場所（select）
  - 大豆品種（text input）
  - 麹歩合（number）
  - 塩分率（number）
- [ ] 診断ページ `/diagnosis` の基本レイアウト完成

**完了基準:** ローカルで写真を選択→Supabase Storageに保存できる

---

## Day 2 — AI Core（4/23）

### T2-1: Anthropic SDK セットアップ
- [ ] `npm install @anthropic-ai/sdk`
- [ ] `lib/anthropic.ts` — Anthropic クライアント初期化（シングルトン）
- [ ] `types/index.ts` — 診断結果型定義:

```typescript
type UrgencyLevel = 'GREEN' | 'YELLOW' | 'RED';

interface DiagnosisResult {
  urgencyLevel: UrgencyLevel;
  moldType: string;
  moldReason: string;
  fermentationChemistry: string;
  immediateActions: string[];
  preventionTips: string[];
  batchComparison?: string;
}
```

### T2-2: 発酵化学プロンプト設計
- [ ] `lib/prompts/fermentation-chemistry.ts` — 発酵化学ベースナレッジプロンプト:
  - カビ種別の視覚的特徴と危険度（白/青/赤/黒）
  - メイラード反応・アミノ酸生成の科学的説明
  - プロテアーゼ活性と温度の関係
  - 塩分・水分活性と発酵抑制の機序
- [ ] `lib/prompts/diagnosis.ts` — 診断プロンプト（システム + ユーザー）:
  - Vision入力（base64 image）
  - 環境メタデータの構造化入力
  - 出力フォーマット指定（JSON構造化出力）

### T2-3: Vision診断 API Route
- [ ] `app/api/diagnosis/route.ts`:
  - `multipart/form-data` で画像 + メタデータ受け取り
  - Supabase Storage にアップロード
  - Opus 4.7 Vision API 呼び出し（`claude-opus-4-7` + `image` content block）
  - 診断結果を `logs` テーブルに保存
  - `DiagnosisResult` を返却
- [ ] バリデーション: ファイルサイズ上限10MB、PNG/JPEG のみ

### T2-4: 診断結果表示コンポーネント
- [ ] `components/diagnosis/DiagnosisResult.tsx`:
  - 緊急度バッジ（GREEN=緑/YELLOW=黄/RED=赤）
  - カビ種別と判定根拠
  - 発酵化学的説明（accordion展開）
  - 具体的アクション（step-by-step numbered list）
  - 再発防止策
- [ ] ローディング状態（streaming対応 or スケルトンUI）
- [ ] 診断フロー完成: アップロード → API → 結果表示

### T2-5: 過去バッチとの比較推論（長文コンテキスト）
- [ ] バッチ選択UIを診断フォームに追加（既存バッチのログを参照するオプション）
- [ ] `app/api/diagnosis/route.ts` を拡張: 過去ログを取得してコンテキストに追加
- [ ] プロンプトに「過去バッチとの比較分析」セクションを追加

**完了基準:** カビ写真をアップロードして緊急度・発酵化学的根拠・アクション手順が表示される

---

## Day 3 — Agents（4/24）

### T3-1: Claude Managed Agents 調査・設計
- [ ] Managed Agents API ドキュメント確認（`/docs/en/managed-agents/overview`）
- [ ] バッチ1つ = 1エージェントセッションのデータモデル確認
- [ ] エージェントの責務定義:
  - 毎日の発酵アクション生成（天地返し・天候対応・塩嘗め時期）
  - 熟成進捗評価と完成予測日の更新
  - 異常検知アラート生成

### T3-2: バッチ管理API
- [ ] `app/api/batches/route.ts`:
  - `GET /api/batches` — バッチ一覧取得
  - `POST /api/batches` — 新規バッチ作成（エージェントセッション初期化も同時実行）
- [ ] `app/api/batches/[id]/route.ts`:
  - `GET /api/batches/[id]` — バッチ詳細（ログ付き）
  - `PATCH /api/batches/[id]` — バッチ更新
- [ ] 新規バッチ作成フォーム (`app/batches/new/page.tsx`):
  - バッチ名・仕込み日・レシピ情報（麹歩合・塩分・大豆種類）

### T3-3: Managed Agent セッション実装
- [ ] `app/api/agent-sessions/route.ts`:
  - `POST /api/agent-sessions` — バッチに対してエージェントセッション開始
  - `GET /api/agent-sessions/[batchId]` — セッション状態取得
- [ ] `lib/agents/batchWatcher.ts` — バッチ監視エージェントのロジック:
  - エージェントへの初期コンテキスト構築（レシピ・仕込み日・現在状態）
  - 「今日のアクション」生成プロンプト
  - 完成日予測ロジック
- [ ] エージェント実行結果を `agent_sessions.agent_state` に保存

### T3-4: 今日のアクション通知UI
- [ ] `components/batches/DailyAction.tsx`:
  - 天地返し推奨カード
  - 天候対応メッセージ
  - 塩嘗め時期アドバイス
  - 完成予測日プログレスバー
- [ ] `app/api/agent-sessions/[batchId]/action/route.ts`:
  - エージェントから「今日のアクション」を取得するエンドポイント
  - 最終実行時刻に基づきキャッシュ（24時間）

**フォールバック:** Managed Agentsの実装が想定超過した場合、  
→ Opus 4.7 への直接APIコールでアクション生成をシミュレートするモックで代替

**完了基準:** バッチを作成するとエージェントセッションが起動し、今日のアクションが表示される

---

## Day 4 — UX + Polish（4/25）

### T4-1: バッチダッシュボード
- [ ] `app/(dashboard)/page.tsx` — メインダッシュボード:
  - アクティブバッチ一覧（カードグリッド）
  - 各バッチの熟成進捗バー
  - 最新の診断ステータスバッジ
  - 「今日のアクション」数バッジ
- [ ] `components/batches/BatchCard.tsx`:
  - バッチ名・仕込み日・経過日数
  - 熟成ステージ（仕込み期→熟成期→完成近し）
  - 最新緊急度バッジ
- [ ] `app/batches/[id]/page.tsx` — バッチ詳細:
  - タイムライン形式のログ一覧（写真サムネイル + 診断サマリー）
  - 今日のアクション表示
  - 新規ログ追加ボタン（診断ページへリンク）

### T4-2: 職人知識翻訳エンジン（Feature 3）
- [ ] `lib/prompts/knowledge.ts` — 知識翻訳プロンプト:
  - 職人経験則の入力を受け取り発酵化学に翻訳
  - 逆引き設計（目標風味→パラメータ推奨）対応
- [ ] `app/api/knowledge/route.ts`:
  - `POST /api/knowledge/translate` — 経験則→科学翻訳
  - `POST /api/knowledge/reverse` — 目標風味→パラメータ逆算
- [ ] `app/knowledge/page.tsx` — 知識翻訳UIページ:
  - 自由記述入力エリア（例: 「寒仕込みにすると旨味が強くなる気がする」）
  - モード切り替え: 翻訳モード / 逆引きモード
  - ストリーミング表示（`useEffect` + ReadableStream）
  - 翻訳結果の科学的根拠カード（アコーディオン展開）

### T4-3: ナビゲーション・レイアウト整備
- [ ] `components/shared/Navigation.tsx` — サイドバーナビゲーション:
  - ダッシュボード / 緊急診断 / 知識翻訳
- [ ] `app/layout.tsx` — ルートレイアウト（ナビ + メインコンテンツ）
- [ ] モバイル対応: スマホ撮影直アップ対応（`accept="image/*"` + `capture` 属性）
- [ ] ランディングページ `app/page.tsx`:
  - ヒーローコピー「年1回の仕込みを、AIが守る」
  - 3機能のカード（緊急診断 / バッチ監視 / 知識翻訳）

### T4-4: E2Eデモフロー動作確認
- [ ] デモシナリオを通しで実行（3分シナリオ）:
  1. 青カビ写真をドロップ → 診断結果確認（〜20秒）
  2. バッチダッシュボード → 今日のアクション確認
  3. 「寒仕込みが旨い理由」→ 知識翻訳確認
- [ ] エラーハンドリング確認（API障害時のフォールバックUI）
- [ ] レスポンシブ確認（スマホ幅）

**完了基準:** 3分デモシナリオが端から端まで動作する

---

## Day 5 — Submit（4/26）

### T5-1: README 作成
- [ ] `README.md` に以下を記載:
  - デモGIF or スクリーンショット
  - 問題提起（年1回の仕込み・職人知識格差）
  - ピボットの過程（単発写真診断→現設計への修正3点、SPEC.md Section 1.1）
  - Opus 4.7 の必然性（長文コンテキスト・知識翻訳・不確実性の定量化）
  - セットアップ手順（env設定・Supabase初期化・npm install・dev server）
  - アーキテクチャ図

### T5-2: 環境変数・本番デプロイ
- [ ] Vercel プロジェクト作成・接続
- [ ] 環境変数を Vercel に設定（ANTHROPIC_API_KEY / SUPABASE_URL / SUPABASE_ANON_KEY / SERVICE_ROLE_KEY）
- [ ] `vercel --prod` でデプロイ・動作確認
- [ ] Supabase の CORS 設定に Vercel ドメインを追加

### T5-3: GitHub リポジトリ公開
- [ ] リポジトリ作成: `github.com/<user>/misologist`
- [ ] MIT ライセンス (`LICENSE`) 追加
- [ ] `.gitignore` で `.env.local` 除外確認
- [ ] `main` ブランチへ push・Public 設定

### T5-4: デモ動画撮影（3分）
- [ ] 台本確認（SPEC.md Section 6）:
  - 0:00–0:30 問題提起（字幕 or ナレーション）
  - 0:30–1:30 青カビ緊急診断ライブデモ
  - 1:30–2:20 バッチ監視ダッシュボード
  - 2:20–3:00 知識翻訳（「寒仕込みが旨い理由」）
- [ ] 動画録画（Loom or QuickTime）
- [ ] YouTube / Loom にアップロード（限定公開 or 公開）

### T5-5: 提出
- [ ] Cerebral Valley プラットフォームから提出:
  - デモ動画URL
  - GitHub リポジトリURL
  - Written summary（100–200 words）
- [ ] **提出締切: 2026-04-26 20:00 EST = 4/27 09:00 JST**

---

## リスク管理・フォールバック

| リスク | 対策 |
|--------|------|
| Managed Agents実装工数超過 | Day 3 で詰まったらOpus 4.7直接呼び出しのモックに切り替え。Feature 1・3を先に完成させる |
| Opus 4.7カビ診断精度低下 | プロンプトに発酵化学詳細コンテキストを追加。Few-shotサンプルを埋め込む |
| UI品質低下 | shadcn/ui 最大活用。デモは機能を絞り「動くこと」最優先 |
| Vercelデプロイ失敗 | Day 4 中にデプロイ試行。本番が動かない場合はlocalhost画面録画で提出 |

---

## 技術スタック詳細

| カテゴリ | ライブラリ/サービス | バージョン |
|---------|-------------------|-----------|
| フレームワーク | Next.js App Router | 14.x |
| UI | shadcn/ui + Tailwind CSS | latest |
| AI | @anthropic-ai/sdk (Opus 4.7) | latest |
| DB | Supabase (PostgreSQL) | - |
| ストレージ | Supabase Storage | - |
| エージェント | Claude Managed Agents | - |
| デプロイ | Vercel | - |
| 言語 | TypeScript | 5.x |

---

*Misologist — Built with Opus 4.7 | Anthropic Hackathon 2026*
