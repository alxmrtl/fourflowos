import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key');
  return key === process.env.PROFILE_ADMIN_KEY;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Get all flow lens profiles with their intake data
  const [flowLensResult, esotericResult] = await Promise.all([
    supabase
      .from('flow_lens_profiles')
      .select(`
        id,
        user_id,
        gravity_pillar,
        blind_side_pillar,
        generated_at,
        intake_id,
        flow_lens_intakes!inner(answers, pillar_scores, created_at)
      `)
      .order('generated_at', { ascending: false })
      .limit(100),
    supabase
      .from('esoteric_profiles')
      .select(`
        id,
        user_id,
        generated_at,
        intake_id,
        esoteric_intakes!inner(full_name, birth_date, birth_location, created_at)
      `)
      .order('generated_at', { ascending: false })
      .limit(100),
  ]);

  return NextResponse.json({
    success: true,
    flow_lens: flowLensResult.data ?? [],
    esoteric: esotericResult.data ?? [],
    errors: {
      flow_lens: flowLensResult.error?.message ?? null,
      esoteric: esotericResult.error?.message ?? null,
    },
  });
}
