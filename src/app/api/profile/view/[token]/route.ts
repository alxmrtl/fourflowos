import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// view_token is always crypto.randomUUID() (see profile/submit route)
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const rl = await checkRateLimit('token-view', clientIp(request));
  if (!rl.success) return tooManyRequests(rl.retryAfterSec);

  const { token } = await params;

  // Uniform 404 for malformed and unknown tokens — no oracle for guessing.
  if (!token || !UUID_RE.test(token)) {
    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
  }

  try {
    const { data: assessment, error } = await supabase
      .from('assessments')
      .select('name, status, flow_profile_final, flow_profile_json, created_at')
      .eq('view_token', token)
      .single();

    if (error || !assessment) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    if (assessment.status !== 'delivered' || !assessment.flow_profile_final) {
      return NextResponse.json({ success: false, error: 'Profile not yet available' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        name: assessment.name,
        content: assessment.flow_profile_final,
        profile_json: assessment.flow_profile_json ?? null,
        created_at: assessment.created_at,
      },
    });
  } catch (error) {
    console.error('View error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
