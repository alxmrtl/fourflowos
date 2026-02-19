import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const REQUIRED_FIELDS = [
  'name', 'email', 'birth_date', 'birth_location',
  'context_working', 'context_stuck', 'context_building',
  'self_energy', 'self_emotions', 'self_focus',
  'space_environment', 'space_tools', 'space_feedback',
  'story_narrative', 'story_mission', 'story_role',
  'spirit_values', 'spirit_curiosity', 'spirit_vision',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const missing = REQUIRED_FIELDS.filter(f => !body[f] || String(body[f]).trim() === '');
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        birth_date: body.birth_date,
        birth_time: body.birth_time_known && body.birth_time ? body.birth_time : null,
        birth_time_known: Boolean(body.birth_time_known),
        birth_location: body.birth_location.trim(),
        context_working: body.context_working.trim(),
        context_stuck: body.context_stuck.trim(),
        context_building: body.context_building.trim(),
        self_energy: body.self_energy.trim(),
        self_emotions: body.self_emotions.trim(),
        self_focus: body.self_focus.trim(),
        space_environment: body.space_environment.trim(),
        space_tools: body.space_tools.trim(),
        space_feedback: body.space_feedback.trim(),
        story_narrative: body.story_narrative.trim(),
        story_mission: body.story_mission.trim(),
        story_role: body.story_role.trim(),
        spirit_values: body.spirit_values.trim(),
        spirit_curiosity: body.spirit_curiosity.trim(),
        spirit_vision: body.spirit_vision.trim(),
        status: 'intake_submitted',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save assessment' },
        { status: 500 }
      );
    }

    // Send notification email via Web3Forms
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: '73d66ffb-9a88-4841-8f05-a48b0219288f',
          subject: `New Flow Profile Intake: ${body.name}`,
          from_name: 'FourFlowOS Flow Profile',
          message: `New Flow Profile intake submitted.\n\nName: ${body.name}\nEmail: ${body.email}\nBirth: ${body.birth_date}, ${body.birth_location}\n\nView in dashboard: /profile/admin/${data.id}`,
        }),
      });
    } catch (emailError) {
      // Don't fail the submission if email notification fails
      console.error('Email notification failed:', emailError);
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
