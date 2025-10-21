"use client";

import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Predefined categories matching model.json
const CATEGORIES = [
  "General",
  "International Shipping",
  "Air Freight",
  "Sea Freight",
  "Road Freight",
  "Customs & Compliance",
  "Pricing & Charges",
  "Vehicle Transport",
  "Warehousing",
] as const;

interface FaqSearchProps {
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  resultCount: number;
  availableCategories: string[];
  isSearching?: boolean;
}

const handleClearSearch = (onSearchChange: (query: string) => void) => {
  onSearchChange("");
};

export default function FaqSearch({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  resultCount,
  availableCategories,
  isSearching = false,
}: FaqSearchProps) {
  return (
    <div className="mb-12 lg:mb-16 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        {/* Search icon on the left */}
        <Search className="absolute left-0 top-0 w-5 h-5 text-neutral-400" />
        
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-10 text-base"
        />
        
        {/* Right side icons - loading spinner or clear button */}
        <div className="absolute right-0 top-0 flex items-center">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-dark-blue animate-spin" />
          ) : searchQuery.trim() ? (
            <button
              onClick={() => handleClearSearch(onSearchChange)}
              className="w-5 h-5 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Category Filter Pills */}
      {availableCategories.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange("all")}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-dark-blue text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              All
            </button>
            {CATEGORIES.filter(cat => availableCategories.includes(cat)).map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-dark-blue text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-neutral-600">
          Found <span className="font-semibold text-neutral-800">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  );
}

