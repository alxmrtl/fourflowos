import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy — pragmatic, no nonces.
 *
 * - script-src keeps 'unsafe-inline' because the App Router injects inline
 *   bootstrap scripts; removing it requires nonce plumbing (deferred).
 *   'unsafe-eval' is dev-only (React Refresh / HMR).
 * - www.youtube.com appears in script-src + frame-src for the FlowZone
 *   ambient-audio player (YouTube IFrame API, see useAudio.ts).
 * - nominatim.openstreetmap.org: browser-side location autocomplete.
 * - *.supabase.co (https + wss): browser auth/data client.
 * - *.sanity.io: client-side content queries (useCdn: false → api.sanity.io);
 *   cdn.sanity.io for image assets.
 * - api.web3forms.com is intentionally absent: forms go through /api/contact.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.youtube.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sanity.io https://nominatim.openstreetmap.org${isDev ? " ws:" : ""}`,
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  productionBrowserSourceMaps: false,
  async redirects() {
    // Archived routes (framework deep-dives, blog, public practice page)
    // fold back into the How It Works page.
    return [
      { source: "/dimension/:path*", destination: "/framework", permanent: true },
      { source: "/content", destination: "/framework", permanent: true },
      { source: "/content/:id", destination: "/framework", permanent: true },
      { source: "/blog", destination: "/framework", permanent: true },
      { source: "/apps", destination: "/framework", permanent: true },
      { source: "/apps/:id", destination: "/framework", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
