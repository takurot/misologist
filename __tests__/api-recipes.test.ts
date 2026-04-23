/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Mock Supabase server client
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockOrder = jest.fn();
const mockSingle = jest.fn();

const recipeListResult = {
  data: [{ id: '1', name: 'Sendai Miso', is_template: true, koji_ratio: 10, salt_ratio: 13, created_at: '2024-01-01' }],
  error: null,
};

const orderChain = { order: mockOrder.mockReturnThis() };
Object.assign(orderChain, recipeListResult);
// Make it thenable so await works
(orderChain as unknown as Promise<unknown> & { order: jest.Mock }).then = (resolve: (v: unknown) => void) => Promise.resolve(recipeListResult).then(resolve);

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: mockSelect.mockReturnValue({
        order: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue(recipeListResult),
        }),
      }),
      insert: mockInsert.mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: mockSingle.mockResolvedValue({
            data: { id: '99', name: 'My Recipe', is_template: false, koji_ratio: 10, salt_ratio: 12, created_at: '2024-01-01' },
            error: null,
          }),
        }),
      }),
    })),
  })),
}));

jest.mock('@/lib/env', () => ({
  getSupabaseConfigError: jest.fn(() => null),
}));

// Mock Anthropic for the generate endpoint
const mockCreate = jest.fn().mockResolvedValue({
  content: [
    {
      type: 'text',
      text: JSON.stringify({
        targetFlavor: 'Rich umami',
        recommendedParameters: { kojRatio: 10, saltRatio: 12, soybeanVariety: 'Tsurunoko', fermentationDuration: '12 months' },
        reasoning: 'High koji ratio promotes umami',
        expectedOutcome: 'Deep, rich miso with complex flavor',
      }),
    },
  ],
});

jest.mock('@/lib/anthropic', () => ({
  ...jest.requireActual('@/lib/anthropic'),
  getAnthropicClient: () => ({ messages: { create: mockCreate } }),
  MODEL: 'claude-opus-4-7',
}));

describe('GET /api/recipes', () => {
  it('returns list of recipes', async () => {
    const { GET } = await import('@/app/api/recipes/route');
    const request = new NextRequest('http://localhost/api/recipes');
    const response = await GET(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });
});

describe('POST /api/recipes', () => {
  it('creates a new recipe and returns it', async () => {
    const { POST } = await import('@/app/api/recipes/route');
    const request = new NextRequest('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ name: 'My Recipe', koji_ratio: 10, salt_ratio: 12 }),
    });
    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data.name).toBe('My Recipe');
  });

  it('returns 400 when name is missing', async () => {
    const { POST } = await import('@/app/api/recipes/route');
    const request = new NextRequest('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ koji_ratio: 10 }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});

describe('POST /api/recipes/generate', () => {
  it('returns AI-generated recipe parameters', async () => {
    const { POST } = await import('@/app/api/recipes/generate/route');
    const request = new NextRequest('http://localhost/api/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({ targetFlavor: 'Rich umami, slightly sweet' }),
    });
    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data.targetFlavor).toBeTruthy();
    expect(json.data.recommendedParameters).toBeDefined();
    expect(json.data.reasoning).toBeTruthy();
  });

  it('returns 400 when targetFlavor is missing', async () => {
    const { POST } = await import('@/app/api/recipes/generate/route');
    const request = new NextRequest('http://localhost/api/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
