import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { session_type, pillar_focus, key_focus } = body;

  const db = getSupabase();
  const { data, error } = await db
    .from('training_sessions')
    .insert({
      user_id: user.id,
      started_at: new Date().toISOString(),
      session_type: session_type || 'daily',
      pillar_focus: pillar_focus || null,
      key_focus: key_focus || null,
      cards_reviewed: 0,
      cards_studied: 0,
      cards_correct: 0,
      cards_missed: 0,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
