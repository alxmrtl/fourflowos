import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('mechanics')
    .select('id, title, pillar, flow_key, keywords, definition, enrichment_score, techniques_count, related_qualities, updated_at')
    .order('pillar', { ascending: true })
    .order('flow_key', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ qualities: data });
}
