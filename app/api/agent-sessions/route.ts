import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAnthropicClient, MODEL } from '@/lib/anthropic';
import { buildBatchWatcherPrompt } from '@/lib/prompts/diagnosis';
import type { AgentSession, AgentState } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { batchId } = await request.json();

    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'バッチIDが必要です' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .select('*, logs(*)')
      .eq('id', batchId)
      .single();

    if (batchError || !batch) {
      return NextResponse.json(
        { success: false, error: 'バッチが見つかりません' },
        { status: 404 }
      );
    }

    const startDate = new Date(batch.started_at);
    const daysElapsed = Math.floor(
      (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const recentLogs = (batch.logs ?? []).slice(-7).map((log: { captured_at: string; env_json: { temperature?: number; humidity?: number }; diagnosis_json?: { moldType?: string } }) => ({
      date: log.captured_at.split('T')[0],
      temperature: log.env_json?.temperature,
      humidity: log.env_json?.humidity,
      observations: log.diagnosis_json?.moldType,
    }));

    const prompt = buildBatchWatcherPrompt({
      batchName: batch.name,
      startDate: batch.started_at,
      daysElapsed,
      recipe: batch.recipe_json ?? {},
      recentLogs,
    });

    const response = await getAnthropicClient().messages.create({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('AIからのレスポンスが空です');
    }

    const agentResult = JSON.parse(textContent.text.trim());

    const agentState: AgentState = {
      fermentationStage: agentResult.fermentationStage,
      lastAssessment: agentResult.assessment,
      actions: agentResult.actions ?? [],
      daysElapsed,
      completionDate: agentResult.completionDate,
    };

    const { data: existing } = await supabase
      .from('agent_sessions')
      .select('id')
      .eq('batch_id', batchId)
      .single();

    let session: AgentSession;
    if (existing) {
      const { data, error } = await supabase
        .from('agent_sessions')
        .update({
          agent_state: agentState,
          last_action_at: new Date().toISOString(),
          next_action_at: agentResult.nextCheckDate
            ? new Date(agentResult.nextCheckDate).toISOString()
            : null,
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      session = data as AgentSession;
    } else {
      const { data, error } = await supabase
        .from('agent_sessions')
        .insert({
          batch_id: batchId,
          agent_state: agentState,
          last_action_at: new Date().toISOString(),
          next_action_at: agentResult.nextCheckDate
            ? new Date(agentResult.nextCheckDate).toISOString()
            : null,
        })
        .select()
        .single();
      if (error) throw error;
      session = data as AgentSession;
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'エージェントセッションの作成に失敗しました';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
