import { buildDiagnosisPrompt, buildKnowledgeTranslationPrompt, buildBatchWatcherPrompt } from '@/lib/prompts/diagnosis';

describe('buildDiagnosisPrompt', () => {
  it('includes JSON format instruction', () => {
    const prompt = buildDiagnosisPrompt({});
    expect(prompt).toContain('urgencyLevel');
    expect(prompt).toContain('GREEN');
    expect(prompt).toContain('RED');
  });

  it('preserves urgencyLevel enum instruction in Japanese mode', () => {
    const prompt = buildDiagnosisPrompt({ locale: 'ja' });
    expect(prompt).toContain('"GREEN"');
    expect(prompt).toContain('"YELLOW"');
    expect(prompt).toContain('"RED"');
  });

  it('preserves urgencyLevel enum instruction in English mode', () => {
    const prompt = buildDiagnosisPrompt({ locale: 'en' });
    expect(prompt).toContain('"GREEN"');
    expect(prompt).toContain('"YELLOW"');
    expect(prompt).toContain('"RED"');
  });

  it('includes provided environment info', () => {
    const prompt = buildDiagnosisPrompt({
      temperature: 25,
      storageLocation: '冷暗所',
      soybeanVariety: '鶴の子大豆',
    });
    expect(prompt).toContain('25');
    expect(prompt).toContain('冷暗所');
    expect(prompt).toContain('鶴の子大豆');
  });

  it('omits undefined fields', () => {
    const prompt = buildDiagnosisPrompt({ temperature: 20 });
    expect(prompt).toContain('20');
    expect(prompt).not.toContain('保存場所');
  });
});

describe('buildKnowledgeTranslationPrompt', () => {
  it('includes the input knowledge text', () => {
    const knowledge = '塩は多めに入れると腐らない';
    const prompt = buildKnowledgeTranslationPrompt(knowledge);
    expect(prompt).toContain(knowledge);
  });

  it('requests JSON with required fields', () => {
    const prompt = buildKnowledgeTranslationPrompt('test');
    expect(prompt).toContain('scientificExplanation');
    expect(prompt).toContain('chemistry');
    expect(prompt).toContain('practicalAdvice');
  });
});

describe('buildBatchWatcherPrompt', () => {
  it('includes batch name and days elapsed', () => {
    const prompt = buildBatchWatcherPrompt({
      batchName: '春仕込み2024',
      startDate: '2024-01-01',
      daysElapsed: 90,
      recipe: { kojRatio: 10, saltRatio: 12 },
      recentLogs: [],
    });
    expect(prompt).toContain('春仕込み2024');
    expect(prompt).toContain('90');
  });

  it('includes log data when provided', () => {
    const prompt = buildBatchWatcherPrompt({
      batchName: 'Test',
      startDate: '2024-01-01',
      daysElapsed: 30,
      recipe: {},
      recentLogs: [{ date: '2024-02-01', temperature: 15, humidity: 60 }],
    });
    expect(prompt).toContain('2024-02-01');
    expect(prompt).toContain('15');
  });

  it('requests JSON with actions array', () => {
    const prompt = buildBatchWatcherPrompt({
      batchName: 'Test',
      startDate: '2024-01-01',
      daysElapsed: 0,
      recipe: {},
      recentLogs: [],
    });
    expect(prompt).toContain('actions');
    expect(prompt).toContain('fermentationStage');
  });

  it('preserves priority enum values instruction in Japanese mode', () => {
    const prompt = buildBatchWatcherPrompt({
      batchName: 'Test',
      startDate: '2024-01-01',
      daysElapsed: 0,
      recipe: {},
      recentLogs: [],
      locale: 'ja',
    });
    expect(prompt).toContain('"high"');
    expect(prompt).toContain('"medium"');
    expect(prompt).toContain('"low"');
  });

  it('preserves priority enum values instruction in English mode', () => {
    const prompt = buildBatchWatcherPrompt({
      batchName: 'Test',
      startDate: '2024-01-01',
      daysElapsed: 0,
      recipe: {},
      recentLogs: [],
      locale: 'en',
    });
    expect(prompt).toContain('"high"');
    expect(prompt).toContain('"medium"');
    expect(prompt).toContain('"low"');
  });
});
