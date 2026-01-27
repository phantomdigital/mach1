/**
 * NavigationDropdown Component
 * 
 * A sophisticated dropdown menu component for navigation items with the following features:
 * - Hover-controlled dropdown with smooth animations
 * - Zustand-powered state management for reliable behavior
 * - Dynamic width and height based on content
 * - Custom SVG backgrounds that preserve design integrity
 * - Support for dropdown images
 * - Shape-aware bounds checking for angled SVG corners
 * 
 * @example
 * <NavigationDropdown 
 *   label="Services"
 *   dropdownItems={[{label: "Service 1", link: {...}}, ...]}
 *   dropdownImage={optionalImage}
 * />
 */

'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownBackground } from "./dropdown-background";
import { ExternalLinkIcon } from "./external-link-icon";
import { useDropdownStore } from "./dropdown-store";
import { NavigationItemWithPrefetch } from "./navigation-item-with-prefetch";
import type { 
  HeaderDocumentDataNavigationItem,
  HeaderDocumentDataNavigationDropdownItemsItem 
} from "@/types.generated";
import type { KeyTextField, ImageField } from "@prismicio/client";


// =================================================================
// TYPES & INTERFACES
// =================================================================

interface NavigationDropdownProps {
  /** Navigation item label (from Prismic) */
  label: KeyTextField;
  /** Optional custom title for dropdown header */
  dropdownTitle?: KeyTextField;
  /** Array of dropdown menu items */
  dropdownItems: HeaderDocumentDataNavigationItem["dropdown_items"];
  /** Optional image to display in dropdown */
  dropdownImage?: ImageField;
  /** Unique identifier for this dropdown */
  dropdownId: string;
  /** Optional top offset for dropdown positioning (default: 38px) */
  topOffset?: number;
}

// =================================================================
// MAIN COMPONENT
// =================================================================

