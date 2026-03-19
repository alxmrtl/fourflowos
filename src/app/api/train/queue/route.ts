import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabase } from '@/lib/supabase';
import type { QueueResponse } from '@/types/training';

export const dynamic = 'force-dynamic';

const PILLAR_ORDER = ['self', 'space', 'story', 'spirit'];
const MAX_SESSION = 10;

export async function GET() {
  // Authenticate user via cookie
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

  const db = getSupabase();

  // Fetch all mechanics (lightweight — no content_md)
  const { data: allMechanics, error: mechanicsErr } = await db
    .from('mechanics')
    .select('id, title, pillar, flow_key, keywords, definition, content_md, recall_md, enrichment_score, techniques_count, related_mechanics, updated_at')
    .order('pillar', { ascending: true })
    .order('enrichment_score', { ascending: false }); // richest first within pillar

  if (mechanicsErr) {
    return NextResponse.json({ error: mechanicsErr.message }, { status: 500 });
  }

  // Fetch all reviews for this user
  const { data: allReviews, error: reviewsErr } = await db
    .from('mechanic_reviews')
    .select('*')
    .eq('user_id', user.id);

  if (reviewsErr) {
    return NextResponse.json({ error: reviewsErr.message }, { status: 500 });
  }

  const reviewMap = new Map((allReviews ?? []).map(r => [r.mechanic_id, r]));
  const now = new Date().toISOString();

  // Due reviews: have a review record AND next_review_at <= now
  const dueReviews = (allReviews ?? [])
    .filter(r => r.next_review_at <= now)
    .sort((a, b) => a.next_review_at.localeCompare(b.next_review_at));

  // New mechanics: no review record yet, ordered by pillar priority + enrichment score
  const dueIds = new Set(dueReviews.map(r => r.mechanic_id));
  const seenIds = new Set(reviewMap.keys());

  const newMechanics = (allMechanics ?? [])
    .filter(m => !seenIds.has(m.id))
    .sort((a, b) => {
      const pillarDiff = PILLAR_ORDER.indexOf(a.pillar) - PILLAR_ORDER.indexOf(b.pillar);
      if (pillarDiff !== 0) return pillarDiff;
      return b.enrichment_score - a.enrichment_score;
    });

  // Build queue: due reviews first, then new cards, cap at MAX_SESSION
  const mechanicMap = new Map((allMechanics ?? []).map(m => [m.id, m]));

  const dueQueue = dueReviews
    .filter(r => mechanicMap.has(r.mechanic_id))
    .map(r => ({
      mechanic: mechanicMap.get(r.mechanic_id)!,
      review: r,
      is_new: false,
    }));

  const remaining = Math.max(0, MAX_SESSION - dueQueue.length);
  const newQueue = newMechanics.slice(0, remaining).map(m => ({
    mechanic: m,
    review: null,
    is_new: true,
  }));

  const queue = [...dueQueue, ...newQueue].slice(0, MAX_SESSION);

  const response: QueueResponse = {
    queue,
    stats: {
      due_count: dueReviews.length,
      new_count: newMechanics.length,
      total_introduced: seenIds.size,
      total_mechanics: allMechanics?.length ?? 0,
    },
  };

  return NextResponse.json(response);
}
