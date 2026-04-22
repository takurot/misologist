import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfigError } from '@/lib/env';
import type { Batch } from '@/types';

export async function GET() {
  try {
    const configError = getSupabaseConfigError();
    if (configError) {
      return NextResponse.json({ success: false, error: configError }, { status: 503 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as Batch[] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'バッチ一覧の取得に失敗しました';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const configError = getSupabaseConfigError();
    if (configError) {
      return NextResponse.json({ success: false, error: configError }, { status: 503 });
    }

    const body = await request.json();
    const { name, started_at, recipe_json } = body;

    if (!name || !started_at) {
      return NextResponse.json(
        { success: false, error: 'バッチ名と開始日は必須です' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('batches')
      .insert({ name, started_at, recipe_json: recipe_json ?? {}, status: 'active' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as Batch }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'バッチの作成に失敗しました';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
