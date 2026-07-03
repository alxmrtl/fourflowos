import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16 * 1024;

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email().max(254),
  subject: z.string().max(150).optional(),
  message: z.string().min(1).max(5000),
  form: z.enum(['contact', 'together']),
  // Honeypot field — real users never fill this in.
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit('contact', clientIp(request));
  if (!rl.success) return tooManyRequests(rl.retryAfterSec);

  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: 'Request too large' },
      { status: 400 }
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid input' },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input' },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Honeypot tripped — pretend success without forwarding anything.
  if (typeof data.website === 'string' && data.website.length > 0) {
    return NextResponse.json({ success: true });
  }

  const accessKey = process.env.WEB3FORMS_KEY;
  if (!accessKey) {
    console.error('[contact] WEB3FORMS_KEY not set');
    return NextResponse.json(
      { success: false, error: 'Contact service unavailable' },
      { status: 503 }
    );
  }

  // Reproduce exactly what each form used to send directly to Web3Forms.
  const subject =
    data.form === 'contact'
      ? `FourFlowOS Contact: ${data.subject ?? ''}`
      : 'FourFlow: Signal Session Request';

  const payload = {
    access_key: accessKey,
    name: data.name,
    email: data.email,
    subject,
    message: data.message,
    from_name: 'FourFlowOS Website',
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { success?: boolean; message?: string };

    if (result.success !== true) {
      console.error('[contact] Web3Forms rejected submission', {
        status: response.status,
        message: result.message,
      });
    }

    return NextResponse.json({ success: result.success === true });
  } catch (err) {
    console.error('[contact] Web3Forms request failed', err);
    return NextResponse.json({ success: false });
  }
}
