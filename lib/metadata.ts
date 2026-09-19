import type { Metadata } from "next";
import type { KeyTextField, ImageField } from "@prismicio/client";
import { defaultLocale, type LocaleCode } from "@/prismicio";
import { getPathnameWithoutLocale } from "@/lib/locale-helpers";
import { localizedPath } from "@/lib/localized-routes";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

export const baseMetadata = {
  siteName: "MACH1 Logistics",
  companyName: "MACH1 Logistics",
  description: "Professional logistics and transportation services. Expert solutions for import/export, freight management, and supply chain optimisation.",
  keywords: [
    "logistics",
    "transportation",
    "freight",
    "import export",
    "supply chain",
    "shipping",
    "cargo",
    "warehousing",
    "distribution",
    "FCL",
    "LCL",
    "dangerous goods",
    "specialty transport"
  ],
  url: SITE_URL,
  locale: "en_AU",
  type: "website" as const,
};

export const HREFLANG_BY_LOCALE = {
  "en-us": "en-AU",
  "zh-cn": "zh-CN",
  "hi-in": "hi-IN",
} as const;

export const OG_LOCALE_BY_LOCALE = {
  "en-us": "en_AU",
  "zh-cn": "zh_CN",
  "hi-in": "hi_IN",
} as const;

export function languageAlternateMap(path = "/"): Record<string, string> {
  const bare = getPathnameWithoutLocale(path);
  const normalized = bare === "" ? "/" : bare;
  const href = (locale: LocaleCode) => {
    if (normalized === "/") {
      return absoluteUrl(locale === defaultLocale ? "/" : `/${locale}`);
    }
    return absoluteUrl(localizedPath(normalized, locale));
  };

  return {
    "en-AU": href("en-us"),
    "zh-CN": href("zh-cn"),
    "hi-IN": href("hi-in"),
    "x-default": href("en-us"),
  };
}

export function ogLocale(locale: LocaleCode = defaultLocale) {
  return OG_LOCALE_BY_LOCALE[locale];
}

export function ogAlternateLocales(locale: LocaleCode = defaultLocale) {
  return Object.values(OG_LOCALE_BY_LOCALE).filter((value) => value !== ogLocale(locale));
}

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale?: LocaleCode;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function generateMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description = baseMetadata.description,
    keywords = [],
    image,
    url,
    locale = defaultLocale,
    type = "website",
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = options;

  const fullTitle = title
    ? `${title} | ${baseMetadata.siteName}`
    : baseMetadata.siteName;

  const allKeywords = [...baseMetadata.keywords, ...keywords];
  const canonical = url ? absoluteUrl(url) : SITE_URL;

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    keywords: allKeywords.join(", "),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      siteName: baseMetadata.siteName,
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      type,
      url: canonical,
      ...(image && {
        images: [
          {
            url: image,
            alt: title || baseMetadata.siteName,
            width: 1200,
            height: 630,
          },
        ],
      }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical,
      ...(!noIndex && { languages: languageAlternateMap(url || "/") }),
    },
    authors: [{ name: baseMetadata.companyName }],
    creator: baseMetadata.companyName,
    publisher: baseMetadata.companyName,
    other: {
      "format-detection": "telephone=no",
    },
  };

  return metadata;
}

export function generatePrismicMetadata(
  doc: {
    data: {
      meta_title?: KeyTextField;
      meta_description?: KeyTextField;
      meta_image?: ImageField;
      title?: KeyTextField;
      description?: KeyTextField;
    };
    last_publication_date?: string;
    first_publication_date?: string;
  },
  options: Omit<MetadataOptions, "title" | "description" | "image"> = {}
): Metadata {
  return generateMetadata({
    title: doc.data.meta_title || doc.data.title || undefined,
    description: doc.data.meta_description || doc.data.description || undefined,
    image: doc.data.meta_image?.url || undefined,
    publishedTime: doc.first_publication_date || undefined,
    modifiedTime: doc.last_publication_date || undefined,
    ...options,
  });
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: baseMetadata.siteName,
    url: SITE_URL,
    description: baseMetadata.description,
    inLanguage: ["en-AU", "zh-CN", "hi-IN"],
    publisher: {
      "@type": "Organization",
      name: baseMetadata.companyName,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: baseMetadata.companyName,
    url: SITE_URL,
    description: baseMetadata.description,
    sameAs: [SITE_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "AU",
      availableLanguage: ["English", "Chinese", "Hindi"],
    },
    serviceArea: {
      "@type": "Country",
      name: "Australia",
    },
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}
