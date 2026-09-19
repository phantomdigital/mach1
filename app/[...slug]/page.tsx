import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react"
import { createClient, locales, defaultLocale, type LocaleCode } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata, generateMetadata as generateCustomMetadata } from "@/lib/metadata";
import { LegalDatesProvider } from "@/slices/LegalContent/legal-dates-context";
import QuoteSummaryPage from "@/app/quote/summary/page";
import { SiteSearchResults } from "@/app/components/search/site-search-results";
import { MAX_SITE_SEARCH_RESULTS, searchSite } from "@/lib/prismic-search";
import type { Content } from "@prismicio/client";
import SolutionPage, { generateMetadata as generateSolutionMetadata } from "@/app/solutions/[uid]/page";
import SpecialtyPage, { generateMetadata as generateSpecialtyMetadata } from "@/app/specialties/[uid]/page";
import NewsArticlePage, { generateMetadata as generateNewsMetadata } from "@/app/news/[uid]/page";
import JobPage, { generateMetadata as generateJobMetadata } from "@/app/job/[uid]/page";
import {
  default as CareersVacanciesPage,
  generateMetadata as generateCareersVacanciesMetadata,
} from "@/app/careers/vacancies/page";
import {
  default as ContactThankYouPage,
  generateMetadata as generateContactThankYouMetadata,
} from "@/app/contact/thank-you/page";

