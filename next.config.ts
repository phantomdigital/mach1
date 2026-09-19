import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
      process.env.CLOUDFLARE_TURNSTILE_SITE_KEY ||
      "",
  },
  /**
   * Keep heavy client-only deps out of the server bundle trace (Vercel 250 MB unzipped limit).
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
   */
  serverExternalPackages: [
    "three",
    "redis",
  ],
  /**
   * Exclude heavy client-only deps from serverless function traces.
   * Routes are matched with picomatch; "/" covers all app routes.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats
   */
  outputFileTracingExcludes: {
    "/": [
      "./node_modules/three/**",
      "./node_modules/mapbox-gl/**",
      "./public/**",
      "./.git/**",
      "./.next/cache/**",
    ],
    "/api/*": [
      "./node_modules/three/**",
      "./node_modules/mapbox-gl/**",
      "./public/**",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.prismic.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
        pathname: '/styles/**/static/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 75, 85, 90, 95, 100],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://challenges.cloudflare.com https://api.mapbox.com https://static.cdn.prismic.io",
      "style-src 'self' 'unsafe-inline' https://api.mapbox.com",
      "img-src 'self' data: blob: https://images.prismic.io https://*.cdn.prismic.io https://images.unsplash.com https://api.mapbox.com https://*.mapbox.com https://*.cloudflare.com",
      "media-src 'self' blob: https://images.prismic.io https://*.cdn.prismic.io https://prismic-io.s3.amazonaws.com",
      "connect-src 'self' ws: wss: https://plausible.io https://*.mapbox.com https://api.mapbox.com https://*.prismic.io https://*.cdn.prismic.io https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "font-src 'self' data:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "mach1logistics.com.au" }],
        destination: "https://www.mach1logistics.com.au/:path*",
        permanent: true,
      },
      {
        source: "/package-tracking",
        destination: "/tracking",
        permanent: true,
      },
      {
        source: "/:locale(zh-cn|hi-in)/package-tracking",
        destination: "/:locale/tracking",
        permanent: true,
      },
    ];
  },
  compiler: {
    // Remove console logs in production builds
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep console.error and console.warn
    } : false,
  },
};

export default nextConfig;
