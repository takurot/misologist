/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

const createClientMock = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => createClientMock(),
}));

describe('batches API configuration guard', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    createClientMock.mockReset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-anon-key';
  });

  afterAll(() => {
    if (originalEnv.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv.NEXT_PUBLIC_SUPABASE_URL;
    }
    if (originalEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }
  });

  it('returns 503 with a clear message when Supabase is not configured for GET', async () => {
    const { GET } = await import('@/app/api/batches/route');

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error).toContain('Supabase');
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('returns 503 with a clear message when Supabase is not configured for POST', async () => {
    const { POST } = await import('@/app/api/batches/route');
    const request = new NextRequest('http://localhost/api/batches', {
      method: 'POST',
      body: JSON.stringify({
        name: 'E2E batch',
        started_at: '2026-04-20',
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error).toContain('Supabase');
    expect(createClientMock).not.toHaveBeenCalled();
  });
});
