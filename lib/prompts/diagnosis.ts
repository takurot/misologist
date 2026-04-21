export function buildDiagnosisPrompt(params: {
  startDate?: string;
  temperature?: number;
  storageLocation?: string;
  soybeanVariety?: string;
  kojRatio?: number;
  saltRatio?: number;
}): string {
  const envContext = [
    params.startDate && `仕込み開始日: ${params.startDate}`,
    params.temperature && `保存温度: ${params.temperature}°C`,
    params.storageLocation && `保存場所: ${params.storageLocation}`,
    params.soybeanVariety && `大豆品種: ${params.soybeanVariety}`,
    params.kojRatio && `麹歩合: ${params.kojRatio}%`,
    params.saltRatio && `塩分比: ${params.saltRatio}%`,
  ]
    .filter(Boolean)
    .join('\n');

  return `あなたは経験豊富な味噌醸造の専門家です。提供された味噌の写真を分析し、発酵状態を診断してください。

${envContext ? `【環境情報】\n${envContext}\n` : ''}

以下のJSON形式で回答してください：

\`\`\`json
{
  "urgencyLevel": "GREEN" | "YELLOW" | "RED",
  "moldType": "検出されたカビの種類（例：白カビ、黒カビ、青カビなど）",
  "moldReason": "カビの発生原因の説明",
  "fermentationChemistry": "発酵化学的な観点からの詳細説明（メイラード反応、アミノ酸生成、酵素活性など）",
  "immediateActions": ["今すぐ実行すべき対処法1", "対処法2"],
  "preventionTips": ["再発防止策1", "再発防止策2"],
  "batchComparison": "過去のバッチとの比較（あれば）"
}
\`\`\`

緊急度レベルの基準：
- GREEN: 正常な発酵状態。白カビ（産膜酵母）は通常許容範囲
- YELLOW: 注意が必要。異常なカビの兆候あり、経過観察が必要
- RED: 緊急対応が必要。黒カビ、青カビ、異臭など深刻な問題あり

JSONのみを返してください。コードブロックマーカーは含めないでください。`;
}

export function buildKnowledgeTranslationPrompt(knowledge: string): string {
  return `あなたは発酵科学と伝統的な味噌醸造の両方に精通した専門家です。
以下の職人の経験則・伝統知識を、現代の発酵化学の観点から科学的に解説してください。

【職人の知識・経験則】
${knowledge}

以下のJSON形式で回答してください：

\`\`\`json
{
  "originalKnowledge": "元の職人知識をそのまま記載",
  "scientificExplanation": "科学的な説明（発酵化学、微生物学、酵素化学の観点から）",
  "chemistry": "関連する化学反応式や化合物名（例：グルタミン酸生成、メイラード反応など）",
  "practicalAdvice": ["科学的根拠に基づく実践的アドバイス1", "アドバイス2"],
  "references": ["参考となる発酵科学の概念1", "概念2"]
}
\`\`\`

JSONのみを返してください。コードブロックマーカーは含めないでください。`;
}

export function buildBatchWatcherPrompt(params: {
  batchName: string;
  startDate: string;
  daysElapsed: number;
  recipe: {
    kojRatio?: number;
    saltRatio?: number;
    soybeanVariety?: string;
  };
  recentLogs: Array<{
    date: string;
    temperature?: number;
    humidity?: number;
    observations?: string;
  }>;
}): string {
  const recipeInfo = [
    params.recipe.soybeanVariety && `大豆品種: ${params.recipe.soybeanVariety}`,
    params.recipe.kojRatio && `麹歩合: ${params.recipe.kojRatio}%`,
    params.recipe.saltRatio && `塩分比: ${params.recipe.saltRatio}%`,
  ]
    .filter(Boolean)
    .join(', ');

  const logsText = params.recentLogs
    .map(
      (log) =>
        `${log.date}: 温度${log.temperature ?? '不明'}°C, 湿度${log.humidity ?? '不明'}%, ${log.observations ?? '記録なし'}`
    )
    .join('\n');

  return `あなたは味噌醸造の長期管理エージェントです。以下のバッチ情報を分析し、今日実施すべきアクションを決定してください。

【バッチ情報】
名前: ${params.batchName}
仕込み日: ${params.startDate}
経過日数: ${params.daysElapsed}日
レシピ: ${recipeInfo || '標準レシピ'}

【直近の観察記録】
${logsText || '記録なし'}

発酵段階に応じた今日のアクションをJSON形式で返してください：

\`\`\`json
{
  "fermentationStage": "初期発酵 | 中期発酵 | 後期発酵 | 熟成",
  "assessment": "現在の発酵状態の評価",
  "actions": [
    {
      "type": "tenchi_gaeshi" | "weather_response" | "salt_tasting" | "observation" | "warning",
      "title": "アクション名",
      "description": "具体的な実施内容",
      "priority": "high" | "medium" | "low",
      "scheduledDate": "YYYY-MM-DD"
    }
  ],
  "completionDate": "予想完成日 YYYY-MM-DD",
  "nextCheckDate": "次回確認推奨日 YYYY-MM-DD"
}
\`\`\`

JSONのみを返してください。`;
}
