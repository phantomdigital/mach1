import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-AU', 'en-NZ', 'en-US', 'en-GB', 'en-SG', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'vi', 'th', 'id'],
    defaultLocale: 'en-AU',
    localeDetection: true,
  },
};

export default nextConfig;
