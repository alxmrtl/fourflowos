import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabase } from '@/lib/supabase';
import type { ReviewUpdate } from '@/types/training';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Authenticate
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

  let body: ReviewUpdate;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { mechanic_id, quality, ease_factor, interval_days, repetitions, next_review_at, phase } = body;

  if (!mechanic_id || quality === undefined) {
    return NextResponse.json({ error: 'mechanic_id and quality are required' }, { status: 400 });
  }

  const db = getSupabase();

  const upsertData: Record<string, unknown> = {
    user_id: user.id,
    mechanic_id,
    ease_factor,
    interval_days,
    repetitions,
    next_review_at,
    last_reviewed_at: new Date().toISOString(),
    last_quality: quality,
  };
  if (phase) {
    upsertData.phase = phase;
  }

  const { error } = await db
    .from('mechanic_reviews')
    .upsert(upsertData, { onConflict: 'user_id,mechanic_id' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
