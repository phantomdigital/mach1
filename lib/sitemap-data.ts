import { createClient } from "@/prismicio";
import { locales, defaultLocale, type LocaleCode } from "@/prismicio";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://www.mach1logistics.com.au");

function pathForLocale(path: string, locale: LocaleCode): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const client = createClient();
  const entries: SitemapEntry[] = [];

  const staticPaths = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/careers/vacancies", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/terms-of-service", changeFrequency: "yearly" as const, priority: 0.5 },
  ];

  for (const { path, changeFrequency, priority } of staticPaths) {
    for (const locale of locales) {
      const fullPath = pathForLocale(path, locale.code);
      entries.push({
        url: `${BASE_URL}${fullPath}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
      });
    }
  }

  try {
    const [
      pages,
      solutions,
      specialties,
      newsArticles,
      jobs,
      authors,
    ] = await Promise.all([
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
    ]);

    for (const page of pages) {
      if (excludePageUids.has(page.uid ?? "")) continue;
      const path = `/${page.uid}`;
      const lang = page.lang as LocaleCode;
      const fullPath = pathForLocale(path, lang);
      entries.push({
        url: `${BASE_URL}${fullPath}`,
        lastModified: page.last_publication_date
          ? new Date(page.last_publication_date)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    }

    for (const solution of solutions) {
      const path = `/solutions/${solution.uid}`;
      const lang = solution.lang as LocaleCode;
      const fullPath = pathForLocale(path, lang);
      entries.push({
        url: `${BASE_URL}${fullPath}`,
        lastModified: solution.last_publication_date
          ? new Date(solution.last_publication_date)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    }

    for (const specialty of specialties) {
      const path = `/specialties/${specialty.uid}`;
      const lang = specialty.lang as LocaleCode;
      const fullPath = pathForLocale(path, lang);
      entries.push({
        url: `${BASE_URL}${fullPath}`,
        lastModified: specialty.last_publication_date
          ? new Date(specialty.last_publication_date)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    }

    for (const article of newsArticles) {
      const path = `/news/${article.uid}`;
      const lang = article.lang as LocaleCode;
      const fullPath = pathForLocale(path, lang);
      entries.push({
        url: `${BASE_URL}${fullPath}`,
        lastModified: article.last_publication_date
          ? new Date(article.last_publication_date)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }

    for (const job of jobs) {
      const path = `/job/${job.uid}`;
      const lang = job.lang as LocaleCode;
      const fullPath = pathForLocale(path, lang);
      entries.push({
        url: `${BASE_URL}${fullPath}`,
        lastModified: job.last_publication_date
          ? new Date(job.last_publication_date)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }

    for (const author of authors) {
      const path = `/authors/${author.uid}`;
      const lang = author.lang as LocaleCode;
      const fullPath = pathForLocale(path, lang);
      entries.push({
        url: `${BASE_URL}${fullPath}`,
        lastModified: author.last_publication_date
          ? new Date(author.last_publication_date)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return entries;
}
