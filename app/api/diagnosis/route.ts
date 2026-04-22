import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, MODEL, parseJsonResponse } from '@/lib/anthropic';
import { resolveLocale } from '@/lib/i18n';
import { buildDiagnosisPrompt } from '@/lib/prompts/diagnosis';
import type { DiagnosisRequest, DiagnosisResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: DiagnosisRequest = await request.json();
    const locale = resolveLocale(body.locale);

    if (!body.imageBase64) {
      return NextResponse.json(
        { success: false, error: locale === 'ja' ? '画像データが必要です' : 'Image data is required.' },
        { status: 400 }
      );
    }

    const prompt = buildDiagnosisPrompt({
      locale,
      startDate: body.startDate,
      temperature: body.temperature,
      storageLocation: body.storageLocation,
      soybeanVariety: body.soybeanVariety,
      kojRatio: body.kojRatio,
      saltRatio: body.saltRatio,
    });

    const response = await getAnthropicClient().messages.create({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: body.mediaType,
                data: body.imageBase64,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error(locale === 'ja' ? 'AIからのレスポンスが空です' : 'The AI response was empty.');
    }

    const result = parseJsonResponse(textContent.text) as DiagnosisResult;

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during diagnosis.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
