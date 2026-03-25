'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HighlightedText } from "@/components/search/highlighted-text";
import { ExternalLinkIcon } from "./external-link-icon";
import { addLocaleToPathname, getLocaleFromPathname } from "@/lib/locale-helpers";

/** Matches SolutionsBase / hero chamfer: cut at bottom-right */
const DROPDOWN_CLIP =
  "polygon(0 0, 100% 0, 100% calc(100% - 2rem), calc(100% - 2.5rem) 100%, 0 100%)";

interface HeaderSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

type ApiSearchResult = {
  id: string;
  title: string;
  url: string | null;
  type: string;
  typeLabel: string;
  snippet: string;
};

const MAX_RESULTS = 5;

export function HeaderSearch({ isOpen, onClose }: HeaderSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollLockY = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock page scroll while search overlay is open (same idea as mobile menu)
  useEffect(() => {
    if (!isOpen) return;
    scrollLockY.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollLockY.current}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollLockY.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setLoading(false);
      setPending(false);
      setActiveType(null);
    }
  }, [isOpen]);

  // If user navigates via header/nav while search is open, close + reset search state.
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      if (isOpen) {
        onClose();
      }
    }
  }, [pathname, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setPending(false);
      setActiveType(null);
      return;
    }

    setPending(true);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPending(false);
      setLoading(true);
      setResults([]);
      try {
        const locale = getLocaleFromPathname(pathname);
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&lang=${encodeURIComponent(locale)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as { results?: ApiSearchResult[] };
        setResults(data.results ?? []);
        setActiveType(null);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      setPending(false);
      controller.abort();
    };
  }, [query, pathname, isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const locale = getLocaleFromPathname(pathname);
    const searchPath = addLocaleToPathname("/search", locale);
    router.push(`${searchPath}?q=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  const handleCloseButton = () => {
    if (query.length > 0) {
      setQuery("");
      setActiveType(null);
      inputRef.current?.focus({ preventScroll: true });
      return;
    }

    onClose();
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
    const base = activeType ? results.filter((r) => r.type === activeType) : results;
    return base.slice(0, MAX_RESULTS);
  }, [results, activeType]);

  const trimmed = query.trim();
  const showDropdown = isOpen && trimmed.length >= 2;
  const showEmpty = showDropdown && !pending && !loading && results.length === 0;
  const showResults = showDropdown && !loading && results.length > 0;
  const showBusy = showDropdown && (pending || loading);

  const typeKeys = Object.keys(typeCounts);

  const overlay =
    mounted &&
    isOpen &&
    createPortal(
      <button
        type="button"
        aria-label="Close search"
        className="fixed inset-0 z-40 cursor-pointer border-0 bg-black/45 p-0 transition-opacity duration-200"
        onClick={onClose}
      />,
      document.body
    );

  return (
    <>
      {overlay}
    <div
      className={`bg-neutral-100 transition-all duration-300 ease-out ${
        isOpen ? "overflow-visible opacity-100 pt-3 pb-0" : "max-h-0 overflow-hidden opacity-0 py-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <label htmlFor="header-search-input" className="sr-only">
            Search this site
          </label>
          <div className="relative z-40">
            <div className="relative">
              <Search className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                ref={inputRef}
                id="header-search-input"
                type="text"
                inputMode="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="py-3 pl-8 pr-10 text-base"
                autoComplete="off"
                aria-expanded={showDropdown}
                aria-controls="header-search-results"
                aria-autocomplete="list"
              />
              <button
                type="button"
                onClick={handleCloseButton}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label={query.length > 0 ? "Clear search" : "Close search"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {showDropdown && (
              <div
                id="header-search-results"
                role="listbox"
                aria-label="Search suggestions"
                className="absolute left-0 right-0 top-full z-40 mt-[15px] overflow-hidden border border-neutral-200 border-t-0 bg-neutral-100 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] rounded-none"
                style={{ clipPath: DROPDOWN_CLIP }}
              >
                {(showBusy || showEmpty || showResults) && (
                  <div className="grid min-h-[140px] grid-cols-1 lg:grid-cols-[180px_1fr]">
                    <div className="hidden lg:block border-r border-neutral-200 py-4 px-3">
                      <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Filter by
                      </p>
                      {showResults ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setActiveType(null)}
                            className={`w-full text-left px-2 py-1.5 rounded-none text-sm transition-colors ${
                              activeType === null
                                ? "bg-dark-blue/10 text-dark-blue font-medium"
                                : "text-neutral-700 hover:bg-neutral-200/60"
                            }`}
                          >
                            All
                            <span className="ml-1 text-neutral-400">({results.length})</span>
                          </button>
                          {typeKeys.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setActiveType(type)}
                              className={`w-full text-left px-2 py-1.5 rounded-none text-sm transition-colors ${
                                activeType === type
                                  ? "bg-dark-blue/10 text-dark-blue font-medium"
                                  : "text-neutral-700 hover:bg-neutral-200/60"
                              }`}
                            >
                              {typeCounts[type].label}
                              <span className="ml-1 text-neutral-400">({typeCounts[type].count})</span>
                            </button>
                          ))}
                        </>
                      ) : showBusy ? (
                        <div className="space-y-2 animate-pulse px-2">
                          <div className="h-4 rounded-none bg-neutral-200/80" />
                          <div className="h-4 w-4/5 rounded-none bg-neutral-200/60" />
                          <div className="h-4 w-3/5 rounded-none bg-neutral-200/60" />
                        </div>
                      ) : (
                        <p className="px-2 text-xs leading-relaxed text-neutral-400">
                          Refine your search or open the full results page below.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col py-3 px-2 lg:px-4">
                      <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        {showResults && activeType
                          ? typeCounts[activeType]?.label
                          : "Top results"}
                      </p>

                      {showBusy && (
                        <div className="flex flex-1 items-center gap-2 px-2 py-6 text-sm text-neutral-500">
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                          <span>Searching…</span>
                        </div>
                      )}

                      {showEmpty && (
                        <p className="px-2 py-4 text-sm leading-relaxed text-neutral-600">
                          No results for &ldquo;{trimmed}&rdquo;
                        </p>
                      )}

                      {showResults && (
                        <>
                          <ul>
                            {filteredResults.map((item) => (
                              <li key={item.id} role="option">
                                {item.url ? (
                                  <Link
                                    href={item.url}
                                    className="group flex items-start gap-3 rounded-none px-2 py-2 transition-colors hover:bg-neutral-200/50"
                                    onClick={() => onClose()}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="block truncate text-sm font-medium text-neutral-900 underline-offset-2 transition-colors group-hover:text-dark-blue group-hover:underline">
                                        <HighlightedText text={item.title} query={trimmed} />
                                      </span>
                                      <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-neutral-400">
                                        {item.typeLabel}
                                      </span>
                                      {item.snippet.trim() ? (
                                        <p className="mt-1 line-clamp-2 text-xs leading-snug text-neutral-500">
                                          <HighlightedText text={item.snippet} query={trimmed} />
                                        </p>
                                      ) : null}
                                    </div>
                                    <span className="mt-0.5 shrink-0 text-neutral-300 transition-colors group-hover:text-dark-blue">
                                      <ExternalLinkIcon
                                        className="w-2.5 h-2.5"
                                        color="currentColor"
                                      />
                                    </span>
                                  </Link>
                                ) : (
                                  <span className="block px-2 py-2 text-sm text-neutral-600">
                                    <HighlightedText text={item.title} query={trimmed} />
                                    <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-neutral-400">
                                      {item.typeLabel}
                                    </span>
                                    {item.snippet.trim() ? (
                                      <p className="mt-1 line-clamp-2 text-xs leading-snug text-neutral-500">
                                        <HighlightedText text={item.snippet} query={trimmed} />
                                      </p>
                                    ) : null}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>

                          {results.length > MAX_RESULTS && !activeType && (
                            <p className="mt-2 px-2 text-xs text-neutral-400">
                              +{results.length - MAX_RESULTS} more results
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer — left-aligned to stay clear of bottom-right chamfer */}
                {!pending && !loading && (
                  <div className="border-t border-neutral-200 bg-neutral-100 px-4 py-3 pr-16 sm:pr-20">
                    <div className="flex flex-col items-start gap-1">
                      <Button
                        type="submit"
                        variant="subtle"
                        className="group !px-0 !no-underline hover:!underline w-auto justify-start"
                      >
                        <span className="inline-flex items-center gap-1.5 text-neutral-800">
                          <span>View all</span>
                          <ExternalLinkIcon
                            className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            color="currentColor"
                          />
                        </span>
                      </Button>
                      <span className="text-xs text-neutral-500">
                        Press Enter to see all results
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
