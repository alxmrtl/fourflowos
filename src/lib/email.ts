import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY must be set');
    _resend = new Resend(key);
  }
  return _resend;
}

// For testing: use 'onboarding@resend.dev' (Resend's test domain — only sends to your own email)
// For production: verify fourflowos.com in Resend dashboard and use 'FourFlow <flow@fourflowos.com>'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'FourFlow <onboarding@resend.dev>';

export async function sendConfirmationEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const firstName = name.split(' ')[0];
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'We received your Flow Profile intake',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0;">FourFlow</h1>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Hi ${firstName},
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Thank you for completing your Flow Profile intake. We've received your responses and your profile is being prepared.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          We'll email you when your personalized Flow Profile is ready — it usually takes 1-2 days.
        </p>

        <div style="margin: 32px 0; padding: 20px; background: #f9f9f9; border-radius: 12px;">
          <p style="font-size: 14px; color: #666; margin: 0 0 8px 0; font-weight: 600;">What happens next:</p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
            Your intake is reviewed and your Flow Profile is generated — a personalized map of where you are across the four dimensions of flow. You'll receive a link to view it.
          </p>
        </div>

        <p style="font-size: 14px; color: #999; margin-top: 40px;">
          — The FourFlow Team
        </p>
      </div>
    `,
  });
}

export async function sendDeliveryEmail({
  to,
  name,
  viewUrl,
}: {
  to: string;
  name: string;
  viewUrl: string;
}) {
  const firstName = name.split(' ')[0];
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Your Flow Profile is ready',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0;">FourFlow</h1>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Hi ${firstName},
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Your personalized Flow Profile is ready. This is your map — a snapshot of where you are right now across the four dimensions that shape flow.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${viewUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6BA292, #7A4DA4); color: white; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600;">
            View Your Flow Profile
          </a>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #666;">
          This link is unique to you — bookmark it to revisit anytime.
        </p>

        <div style="margin: 32px 0; padding: 20px; background: #f9f9f9; border-radius: 12px;">
          <p style="font-size: 14px; color: #666; margin: 0 0 8px 0; font-weight: 600;">Want to go deeper?</p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
            Your profile is based on your intake responses. A live facilitated session reveals the patterns beneath the surface — the blind spots, the cascades, the single unlock that shifts everything. Details are at the bottom of your profile.
          </p>
        </div>

        <p style="font-size: 14px; color: #999; margin-top: 40px;">
          — The FourFlow Team
        </p>
      </div>
    `,
  });
}
