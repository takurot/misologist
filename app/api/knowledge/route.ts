import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, MODEL, parseJsonResponse } from '@/lib/anthropic';
import { resolveLocale } from '@/lib/i18n';
import { buildKnowledgeTranslationPrompt } from '@/lib/prompts/diagnosis';
import type { KnowledgeTranslationResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { knowledge, locale: localeValue } = await request.json();
    const locale = resolveLocale(localeValue);

    if (!knowledge || typeof knowledge !== 'string' || knowledge.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: locale === 'ja' ? '職人知識のテキストが必要です' : 'Craft knowledge text is required.' },
        { status: 400 }
      );
    }

    const prompt = buildKnowledgeTranslationPrompt(knowledge.trim(), locale);

    const response = await getAnthropicClient().messages.create({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error(locale === 'ja' ? 'AIからのレスポンスが空です' : 'The AI response was empty.');
    }

    const result = parseJsonResponse(textContent.text) as KnowledgeTranslationResult;

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during translation.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
