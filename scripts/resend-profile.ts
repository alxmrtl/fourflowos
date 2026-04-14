#!/usr/bin/env ts-node

/**
 * Re-send the Flow Profile delivery email for an already-generated assessment.
 * Does NOT regenerate the profile — just sends the email.
 *
 * Usage:
 *   npm run profile:resend <assessment-id>
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getSupabase } from '../src/lib/supabase';
import { sendDeliveryEmail } from '../src/lib/email';

const supabase = getSupabase();

async function main() {
  const assessmentId = process.argv[2];

  if (!assessmentId) {
    console.error(`
Usage:
  npm run profile:resend <assessment-id>

Example:
  npm run profile:resend abc-123-def-456
`);
    process.exit(1);
  }

  const { data: assessment, error } = await supabase
    .from('assessments')
    .select('id, name, email, status, flow_profile_json')
    .eq('id', assessmentId)
    .single();

  if (error || !assessment) {
    console.error('Assessment not found:', error?.message);
    process.exit(1);
  }

  console.log(`\nAssessment  : ${assessment.name} <${assessment.email}>`);
  console.log(`Status      : ${assessment.status}`);
  console.log(`Has profile : ${!!assessment.flow_profile_json}`);

  if (!assessment.flow_profile_json) {
    console.error('\nNo profile JSON found — run profile:generate first.');
    process.exit(1);
  }

  const host = process.env.NEXT_PUBLIC_SITE_URL || 'fourflowos.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const cleanHost = host.replace(/^https?:\/\//, '');
  const viewUrl = `${protocol}://${cleanHost}/me`;

  console.log(`\nSending to  : ${assessment.email}`);
  console.log(`From        : ${process.env.RESEND_FROM_EMAIL || 'FourFlow <onboarding@resend.dev> (test domain!)'}`);
  console.log(`View URL    : ${viewUrl}\n`);

  await sendDeliveryEmail({
    to: assessment.email,
    name: assessment.name,
    viewUrl,
  });

  console.log('Done. Email sent.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
