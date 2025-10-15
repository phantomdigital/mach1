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

interface NewsFiltersProps {
  allArticles: Content.NewsDocument[];
  allArticlesForFilters: Content.NewsDocument[];
  enableLoadMore: boolean;
  initialCount: number;
}

export function NewsFilters({
  allArticles,
  allArticlesForFilters,
  enableLoadMore,
  initialCount,
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
            Sort by Category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Sort by Year
          </label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "All" ? "All Years" : year}
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
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-600 text-lg">
            No articles found for the selected filters.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button variant="hero" onClick={handleLoadMore}>
            LOAD MORE ARTICLES
          </Button>
        </div>
      )}
    </>
  );
}

