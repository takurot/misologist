export const LOCALE_COOKIE = 'misologist-locale';
export const LOCALE_STORAGE_KEY = 'misologist-locale';

export const SUPPORTED_LOCALES = ['en', 'ja'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const dictionaries = {
  en: {
    metadata: {
      title: 'Misologist — Fermentation Diagnosis & Craft Knowledge Engine',
      description:
        'Diagnose and manage miso fermentation with Claude Opus 4.7. Translate tacit craft knowledge into fermentation science.',
    },
    brand: {
      subtitle: 'Fermentation Diagnosis / Knowledge Engine',
    },
    nav: {
      diagnosis: 'Diagnose',
      batches: 'Batches',
      recipes: 'Recipes',
      knowledge: 'Knowledge',
    },
    language: {
      label: 'Language',
      en: 'English',
      ja: '日本語',
    },
    footer: {
      builtWith: 'Misologist — Built with Claude Opus 4.7',
      hackathon: 'Anthropic Hackathon 2025',
    },
    common: {
      loading: 'Loading...',
      networkError: 'A network error occurred.',
    },
    home: {
      label: 'Fermentation Intelligence',
      headlineLeading: 'Turn fermentation',
      headlineAccent: 'into science.',
      descriptionLine1:
        'Twenty years of miso craft, translated into fermentation science by Claude Opus 4.7.',
      descriptionLine2:
        'From a single photo to mold type, chemical rationale, and concrete corrective action.',
      cta: 'Start diagnosis',
      decorativeMark: 'MISO',
      featureExplore: 'Explore →',
      quoteLine1: 'Twenty years of miso craft,',
      quoteLine2: 'explained as science by Opus 4.7.',
      features: [
        {
          title: 'Emergency fermentation triage',
          subtitle: 'Emergency Triage',
          description:
            'Drop in a fermentation photo. Opus 4.7 Vision identifies the mold, assigns a GREEN / YELLOW / RED urgency level, and explains the fermentation chemistry behind the call.',
        },
        {
          title: 'Batch monitoring',
          subtitle: 'Async Agent',
          description:
            'One batch equals one agent session. From inoculation to maturation, AI proposes the next daily action asynchronously.',
        },
        {
          title: 'Craft knowledge translation',
          subtitle: 'Knowledge Translation',
          description:
            'Translate rules of thumb like “use a little more salt” into osmotic pressure, water activity, and fermentation science for the next generation.',
        },
      ],
    },
    diagnosis: {
      label: 'Emergency Triage',
      heading: 'Emergency Fermentation Diagnosis',
      descriptionLine1:
        'Upload a photo of your miso. Claude Opus 4.7 diagnoses the fermentation state and surfaces',
      descriptionLine2:
        'the mold category, the chemical rationale, and the immediate corrective actions to take.',
      loading: 'Diagnosing...',
      submit: 'Diagnose batch',
      errorFallback: 'The diagnosis could not be completed.',
    },
    photoUpload: {
      ariaLabel: 'Upload a photo of your miso',
      imageAlt: 'Uploaded photo of the miso batch',
      idleLabel: 'Scan',
      draggingLabel: 'Drop to scan',
      dropHere: 'Drop your photo here',
      prompt: 'Drag and drop a photo, or click to choose a file',
      changePhoto: 'Change photo →',
    },
    metadataForm: {
      sectionTitle: 'Environment details (optional)',
      startDate: 'Batch start date',
      temperature: 'Storage temperature (°C)',
      temperaturePlaceholder: 'e.g. 25',
      storageLocation: 'Storage location',
      storageLocationPlaceholder: 'e.g. cool pantry, cellar',
      soybeanVariety: 'Soybean variety',
      soybeanVarietyPlaceholder: 'e.g. Tsurunoko',
      kojiRatio: 'Koji ratio (%)',
      kojiRatioPlaceholder: 'e.g. 10',
      saltRatio: 'Salt ratio (%)',
      saltRatioPlaceholder: 'e.g. 12',
    },
    diagnosisResult: {
      urgencyHeading: 'Urgency Level',
      urgencyLabels: {
        GREEN: 'Normal',
        YELLOW: 'Caution',
        RED: 'Critical',
      },
      detectedMold: 'Detected mold',
      cause: 'Likely cause',
      chemistry: 'Fermentation chemistry',
      immediateActions: 'Do this now',
      preventionTips: 'Prevent it next time',
      batchComparison: 'Comparison with previous batches',
    },
    knowledge: {
      label: 'Knowledge Translation',
      heading: 'Craft Knowledge Translation',
      description:
        'Translate tacit craft intuition and workshop heuristics into the scientific language of fermentation chemistry.',
      inputLabel: 'Craft saying',
      placeholder: 'e.g. Using more salt helps prevent spoilage',
      examplesLabel: 'Try an example',
      loading: 'Translating...',
      submit: 'Explain scientifically',
      errorFallback: 'The translation could not be completed.',
      sections: {
        explanation: 'Scientific explanation',
        chemistry: 'Fermentation chemistry',
        advice: 'Practical advice',
        references: 'Related fermentation science concepts',
      },
      examples: [
        'Using more salt helps prevent spoilage',
        'Turning the batch on a full moon makes it better',
        'Bad emotions lead to worse fermentation',
        'Summer brewing is harder to control',
      ],
    },
    batches: {
      label: 'Batch Monitor',
      heading: 'Batch Management',
      newBatch: 'New batch',
      empty: 'No batches yet',
      emptyCta: 'Start your first batch',
      fetchError: 'The batch list could not be loaded.',
      statuses: {
        active: 'Active',
        completed: 'Completed',
        failed: 'Failed',
      },
      startSuffix: 'started',
    },
    newBatch: {
      label: 'New Batch',
      heading: 'Create a New Batch',
      name: 'Batch name *',
      namePlaceholder: 'e.g. Spring Brew 2024',
      startedAt: 'Batch start date *',
      recipeSection: 'Recipe details (optional)',
      soybeanVariety: 'Soybean variety',
      soybeanVarietyPlaceholder: 'e.g. Tsurunoko',
      kojiRatio: 'Koji ratio (%)',
      kojiRatioPlaceholder: 'e.g. 10',
      saltRatio: 'Salt ratio (%)',
      saltRatioPlaceholder: 'e.g. 12',
      notes: 'Notes',
      notesPlaceholder: 'Any special notes',
      cancel: 'Cancel',
      submitting: 'Creating...',
      submit: 'Create batch',
      errorFallback: 'The batch could not be created.',
    },
    batchDetail: {
      back: '← Batches',
      fetchError: 'The batch could not be loaded.',
      runAgentError: 'The AI agent could not be started.',
      stats: {
        stage: 'Fermentation stage',
        completionDate: 'Projected completion',
        observationLogs: 'Observation logs',
      },
      stages: ['Early fermentation', 'Mid fermentation', 'Late fermentation', 'Aging'],
      assessment: 'AI agent assessment',
      actions: 'Recommended actions',
      runAgent: 'Ask the AI agent for today’s actions',
      runningAgent: 'AI agent is running...',
      actionTypes: {
        tenchi_gaeshi: 'Turn batch',
        weather_response: 'Weather response',
        salt_tasting: 'Salt check',
        observation: 'Observation',
        warning: 'Warning',
      },
    },
    recipes: {
      label: 'Recipe Library',
      heading: 'Miso Recipes',
      description: 'Browse classic recipes or describe your ideal flavor and let Claude generate a recipe for you.',
      aiSection: 'Generate a recipe with AI',
      aiInputLabel: 'Describe your ideal miso flavor',
      aiInputPlaceholder: 'e.g. Rich umami, slightly sweet, aged 12+ months...',
      aiSubmit: 'Generate recipe',
      aiLoading: 'Generating...',
      aiErrorFallback: 'The recipe could not be generated.',
      saveGenerated: 'Save as recipe',
      browseSection: 'Starter recipes',
      mySection: 'My recipes',
      empty: 'No saved recipes yet',
      emptyCta: 'Create your first recipe',
      fetchError: 'The recipe list could not be loaded.',
      useRecipe: 'Use this recipe →',
      newRecipe: 'New recipe',
      misoType: 'Miso type',
      kojiRatio: 'Koji ratio',
      saltRatio: 'Salt ratio',
      fermentationDuration: 'Duration',
    },
    newRecipe: {
      label: 'New Recipe',
      heading: 'Create a New Recipe',
      name: 'Recipe name *',
      namePlaceholder: 'e.g. My Sendai-style Miso',
      description: 'Description',
      descriptionPlaceholder: 'e.g. Rich red miso inspired by Sendai tradition',
      misoType: 'Miso type',
      misoTypePlaceholder: 'e.g. red, white, mixed',
      kojiRatio: 'Koji ratio (%)',
      kojiRatioPlaceholder: 'e.g. 10',
      saltRatio: 'Salt ratio (%)',
      saltRatioPlaceholder: 'e.g. 12',
      soybeanVariety: 'Soybean variety',
      soybeanVarietyPlaceholder: 'e.g. Tsurunoko',
      waterContent: 'Water content (%)',
      waterContentPlaceholder: 'e.g. 45',
      fermentationDuration: 'Fermentation duration',
      fermentationDurationPlaceholder: 'e.g. 12–18 months',
      notes: 'Notes',
      notesPlaceholder: 'Any special notes or technique tips',
      cancel: 'Cancel',
      submitting: 'Saving...',
      submit: 'Save recipe',
      errorFallback: 'The recipe could not be saved.',
    },
  },
  ja: {
    metadata: {
      title: 'Misologist — 発酵診断・職人知識継承エンジン',
      description:
        '味噌の発酵状態をClaude Opus 4.7で診断・管理。職人の暗黙知を発酵化学に翻訳します。',
    },
    brand: {
      subtitle: '発酵診断 / 知識継承エンジン',
    },
    nav: {
      diagnosis: 'Diagnose',
      batches: 'Batches',
      recipes: 'Recipes',
      knowledge: 'Knowledge',
    },
    language: {
      label: '言語',
      en: 'English',
      ja: '日本語',
    },
    footer: {
      builtWith: 'Misologist — Built with Claude Opus 4.7',
      hackathon: 'Anthropic Hackathon 2025',
    },
    common: {
      loading: '読み込み中...',
      networkError: 'ネットワークエラーが発生しました。',
    },
    home: {
      label: 'Fermentation Intelligence',
      headlineLeading: '発酵を、',
      headlineAccent: '科学にする。',
      descriptionLine1:
        '味噌職人20年の経験を、Claude Opus 4.7が発酵化学として語る。',
      descriptionLine2: '写真一枚から、カビの種別・化学的根拠・対処法まで。',
      cta: '診断を開始する',
      decorativeMark: '味',
      featureExplore: '探索する →',
      quoteLine1: '味噌職人の20年の経験を、',
      quoteLine2: 'Opus 4.7 が科学として語る。',
      features: [
        {
          title: '緊急発酵診断',
          subtitle: 'Emergency Triage',
          description:
            '発酵写真をドロップするだけ。Opus 4.7のVisionがカビ種別を判定し、GREEN / YELLOW / REDの緊急度とともに発酵化学的根拠を生成します。',
        },
        {
          title: 'バッチ監視',
          subtitle: 'Async Agent',
          description:
            '1バッチ = 1エージェントセッション。仕込みから熟成まで、AIが毎日のアクションを非同期で提案します。',
        },
        {
          title: '職人知識翻訳',
          subtitle: 'Knowledge Translation',
          description:
            '「塩は多めに」という経験則を、浸透圧・水分活性の科学言語に翻訳。暗黙知を次世代へ継承します。',
        },
      ],
    },
    diagnosis: {
      label: 'Emergency Triage',
      heading: '緊急発酵診断',
      descriptionLine1:
        '味噌の写真をアップロード。Claude Opus 4.7が発酵状態を診断し、',
      descriptionLine2:
        'カビの種別・化学的根拠・具体的対処法をまとめて提示します。',
      loading: '診断中...',
      submit: '診断する',
      errorFallback: '診断に失敗しました。',
    },
    photoUpload: {
      ariaLabel: '味噌の写真をアップロード',
      imageAlt: 'アップロードした味噌の写真',
      idleLabel: 'Scan / 解析',
      draggingLabel: 'Drop to scan',
      dropHere: 'ここにドロップ',
      prompt: '写真をドラッグ&ドロップ、またはクリックして選択',
      changePhoto: '写真を変更 →',
    },
    metadataForm: {
      sectionTitle: '環境情報（任意）',
      startDate: '仕込み開始日',
      temperature: '保存温度 (°C)',
      temperaturePlaceholder: '例: 25',
      storageLocation: '保存場所',
      storageLocationPlaceholder: '例: 冷暗所、床下',
      soybeanVariety: '大豆品種',
      soybeanVarietyPlaceholder: '例: 鶴の子大豆',
      kojiRatio: '麹歩合 (%)',
      kojiRatioPlaceholder: '例: 10',
      saltRatio: '塩分比 (%)',
      saltRatioPlaceholder: '例: 12',
    },
    diagnosisResult: {
      urgencyHeading: 'Urgency Level',
      urgencyLabels: {
        GREEN: '正常',
        YELLOW: '注意',
        RED: '緊急',
      },
      detectedMold: '検出されたカビ',
      cause: '発生原因',
      chemistry: '発酵化学的解説',
      immediateActions: '今すぐ実施すること',
      preventionTips: '再発防止策',
      batchComparison: '過去バッチとの比較',
    },
    knowledge: {
      label: 'Knowledge Translation',
      heading: '職人知識翻訳',
      description: '職人の経験則・暗黙知を、発酵化学の科学言語に翻訳します。',
      inputLabel: '職人の言葉',
      placeholder: '例: 塩は多めに入れると腐らない',
      examplesLabel: '例文を試す',
      loading: '翻訳中...',
      submit: '科学的に解明する',
      errorFallback: '翻訳に失敗しました。',
      sections: {
        explanation: '科学的説明',
        chemistry: '発酵化学',
        advice: '実践的アドバイス',
        references: '関連する発酵科学の概念',
      },
      examples: [
        '塩は多めに入れると腐らない',
        '天地返しは満月の夜にやると良い',
        '怒りながら味噌を仕込むと発酵が悪くなる',
        '夏の暑い時期に仕込む「暑仕込み」は難しい',
      ],
    },
    batches: {
      label: 'Batch Monitor',
      heading: 'バッチ管理',
      newBatch: '新規バッチ',
      empty: 'まだバッチがありません',
      emptyCta: '最初のバッチを仕込む',
      fetchError: 'バッチ一覧の取得に失敗しました。',
      statuses: {
        active: '仕込み中',
        completed: '完成',
        failed: '失敗',
      },
      startSuffix: '仕込み',
    },
    newBatch: {
      label: 'New Batch',
      heading: '新規バッチ作成',
      name: 'バッチ名 *',
      namePlaceholder: '例: 2024年 春仕込み',
      startedAt: '仕込み開始日 *',
      recipeSection: 'レシピ情報（任意）',
      soybeanVariety: '大豆品種',
      soybeanVarietyPlaceholder: '例: 鶴の子大豆',
      kojiRatio: '麹歩合 (%)',
      kojiRatioPlaceholder: '例: 10',
      saltRatio: '塩分比 (%)',
      saltRatioPlaceholder: '例: 12',
      notes: 'メモ',
      notesPlaceholder: '特記事項など',
      cancel: 'キャンセル',
      submitting: '作成中...',
      submit: 'バッチを仕込む',
      errorFallback: 'バッチの作成に失敗しました。',
    },
    batchDetail: {
      back: '← Batches',
      fetchError: 'バッチの取得に失敗しました。',
      runAgentError: 'エージェント実行に失敗しました。',
      stats: {
        stage: '発酵ステージ',
        completionDate: '予想完成日',
        observationLogs: '観察ログ',
      },
      stages: ['初期発酵', '中期発酵', '後期発酵', '熟成'],
      assessment: 'AIエージェントの評価',
      actions: '推奨アクション',
      runAgent: 'AIエージェントで今日のアクションを確認',
      runningAgent: 'AIエージェント実行中...',
      actionTypes: {
        tenchi_gaeshi: '天地返し',
        weather_response: '天候対応',
        salt_tasting: '塩梅確認',
        observation: '観察',
        warning: '警告',
      },
    },
    recipes: {
      label: 'レシピライブラリ',
      heading: '味噌レシピ',
      description: '定番レシピをブラウズするか、理想の風味を入力してClaudeにレシピを生成してもらいましょう。',
      aiSection: 'AIでレシピを生成',
      aiInputLabel: '理想の味噌の風味・特徴を入力',
      aiInputPlaceholder: '例: 濃厚な旨み、ほんのり甘め、1年以上熟成...',
      aiSubmit: 'レシピを生成',
      aiLoading: '生成中...',
      aiErrorFallback: 'レシピの生成に失敗しました。',
      saveGenerated: 'レシピとして保存',
      browseSection: '定番レシピ',
      mySection: 'マイレシピ',
      empty: 'まだレシピがありません',
      emptyCta: '最初のレシピを作成する',
      fetchError: 'レシピ一覧の取得に失敗しました。',
      useRecipe: 'このレシピを使う →',
      newRecipe: '新規レシピ',
      misoType: '味噌タイプ',
      kojiRatio: '麹歩合',
      saltRatio: '塩分比',
      fermentationDuration: '熟成期間',
    },
    newRecipe: {
      label: 'New Recipe',
      heading: '新規レシピ作成',
      name: 'レシピ名 *',
      namePlaceholder: '例: 仙台風赤味噌',
      description: '説明',
      descriptionPlaceholder: '例: 仙台の伝統に着想を得た濃厚な赤味噌',
      misoType: '味噌タイプ',
      misoTypePlaceholder: '例: red, white, mixed',
      kojiRatio: '麹歩合 (%)',
      kojiRatioPlaceholder: '例: 10',
      saltRatio: '塩分比 (%)',
      saltRatioPlaceholder: '例: 12',
      soybeanVariety: '大豆品種',
      soybeanVarietyPlaceholder: '例: 鶴の子大豆',
      waterContent: '加水量 (%)',
      waterContentPlaceholder: '例: 45',
      fermentationDuration: '熟成期間',
      fermentationDurationPlaceholder: '例: 12〜18ヶ月',
      notes: 'メモ',
      notesPlaceholder: '特記事項や技法のヒントなど',
      cancel: 'キャンセル',
      submitting: '保存中...',
      submit: 'レシピを保存',
      errorFallback: 'レシピの保存に失敗しました。',
    },
  },
} as const;

export function resolveLocale(value?: string | null): Locale {
  return value === 'ja' ? 'ja' : 'en';
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function formatDaysElapsed(days: number, locale: Locale) {
  return locale === 'ja' ? `${days}日経過` : `${days} days elapsed`;
}

export function formatObservationCount(count: number, locale: Locale) {
  return locale === 'ja' ? `${count} 件` : `${count} logs`;
}
