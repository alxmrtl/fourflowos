import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/email';
import type { IntakeStructuredV2 } from '@/types/intake';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields (v2 schema)
    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!body.email || !String(body.email).trim()) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    if (!body.birth_date) {
      return NextResponse.json({ success: false, error: 'Birth date is required' }, { status: 400 });
    }
    if (!body.birth_location || !String(body.birth_location).trim()) {
      return NextResponse.json({ success: false, error: 'Birth location is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    const viewToken = randomUUID();

    // intake_structured is the v2 JSONB payload — required for new submissions
    const intakeStructured: IntakeStructuredV2 | null = body.intake_structured ?? null;

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        birth_date: body.birth_date,
        birth_time: body.birth_time_known && body.birth_time ? body.birth_time : null,
        birth_time_known: Boolean(body.birth_time_known),
        birth_location: body.birth_location.trim(),
        birth_lat: body.birth_lat ? parseFloat(body.birth_lat) : null,
        birth_lng: body.birth_lng ? parseFloat(body.birth_lng) : null,
        // v2 structured intake — primary data store
        intake_structured: intakeStructured,
        status: 'intake_submitted',
        view_token: viewToken,
        ...(body.user_id ? { user_id: body.user_id } : {}),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: 'Failed to save assessment' }, { status: 500 });
    }

    // Notify admin via Web3Forms
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '73d66ffb-9a88-4841-8f05-a48b0219288f',
          subject: `New Flow Profile Intake: ${body.name}`,
          from_name: 'FourFlowOS Flow Profile',
          message: `New Flow Profile intake submitted.\n\nName: ${body.name}\nEmail: ${body.email}\nBirth: ${body.birth_date}, ${body.birth_location}\nSchema: v2 structured\n\nView in dashboard: /profile/admin/${data.id}`,
        }),
      });
    } catch (emailError) {
      console.error('Admin notification failed:', emailError);
    }

    // Confirmation email to user
    try {
      await sendConfirmationEmail({
        to: body.email.trim().toLowerCase(),
        name: body.name.trim(),
      });
    } catch (confirmError) {
      console.error('Confirmation email failed:', confirmError);
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
