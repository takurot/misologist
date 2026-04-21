import type { DiagnosisResult as DiagnosisResultType } from '@/types';

const urgencyConfig = {
  GREEN: { label: '正常', color: 'bg-green-100 text-green-800 border-green-200', emoji: '✅' },
  YELLOW: { label: '注意', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', emoji: '⚠️' },
  RED: { label: '緊急', color: 'bg-red-100 text-red-800 border-red-200', emoji: '🚨' },
};

interface DiagnosisResultProps {
  result: DiagnosisResultType;
}

export function DiagnosisResult({ result }: DiagnosisResultProps) {
  const config = urgencyConfig[result.urgencyLevel];

  return (
    <div className="space-y-4">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold ${config.color}`}>
        <span>{config.emoji}</span>
        <span>{config.label} ({result.urgencyLevel})</span>
      </div>

      <div className="border rounded-lg p-4 bg-card space-y-3">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">検出されたカビ</h3>
          <p className="font-medium">{result.moldType}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">発生原因</h3>
          <p className="text-sm">{result.moldReason}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">発酵化学的解説</h3>
          <p className="text-sm leading-relaxed">{result.fermentationChemistry}</p>
        </div>
      </div>

      {result.immediateActions.length > 0 && (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium mb-2">今すぐ実施すること</h3>
          <ul className="space-y-1">
            {result.immediateActions.map((action, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary font-bold">{i + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.preventionTips.length > 0 && (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium mb-2">再発防止策</h3>
          <ul className="space-y-1">
            {result.preventionTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.batchComparison && (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium mb-2">過去バッチとの比較</h3>
          <p className="text-sm">{result.batchComparison}</p>
        </div>
      )}
    </div>
  );
}
