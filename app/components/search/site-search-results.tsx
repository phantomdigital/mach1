"use client";

import { useState, useMemo, FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HighlightedText } from "@/components/search/highlighted-text";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import { Input } from "@/components/ui/input";
import type { SiteSearchResult } from "@/lib/prismic-search";
import { addLocaleToPathname, getLocaleFromPathname } from "@/lib/locale-helpers";

type SiteSearchResultsProps = {
  initialQuery: string;
  results: SiteSearchResult[];
};

export function SiteSearchResults({ initialQuery, results }: SiteSearchResultsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      const locale = getLocaleFromPathname(pathname);
      const searchPath = addLocaleToPathname("/search", locale);
      router.push(`${searchPath}?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const typeCounts = useMemo(() => {
    const counts: Record<string, { count: number; label: string }> = {};
    for (const r of results) {
      if (!counts[r.type]) {
        counts[r.type] = { count: 0, label: r.typeLabel };
      }
      counts[r.type].count++;
    }
    return counts;
  }, [results]);

  const filteredResults = useMemo(() => {
    return activeType ? results.filter((r) => r.type === activeType) : results;
  }, [results, activeType]);

  const typeKeys = Object.keys(typeCounts);
  const hasResults = results.length > 0;
  const hasQuery = initialQuery.length >= 2;
  const showFilterColumn = hasQuery && hasResults;

  const searchForm = (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="search-input"
        className="mb-2 block text-sm font-medium text-neutral-900"
      >
        Search
      </label>
      <Input
        id="search-input"
        type="search"
        inputMode="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages, solutions, news..."
        className="w-full"
        autoComplete="off"
        enterKeyHint="search"
      />
      {hasQuery && (
        <p className="mt-3 text-xs text-neutral-400">
          {results.length} {results.length === 1 ? "result" : "results"}
          {initialQuery && ` for "${initialQuery}"`}
        </p>
      )}
    </form>
  );

  /** Grey block: input row only (no duplicate “Search” heading/label) */
  const greySearchSection = (
    <div
      className={`border-b border-neutral-200 bg-white px-4 py-8 lg:py-10 lg:pr-6 ${
        showFilterColumn ? "lg:pl-0" : "lg:pl-6"
      }`}
    >
      {showFilterColumn ? <div className="lg:pl-6">{searchForm}</div> : searchForm}
    </div>
  );

  const filterAside = showFilterColumn && (
    <aside
      className="order-2 -mx-4 w-[calc(100%+2rem)] max-w-none px-4 pb-6 pt-6 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:mx-0 lg:w-auto lg:shrink-0 lg:px-6 lg:py-5"
      style={{ backgroundColor: "#F0FCFB" }}
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
        Filter by type
      </p>
      <nav className="flex flex-wrap gap-2 lg:flex-col">
        <button
          type="button"
          onClick={() => setActiveType(null)}
          className="rounded-none px-1 py-2 text-left text-sm transition-colors"
        >
          <span
            className={`underline-offset-4 ${
              activeType === null
                ? "font-semibold text-dark-blue underline decoration-2 decoration-dark-blue"
                : "text-neutral-700 no-underline hover:text-dark-blue"
            }`}
          >
            All
          </span>
          <span className="ml-1.5 tabular-nums text-neutral-400 no-underline">
            ({results.length})
          </span>
        </button>
        {typeKeys.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveType(type)}
            className="rounded-none px-1 py-2 text-left text-sm transition-colors"
          >
            <span
              className={`underline-offset-4 ${
                activeType === type
                  ? "font-semibold text-dark-blue underline decoration-2 decoration-dark-blue"
                  : "text-neutral-700 no-underline hover:text-dark-blue"
              }`}
            >
              {typeCounts[type].label}
            </span>
            <span className="ml-1.5 tabular-nums text-neutral-400 no-underline">
              ({typeCounts[type].count})
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="w-full" style={{ minHeight: "calc(100vh - var(--header-height, 128px))" }}>
      <div
        className="mx-auto w-full max-w-[80rem] px-4 lg:px-8"
        style={{ paddingTop: "var(--header-height, 128px)", minHeight: "100vh" }}
      >
        <div
          className={
            showFilterColumn
              ? "flex flex-col lg:grid lg:grid-cols-[280px_1fr] lg:grid-rows-[auto_1fr] min-h-full"
              : ""
          }
          style={showFilterColumn ? { minHeight: "calc(100vh - var(--header-height, 128px))" } : undefined}
        >
          {/* Grey search section - order-1 on mobile, col-2 row-1 on desktop */}
          <div
            className={`${showFilterColumn ? "order-1 lg:order-none lg:col-start-2 lg:row-start-1" : ""}`}
          >
            {greySearchSection}
          </div>

          {/* Filter - order-2 on mobile (between grey search and results), col-1 spanning both rows on desktop */}
          {filterAside}

          {/* Results - order-3 on mobile, col-2 row-2 on desktop */}
          <div
            className={`${showFilterColumn ? "order-3 lg:order-none lg:col-start-2 lg:row-start-2" : ""}`}
          >
            <div className="space-y-8 pb-10 pt-8 pl-4 lg:pb-14 lg:pl-6">
              {!hasQuery && (
                <p className="text-sm text-neutral-600 lg:text-base">
                  Enter at least two characters to search.
                </p>
              )}

              {hasQuery && !hasResults && (
                <div className="py-8 text-center lg:py-12">
                  <p className="mb-2 text-lg font-medium text-neutral-800">
                    No results found
                  </p>
                  <p className="text-sm text-neutral-500">
                    Try adjusting your search terms or browse our{" "}
                    <Link href="/solutions" className="text-dark-blue hover:underline">
                      solutions
                    </Link>{" "}
                    and{" "}
                    <Link href="/news" className="text-dark-blue hover:underline">
                      news
                    </Link>
                    .
                  </p>
                </div>
              )}

              {hasQuery && hasResults && (
                <>
                  <div>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      <span className="no-underline">
                        {activeType ? typeCounts[activeType]?.label : "All results"}
                      </span>
                      <span className="ml-1.5 font-normal tabular-nums text-neutral-400 no-underline">
                        ({filteredResults.length})
                      </span>
                    </p>

                    <ul className="divide-y divide-neutral-200">
                      {filteredResults.map((item) => (
                        <li key={item.id} className="py-5">
                          {item.url ? (
                            <Link
                              href={item.url}
                              className="group flex items-start justify-between gap-4"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="block text-lg font-semibold text-neutral-900 underline-offset-2 transition-colors group-hover:text-dark-blue group-hover:underline">
                                  <HighlightedText text={item.title} query={initialQuery} />
                                </span>
                                <span className="mt-1 block text-xs uppercase tracking-wide text-neutral-400">
                                  {item.typeLabel}
                                </span>
                                {item.snippet.trim() && (
                                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                                    <HighlightedText text={item.snippet} query={initialQuery} />
                                  </p>
                                )}
                              </div>
                              <span className="mt-1 shrink-0 text-neutral-300 transition-colors group-hover:text-dark-blue">
                                <ExternalLinkIcon className="h-3 w-3" color="currentColor" />
                              </span>
                            </Link>
                          ) : (
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <span className="block text-lg font-semibold text-neutral-900">
                                  <HighlightedText text={item.title} query={initialQuery} />
                                </span>
                                <span className="mt-1 block text-xs uppercase tracking-wide text-neutral-400">
                                  {item.typeLabel}
                                </span>
                                {item.snippet.trim() && (
                                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                                    <HighlightedText text={item.snippet} query={initialQuery} />
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    {filteredResults.length === 0 && activeType && (
                      <p className="py-8 text-center text-sm text-neutral-500">
                        No {typeCounts[activeType]?.label.toLowerCase()} found for this search.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
