import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfigError } from '@/lib/env';
import type { Recipe } from '@/types';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const configError = getSupabaseConfigError();
    if (configError) {
      return NextResponse.json({ success: false, error: configError }, { status: 503 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Recipe not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: data as Recipe });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load recipe';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
