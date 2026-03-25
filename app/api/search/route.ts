import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type LocaleCode } from "@/prismicio";
import { MAX_SITE_SEARCH_RESULTS, searchSite } from "@/lib/prismic-search";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
const SEARCH_CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

/** Per-IP limit for `/api/search` (abuse protection). */
const SEARCH_RATE_MAX = 60;
const SEARCH_RATE_WINDOW_MS = 60_000;

function parseLang(raw: string | null): LocaleCode {
  if (!raw) return defaultLocale;
  const match = locales.find((l) => l.code === raw);
  return match ? match.code : defaultLocale;
}

export async function GET(request: NextRequest) {
  const clientId = getClientIdentifier(request.headers);
  const rate = await checkRateLimit(
    `api-search:${clientId}`,
    SEARCH_RATE_MAX,
    SEARCH_RATE_WINDOW_MS
  );
  if (!rate.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil((rate.resetTime - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const lang = parseLang(request.nextUrl.searchParams.get("lang"));

  if (q.trim().length < 2) {
    return NextResponse.json(
      { results: [] as const },
      { headers: { "Cache-Control": SEARCH_CACHE_CONTROL } }
    );
  }

  try {
    const results = await searchSite(q, lang, { pageSize: MAX_SITE_SEARCH_RESULTS });
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": SEARCH_CACHE_CONTROL } }
    );
  } catch (error) {
    console.error("search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
