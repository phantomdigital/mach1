import { NextResponse } from "next/server";
import { getSitemapEntries } from "@/lib/sitemap-data";

export async function GET() {
  const entries = await getSitemapEntries();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${(e.lastModified || new Date()).toISOString().split("T")[0]}</lastmod>
    ${e.changeFrequency ? `<changefreq>${e.changeFrequency}</changefreq>` : ""}
    ${e.priority !== undefined ? `<priority>${e.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
}
