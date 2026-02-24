import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — only instantiated in the browser, not during SSR/static generation.
// Call getSupabaseBrowser() instead of importing the client directly.
let _client: SupabaseClient | null = null;

/** Returns true if the JWT payload contains role: "service_role" */
function isServiceRoleKey(key: string): boolean {
  try {
    const payload = JSON.parse(atob(key.split('.')[1]));
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

export function getSupabaseBrowser(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. ' +
      'Check Vercel → Settings → Environment Variables.'
    );
  }

  // Guard: service_role key must never reach the browser.
  // If this throws, NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel is set to the
  // service role key. Fix it by pasting the anon key (role:"anon" in the JWT).
  if (isServiceRoleKey(key)) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is the service_role key — this is a security risk. ' +
      'Go to Vercel → Settings → Environment Variables and replace it with the anon/public key from ' +
      'Supabase Dashboard → Settings → API → Project API keys → "anon public".'
    );
  }

  _client = createBrowserClient(url, key);
  return _client;
}
