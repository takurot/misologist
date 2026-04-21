# Misologist — 発酵診断・職人知識継承エンジン

> 「味噌職人の20年の経験を、Opus 4.7 が科学として語る」

**Anthropic Hackathon 2025 — Built with Opus 4.7**

---

## 概要

Misologist は、家庭味噌仕込み愛好家・小規模味噌蔵・発酵研究者向けの AI エージェントプラットフォームです。年1回しかチャンスのない味噌仕込みの失敗を防ぎ、職人の暗黙知を科学として継承します。

### なぜ Opus 4.7 でなければならないか

| 他のモデルで代替できないこと | Opus 4.7 の能力 |
|---|---|
| 複数バッチ・複数月の発酵ログ全体を参照した比較推論 | 長文コンテキスト統合 |
| 「寒仕込みは旨味が出る」→ メイラード反応・アミノ酸生成への変換 | 職人暗黙知の科学翻訳 |
| 「このカビは除去すれば問題ない」判断の発酵化学的プロセス逐次説明 | 不確実性の定量化と根拠生成 |

---

## 機能

### Feature 1 — 緊急発酵診断

発酵写真をアップロードすると Opus 4.7 が即座に診断します。

- **カビ種別判定:** 白カビ（産膜酵母/良性）/ 青カビ（ペニシリウム/危険）/ 赤カビ（ロドトルラ/要確認）
- **緊急度レベル:** GREEN / YELLOW / RED
- **発酵化学的根拠:** なぜそのカビが問題/問題でないかのメカニズム解説
- **具体的アクション:** 除去手順・消毒方法・再発防止策（ステップバイステップ）
- **過去バッチとの比較:** 「3ヶ月前の同条件バッチと比較してカビ発生が2週間早い」等の縦断推論

### Feature 2 — バッチ監視エージェント（Managed Agents）

仕込んだ日から完成まで、バックグラウンドで非同期常時監視。

- バッチ1つ = 1エージェントセッション（最長12ヶ月の長期タスク）
- 毎日定刻に「今日のアクション」を生成（天地返し推奨・天候対応・塩嘗め時期）
- 熟成速度から完成日を動的に再計算・更新

### Feature 3 — 職人知識翻訳エンジン

職人の経験則を Opus 4.7 が発酵化学に翻訳します。

- **翻訳モード:** 「寒仕込みにすると旨味が強くなる気がする」→ プロテアーゼ活性・グルタミン酸生成の科学的説明
- **逆引きモード:** 「酸味を抑えて甘みを強くしたい」→ 麹歩合・仕込み温度・熟成期間の最適パラメータを逆算

---

## ピボットの記録

最初のアイデア（単発写真診断ツール）から、以下3点を根本的に修正しました。

| 修正前の問題 | 根拠 | 修正後の設計 |
|---|---|---|
| 単発写真診断 | Vision診断は小型モデルでも代替可能。Opus 4.7の必然性なし | 複数バッチ・複数年の長文ログを統合した縦断推論 |
| 発酵スコア0-100 | 計算根拠が曖昧 | Opus 4.7が発酵化学的根拠付きで「なぜそのスコアか」を説明生成 |
| Managed Agentsを同期タスクに使用 | 短時間タスクではMCAの強みを無駄にする | バッチ監視エージェントとして非同期常時動作 |

---

## 技術スタック

| レイヤー | コンポーネント | 役割 |
|---|---|---|
| フロントエンド | Next.js 14 App Router + shadcn/ui | 写真アップロード・診断結果表示・バッチダッシュボード |
| AI エンジン | Claude Opus 4.7 | Vision診断・発酵推論・知識翻訳・根拠生成 |
| エージェント基盤 | Claude Managed Agents | 非同期バッチ監視・長期セッション管理 |
| データ | Supabase (PostgreSQL) | バッチログ・診断履歴・写真メタデータ |
| ストレージ | Supabase Storage | 発酵写真のバイナリ保存 |
| デプロイ | Vercel | サーバーレス実行環境 |

---

## セットアップ

### 前提条件

- Node.js 18+
- Supabase アカウント
- Anthropic API キー（Opus 4.7 アクセス権）

### 環境変数

`.env.local` を作成:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Supabase スキーマ初期化

Supabase SQL Editor で `docs/schema.sql` を実行してください。

### インストール・起動

```bash
npm install
npm run dev
```

`http://localhost:3000` で起動します。

---

## データスキーマ

```sql
batches:       id / name / started_at / recipe_json / status
logs:          id / batch_id / captured_at / photo_url / env_json / diagnosis_json / action_json
agent_sessions: id / batch_id / agent_state / last_action_at / next_action_at
```

---

## ライセンス

MIT License — see [LICENSE](LICENSE)

---

*Misologist — Built with Opus 4.7 | Anthropic Hackathon 2025*
