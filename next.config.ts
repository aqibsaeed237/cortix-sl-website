import type { NextConfig } from "next";

const securityHeaders = [
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
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
