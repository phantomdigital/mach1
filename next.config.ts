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
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
