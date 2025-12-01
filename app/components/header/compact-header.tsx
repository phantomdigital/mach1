'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { NavigationDropdown } from "./navigation-dropdown";
import { HeaderButtons } from "./header-buttons";
import { ScrollDropdownCloser } from "./scroll-dropdown-closer";
import type { HeaderDocument, HeaderDocumentDataNavigationItem } from "@/types.generated";

interface CompactHeaderProps {
  logo: HeaderDocument["data"]["logo"];
  siteTitle: HeaderDocument["data"]["site_title"];
  navigation: HeaderDocument["data"]["navigation"];
  buttons: HeaderDocument["data"]["buttons"];
}

export function CompactHeader({ logo, siteTitle, navigation, buttons }: CompactHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    let ticking = false;
    
    // Threshold: show/hide at this exact scroll position (when main header is out of view)
    const SCROLL_THRESHOLD = 300;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show when scrolled past threshold, hide when scrolled back above it
          if (currentScrollY > SCROLL_THRESHOLD) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Set initial state on mount
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    // Set initial position based on visibility state (hidden by default)
    gsap.set(headerElement, {
      yPercent: -100, // Start hidden
      force3D: true,
    });
  }, []);

  // Handle GSAP animation with proper cleanup
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    // Kill any existing animation before starting a new one
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }

    // Set target position
    const targetY = isVisible ? 0 : -100; // -100% = completely hidden
    
    // Enable will-change for better performance during animation
    gsap.set(headerElement, {
      willChange: 'transform',
      force3D: true, // Force GPU acceleration
    });

    // Animate to target position
    animationRef.current = gsap.to(headerElement, {
      yPercent: targetY,
      duration: 0.3,
      ease: 'power2.out',
      force3D: true,
      onComplete: () => {
        // Remove will-change after animation completes to free up browser resources
        gsap.set(headerElement, { willChange: 'auto' });
        animationRef.current = null;
      },
    });

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      // Ensure will-change is removed on cleanup
      gsap.set(headerElement, { willChange: 'auto' });
    };
  }, [isVisible]);

  // Server component for simple navigation items
  const NavigationItem = ({ item, index }: { item: HeaderDocumentDataNavigationItem; index: number }) => {
    if (!item.has_dropdown || !item.dropdown_items || item.dropdown_items.length === 0) {
      // Simple navigation item without dropdown
      return (
        <PrismicNextLink
          key={index}
          field={item.link}
          className="text-black font-semibold text-[1.25rem] px-3 inline-flex items-center group h-full"
        >
          <span className="border-b-2 border-transparent group-hover:border-dark-blue transition-all duration-300 inline-block py-1">
            {item.label}
          </span>
        </PrismicNextLink>
      );
    }

    // Navigation item with dropdown - uses client component
    return (
      <NavigationDropdown
        key={index}
        label={item.label}
        dropdownTitle={item.dropdown_title}
        dropdownItems={item.dropdown_items}
        dropdownImage={item.dropdown_image}
        dropdownId={`compact-nav-${index}-${String(item.label || '').toLowerCase().replace(/\s+/g, '-')}`}
        topOffset={44}
      />
    );
  };

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-neutral-100 border-b-3 border-neutral-200 transform-gpu"
    >
      {/* Close dropdowns on scroll */}
      <ScrollDropdownCloser />
      
      <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Compact Logo */}
          <div className="flex items-center">
            <PrismicNextLink href="/" className="block">
              {logo.url ? (
                <img
                  src={logo.url}
                  alt={logo.alt || 'Logo'}
                  className="object-contain"
                  style={{ 
                    width: 'auto',
                    height: '60px'
                  }}
                />
              ) : siteTitle ? (
                <div 
                  className="font-bold tracking-tight text-black"
                  style={{ 
                    fontSize: '24px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {siteTitle}
                </div>
              ) : null}
            </PrismicNextLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 xl:gap-4">
              {navigation && navigation.length > 0 && (
                navigation.map((item: HeaderDocumentDataNavigationItem, index: number) => (
                  <NavigationItem key={index} item={item} index={index} />
                ))
              )}
            </div>
          </nav>

          {/* Buttons */}
          <div className="flex items-center">
            {buttons && buttons.length > 0 && (
              <HeaderButtons buttons={buttons} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

