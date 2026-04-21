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
              urgencyLevel: 'GREEN',
              moldType: '産膜酵母（白カビ）',
              moldReason: '表面に産膜酵母が発生しました',
              fermentationChemistry: 'アミノ酸分解が進行中です',
              immediateActions: ['表面のカビを取り除く'],
              preventionTips: ['重石を増やす'],
            }),
          },
        ],
      }),
    },
  },
  MODEL: 'claude-opus-4-7',
}));

describe('POST /api/diagnosis', () => {
  it('returns diagnosis result for valid image', async () => {
    const { POST } = await import('@/app/api/diagnosis/route');
    const request = new NextRequest('http://localhost/api/diagnosis', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64: 'dGVzdA==',
        mediaType: 'image/jpeg',
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data.urgencyLevel).toBe('GREEN');
    expect(json.data.immediateActions).toHaveLength(1);
  });

  it('returns 400 when imageBase64 is missing', async () => {
    const { POST } = await import('@/app/api/diagnosis/route');
    const request = new NextRequest('http://localhost/api/diagnosis', {
      method: 'POST',
      body: JSON.stringify({ mediaType: 'image/jpeg' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
  });
});
