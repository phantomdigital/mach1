import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react"
import { createClient, locales, defaultLocale, type LocaleCode } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata } from "@/lib/metadata";
import QuoteSummaryPage from "@/app/quote/summary/page";

type Params = { slug: string[] };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const client = createClient();
  
  // Empty slug should be handled by app/page.tsx, not this route
  // If we somehow get here with empty slug, redirect to notFound
  if (!slug || slug.length === 0) {
    notFound();
  }
  
  // Parse slug array to determine locale and uid
  const validLocaleCodes = locales.map(l => l.code);
  const firstSegment = slug[0];
  
  let locale: LocaleCode;
  let uid: string | undefined;
  
  // Check if first segment is a locale code
  if (validLocaleCodes.includes(firstSegment as LocaleCode)) {
    locale = firstSegment as LocaleCode;
    
    // Check if this is quote/summary with locale prefix (e.g., /zh-cn/quote/summary)
    if (slug.length >= 3 && slug[1] === "quote" && slug[2] === "summary") {
      // Handle quote summary page with locale
      return <QuoteSummaryPage params={Promise.resolve({ slug })} />;
    }
    
    uid = slug[1]; // Second segment is the uid
    
    // If no uid after locale, it's a localized homepage
    if (!uid) {
      const page = await client.getSingle("home", { lang: locale }).catch(() => notFound());
      return <SliceZone slices={page.data.slices} components={components} />;
    }
  } else {
    // No locale prefix, use default locale
    locale = defaultLocale;
    
    // Check if this is quote/summary without locale (e.g., /quote/summary)
    // This should be handled by the specific route, but if it falls here, handle it
    if (slug.length >= 2 && slug[0] === "quote" && slug[1] === "summary") {
      return <QuoteSummaryPage params={Promise.resolve({ slug: [] })} />;
    }
    
    uid = firstSegment;
  }
  
  // Handle page types
  // Note: More specific routes like /solutions/[uid] will be matched first by Next.js
  try {
    const page = await client.getByUID("page", uid, { 
      lang: locale
    });
    
    return (
      <main>
        <SliceZone slices={page.data.slices} components={components} />
      </main>
    );
  } catch {
    // Page not found
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = createClient();
  
  // Empty slug should be handled by app/page.tsx metadata
  if (!slug || slug.length === 0) {
    return {
      title: "MACH 1 Logistics",
      description: "Professional logistics and transportation services",
    };
  }
  
  const validLocaleCodes = locales.map(l => l.code);
  const firstSegment = slug[0];
  
  let locale: LocaleCode;
  let uid: string | undefined;
  
  if (validLocaleCodes.includes(firstSegment as LocaleCode)) {
    locale = firstSegment as LocaleCode;
    uid = slug[1];
    
    if (!uid) {
      const page = await client.getSingle("home", { lang: locale }).catch(() => notFound());
      return generatePrismicMetadata(page, {
        url: `/${locale}`,
        keywords: ["home", "logistics solutions", "freight services", "MACH1"],
      });
    }
  } else {
    locale = defaultLocale;
    uid = firstSegment;
  }
  
  try {
    const page = await client.getByUID("page", uid, { lang: locale });
    
    const url = locale === defaultLocale ? `/${uid}` : `/${locale}/${uid}`;
    
    return generatePrismicMetadata(page, {
      url,
      keywords: [uid.replace(/-/g, " "), "MACH 1 Logistics", "logistics services"],
    });
  } catch {
    return {
      title: "Page Not Found | MACH 1 Logistics",
      description: "The requested page could not be found.",
    };
  }
}

export async function generateStaticParams() {
  const client = createClient();
  
  const allParams: { slug: string[] }[] = [];
  
  // Note: Default locale homepage (slug: []) is handled by app/page.tsx, not this route
  
  // Default locale pages (no locale prefix)
  const defaultPages = await client.getAllByType("page", { lang: defaultLocale });
  defaultPages.forEach((page) => {
    allParams.push({ slug: [page.uid] });
  });
  
  // Non-default locale pages (with locale prefix)
  const nonDefaultLocales = locales
    .map(l => l.code)
    .filter(code => code !== defaultLocale);
  
  for (const locale of nonDefaultLocales) {
    // Localized homepage
    try {
      await client.getSingle("home", { lang: locale });
      allParams.push({ slug: [locale] });
    } catch {
      // Homepage doesn't exist for this locale, skip
    }
    
    // Localized pages
    const pages = await client.getAllByType("page", { lang: locale });
    pages.forEach((page) => {
      allParams.push({ slug: [locale, page.uid] });
    });
  }

  return allParams;
}

