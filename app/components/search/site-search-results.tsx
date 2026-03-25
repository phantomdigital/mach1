import Link from "next/link";
import { HighlightedText } from "@/components/search/highlighted-text";
import { searchSite } from "@/lib/prismic-search";
import type { LocaleCode } from "@/prismicio";

type SiteSearchResultsProps = {
  locale: LocaleCode;
  query: string | undefined;
};

export async function SiteSearchResults({ locale, query }: SiteSearchResultsProps) {
  const q = query?.trim() ?? "";
  const results = q.length >= 2 ? await searchSite(q, locale) : [];

  return (
    <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8 py-12 pt-28 lg:pt-32">
      <h1 className="text-black text-3xl lg:text-4xl font-bold leading-tight mb-8">
        Search
      </h1>

      {!q || q.length < 2 ? (
        <p className="text-neutral-600 text-sm lg:text-base">
          Enter at least two characters to search.
        </p>
      ) : results.length === 0 ? (
        <p className="text-neutral-600 text-sm lg:text-base">
          No results for &ldquo;{q}&rdquo;.
        </p>
      ) : (
        <ul className="space-y-6">
          {results.map((item) => (
            <li key={item.id} className="border-b border-neutral-200 pb-6 last:border-0">
              {item.url ? (
                <Link
                  href={item.url}
                  className="text-lg font-semibold text-dark-blue hover:underline"
                >
                  <HighlightedText text={item.title} query={q} />
                </Link>
              ) : (
                <span className="text-lg font-semibold text-neutral-900">
                  <HighlightedText text={item.title} query={q} />
                </span>
              )}
              <p className="text-xs text-neutral-500 uppercase tracking-wide mt-1">
                {item.typeLabel}
              </p>
              {item.snippet.trim() ? (
                <p className="text-sm text-neutral-600 mt-2 leading-relaxed line-clamp-3">
                  <HighlightedText text={item.snippet} query={q} />
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
