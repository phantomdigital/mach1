import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type LocaleCode } from "@/prismicio";
import { searchSite } from "@/lib/prismic-search";

export const dynamic = "force-dynamic";
const SEARCH_CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

function parseLang(raw: string | null): LocaleCode {
  if (!raw) return defaultLocale;
  const match = locales.find((l) => l.code === raw);
  return match ? match.code : defaultLocale;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const lang = parseLang(request.nextUrl.searchParams.get("lang"));

  if (q.trim().length < 2) {
    return NextResponse.json(
      { results: [] as const },
      { headers: { "Cache-Control": SEARCH_CACHE_CONTROL } }
    );
  }

  try {
    const results = await searchSite(q, lang, { pageSize: 10 });
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": SEARCH_CACHE_CONTROL } }
    );
  } catch (error) {
    console.error("search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
