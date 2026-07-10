import { NextRequest, NextResponse } from 'next/server';

// /flowmap — the short, typeable fallback for the workshop QR code.
// Redirects to the workshop intake, preserving the query string (?c=COHORT).
export function GET(request: NextRequest) {
  const url = new URL('/profile/workshop', request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
}
