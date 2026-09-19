const FALLBACK_SITE_URL = "https://www.mach1logistics.com.au";

export function normalizeSiteUrl(raw?: string): string {
  const candidate = (raw || FALLBACK_SITE_URL).trim().replace(/\/$/, "");
  try {
    const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
    if (url.hostname === "mach1logistics.com.au") {
      url.hostname = "www.mach1logistics.com.au";
    }
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