type Params = { slug: string[] };
type SearchParams = { q?: string; email?: string };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const { q, email } = await searchParams;
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

    const [, routeType, routeUid] = slug;
    if (routeUid) {
      const routeParams = Promise.resolve({ uid: routeUid, locale });
      if (routeType === "solutions") return SolutionPage({ params: routeParams });
      if (routeType === "specialties") return SpecialtyPage({ params: routeParams });
      if (routeType === "news") return NewsArticlePage({ params: routeParams });
      if (routeType === "job") return JobPage({ params: routeParams });
    }
    if (routeType === "careers" && routeUid === "vacancies") {
      return CareersVacanciesPage({ params: Promise.resolve({ locale }) });
    }
    if (routeType === "contact" && routeUid === "thank-you") {
      return ContactThankYouPage({
        params: Promise.resolve({ locale }),
        searchParams: Promise.resolve({ email }),
      });
    }
    
    // Check if this is quote/summary with locale prefix (e.g., /zh-cn/quote/summary)
    if (slug.length >= 3 && slug[1] === "quote" && slug[2] === "summary") {
      // Handle quote summary page with locale
      return <QuoteSummaryPage params={Promise.resolve({ slug })} />;
    }
    
    uid = slug[1]; // Second segment is the uid
    
    // If no uid after locale, it's a localized homepage
    if (!uid) {
      const page = await client.getSingle("home", { lang: locale }).catch(() => notFound());
      return <SliceZone slices={page.data.slices} components={components} context={{ locale }} />;
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

  if (uid === "search") {
    const query = q?.trim() ?? "";
    const results =
      query.length >= 2 ? await searchSite(query, locale, { pageSize: MAX_SITE_SEARCH_RESULTS }) : [];
    return <SiteSearchResults initialQuery={query} results={results} />;
  }
  
  // Handle page types
  // Note: More specific routes like /solutions/[uid] will be matched first by Next.js
  try {
    const page = await client.getByUID("page", uid, { 
      lang: locale
    });
    
    // Check if page contains LegalContent slice
    const hasLegalContent = page.data.slices?.some(
      (slice) => slice.slice_type === "legal_content"
    );
    
    if (hasLegalContent) {
      return (
        <main>
          <LegalDatesProvider 
            firstPublicationDate={page.first_publication_date}
            lastPublicationDate={page.last_publication_date}
          >
            <SliceZone slices={page.data.slices} components={components} context={{ locale }} />
          </LegalDatesProvider>
        </main>
      );
    }
    
    return (
      <main>
        <SliceZone slices={page.data.slices} components={components} context={{ locale }} />
      </main>
    );
  } catch {
    // Page not found
    notFound();
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { q } = await searchParams;
  const client = createClient();
  
  // Empty slug should be handled by app/page.tsx metadata
  if (!slug || slug.length === 0) {
    return {
      title: "MACH1 Logistics",
      description: "Professional logistics and transportation services",
    };
  }
  
  const validLocaleCodes = locales.map(l => l.code);
  const firstSegment = slug[0];
  
  let locale: LocaleCode;
  let uid: string | undefined;
  
  if (validLocaleCodes.includes(firstSegment as LocaleCode)) {
    locale = firstSegment as LocaleCode;
    const [, routeType, routeUid] = slug;
    if (routeUid) {
      const routeParams = Promise.resolve({ uid: routeUid, locale });
      if (routeType === "solutions") return generateSolutionMetadata({ params: routeParams });
      if (routeType === "specialties") return generateSpecialtyMetadata({ params: routeParams });
      if (routeType === "news") return generateNewsMetadata({ params: routeParams });
      if (routeType === "job") return generateJobMetadata({ params: routeParams });
    }
    if (routeType === "careers" && routeUid === "vacancies") {
      return generateCareersVacanciesMetadata({ params: Promise.resolve({ locale }) });
    }
    if (routeType === "contact" && routeUid === "thank-you") {
      return generateContactThankYouMetadata({ params: Promise.resolve({ locale }) });
    }
    uid = slug[1];
    
    if (!uid) {
      const page = await client.getSingle("home", { lang: locale }).catch(() => notFound());
      return generatePrismicMetadata(page, {
        url: `/${locale}`,
        locale,
        keywords: ["home", "logistics solutions", "freight services", "MACH1"],
      });
    }
  } else {
    locale = defaultLocale;
    uid = firstSegment;
  }

  if (uid === "search") {
    const term = q?.trim();
    return {
      title: term ? `Search: ${term} | MACH1 Logistics` : "Search | MACH1 Logistics",
      description: "Search pages and articles on MACH1 Logistics.",
      robots: { index: false, follow: false },
      alternates: { canonical: locale === defaultLocale ? "/search" : `/${locale}/search` },
    };
  }
  
  try {
    const page = await client.getByUID("page", uid, { lang: locale });
    
    const url = locale === defaultLocale ? `/${uid}` : `/${locale}/${uid}`;
    
    // Check if page contains LegalContent slice and extract title
    const legalContentSlice = page.data.slices?.find(
      (slice) => slice.slice_type === "legal_content"
    ) as Content.LegalContentSlice | undefined;
    
    // For legal pages, use the page title from the LegalContent slice
    if (legalContentSlice?.primary?.page_title) {
      const title = legalContentSlice.primary.page_title;
      return generateCustomMetadata({
        title: title,
        description: `Read our ${title.toLowerCase()} to understand your rights and obligations.`,
        url,
        locale,
        keywords: [uid.replace(/-/g, " "), "MACH1 Logistics", "legal", title.toLowerCase()],
        publishedTime: page.first_publication_date || undefined,
        modifiedTime: page.last_publication_date || undefined,
        noIndex: true,
      });
    }
    
    return generatePrismicMetadata(page, {
      url,
      locale,
      keywords: [uid.replace(/-/g, " "), "MACH1 Logistics", "logistics services"],
    });
  } catch {
    return {
      title: "Page Not Found | MACH1 Logistics",
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
      if (page.uid === "careers-vacancies") {
        allParams.push({ slug: [locale, "careers", "vacancies"] });
      } else if (page.uid === "contact-thank-you") {
        allParams.push({ slug: [locale, "contact", "thank-you"] });
      } else {
        allParams.push({ slug: [locale, page.uid] });
      }
    });

    const [solutions, specialties, news, jobs] = await Promise.all([
      client.getAllByType("solution", { lang: locale }),
      client.getAllByType("specialty", { lang: locale }),
      client.getAllByType("news", { lang: locale }),
      client.getAllByType("job", { lang: locale }),
    ]);
    solutions.forEach((document) =>
      allParams.push({ slug: [locale, "solutions", document.uid] })
    );
    specialties.forEach((document) =>
      allParams.push({ slug: [locale, "specialties", document.uid] })
    );
    news.forEach((document) =>
      allParams.push({ slug: [locale, "news", document.uid] })
    );
    jobs.forEach((document) =>
      allParams.push({ slug: [locale, "job", document.uid] })
    );
  }

  return allParams;
}

