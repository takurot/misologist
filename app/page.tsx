import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Misologist
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          発酵診断・職人知識継承エンジン
        </p>
        <p className="text-muted-foreground">
          Claude Opus 4.7の視覚診断とエージェント技術で、あなたの味噌造りを支援します
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/diagnosis" className="group block">
          <div className="border rounded-lg p-6 bg-card hover:border-primary transition-colors">
            <div className="text-3xl mb-3">🔬</div>
            <h2 className="text-lg font-semibold mb-2">緊急発酵診断</h2>
            <p className="text-sm text-muted-foreground">
              写真をアップロードするだけで、AIが発酵状態を即座に診断。
              GREEN/YELLOW/REDの緊急度レベルで判定します。
            </p>
          </div>
        </Link>

        <Link href="/batches" className="group block">
          <div className="border rounded-lg p-6 bg-card hover:border-primary transition-colors">
            <div className="text-3xl mb-3">📋</div>
            <h2 className="text-lg font-semibold mb-2">バッチ管理</h2>
            <p className="text-sm text-muted-foreground">
              複数の味噌バッチを長期管理。AIエージェントが毎日の発酵状態を
              監視し、適切なアクションを提案します。
            </p>
          </div>
        </Link>

        <Link href="/knowledge" className="group block">
          <div className="border rounded-lg p-6 bg-card hover:border-primary transition-colors">
            <div className="text-3xl mb-3">📖</div>
            <h2 className="text-lg font-semibold mb-2">知識翻訳</h2>
            <p className="text-sm text-muted-foreground">
              職人の経験則を発酵化学で解明。「塩は多めに」などの伝統知識を
              科学的に解説します。
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
