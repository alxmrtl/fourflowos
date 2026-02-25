import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/me';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Classify the error so the UI can show a helpful message instead of
    // silently dropping the user at the home page with no explanation.
    const msg = error.message?.toLowerCase() ?? '';
    const errorCode = msg.includes('expired') ? 'expired'
      : msg.includes('already') || msg.includes('used') ? 'used'
      : 'failed';

    // Redirect to /me so the AuthModal is already visible and the user
    // immediately sees the error — no hunting around the home page.
    return NextResponse.redirect(`${origin}/me?auth_error=${errorCode}`);
  }

  // No code present — malformed callback URL
  return NextResponse.redirect(`${origin}/me?auth_error=failed`);
}
