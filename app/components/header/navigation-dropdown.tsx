/**
 * NavigationDropdown Component
 * 
 * A sophisticated dropdown menu component for navigation items with the following features:
 * - Hover-controlled dropdown with smooth animations
 * - Dynamic width and height based on content
 * - Custom SVG backgrounds that preserve design integrity
 * - Support for dropdown images
 * - Proper TypeScript integration with Prismic CMS
 * 
 * @example
 * <NavigationDropdown 
 *   label="Services"
 *   dropdownItems={[{label: "Service 1", link: {...}}, ...]}
 *   dropdownImage={optionalImage}
 * />
 */

'use client';

import { useState, useRef, useEffect } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { ChevronDown } from "lucide-react";
import { DropdownBackground } from "./dropdown-background";
import { ExternalLinkIcon } from "./external-link-icon";
import { useDropdownState } from "./dropdown-state-context";
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
  // STATE & REFS
  // =================================================================
  
  const { openDropdown, closeDropdown, isDropdownOpen } = useDropdownState();
  const isOpen = isDropdownOpen(dropdownId);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number>(0);
  const [imageTransitionKey, setImageTransitionKey] = useState<number>(0);
  const previousImageRef = useRef<ImageField | undefined>(undefined); // Track previous image for crossfade
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // =================================================================
  // DYNAMIC SIZING CALCULATIONS
  // =================================================================
  
  // Check if any dropdown items have images
  const hasIndividualImages = dropdownItems.some(item => item.image && item.image.url);
  const hasDropdownImage = Boolean((dropdownImage && dropdownImage.url) || hasIndividualImages);

  // Height calculation - content-based with edge preservation
  const itemHeight = 55;           // Height per dropdown item (py-6 + content)
  const headerHeight = 48;         // Category header space (text + mb-6)
  const topPadding = 40;           // pt-10 = 40px
  const bottomPadding = hasDropdownImage ? 32 : 20; // Less padding for no-image dropdowns
  const edgeBuffer = hasDropdownImage ? 100 : 60; // Reduced edge space for no-image dropdowns
  
  const contentHeight = topPadding + headerHeight + (dropdownItems.length * itemHeight) + bottomPadding;
  const minHeight = contentHeight + edgeBuffer;
  // Allow natural scaling based on content, with minimal safety buffer for images
  const minImageHeight = hasDropdownImage ? 320 : 280;
  const dynamicHeight = Math.max(minHeight, minImageHeight);

  // Width calculation - text-based with proper constraints
  const calculateTextWidth = (text: string): number => {
    // More accurate calculation for Inter Tight Medium at 20px (1.25rem)
    const avgCharWidth = 12; // Increased from 12 to account for medium weight
    return text.length * avgCharWidth;
  };

  const calculateHeaderTextWidth = (text: string): number => {
    // Space Mono at 0.5rem (8px) - monospace so more predictable
    const avgCharWidth = 4; // Much smaller due to 0.5rem size
    return text.length * avgCharWidth;
  };

  // Find longest text content
  const displayTitle = dropdownTitle || label;
  const headerWidth = calculateHeaderTextWidth(String(displayTitle || ''));
  const maxItemWidth = dropdownItems.reduce((max, item) => {
    const itemWidth = calculateTextWidth(String(item.label || ''));
    return Math.max(max, itemWidth);
  }, 0);
  
  const longestTextWidth = Math.max(headerWidth, maxItemWidth);
  
  // Account for all padding and spacing
  // px-5 (40px) + pl-7 pr-20 (108px) + px-4 (32px) + icon + buffer = ~200px
  const horizontalPadding = 40 + 108 + 32 + 20; // 200px total
  const minContentWidth = longestTextWidth + horizontalPadding;
  
  // Add extra buffer for safety to prevent wrapping
  const safeContentWidth = minContentWidth * 1.02; // 3% buffer (minimal safety margin)
  
  // Get the current image to display (individual item image or fallback dropdown image)
  const getCurrentImage = () => {
    const hoveredItem = dropdownItems[hoveredItemIndex];
    if (hoveredItem && hoveredItem.image && hoveredItem.image.url) {
      return hoveredItem.image;
    }
    return dropdownImage;
  };
  
  // Width constraints
  const minWidth = hasDropdownImage ? 878 : 300;
  const maxWidth = hasDropdownImage ? 1000 : 800; // Increased max for no-image
  
  const dynamicWidth = Math.min(Math.max(safeContentWidth, minWidth), maxWidth);

  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  
  /**
   * Handles mouse enter - opens dropdown and resets to first item
   */
  const handleMouseEnter = (): void => {
    // Always clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Open this dropdown (will close others automatically)
    if (!isOpen) {
      setHoveredItemIndex(0); // Always start with first item
      previousImageRef.current = undefined; // Clear previous image for clean start
      setImageTransitionKey(prev => prev + 1);
    }
    openDropdown(dropdownId); // Always call this to ensure this dropdown stays open
  };

  /**
   * Handles mouse leave - delays closing with CSS transitions handling the animation
   */
  const handleMouseLeave = (): void => {
    timeoutRef.current = setTimeout(() => {
      // Only close this specific dropdown - won't close if another dropdown is now open
      closeDropdown(dropdownId);
      setHoveredItemIndex(0); // Reset for next time
    }, 150); // Slightly longer grace period
  };

  // =================================================================
  // EFFECTS & CLEANUP
  // =================================================================
  
  /**
   * Cleanup timeouts on component unmount to prevent memory leaks
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* =================================================================
          DROPDOWN TRIGGER BUTTON
          ================================================================= */}
      
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
          <span className="inline whitespace-nowrap">
            {label}
          </span>
          <ChevronDown 
            className={`ml-1 h-4 w-4 transition-transform duration-150 ease-out flex-shrink-0 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </span>
      </button>
      
      {/* =================================================================
          INVISIBLE HOVER BRIDGE
          ================================================================= */}
      
      {/* Maintains hover state across the visual gap between trigger and dropdown */}
      <div 
        className={`absolute top-full left-0 w-full h-2 bg-transparent z-40 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none hidden'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* =================================================================
          DROPDOWN CONTENT
          ================================================================= */}
      
      {/* Dropdown Content with CSS-only transitions */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 z-50 ${
          isOpen 
            ? 'pointer-events-auto' 
            : 'pointer-events-none hidden'
        }`}
        style={{ top: `${topOffset}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
          {/* SVG Background Container */}
          <div className="relative" style={{ height: `${dynamicHeight}px` }}>
            
            {/* Custom SVG Background */}
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
              
              {/* Vertical separator line - positioned relative to entire dropdown */}
              {(() => {
                // ========== DYNAMIC LINE BASED ON ACTUAL CONTENT ==========
                // Start position: identical for both variants
                const startY = 70;   // Same fixed position for both image and no-image
                
                // End position: go almost to the bottom of the SVG, leaving small margin
                const contentEndY = dynamicHeight - 18; // 25px from bottom edge
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
              
              {/* =================================================================
                  DROPDOWN NAVIGATION ITEMS
                  ================================================================= */}
              
              <div className="flex-1 px-5 pt-10 pb-8">
                
                {/* Category Header */}
                <h5 
                  className="font-medium text-gray-500 uppercase tracking-widest mb-2 pl-4" 
                  style={{ 
                    color: '#747474',
                    fontSize: '0.55rem'
                  }}
                >
                  {dropdownTitle || label}
                </h5>
                
                {/* Navigation Items List */}
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
                            // Store current image as previous before changing hover index
                            const currentItem = dropdownItems[hoveredItemIndex];
                            if (currentItem && currentItem.image && currentItem.image.url) {
                              previousImageRef.current = currentItem.image;
                            } else {
                              previousImageRef.current = dropdownImage;
                            }
                            
                            setHoveredItemIndex(dropdownIndex);
                            setImageTransitionKey(prev => prev + 1);
                          }
                        }, 50);
                      }}
                    >
                      
                      {/* Horizontal separator line - positioned relative to this nav item */}
                      {dropdownIndex < dropdownItems.length - 1 && (
                        <div 
                          className="absolute bottom-0 left-0 h-px bg-gray-200"
                          style={{ 
                            marginLeft: '-23px', // Align with vertical line
                            backgroundColor: '#DFDFDF',
                            // Dynamic width: stop before image area (519px) when present, or use text-based width
                            width: hasDropdownImage 
                              ? `${dynamicWidth - 519 - 40}px`  // Stop before 519px gray area + padding
                              : `${longestTextWidth + 60}px`     // Text width + padding for no-image
                          }} 
                        />
                      )}
                      
                      {/* Left hover bar - easy positioning controls with bottom-up animation */}
                      {(() => {
                        // ========== HOVER BAR POSITION CONTROLS ==========
                        const withImagePosition = -11.825;    // ← Adjust this number to move bar left/right when dropdown has image
                        const noImagePosition = -11.825;       // ← Adjust this number to move bar left/right when dropdown has no image
                        
                        return (
                          <div 
                            className="absolute bottom-0 w-0.5 bg-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100" 
                            style={{ 
                              left: `${hasDropdownImage ? withImagePosition : noImagePosition}px`,
                              height: '100%'
                            }} 
                          />
                        );
                      })()}
                      
                      {/* Navigation Link with prefetching */}
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
                            fontSize: '1.25rem',        // 20px
                            lineHeight: '100%',         // Tight line height
                            letterSpacing: '0%'         // No letter spacin
                          }}
                        >
                          <span>{dropdownItem.label}</span>
                          
                          {/* External link icon - appears on hover, positioned differently based on image presence */}
                          {hasDropdownImage ? (
                            // With image: icon appears next to text to avoid gray area
                            <ExternalLinkIcon 
                              className="w-[13px] h-[13px] opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 ml-2" 
                              color="currentColor"
                            />
                          ) : (
                            // Without image: icon appears on far right as before
                            <ExternalLinkIcon 
                              className="w-[13px] h-[13px] opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" 
                              color="currentColor"
                            />
                          )}
                        </div>
                      </NavigationItemWithPrefetch>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* =================================================================
                  OPTIONAL DROPDOWN IMAGE
                  ================================================================= */}
              
              {/* Image will be rendered inside the gray SVG for natural clipping */}
            </div>
          </div>
      </div>
    </div>
  );
}