export function NavigationDropdown({ 
  label, 
  dropdownTitle,
  dropdownItems, 
  dropdownImage,
  dropdownId,
  topOffset = 38
}: NavigationDropdownProps) {
  
  // =================================================================
  // ZUSTAND STATE
  // =================================================================
  
  const { openDropdown, closeDropdown, isDropdownOpen, isInGracePeriod } = useDropdownStore();
  const isOpen = isDropdownOpen(dropdownId);
  
  // =================================================================
  // LOCAL STATE & REFS
  // =================================================================
  
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number>(0);
  const [imageTransitionKey, setImageTransitionKey] = useState<number>(0);
  const previousImageRef = useRef<ImageField | undefined>(undefined);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  
  // =================================================================
  // DYNAMIC SIZING CALCULATIONS (Memoized for performance)
  // =================================================================
  
  const { hasDropdownImage, dynamicHeight, dynamicWidth, longestTextWidth } = useMemo(() => {
    const hasIndividualImages = dropdownItems.some(item => item.image && item.image.url);
    const hasDropdownImage = Boolean((dropdownImage && dropdownImage.url) || hasIndividualImages);

    // Height calculation
    const itemHeight = 55;
    const headerHeight = 48;
    const topPadding = 40;
    const bottomPadding = hasDropdownImage ? 32 : 20;
    const edgeBuffer = hasDropdownImage ? 100 : 60;
    
    const contentHeight = topPadding + headerHeight + (dropdownItems.length * itemHeight) + bottomPadding;
    const minHeight = contentHeight + edgeBuffer;
    const minImageHeight = hasDropdownImage ? 320 : 280;
    const dynamicHeight = Math.max(minHeight, minImageHeight);

    // Width calculation
    const calculateTextWidth = (text: string): number => text.length * 12;
    const calculateHeaderTextWidth = (text: string): number => text.length * 4;

    const displayTitle = dropdownTitle || label;
    const headerWidth = calculateHeaderTextWidth(String(displayTitle || ''));
    const maxItemWidth = dropdownItems.reduce((max, item) => {
      return Math.max(max, calculateTextWidth(String(item.label || '')));
    }, 0);
    
    const longestTextWidth = Math.max(headerWidth, maxItemWidth);
    const horizontalPadding = 200;
    const minContentWidth = longestTextWidth + horizontalPadding;
    const safeContentWidth = minContentWidth * 1.02;
    
    const minWidth = hasDropdownImage ? 878 : 300;
    const maxWidth = hasDropdownImage ? 1000 : 800;
    const dynamicWidth = Math.min(Math.max(safeContentWidth, minWidth), maxWidth);

    return { hasDropdownImage, dynamicHeight, dynamicWidth, longestTextWidth };
  }, [dropdownItems, dropdownImage, dropdownTitle, label]);

  // Get current image to display
  const getCurrentImage = useCallback(() => {
    const hoveredItem = dropdownItems[hoveredItemIndex];
    if (hoveredItem?.image?.url) {
      return hoveredItem.image;
    }
    return dropdownImage;
  }, [dropdownItems, hoveredItemIndex, dropdownImage]);

  // =================================================================
  // SHAPE-AWARE BOUNDS CHECKING
  // =================================================================
  
  /**
   * Checks if a point is within the actual SVG shape (handles angled corners).
   */
  const isPointInDropdownShape = useCallback((
    clientX: number, 
    clientY: number,
    contentRect: DOMRect
  ): boolean => {
    const relX = clientX - contentRect.left;
    const relY = clientY - contentRect.top;
    
    // Basic bounds check
    if (relX < 0 || relX > dynamicWidth || relY < 0 || relY > dynamicHeight) {
      return false;
    }
    
    // Check the angled corner "dead zone" on top-right
    const angleStartX = dynamicWidth - 88;
    const angleStartY = 19;
    const angleEndY = 80;
    
    if (relX > angleStartX && relY < angleEndY) {
      const slope = (angleEndY - angleStartY) / (dynamicWidth - angleStartX);
      const lineYAtX = angleStartY + (relX - angleStartX) * slope;
      
      if (relY < lineYAtX) {
        return false;
      }
    }
    
    return true;
  }, [dynamicWidth, dynamicHeight]);

  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  
  const handleMouseEnter = useCallback((): void => {
    if (!isOpen) {
      setHoveredItemIndex(0);
      previousImageRef.current = undefined;
      setImageTransitionKey(prev => prev + 1);
    }
    openDropdown(dropdownId);
  }, [isOpen, dropdownId, openDropdown]);

  const handleMouseLeave = useCallback((): void => {
    // Zustand store handles grace period internally
    closeDropdown(dropdownId);
    setHoveredItemIndex(0);
  }, [dropdownId, closeDropdown]);

  // =================================================================
  // SHAPE-AWARE MOUSEMOVE EFFECT
  // =================================================================
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Skip during grace period to prevent immediate close
      if (isInGracePeriod()) return;
      
      const contentEl = dropdownContentRef.current;
      const wrapperEl = wrapperRef.current;
      
      if (!contentEl || !wrapperEl) return;
      
      const wrapperRect = wrapperEl.getBoundingClientRect();
      const contentRect = contentEl.getBoundingClientRect();
      
      // Check if within wrapper
      const inWrapper = (
        e.clientX >= wrapperRect.left &&
        e.clientX <= wrapperRect.right &&
        e.clientY >= wrapperRect.top &&
        e.clientY <= wrapperRect.bottom
      );
      
      if (!inWrapper) return; // Let onMouseLeave handle it
      
      // Check if over trigger (above dropdown content)
      if (e.clientY < contentRect.top) return;
      
      // Check if within actual SVG shape
      if (!isPointInDropdownShape(e.clientX, e.clientY, contentRect)) {
        closeDropdown(dropdownId);
        setHoveredItemIndex(0);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen, dropdownId, closeDropdown, isPointInDropdownShape, isInGracePeriod]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // =================================================================
  // RENDER
  // =================================================================
  
  return (
    <div 
      ref={wrapperRef}
      className="relative"
      data-dropdown-id={dropdownId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button 
        className="text-black font-semibold text-[1.25rem] px-5 h-full outline-none cursor-pointer bg-transparent inline-flex items-center"
      >
        <span 
          className={`
            flex items-center border-b-2 transition-all duration-150 ease-out py-1
            ${isOpen 
              ? 'border-dark-blue' 
              : 'border-transparent hover:border-dark-blue'
            }
          `}
        >
          <span className="inline whitespace-nowrap">{label}</span>
          <ChevronDown 
            className={`ml-1 h-4 w-4 transition-transform duration-150 ease-out flex-shrink-0 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </span>
      </button>
      
      {/* Dropdown Content */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 z-50 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none hidden'
        }`}
        style={{ 
          top: '100%',
          marginTop: `${topOffset}px`,
          paddingTop: '4px' // Small gap for hover bridge
        }}
      >
        <div 
          ref={dropdownContentRef}
          className="relative" 
          style={{ height: `${dynamicHeight}px` }}
        >
          {/* SVG Background */}
          <DropdownBackground 
            hasImage={hasDropdownImage}
            height={dynamicHeight}
            width={dynamicWidth}
            itemCount={dropdownItems.length}
            longestTextWidth={longestTextWidth}
            image={getCurrentImage()}
            previousImage={previousImageRef.current}
            imageKey={`${imageTransitionKey}`}
            dropdownId={dropdownId}
          />

          {/* Content Container */}
          <div 
            className="relative z-10 flex"
            style={{
              height: `${dynamicHeight}px`,
              width: `${dynamicWidth}px`
            }}
          >
            {/* Vertical separator line */}
            {(() => {
              const startY = 70;
              const contentEndY = dynamicHeight - 18;
              const lineHeight = contentEndY - startY;
              
              return (
                <div 
                  className="absolute w-px bg-gray-200" 
                  style={{ 
                    left: '37px',
                    top: `${startY}px`,
                    height: `${lineHeight}px`,
                    backgroundColor: '#DFDFDF' 
                  }} 
                />
              );
            })()}
            
            {/* Navigation Items */}
            <div className="flex-1 px-5 pt-10 pb-8">
              <h5 
                className="font-medium text-gray-500 uppercase tracking-widest mb-2 pl-4" 
                style={{ color: '#747474', fontSize: '0.55rem' }}
              >
                {dropdownTitle || label}
              </h5>
              
              <div className={`space-y-0 pl-7 relative pt-2 ${hasDropdownImage ? 'pr-8' : 'pr-20'}`}>
                {dropdownItems.map((dropdownItem: HeaderDocumentDataNavigationDropdownItemsItem, dropdownIndex: number) => (
                  <div 
                    key={dropdownIndex} 
                    className="relative group"
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      
                      hoverTimeoutRef.current = setTimeout(() => {
                        if (dropdownIndex !== hoveredItemIndex) {
                          const currentItem = dropdownItems[hoveredItemIndex];
                          previousImageRef.current = currentItem?.image?.url 
                            ? currentItem.image 
                            : dropdownImage;
                          
                          setHoveredItemIndex(dropdownIndex);
                          setImageTransitionKey(prev => prev + 1);
                        }
                      }, 50);
                    }}
                  >
                    {/* Horizontal separator */}
                    {dropdownIndex < dropdownItems.length - 1 && (
                      <div 
                        className="absolute bottom-0 left-0 h-px bg-gray-200"
                        style={{ 
                          marginLeft: '-23px',
                          backgroundColor: '#DFDFDF',
                          width: hasDropdownImage 
                            ? `${dynamicWidth - 519 - 40}px`
                            : `${longestTextWidth + 60}px`
                        }} 
                      />
                    )}
                    
                    {/* Left hover bar */}
                    <div 
                      className="absolute bottom-0 w-0.5 bg-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100" 
                      style={{ left: '-11.825px', height: '100%' }} 
                    />
                    
                    {/* Navigation Link */}
                    <NavigationItemWithPrefetch
                      link={dropdownItem.link}
                      label={dropdownItem.label}
                      className={`group/link flex items-center py-4 px-4 transition-colors duration-200 text-mach-gray hover:text-black ${hasDropdownImage ? 'justify-start' : 'justify-between'}`}
                    >
                      <div 
                        className={`flex items-center w-full ${hasDropdownImage ? 'justify-start' : 'justify-between'}`}
                        style={{
                          fontFamily: 'var(--font-inter-tight), sans-serif',
                          fontWeight: 500,
                          fontSize: '1.25rem',
                          lineHeight: '100%',
                          letterSpacing: '0%'
                        }}
                      >
                        <span>{dropdownItem.label}</span>
                        <ExternalLinkIcon 
                          className={`w-[13px] h-[13px] opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 ${hasDropdownImage ? 'ml-2' : ''}`}
                          color="currentColor"
                        />
                      </div>
                    </NavigationItemWithPrefetch>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
