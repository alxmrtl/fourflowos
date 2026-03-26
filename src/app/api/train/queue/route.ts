import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabase } from '@/lib/supabase';
import type { QueueResponse, QueueItem } from '@/types/training';

export const dynamic = 'force-dynamic';

const PILLAR_ORDER = ['self', 'space', 'story', 'spirit'];
const MAX_SESSION = 10;
const MAX_DEEP_DIVE = 20;

export async function GET(request: NextRequest) {
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

  // Parse optional mode/filter params
  const { searchParams } = request.nextUrl;
  const pillarFilter = searchParams.get('pillar');
  const keyFilter = searchParams.get('key');
  const mode = searchParams.get('mode') || 'daily'; // daily | pillar | deep-dive

  const sessionCap = mode === 'deep-dive' ? MAX_DEEP_DIVE : MAX_SESSION;

  // Fetch all cards (mechanics + techniques + concepts)
  let mechanicsQuery = db
    .from('mechanics')
    .select('id, title, pillar, flow_key, keywords, definition, content_md, recall_md, enrichment_score, techniques_count, related_mechanics, card_type, parent_mechanic_id, content_hash, updated_at')
    .order('pillar', { ascending: true })
    .order('enrichment_score', { ascending: false });

  if (pillarFilter) {
    mechanicsQuery = mechanicsQuery.eq('pillar', pillarFilter);
  }
  if (keyFilter) {
    mechanicsQuery = mechanicsQuery.eq('flow_key', keyFilter);
  }

  const { data: allCards, error: mechanicsErr } = await mechanicsQuery;

  if (mechanicsErr) {
    return NextResponse.json({ error: mechanicsErr.message }, { status: 500 });
  }

  // Separate mechanics (SRS cards) from children (study material)
  const allMechanics = (allCards ?? []).filter(m => m.card_type === 'mechanic' || m.card_type === 'quality');
  const childCards = (allCards ?? []).filter(m => m.card_type === 'technique' || m.card_type === 'concept');

  // Build parent → children map for study mode
  const childrenByParent = new Map<string, typeof childCards>();
  for (const child of childCards) {
    const parentId = child.parent_mechanic_id;
    if (parentId) {
      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
      childrenByParent.get(parentId)!.push(child);
    }
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

  // Due reviews: have a review record with phase='recall' AND next_review_at <= now
  // Also include study cards that are due (phase='study', next_review_at <= now → transition to recall)
  const dueReviews = (allReviews ?? [])
    .filter(r => r.next_review_at <= now)
    .sort((a, b) => a.next_review_at.localeCompare(b.next_review_at));

  // New mechanics: no review record yet, ordered by pillar priority + enrichment score
  const seenIds = new Set(reviewMap.keys());

  const newMechanics = allMechanics
    .filter(m => !seenIds.has(m.id))
    .sort((a, b) => {
      const pillarDiff = PILLAR_ORDER.indexOf(a.pillar) - PILLAR_ORDER.indexOf(b.pillar);
      if (pillarDiff !== 0) return pillarDiff;
      return (b.enrichment_score ?? 0) - (a.enrichment_score ?? 0);
    });

  // Build queue: due reviews first (recall), then new cards (study), cap at session limit
  const mechanicMap = new Map(allMechanics.map(m => [m.id, m]));

  // Filter due reviews to only mechanics (not technique/concept reviews if any exist)
  const dueQueue: QueueItem[] = dueReviews
    .filter(r => mechanicMap.has(r.mechanic_id))
    .map(r => {
      const mechanic = mechanicMap.get(r.mechanic_id)!;
      // Detect content updates: mechanic updated after last review
      const contentUpdated = r.last_reviewed_at
        ? mechanic.updated_at > r.last_reviewed_at
        : false;
      return {
        mechanic,
        review: r,
        is_new: false,
        content_updated: contentUpdated,
        children: childrenByParent.get(mechanic.id),
      };
    });

  const remaining = Math.max(0, sessionCap - dueQueue.length);
  const newQueue: QueueItem[] = newMechanics.slice(0, remaining).map(m => ({
    mechanic: m,
    review: null,
    is_new: true,
    content_updated: false,
    children: childrenByParent.get(m.id),
  }));

  const queue = [...dueQueue, ...newQueue].slice(0, sessionCap);

  const response: QueueResponse = {
    queue,
    stats: {
      due_count: dueReviews.filter(r => mechanicMap.has(r.mechanic_id)).length,
      new_count: newMechanics.length,
      total_introduced: [...seenIds].filter(id => mechanicMap.has(id)).length,
      total_mechanics: allMechanics.length,
    },
  };

  return NextResponse.json(response);
}
