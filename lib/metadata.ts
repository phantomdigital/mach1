import type { Metadata } from "next";
import type { KeyTextField, ImageField } from "@prismicio/client";

// Base metadata for MACH1 Logistics
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
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mach1logistics.com.au",
  locale: "en_AU",
  type: "website" as const,
};

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
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
    type = "website",
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = options;

  // Title generation with proper hierarchy
  const fullTitle = title 
    ? `${title} | ${baseMetadata.siteName}`
    : baseMetadata.siteName;

  // Combine base keywords with page-specific ones
  const allKeywords = [...baseMetadata.keywords, ...keywords];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.join(", "),
    
    // Robots and indexing
    robots: noIndex 
      ? { index: false, follow: false }
      : { index: true, follow: true },
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      siteName: baseMetadata.siteName,
      locale: baseMetadata.locale,
      type,
      url: url ? `${baseMetadata.url}${url}` : baseMetadata.url,
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

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },

    // Additional SEO metadata
    alternates: {
      canonical: url ? `${baseMetadata.url}${url}` : baseMetadata.url,
    },

    // Author and organization
    authors: [{ name: baseMetadata.companyName }],
    creator: baseMetadata.companyName,
    publisher: baseMetadata.companyName,

    // Structured data will be handled separately
    other: {
      "format-detection": "telephone=no",
    },
  };

  return metadata;
}

// Helper for Prismic documents
export function generatePrismicMetadata(
  doc: {
    data: {
      meta_title?: KeyTextField;
      meta_description?: KeyTextField;
      meta_image?: ImageField;
      title?: KeyTextField; // Fallback title from content
      description?: KeyTextField; // Fallback description from content
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

// Structured data helpers
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: baseMetadata.companyName,
    url: baseMetadata.url,
    description: baseMetadata.description,
    sameAs: [
      // Add social media URLs when available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "AU",
      availableLanguage: "English",
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
      item: `${baseMetadata.url}${crumb.url}`,
    })),
  };
}
