import { filter, type PrismicDocument } from "@prismicio/client";
import Fuse from "fuse.js";
import { createClient } from "@/prismicio";
import type { LocaleCode } from "@/prismicio";
import { clipAroundMatch, extractPrimaryText } from "@/lib/search-text-utils";

/**
 * Repeatable / singleton page types to include in site search.
 * Excludes `home` (homepage is redundant in search), header/footer, etc.
 */
export const SEARCHABLE_DOCUMENT_TYPES = [
  "page",
  "solution",
  "specialty",
  "news",
  "job",
  "author",
] as const;

/** Hard cap for Prismic fetch and UI — keeps search fast and predictable. */
export const MAX_SITE_SEARCH_RESULTS = 30;

export type SiteSearchResult = {
  id: string;
  uid: string | null;
  type: string;
  typeLabel: string;
  title: string;
  url: string | null;
  /** Short excerpt with a window around the first query match where possible */
  snippet: string;
};

const TYPE_LABELS: Record<string, string> = {
  page: "Page",
  solution: "Solution",
  specialty: "Specialty",
  news: "News",
  job: "Careers",
  author: "Author",
};

type InternalResult = SiteSearchResult & { _searchText: string };

function resolveTitle(doc: PrismicDocument): string {
  const data = doc.data as Record<string, unknown>;

  if (typeof data.title === "string" && data.title.trim()) {
    return data.title.trim();
  }
  if (typeof data.name === "string" && data.name.trim()) {
    return data.name.trim();
  }
  if (typeof data.meta_title === "string" && data.meta_title.trim()) {
    return data.meta_title.trim();
  }
  if (doc.uid) {
    return doc.uid.replace(/-/g, " ");
  }
  return doc.id;
}

function mapDocToInternal(doc: PrismicDocument, query: string): InternalResult {
  const title = resolveTitle(doc);
  const typeLabel = TYPE_LABELS[doc.type] ?? doc.type;
  const primary = extractPrimaryText(doc);
  const snippetSource = primary || title;
  const snippet = clipAroundMatch(snippetSource, query, 180);
  const _searchText = [title, primary, typeLabel, doc.uid ?? ""].filter(Boolean).join(" ");

  return {
    id: doc.id,
    uid: doc.uid,
    type: doc.type,
    typeLabel,
    title,
    url: doc.url ?? null,
    snippet,
    _searchText,
  };
}

function stripInternal(item: InternalResult): SiteSearchResult {
  const { _searchText, ...rest } = item;
  return rest;
}

/**
 * Re-rank Prismic fulltext hits with Fuse.js (typo-tolerant within this result set).
 * If Fuse returns nothing (edge case), keeps Prismic order.
 */
function rankWithFuse(query: string, items: InternalResult[]): SiteSearchResult[] {
  const q = query.trim();
  if (q.length < 2 || items.length <= 1) {
    return items.map(stripInternal);
  }

  const fuse = new Fuse(items, {
    keys: [
      { name: "title", weight: 0.45 },
      { name: "snippet", weight: 0.35 },
      { name: "_searchText", weight: 0.25 },
    ],
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true,
    shouldSort: true,
  });

  const hits = fuse.search(q);
  if (hits.length === 0) {
    return items.map(stripInternal);
  }

  return hits.map((h) => stripInternal(h.item));
}

/**
 * Full-text search across Prismic documents for the current locale.
 * Uses a single API request with `fulltext` on `document` (includes slice zone text),
 * then fuzzy re-ranks results with Fuse.js for softer matching within that set.
 */
export async function searchSite(
  rawQuery: string,
  lang: LocaleCode,
  options?: { pageSize?: number }
): Promise<SiteSearchResult[]> {
  const query = rawQuery.trim();
  if (query.length < 2) {
    return [];
  }

  const pageSize = Math.min(
    Math.max(options?.pageSize ?? MAX_SITE_SEARCH_RESULTS, 1),
    MAX_SITE_SEARCH_RESULTS
  );

  const client = createClient({
    fetchOptions: { cache: "no-store" },
  });

  const response = await client.get({
    filters: [
      filter.any("document.type", [...SEARCHABLE_DOCUMENT_TYPES]),
      filter.fulltext("document", query),
    ],
    pageSize,
    lang,
    orderings: [{ field: "document.last_publication_date", direction: "desc" }],
  });

  const internal = response.results.map((doc) => mapDocToInternal(doc, query));
  return rankWithFuse(query, internal);
}
