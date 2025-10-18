import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import type { Content } from "@prismicio/client";
import { LegalDatesProvider } from "@/slices/LegalContent/legal-dates-context";
import type { PageDocumentDataSlicesSlice } from "@/types.generated";

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
    (slice: PageDocumentDataSlicesSlice) => slice.slice_type === "legal_content"
  ) as Content.LegalContentSlice | undefined;

  const title = legalContentSlice?.primary?.page_title || "Terms of Service";

  return {
    title: `${title} | MACH 1 Logistics`,
    description: `Read our ${title.toLowerCase()} to understand your rights and obligations.`,
  };
}

