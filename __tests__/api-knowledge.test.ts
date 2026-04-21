/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/lib/anthropic', () => ({
  anthropic: {
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              originalKnowledge: '塩は多めに入れると腐らない',
              scientificExplanation: '塩分濃度が高いと水分活性が下がり微生物の繁殖を抑制します',
              chemistry: 'aw = 1 - Xsolute (ラウールの法則)',
              practicalAdvice: ['塩分を12%以上に保つ'],
              references: ['水分活性', '浸透圧'],
            }),
          },
        ],
      }),
    },
  },
  MODEL: 'claude-opus-4-7',
}));

describe('POST /api/knowledge', () => {
  it('returns translation for valid knowledge text', async () => {
    const { POST } = await import('@/app/api/knowledge/route');
    const request = new NextRequest('http://localhost/api/knowledge', {
      method: 'POST',
      body: JSON.stringify({ knowledge: '塩は多めに入れると腐らない' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data.originalKnowledge).toBeTruthy();
    expect(json.data.scientificExplanation).toBeTruthy();
    expect(Array.isArray(json.data.practicalAdvice)).toBe(true);
  });

  it('returns 400 when knowledge is empty', async () => {
    const { POST } = await import('@/app/api/knowledge/route');
    const request = new NextRequest('http://localhost/api/knowledge', {
      method: 'POST',
      body: JSON.stringify({ knowledge: '  ' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 400 when knowledge is missing', async () => {
    const { POST } = await import('@/app/api/knowledge/route');
    const request = new NextRequest('http://localhost/api/knowledge', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
