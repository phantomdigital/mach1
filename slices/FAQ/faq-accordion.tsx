"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { PrismicRichText } from "@prismicio/react";
import type { Content } from "@prismicio/client";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FaqSearch from "./faq-search";
import Fuse from "fuse.js";

interface FaqAccordionProps {
  faqs: Content.FaqSliceDefaultItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Get unique categories from actual FAQ data
  const availableCategories = useMemo(() => {
    const categories: string[] = [];
    faqs.forEach(faq => {
      if (faq.category) {
        categories.push(faq.category as string);
      }
    });
    return Array.from(new Set(categories)).sort();
  }, [faqs]);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(faqs, {
      keys: [
        { name: 'question', weight: 0.7 },
        { name: 'answer.text', weight: 0.3 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.4, // Lower = more strict, higher = more fuzzy
      includeScore: true,
      includeMatches: true,
    });
  }, [faqs]);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    let results = faqs;

    // Apply fuzzy search if there's a query
    if (debouncedSearchQuery.trim()) {
      const searchResults = fuse.search(debouncedSearchQuery);
      results = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      results = results.filter(faq => faq.category === selectedCategory);
    }

    return results;
  }, [faqs, debouncedSearchQuery, selectedCategory, fuse]);

  // Group FAQs by category for display
  const groupedFaqs = useMemo(() => {
    if (selectedCategory !== "all") {
      return { [selectedCategory]: filteredFaqs };
    }

    const groups: Record<string, Content.FaqSliceDefaultItem[]> = {};
    filteredFaqs.forEach(faq => {
      const category = faq.category || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(faq);
    });
    return groups;
  }, [filteredFaqs, selectedCategory]);

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <FaqSearch
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={handleSearchChange}
        onCategoryChange={setSelectedCategory}
        resultCount={filteredFaqs.length}
        availableCategories={availableCategories}
        isSearching={isSearching}
      />

      {/* FAQ Accordion - Grouped by Category */}
      {Object.keys(groupedFaqs).length === 0 ? (
        <div className="text-center py-16 lg:py-24">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-neutral-800 text-lg lg:text-xl font-semibold mb-2">
              {debouncedSearchQuery.trim() ? "No results found" : "No FAQs available"}
            </h3>
            <p className="text-neutral-600 text-sm lg:text-base mb-4">
              {debouncedSearchQuery.trim() 
                ? `We couldn't find any FAQs matching "${debouncedSearchQuery}"`
                : selectedCategory !== "all" 
                  ? `No FAQs available in the "${selectedCategory}" category`
                  : "There are no FAQs to display at the moment"
              }
            </p>
            {debouncedSearchQuery.trim() && (
              <div className="space-y-2 text-sm text-neutral-500">
                <p>Try:</p>
                <ul className="text-center space-y-1">
                  <li>• Using different keywords</li>
                  <li>• Checking your spelling</li>
                  <li>• Using more general terms</li>
                  <li>• Selecting a different category</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12 lg:space-y-16">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category}>
              {/* Category Header - only show if viewing all categories */}
              {selectedCategory === "all" && (
                <div className="mb-6 lg:mb-8">
                  <Badge variant="green" className="text-sm">
                    {category}
                  </Badge>
                </div>
              )}

              {/* FAQs in this category using shadcn Accordion */}
              <Accordion type="single" collapsible className="w-full">
                {categoryFaqs.map((faq, index) => {
                  // Create unique ID for each FAQ
                  const faqId = `faq-${category}-${index}`;
                  
                  return (
                    <AccordionItem 
                      key={faqId} 
                      value={faqId}
                      className="border-b border-neutral-200 last:border-b-0"
                    >
                      <AccordionTrigger className="py-6 text-left hover:no-underline group">
                        <span className="text-neutral-800 group-hover:text-dark-blue text-base lg:text-lg font-semibold pr-4 transition-colors">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 pt-0">
                        <div className="text-neutral-600 text-base lg:text-lg prose max-w-none prose-p:leading-relaxed prose-strong:text-neutral-800 prose-strong:font-semibold prose-a:text-dark-blue prose-a:underline hover:prose-a:text-mach1-green">
                          <PrismicRichText field={faq.answer} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
