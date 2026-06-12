import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getUserFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

interface HistoryRow {
  id: string;
  blind_side_pillar: string;
  profile_json: {
    bottleneck_key?: string;
    key_moves?: { key: string; move: string }[];
    the_move?: string;
  } | null;
  generated_at: string;
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  const [flowLensResult, esotericResult] = await Promise.all([
    supabase
      .from('flow_lens_profiles')
      .select('id, gravity_pillar, blind_side_pillar, profile_text, profile_json, recommendations, generated_at')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(31),
    supabase
      .from('esoteric_profiles')
      .select('id, profile_text, profile_json, generated_at')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const rows = (flowLensResult.data ?? []) as HistoryRow[];
  const latest = rows[0] ?? null;

  // Compact history: one line per past unlock (the bottleneck's move).
  const history = rows.map(r => {
    const bottleneck = r.profile_json?.bottleneck_key ?? null;
    const move =
      r.profile_json?.key_moves?.find(m => m.key === bottleneck)?.move
      ?? r.profile_json?.the_move
      ?? null;
    return {
      id: r.id,
      bottleneck_key: bottleneck,
      blind_side_pillar: r.blind_side_pillar,
      move,
      generated_at: r.generated_at,
    };
  });

  return NextResponse.json({
    success: true,
    flow_lens: latest,
    flow_lens_history: history,
    esoteric: esotericResult.data ?? null,
  });
}
