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
      .limit(1)
      .maybeSingle(),
    supabase
      .from('esoteric_profiles')
      .select('id, profile_text, profile_json, generated_at')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    success: true,
    flow_lens: flowLensResult.data ?? null,
    esoteric: esotericResult.data ?? null,
  });
}
