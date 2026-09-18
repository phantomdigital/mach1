import { NextRequest, NextResponse } from "next/server";
import { createClient, defaultLocale, locales, type LocaleCode } from "@/prismicio";

export const dynamic = "force-dynamic";

function validateLocale(locale: string | null): LocaleCode {
  if (!locale) {
    return defaultLocale;
  }

  const validLocale = locales.find((item) => item.code === locale);
  return validLocale ? validLocale.code : defaultLocale;
}

export async function GET(request: NextRequest) {
  try {
    const lang = validateLocale(request.nextUrl.searchParams.get("lang"));
    const client = createClient();

    try {
      const footer = await client.getSingle("footer", { lang });
      return NextResponse.json(footer, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Footer API: Not found in locale ${lang}, error:`, errorMessage);

      if (lang === defaultLocale) {
        return NextResponse.json({ error: "Footer not found" }, { status: 404 });
      }

      try {
        const footer = await client.getSingle("footer", { lang: defaultLocale });
        return NextResponse.json(footer, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        });
      } catch (fallbackError) {
        console.error("Footer API: Not found in default locale either:", fallbackError);
        return NextResponse.json({ error: "Footer not found" }, { status: 404 });
      }
    }
  } catch (error: unknown) {
    console.error("Error fetching footer:", error);
    return NextResponse.json({ error: "Failed to fetch footer" }, { status: 500 });
  }
}
