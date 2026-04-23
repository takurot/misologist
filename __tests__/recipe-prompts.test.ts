import { buildRecipeGenerationPrompt } from '@/lib/prompts/diagnosis';

describe('buildRecipeGenerationPrompt', () => {
  it('includes the target flavor text', () => {
    const prompt = buildRecipeGenerationPrompt('Rich umami, slightly sweet, aged 12 months');
    expect(prompt).toContain('Rich umami, slightly sweet, aged 12 months');
  });

  it('requests JSON with required ReverseEngineeringResult fields', () => {
    const prompt = buildRecipeGenerationPrompt('test flavor');
    expect(prompt).toContain('targetFlavor');
    expect(prompt).toContain('recommendedParameters');
    expect(prompt).toContain('reasoning');
    expect(prompt).toContain('expectedOutcome');
  });

  it('requests kojRatio and saltRatio in recommendedParameters', () => {
    const prompt = buildRecipeGenerationPrompt('test flavor');
    expect(prompt).toContain('kojRatio');
    expect(prompt).toContain('saltRatio');
  });

  it('includes fermentation science context', () => {
    const prompt = buildRecipeGenerationPrompt('test flavor');
    expect(prompt).toContain('fermentationDuration');
    expect(prompt).toContain('soybeanVariety');
  });

  it('generates English values in English mode', () => {
    const prompt = buildRecipeGenerationPrompt('test flavor', 'en');
    expect(prompt).toContain('English');
  });

  it('generates Japanese values in Japanese mode', () => {
    const prompt = buildRecipeGenerationPrompt('test flavor', 'ja');
    expect(prompt).toContain('日本語');
  });
});
