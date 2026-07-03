import { timingSafeEqual, createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, clientIp, tooManyRequests } from './rate-limit';

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

/**
 * Constant-time check of the x-admin-key header against PROFILE_ADMIN_KEY.
 * Returns false when the header is missing or the env key is unset/empty —
 * an unconfigured key never authorizes anyone.
 */
export function isAdminAuthorized(request: NextRequest): boolean {
  const provided = request.headers.get('x-admin-key');
  const expected = process.env.PROFILE_ADMIN_KEY;
  if (!provided || !expected) return false;
  // Digest both sides to equal-length buffers so timingSafeEqual never
  // throws (or leaks length) on mismatched input sizes.
  return timingSafeEqual(sha256(provided), sha256(expected));
}

/**
 * Admin gate for route handlers. Returns null when authorized; otherwise a
 * ready-to-return 429 (failed attempts are rate limited per IP) or 401.
 *
 * Usage:
 *   const denied = await requireAdmin(request);
 *   if (denied) return denied;
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  if (isAdminAuthorized(request)) return null;

  const rl = await checkRateLimit('admin-fail', clientIp(request));
  if (!rl.success) return tooManyRequests(rl.retryAfterSec);

  console.error('[admin-auth] failed attempt', {
    path: request.nextUrl.pathname,
    ip: clientIp(request),
  });
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
