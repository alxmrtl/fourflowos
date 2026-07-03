import { NextRequest, NextResponse } from 'next/server';

export type RouteClass =
  | 'contact' | 'profile-submit' | 'token-view'
  | 'llm-esoteric' | 'llm-flow-lens' | 'admin-fail';

const LIMITS: Record<RouteClass, Array<{ limit: number; windowSec: number }>> = {
  'contact': [
    { limit: 5, windowSec: 3600 },
    { limit: 20, windowSec: 86400 },
  ],
  'profile-submit': [
    { limit: 3, windowSec: 3600 },
    { limit: 10, windowSec: 86400 },
  ],
  'token-view': [
    { limit: 30, windowSec: 3600 },
  ],
  // Callers key by user id.
  'llm-esoteric': [
    { limit: 3, windowSec: 86400 },
  ],
  // Callers key by IP.
  'llm-flow-lens': [
    { limit: 10, windowSec: 3600 },
  ],
  'admin-fail': [
    { limit: 10, windowSec: 3600 },
  ],
};

/**
 * Best-effort client IP extraction. On Vercel, x-forwarded-for is set by the
 * platform; the first entry is the original client.
 */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

// ---------------------------------------------------------------------------
// In-memory fallback backend.
// NOTE: on Vercel this Map is per-lambda-instance, so limits are best-effort
// only (each warm instance counts independently). Set UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN for durable, shared rate limiting.
// ---------------------------------------------------------------------------

const MAX_MEMORY_ENTRIES = 10_000;
const memoryStore = new Map<string, { count: number; resetAt: number }>();
let memoryCapWarned = false;

function checkMemory(
  key: string,
  limit: number,
  windowSec: number
): { success: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (entry && entry.resetAt > now) {
    entry.count += 1;
    if (entry.count > limit) {
      return {
        success: false,
        retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
      };
    }
    return { success: true, retryAfterSec: 0 };
  }

  // New window. Enforce the cap before inserting a new key.
  if (!entry && memoryStore.size >= MAX_MEMORY_ENTRIES) {
    for (const [k, v] of memoryStore) {
      if (v.resetAt <= now) memoryStore.delete(k);
    }
    if (memoryStore.size >= MAX_MEMORY_ENTRIES) {
      // Still over cap after sweeping — fail open rather than evict live windows.
      if (!memoryCapWarned) {
        memoryCapWarned = true;
        console.error(
          '[rate-limit] in-memory store over capacity; allowing requests unthrottled'
        );
      }
      return { success: true, retryAfterSec: 0 };
    }
  }

  memoryStore.set(key, { count: 1, resetAt: now + windowSec * 1000 });
  return { success: true, retryAfterSec: 0 };
}

// ---------------------------------------------------------------------------
// Upstash Redis REST backend (used when env vars are present).
// ---------------------------------------------------------------------------

async function checkUpstash(
  url: string,
  token: string,
  key: string,
  limit: number,
  windowSec: number
): Promise<{ success: boolean; retryAfterSec: number }> {
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, String(windowSec), 'NX'],
    ]),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Upstash pipeline returned ${res.status}`);
  }

  const results = (await res.json()) as Array<{ result?: unknown; error?: string }>;
  const incr = results[0];
  if (!incr || incr.error !== undefined || typeof incr.result !== 'number') {
    throw new Error(`Unexpected Upstash INCR response: ${JSON.stringify(incr)}`);
  }

  const count = incr.result;
  if (count > limit) {
    // windowSec is a safe upper bound on time-to-reset for a fixed window.
    return { success: false, retryAfterSec: windowSec };
  }
  return { success: true, retryAfterSec: 0 };
}

/**
 * Fixed-window rate limit check. Checks every window tier configured for the
 * class; the first exceeded tier wins. Fails open on any backend error —
 * availability over strictness.
 */
export async function checkRateLimit(
  cls: RouteClass,
  id: string
): Promise<{ success: boolean; retryAfterSec: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    for (const { limit, windowSec } of LIMITS[cls]) {
      const key = `rl:${cls}:${windowSec}:${id}`;
      const result =
        upstashUrl && upstashToken
          ? await checkUpstash(upstashUrl, upstashToken, key, limit, windowSec)
          : checkMemory(key, limit, windowSec);
      if (!result.success) return result;
    }
    return { success: true, retryAfterSec: 0 };
  } catch (err) {
    console.error('[rate-limit] backend error, failing open', err);
    return { success: true, retryAfterSec: 0 };
  }
}

/** Standard 429 response with a Retry-After header. */
export function tooManyRequests(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Too many requests' },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.max(1, retryAfterSec)) },
    }
  );
}
