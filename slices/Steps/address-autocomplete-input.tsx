"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";

interface AddressAutocompleteInputProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
  label: string;
  country?: string; // Optional country filter (e.g., 'AU', 'US', 'GB')
}

const COUNTRY_NAMES: Record<string, string> = {
  'AU': 'Australia',
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'NZ': 'New Zealand',
};

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  text: string;
}

export default function AddressAutocompleteInput({
  name,
  value,
  onChange,
  placeholder,
  required,
  label,
  country,
}: AddressAutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedFromSuggestions, setSelectedFromSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        console.error("Mapbox token not found");
        setIsLoading(false);
        return;
      }

      // Build URL with optional country filter
      const countryParam = country ? `&country=${country}` : '';
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${token}${countryParam}&limit=5&types=address,place,postcode`
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(name, newValue);
    setSelectedFromSuggestions(false); // Reset flag when manually typing

    // Debounce the API call
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    setInputValue(suggestion.place_name);
    onChange(name, suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedFromSuggestions(true); // Mark as selected from filtered suggestions
  };

  const handleClear = () => {
    setInputValue("");
    onChange(name, "");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedFromSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      <label className="block text-neutral-800 text-sm mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-2 flex items-center pointer-events-none">
          <MapPin className="w-4 h-4 text-neutral-400" />
        </div>
        
        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent border-b border-neutral-300 pb-2 pl-6 pr-6 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
          autoComplete="off"
        />

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-0 top-0 bottom-2 flex items-center text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-0 top-0 bottom-2 flex items-center">
            <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 shadow-lg overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-neutral-100 transition-colors flex items-start gap-3 border-b border-neutral-100 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-neutral-800 font-medium truncate">
                  {suggestion.text}
                </div>
                <div className="text-xs text-neutral-500 truncate">
                  {suggestion.place_name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Helper Text for Country Restriction */}
      {country && (
        <p className="mt-2 text-xs text-neutral-500">
          {!selectedFromSuggestions && inputValue ? (
            <span className="text-amber-600">
              ⚠️ Please select an address from the dropdown to ensure it's in {COUNTRY_NAMES[country] || country}
            </span>
          ) : (
            <span>
              Only {COUNTRY_NAMES[country] || country} addresses accepted. Select from suggestions.
            </span>
          )}
        </p>
      )}
    </div>
  );
}

