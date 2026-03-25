import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Keep heavy client-only deps out of the server bundle trace (Vercel 250 MB unzipped limit).
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
   */
  serverExternalPackages: [
    "three",
    "mapbox-gl",
    "@react-three/fiber",
    "@react-three/drei",
  ],
  /**
   * Do not ship WebGL / map clients inside Node serverless functions — they are only used in
   * client components; tracing can still pull them in via shared chunks.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats
   */
  outputFileTracingExcludes: {
    "**": [
      "**/node_modules/three/**",
      "**/node_modules/@react-three/**",
      "**/node_modules/mapbox-gl/**",
    ],
  },
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization
  experimental: {
    viewTransition: true,
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
  compiler: {
    // Remove console logs in production builds
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep console.error and console.warn
    } : false,
  },
};

export default nextConfig;
