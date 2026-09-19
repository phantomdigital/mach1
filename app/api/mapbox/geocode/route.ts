import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ALLOWED_COUNTRIES = new Set(["AU", "US", "GB", "CA", "NZ"]);

export async function GET(request: NextRequest) {
  const clientId = getClientIdentifier(request.headers);
  const rate = await checkRateLimit(`mapbox-geocode:${clientId}`, 40, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Geocoding is not configured" }, { status: 503 });
  }

  const query = (request.nextUrl.searchParams.get("q") || "").trim();
  if (query.length < 3 || query.length > 200) {
    return NextResponse.json({ features: [] });
  }

  const country = (request.nextUrl.searchParams.get("country") || "").toUpperCase();
  const countryParam = ALLOWED_COUNTRIES.has(country) ? `&country=${country}` : "";

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}${countryParam}&limit=5&types=address,place,postcode`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 502 });
  }

  const data = (await response.json()) as {
    features?: Array<{ id: string; place_name: string; center: [number, number]; text: string }>;
  };

  return NextResponse.json({
    features: (data.features || []).map((feature) => ({
      id: feature.id,
      place_name: feature.place_name,
      center: feature.center,
      text: feature.text,
    })),
  });
}
