/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

const createClientMock = jest.fn();
const getAnthropicClientMock = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => createClientMock(),
}));

jest.mock('@/lib/anthropic', () => ({
  getAnthropicClient: () => getAnthropicClientMock(),
  MODEL: 'claude-opus-4-7',
}));

describe('POST /api/agent-sessions', () => {
  beforeEach(() => {
    jest.resetModules();
    createClientMock.mockReset();
    getAnthropicClientMock.mockReset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-anon-key';
  });

  it('returns 503 with a clear message when Supabase is not configured', async () => {
    const { POST } = await import('@/app/api/agent-sessions/route');
    const request = new NextRequest('http://localhost/api/agent-sessions', {
      method: 'POST',
      body: JSON.stringify({ batchId: 'batch-1' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error).toContain('Supabase');
    expect(createClientMock).not.toHaveBeenCalled();
    expect(getAnthropicClientMock).not.toHaveBeenCalled();
  });
});
