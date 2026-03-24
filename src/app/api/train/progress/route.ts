import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabase } from '@/lib/supabase';
import { getMasteryLevel } from '@/types/training';
import type { MasteryStats, Pillar } from '@/types/training';

export const dynamic = 'force-dynamic';

/** Extract blockquote definition from markdown content when frontmatter definition is empty */
function extractBlockquoteDefinition(contentMd: string | null): string {
  if (!contentMd) return '';
  const lines = contentMd.split('\n');
  const parts: string[] = [];
  let inBlockquote = false;
  for (const line of lines) {
    if (line.startsWith('> ')) {
      parts.push(line.slice(2).trim());
      inBlockquote = true;
    } else if (inBlockquote) {
      break;
    }
  }
  return parts.join(' ');
}

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
    db.from('mechanics').select('id, title, pillar, flow_key, enrichment_score, definition, keywords, card_type, parent_mechanic_id, techniques_count, content_md'),
    db.from('mechanic_reviews').select('mechanic_id, repetitions, interval_days, next_review_at, phase').eq('user_id', user.id),
  ]);

  const reviewMap = new Map((reviews ?? []).map(r => [r.mechanic_id, r]));

  const pillars: Pillar[] = ['self', 'space', 'story', 'spirit'];
  const by_pillar = Object.fromEntries(
    pillars.map(p => [p, { total: 0, introduced: 0, mature: 0 }])
  ) as Record<Pillar, { total: number; introduced: number; mature: number }>;

  const mechanicDetails: MasteryStats['mechanics'] = [];
  const counts = { unseen: 0, learning: 0, young: 0, mature: 0 };
  let studyingCount = 0;

  for (const m of mechanics ?? []) {
    const review = reviewMap.get(m.id) ?? null;
    const level = getMasteryLevel(review);
    counts[level]++;
    if (review?.phase === 'study') studyingCount++;

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
      enrichment_score: m.enrichment_score ?? 0,
      definition: m.definition || extractBlockquoteDefinition(m.content_md),
      keywords: m.keywords ?? [],
      card_type: m.card_type ?? 'mechanic',
      parent_mechanic_id: m.parent_mechanic_id ?? null,
      techniques_count: m.techniques_count ?? 0,
    });
  }

  const stats: MasteryStats = {
    total: mechanics?.length ?? 0,
    ...counts,
    studying: studyingCount,
    by_pillar,
    mechanics: mechanicDetails,
  };

  return NextResponse.json(stats);
}
