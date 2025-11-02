"use client";

import { useState, useEffect } from "react";
import { useScrollTo } from "@/hooks/use-lenis";
import { useCompactHeaderVisible } from "@/hooks/use-compact-header-visible";

interface LocationNavProps {
  locations: Array<{
    name: string;
    state: string;
    index: number;
  }>;
}

export function LocationsNav({ locations }: LocationNavProps) {
  // Track compact header visibility for desktop positioning
  const isCompactHeaderVisible = useCompactHeaderVisible();
  const [activeLocation, setActiveLocation] = useState<number>(0);
  const { scrollToElement, lenis } = useScrollTo();

  // Group locations by state
  const locationsByState = locations.reduce((acc, location) => {
    if (!acc[location.state]) {
      acc[location.state] = [];
    }
    acc[location.state].push(location);
    return acc;
  }, {} as Record<string, typeof locations>);

  // Track active location on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = locations.length - 1; i >= 0; i--) {
        const element = document.getElementById(`location-${i}`);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveLocation(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [locations.length]);

  const handleLocationClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.getElementById(`location-${index}`);
    
    if (element) {
      if (lenis) {
        // Use Lenis for smooth scroll
        lenis.scrollTo(element, {
          offset: -150,
          duration: 1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        // Fallback to native smooth scroll
        const offset = 150;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Compact header height when visible (desktop only)
  const compactHeaderHeight = 85; // py-3 + 50px logo + border ≈ 74px

  return (
    <div 
      className="sticky z-30 bg-white border-b border-neutral-200 shadow-sm transition-all duration-300"
      style={{
        // On desktop: position below compact header when visible
        // On mobile: always at top (compact header is hidden on mobile)
        top: isCompactHeaderVisible ? `${compactHeaderHeight}px` : '0px'
      }}
    >
      <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
        <div className="py-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 lg:gap-8 min-w-max">
            {Object.entries(locationsByState).map(([state, stateLocations]) => (
              <div key={state} className="flex items-center gap-4">
                {/* State Label */}
                <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                  {state}
                </span>
                
                {/* Location Links for this state */}
                <div className="flex gap-2">
                  {stateLocations.map((location) => (
                    <button
                      key={location.index}
                      onClick={(e) => handleLocationClick(location.index, e)}
                      type="button"
                      className={`
                        px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap
                        ${
                          activeLocation === location.index
                            ? "bg-neutral-800 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }
                      `}
                    >
                      {location.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

