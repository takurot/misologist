/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

const singleMock = jest.fn();
const eqMock = jest.fn(() => ({ single: singleMock }));
const selectMock = jest.fn(() => ({ eq: eqMock }));
const fromMock = jest.fn(() => ({ select: selectMock }));
const createClientMock = jest.fn(() => ({ from: fromMock }));

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => createClientMock(),
}));

describe('GET /api/batches/[id]', () => {
  beforeEach(() => {
    jest.resetModules();
    createClientMock.mockClear();
    fromMock.mockClear();
    selectMock.mockClear();
    eqMock.mockClear();
    singleMock.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://local.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'local-anon-key';
  });

  it('normalizes the first agent session onto agent_session', async () => {
    singleMock.mockResolvedValue({
      data: {
        id: 'batch-1',
        name: 'Spring batch',
        started_at: '2026-04-20T00:00:00.000Z',
        recipe_json: {},
        status: 'active',
        created_at: '2026-04-20T00:00:00.000Z',
        logs: [],
        agent_sessions: [
          {
            id: 'session-1',
            batch_id: 'batch-1',
            agent_state: { fermentationStage: '中期発酵' },
            created_at: '2026-04-21T00:00:00.000Z',
          },
        ],
      },
      error: null,
    });

    const { GET } = await import('@/app/api/batches/[id]/route');
    const response = await GET(new NextRequest('http://localhost/api/batches/batch-1'), {
      params: { id: 'batch-1' },
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.agent_session.id).toBe('session-1');
    expect(json.data.agent_session.agent_state.fermentationStage).toBe('中期発酵');
  });
});
