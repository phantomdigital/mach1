import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateCustomMetadata } from "@/lib/metadata";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import type { Content } from "@prismicio/client";
import { LegalDatesProvider } from "@/slices/LegalContent/legal-dates-context";

export default async function TermsOfServicePage() {
  const client = createClient();

  let page: Content.PageDocument;
  try {
    // Fetch your page by UID (adjust the custom type and UID as needed)
    page = await client.getByUID("page", "terms-of-service");
  } catch {
    notFound();
  }

  return (
    <main>
      {/* Provide dates to LegalContent slice via context */}
      <LegalDatesProvider 
        firstPublicationDate={page.first_publication_date}
        lastPublicationDate={page.last_publication_date}
      >
        <SliceZone slices={page.data.slices} components={components} />
      </LegalDatesProvider>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();

  let page: Content.PageDocument;
  try {
    page = await client.getByUID("page", "terms-of-service");
  } catch {
    return {
      title: "Page Not Found",
    };
  }

  // Get title from the first LegalContent slice
  const legalContentSlice = page.data.slices?.find(
    (slice) => slice.slice_type === "legal_content"
  ) as Content.LegalContentSlice | undefined;

  const title = legalContentSlice?.primary?.page_title || "Terms of Service";

  return generateCustomMetadata({
    title,
    description: `Read our ${title.toLowerCase()} to understand your rights and obligations.`,
    url: "/terms-of-service",
    keywords: ["terms of service", "MACH1 Logistics", "legal"],
    publishedTime: page.first_publication_date || undefined,
    modifiedTime: page.last_publication_date || undefined,
    noIndex: true,
  });
}

