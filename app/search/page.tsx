import type { Metadata } from "next";
import { defaultLocale } from "@/prismicio";
import { searchSite } from "@/lib/prismic-search";
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
  const query = q?.trim() ?? "";
  const results = query.length >= 2 ? await searchSite(query, defaultLocale) : [];

  return <SiteSearchResults initialQuery={query} results={results} />;
}
