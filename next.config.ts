import type { NextConfig } from "next";

/*
 * Content-Security-Policy.
 *
 * `'unsafe-inline'` on script-src is load-bearing here: the theme bootstrap in
 * app/layout.tsx runs inline before paint to avoid a flash of the wrong theme,
 * and next/script's inline blocks for Plausible and GA4 are inline too.
 * Tightening this to a nonce means moving all three, which is a separate piece
 * of work — the policy below still shuts out the things that matter most
 * (framing, plugins, form posts and base-href hijacking) and pins which hosts
 * may serve scripts at all.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://plausible.io https://www.google-analytics.com https://api.techcortix.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF first, WebP fallback. Screenshots are 460px wide, so cap sizes
    // near 2× their largest render (280px) instead of the 3840 default.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [32, 64, 96, 128, 256, 384, 480, 560],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // iOS ignores the association file unless it is served as JSON, and
        // the file has no extension, so Next would send octet-stream.
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
