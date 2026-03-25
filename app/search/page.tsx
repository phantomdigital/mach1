import type { Metadata } from "next";
import { Suspense } from "react";
import { defaultLocale } from "@/prismicio";
import { SiteSearchResults } from "@/app/components/search/site-search-results";

export const metadata: Metadata = {
  title: "Search | MACH1 Logistics",
  description: "Search pages and articles on MACH1 Logistics.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-[40vh] pt-28" />}>
      <SiteSearchResults locale={defaultLocale} query={q} />
    </Suspense>
  );
}
