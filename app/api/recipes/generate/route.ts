import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, MODEL, parseJsonResponse } from '@/lib/anthropic';
import { buildRecipeGenerationPrompt } from '@/lib/prompts/diagnosis';
import { resolveLocale } from '@/lib/i18n';
import type { ReverseEngineeringResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetFlavor, locale: localeParam } = body;

    if (!targetFlavor?.trim()) {
      return NextResponse.json({ success: false, error: 'targetFlavor is required' }, { status: 400 });
    }

    const locale = resolveLocale(localeParam);
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      messages: [
        {
          role: 'user',
          content: buildRecipeGenerationPrompt(targetFlavor, locale),
        },
      ],
    });

    const textBlock = response.content.find((c) => c.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI');
    }

    const result = parseJsonResponse(textBlock.text) as ReverseEngineeringResult;
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate recipe';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
