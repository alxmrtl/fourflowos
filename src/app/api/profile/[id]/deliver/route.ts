import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendDeliveryEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key');
  return key === process.env.PROFILE_ADMIN_KEY;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { flow_profile_final, custom_notes } = body as { flow_profile_final?: string; custom_notes?: string };

  try {
    // Fetch the assessment
    const { data: assessment, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !assessment) {
      return NextResponse.json({ success: false, error: 'Assessment not found' }, { status: 404 });
    }

    if (!assessment.flow_profile_draft && !flow_profile_final) {
      return NextResponse.json({ success: false, error: 'No profile to deliver' }, { status: 400 });
    }

    if (!assessment.view_token) {
      return NextResponse.json({ success: false, error: 'No view token — cannot generate delivery link' }, { status: 400 });
    }

    const finalContent = flow_profile_final || assessment.flow_profile_draft;

    // Update assessment to delivered
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        flow_profile_final: finalContent,
        status: 'delivered',
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    // Build the view URL
    const host = request.headers.get('host') || 'fourflowos.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const viewUrl = `${protocol}://${host}/profile/view/${assessment.view_token}`;

    // Send delivery email
    try {
      await sendDeliveryEmail({
        to: assessment.email,
        name: assessment.name,
        viewUrl,
        customNotes: custom_notes,
      });
    } catch (emailError) {
      console.error('Delivery email failed:', emailError);
      // Don't fail the delivery if email fails — profile is still marked delivered
    }

    return NextResponse.json({ success: true, viewUrl });
  } catch (error) {
    console.error('Deliver error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
