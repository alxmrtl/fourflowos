import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// GET /api/core/admin/[id]?type=flow_lens|esoteric
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

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

    if (error) {
      console.error('[core/admin]', error);
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
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

  if (error) {
    console.error('[core/admin]', error);
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, profile: data });
}
