import { createClient } from "@/prismicio";
import { locales, defaultLocale, type LocaleCode } from "@/prismicio";
import { SITE_URL } from "@/lib/site-url";
import { languageAlternateMap } from "@/lib/metadata";

function pathForLocale(path: string, locale: LocaleCode): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  alternates: Record<string, string>;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const client = createClient();
  const entries: SitemapEntry[] = [];

  const staticPaths = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/careers/vacancies", changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  for (const { path, changeFrequency, priority } of staticPaths) {
    for (const locale of locales) {
      const fullPath = pathForLocale(path, locale.code);
      entries.push({
        url: `${SITE_URL}${fullPath}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: languageAlternateMap(path),
      });
    }
  }

  try {
    const [pages, solutions, specialties, newsArticles, jobs, authors] = await Promise.all([
      client.getAllByType("page", { lang: "*" }),
      client.getAllByType("solution", { lang: "*" }),
      client.getAllByType("specialty", { lang: "*" }),
      client.getAllByType("news", { lang: "*" }),
      client.getAllByType("job", { lang: "*" }),
      client.getAllByType("author", { lang: "*" }),
    ]);

    const excludePageUids = new Set([
      "careers-vacancies",
      "contact-thank-you",
      "terms-of-service",
    ]);

    const pushDocument = (
      path: string,
      lang: LocaleCode,
      lastPublicationDate: string | null | undefined,
      changeFrequency: SitemapEntry["changeFrequency"],
      priority: number
    ) => {
      const fullPath = pathForLocale(path, lang);
      entries.push({
        url: `${SITE_URL}${fullPath}`,
        lastModified: lastPublicationDate ? new Date(lastPublicationDate) : new Date(),
        changeFrequency,
        priority,
        alternates: languageAlternateMap(path),
      });
    };

    for (const page of pages) {
      if (excludePageUids.has(page.uid ?? "")) continue;
      const isLegalPage = page.data.slices?.some((s) => s.slice_type === "legal_content");
      if (isLegalPage) continue;
      pushDocument(
        `/${page.uid}`,
        page.lang as LocaleCode,
        page.last_publication_date,
        "monthly",
        0.8
      );
    }

    for (const solution of solutions) {
      pushDocument(
        `/solutions/${solution.uid}`,
        solution.lang as LocaleCode,
        solution.last_publication_date,
        "monthly",
        0.8
      );
    }

    for (const specialty of specialties) {
      pushDocument(
        `/specialties/${specialty.uid}`,
        specialty.lang as LocaleCode,
        specialty.last_publication_date,
        "monthly",
        0.8
      );
    }

    for (const article of newsArticles) {
      pushDocument(
        `/news/${article.uid}`,
        article.lang as LocaleCode,
        article.last_publication_date,
        "monthly",
        0.6
      );
    }

    for (const job of jobs) {
      const isActive = job.data.active !== false;
      const closingDate = job.data.closing_date;
      const isClosed = Boolean(closingDate && new Date(closingDate) < new Date());
      if (!isActive || isClosed) continue;
      pushDocument(
        `/job/${job.uid}`,
        job.lang as LocaleCode,
        job.last_publication_date,
        "weekly",
        0.7
      );
    }

    for (const author of authors) {
      pushDocument(
        `/authors/${author.uid}`,
        author.lang as LocaleCode,
        author.last_publication_date,
        "monthly",
        0.4
      );
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return entries;
}

export { SITE_URL };
