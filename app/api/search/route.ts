import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type LocaleCode } from "@/prismicio";
import { searchSite } from "@/lib/prismic-search";

export const dynamic = "force-dynamic";

function parseLang(raw: string | null): LocaleCode {
  if (!raw) return defaultLocale;
  const match = locales.find((l) => l.code === raw);
  return match ? match.code : defaultLocale;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const lang = parseLang(request.nextUrl.searchParams.get("lang"));

  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] as const });
  }

  try {
    const results = await searchSite(q, lang);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
