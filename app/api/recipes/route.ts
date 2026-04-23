import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfigError } from '@/lib/env';
import type { Recipe } from '@/types';

export async function GET() {
  try {
    const configError = getSupabaseConfigError();
    if (configError) {
      return NextResponse.json({ success: false, error: configError }, { status: 503 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('is_template', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as Recipe[] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load recipes';
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
    const { name, description, miso_type, koji_ratio, salt_ratio, soybean_variety, water_content, fermentation_duration, notes } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Recipe name is required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('recipes')
      .insert({ name, description, miso_type, koji_ratio, salt_ratio, soybean_variety, water_content, fermentation_duration, notes, is_template: false })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as Recipe }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create recipe';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
