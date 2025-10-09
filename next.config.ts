import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // i18n configuration is not supported in App Router
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization
};

export default nextConfig;
