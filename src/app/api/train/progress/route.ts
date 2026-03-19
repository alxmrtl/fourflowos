import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabase } from '@/lib/supabase';
import { getMasteryLevel } from '@/types/training';
import type { MasteryStats, Pillar } from '@/types/training';

export const dynamic = 'force-dynamic';

export async function GET() {
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

  const db = getSupabase();

  const [{ data: mechanics }, { data: reviews }] = await Promise.all([
    db.from('mechanics').select('id, title, pillar, flow_key, enrichment_score'),
    db.from('mechanic_reviews').select('mechanic_id, repetitions, interval_days, next_review_at').eq('user_id', user.id),
  ]);

  const reviewMap = new Map((reviews ?? []).map(r => [r.mechanic_id, r]));

  const pillars: Pillar[] = ['self', 'space', 'story', 'spirit'];
  const by_pillar = Object.fromEntries(
    pillars.map(p => [p, { total: 0, introduced: 0, mature: 0 }])
  ) as Record<Pillar, { total: number; introduced: number; mature: number }>;

  const mechanicDetails: MasteryStats['mechanics'] = [];
  const counts = { unseen: 0, learning: 0, young: 0, mature: 0 };

  for (const m of mechanics ?? []) {
    const review = reviewMap.get(m.id) ?? null;
    const level = getMasteryLevel(review);
    counts[level]++;

    by_pillar[m.pillar as Pillar].total++;
    if (review) by_pillar[m.pillar as Pillar].introduced++;
    if (level === 'mature') by_pillar[m.pillar as Pillar].mature++;

    mechanicDetails.push({
      id: m.id,
      title: m.title,
      pillar: m.pillar as Pillar,
      flow_key: m.flow_key,
      mastery_level: level,
      repetitions: review?.repetitions ?? 0,
      interval_days: review?.interval_days ?? 0,
      next_review_at: review?.next_review_at ?? null,
      enrichment_score: m.enrichment_score,
    });
  }

  const stats: MasteryStats = {
    total: mechanics?.length ?? 0,
    ...counts,
    by_pillar,
    mechanics: mechanicDetails,
  };

  return NextResponse.json(stats);
}
