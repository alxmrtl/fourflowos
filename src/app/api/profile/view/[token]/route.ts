import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || token.length < 10) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 });
  }

  try {
    const { data: assessment, error } = await supabase
      .from('assessments')
      .select('name, status, flow_profile_final, created_at')
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
