import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 75, 85, 90, 95, 100],
  },
};

export default nextConfig;
