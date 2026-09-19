import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const disallowed = [
  "/api/",
  "/search",
  "/zh-cn/search",
  "/hi-in/search",
  "/slice-simulator",
  "/quote/summary",
  "/zh-cn/quote/summary",
  "/hi-in/quote/summary",
  "/quote/error",
  "/contact/thank-you",
  "/zh-cn/contact/thank-you",
  "/hi-in/contact/thank-you",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: disallowed,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
