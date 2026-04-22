import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfigError } from '@/lib/env';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const configError = getSupabaseConfigError();
    if (configError) {
      return NextResponse.json({ success: false, error: configError }, { status: 503 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('batches')
      .select('*, logs(*), agent_sessions(*)')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'バッチが見つかりません' }, { status: 404 });
    }

    const { agent_sessions, ...batchData } = data;
    const agentSession = Array.isArray(agent_sessions) ? agent_sessions[0] ?? null : null;

    return NextResponse.json({
      success: true,
      data: {
        ...batchData,
        agent_session: agentSession ?? undefined,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'バッチの取得に失敗しました';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const configError = getSupabaseConfigError();
    if (configError) {
      return NextResponse.json({ success: false, error: configError }, { status: 503 });
    }

    const body = await request.json();
    const supabase = createClient();

    const { data, error } = await supabase
      .from('batches')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'バッチの更新に失敗しました';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
