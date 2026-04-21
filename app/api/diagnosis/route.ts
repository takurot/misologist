import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, MODEL } from '@/lib/anthropic';
import { buildDiagnosisPrompt } from '@/lib/prompts/diagnosis';
import type { DiagnosisRequest, DiagnosisResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: DiagnosisRequest = await request.json();

    if (!body.imageBase64) {
      return NextResponse.json(
        { success: false, error: '画像データが必要です' },
        { status: 400 }
      );
    }

    const prompt = buildDiagnosisPrompt({
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
      throw new Error('AIからのレスポンスが空です');
    }

    const jsonText = textContent.text.trim();
    const result: DiagnosisResult = JSON.parse(jsonText);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : '診断中にエラーが発生しました';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
