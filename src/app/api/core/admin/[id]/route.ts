import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key');
  return key === process.env.PROFILE_ADMIN_KEY;
}

// GET /api/core/admin/[id]?type=flow_lens|esoteric
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const type = request.nextUrl.searchParams.get('type') ?? 'flow_lens';

  if (type === 'esoteric') {
    const { data, error } = await supabase
      .from('esoteric_profiles')
      .select(`
        *,
        esoteric_intakes(*)
      `)
      .eq('id', id)
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    return NextResponse.json({ success: true, profile: data });
  }

  const { data, error } = await supabase
    .from('flow_lens_profiles')
    .select(`
      *,
      flow_lens_intakes(*)
    `)
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  return NextResponse.json({ success: true, profile: data });
}
