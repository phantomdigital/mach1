"use client";

import { useState, useMemo } from "react";
import type { Content } from "@prismicio/client";
import { NewsCard } from "./news-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LocaleCode } from "@/prismicio";
import { localizedChrome, localizedNewsLabel } from "@/lib/localized-routes";

interface NewsFiltersProps {
  allArticles: Content.NewsDocument[];
  allArticlesForFilters: Content.NewsDocument[];
  enableLoadMore: boolean;
  initialCount: number;
  locale: LocaleCode;
}

export function NewsFilters({
  allArticles,
  allArticlesForFilters,
  enableLoadMore,
  initialCount,
  locale,
}: NewsFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [displayCount, setDisplayCount] = useState(initialCount);

  // Get unique categories and years from ALL articles (including featured)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allArticlesForFilters.forEach((article) => {
      if (article.data.category) cats.add(article.data.category);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [allArticlesForFilters]);

  const years = useMemo(() => {
    const yrs = new Set<string>();
    allArticlesForFilters.forEach((article) => {
      if (article.first_publication_date) {
        const year = new Date(article.first_publication_date).getFullYear().toString();
        yrs.add(year);
      }
    });
    return ["All", ...Array.from(yrs).sort().reverse()];
  }, [allArticlesForFilters]);

  // Filter articles based on selections
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // Category filter
      if (selectedCategory !== "All" && article.data.category !== selectedCategory) {
        return false;
      }

      // Year filter
      if (selectedYear !== "All" && article.first_publication_date) {
        const articleYear = new Date(article.first_publication_date).getFullYear().toString();
        if (articleYear !== selectedYear) {
          return false;
        }
      }

      return true;
    });
  }, [allArticles, selectedCategory, selectedYear]);

  // Articles to display (for load more functionality)
  const displayedArticles = enableLoadMore
    ? filteredArticles.slice(0, displayCount)
    : filteredArticles;

  const hasMore = enableLoadMore && displayCount < filteredArticles.length;

  const handleLoadMore = () => {
    setDisplayCount(displayCount + initialCount);
  };

  return (
    <>
      {/* Filter Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-12">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {localizedChrome(locale, "Sort by Category", "按类别筛选", "श्रेणी से छाँटें")}
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder={localizedChrome(locale, "All Categories", "所有类别", "सभी श्रेणियाँ")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "All"
                    ? localizedChrome(locale, "All Categories", "所有类别", "सभी श्रेणियाँ")
                    : localizedNewsLabel(category, locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {localizedChrome(locale, "Sort by Year", "按年份筛选", "वर्ष से छाँटें")}
          </label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder={localizedChrome(locale, "All Years", "所有年份", "सभी वर्ष")} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "All" ? localizedChrome(locale, "All Years", "所有年份", "सभी वर्ष") : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Grid */}
      {displayedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {displayedArticles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-600 text-lg">
            {localizedChrome(locale, "No articles found for the selected filters.", "未找到符合筛选条件的文章。", "चयनित फ़िल्टर के लिए कोई लेख नहीं मिला।")}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button variant="hero" onClick={handleLoadMore}>
            {localizedChrome(locale, "LOAD MORE ARTICLES", "加载更多文章", "और लेख लोड करें")}
          </Button>
        </div>
      )}
    </>
  );
}

