import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Keep heavy client-only deps out of the server bundle trace (Vercel 250 MB unzipped limit).
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
   */
  serverExternalPackages: [
    "three",
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
