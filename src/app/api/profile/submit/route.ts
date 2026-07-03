import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/email';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';
import type { IntakeStructuredV2 } from '@/types/intake';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 64 * 1024;

/**
 * Coerce a latitude/longitude value the way the route always has: numbers and
 * numeric strings pass through; empty/missing/NaN/out-of-bounds become null.
 * Never rejects the submission.
 */
const coordinate = (min: number, max: number) =>
  z.unknown().transform((value): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const n = typeof value === 'number' ? value : parseFloat(String(value));
    if (Number.isNaN(n) || n < min || n > max) return null;
    return n;
  });

const submitSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().min(1).max(254).pipe(z.email()),
  // YYYY-MM-DD and a real calendar date (round-trip check catches e.g. 2026-02-30)
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((s) => {
      const d = new Date(`${s}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
    }),
  // <input type="time"> sends HH:MM (empty string when birth time unknown)
  birth_time: z.union([z.string().regex(/^\d{2}:\d{2}/), z.literal('')]).nullish(),
  birth_time_known: z.unknown().transform((v) => Boolean(v)),
  birth_location: z.string().trim().min(1).max(200),
  birth_lat: coordinate(-90, 90),
  birth_lng: coordinate(-180, 180),
  user_id: z.union([z.uuid(), z.literal('')]).nullish(),
  // v2 JSONB payload — passed through unchanged; the body size cap bounds it
  intake_structured: z.unknown(),
});

const FIELD_ERRORS: Record<string, string> = {
  name: 'Name is required',
  email: 'Invalid email address',
  birth_date: 'Invalid birth date',
  birth_time: 'Invalid birth time',
  birth_location: 'Birth location is required',
  user_id: 'Invalid user id',
};

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit('profile-submit', clientIp(request));
    if (!rl.success) return tooManyRequests(rl.retryAfterSec);

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, error: 'Request too large' }, { status: 413 });
    }
    const body = JSON.parse(raw);

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      const field = parsed.error.issues[0]?.path[0];
      const message =
        (typeof field === 'string' && FIELD_ERRORS[field]) || 'Invalid submission';
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const {
      name,
      email: rawEmail,
      birth_date,
      birth_time,
      birth_time_known,
      birth_location,
      birth_lat,
      birth_lng,
      user_id,
    } = parsed.data;
    const email = rawEmail.toLowerCase();

    const viewToken = randomUUID();

    // intake_structured is the v2 JSONB payload — required for new submissions
    const intakeStructured = (parsed.data.intake_structured ??
      null) as IntakeStructuredV2 | null;

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        name,
        email,
        birth_date,
        birth_time: birth_time_known && birth_time ? birth_time : null,
        birth_time_known,
        birth_location,
        birth_lat,
        birth_lng,
        // v2 structured intake — primary data store
        intake_structured: intakeStructured,
        status: 'intake_submitted',
        view_token: viewToken,
        ...(user_id ? { user_id } : {}),
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

    // Notify admin via Web3Forms
    try {
      const web3formsKey = process.env.WEB3FORMS_KEY;
      if (!web3formsKey) {
        console.error('[profile/submit] WEB3FORMS_KEY not set — admin notification skipped');
      } else {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New Flow Profile Intake: ${name}`,
            from_name: 'FourFlowOS Flow Profile',
            message: `New Flow Profile intake submitted.\n\nName: ${name}\nEmail: ${email}\nBirth: ${birth_date}, ${birth_location}\nSchema: v2 structured\n\nView in dashboard: /profile/admin/${data.id}`,
          }),
        });
      }
    } catch (emailError) {
      console.error('Admin notification failed:', emailError);
    }

    // Confirmation email to user
    try {
      await sendConfirmationEmail({
        to: email,
        name,
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
