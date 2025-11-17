import { memo } from 'react';
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import { NavigationDropdown } from "./navigation-dropdown";
import { HeaderButtons } from "./header-buttons";
import { ScrollDropdownCloser } from "./scroll-dropdown-closer";
import { RegionLanguageSelector } from "./region-language-selector";
import { MobileMenu } from "./mobile-menu";
import { HeaderHeightTracker } from "./header-height-tracker";
import { CompactHeader } from "./compact-header";
import { ExternalLinkIcon } from "./external-link-icon";
import { NavigationItemWithPrefetch } from "./navigation-item-with-prefetch";
import { LogoLink } from "./logo-link";
import type { HeaderDocument, HeaderDocumentDataNavigationItem } from "@/types.generated";

// Navigation items with hover prefetching
// Memoized to prevent unnecessary re-renders
const NavigationItem = memo(({ item, index }: { item: HeaderDocumentDataNavigationItem; index: number }) => {
  if (!item.has_dropdown || !item.dropdown_items || item.dropdown_items.length === 0) {
    // Simple navigation item without dropdown - with hover prefetch
    return (
      <NavigationItemWithPrefetch
        key={index}
        link={item.link}
        label={item.label}
        className="text-black font-semibold text-[1.25rem] px-5 inline-flex items-center group h-full"
      >
        <span className="border-b-2 border-transparent group-hover:border-dark-blue transition-all duration-300 inline-block py-1">
          {item.label}
        </span>
      </NavigationItemWithPrefetch>
    );
  }

  // Navigation item with dropdown - use client component
  return (
    <NavigationDropdown
      key={index}
      label={item.label}
      dropdownTitle={item.dropdown_title}
      dropdownItems={item.dropdown_items}
      dropdownImage={item.dropdown_image}
      dropdownId={`nav-${index}-${String(item.label || '').toLowerCase().replace(/\s+/g, '-')}`}
    />
  );
});

interface HeaderClientProps {
  header: HeaderDocument | null;
}

function HeaderClient({ header }: HeaderClientProps) {
  if (!header) {
    // Minimal loading/fallback header
    return (
      <header className="absolute top-0 left-0 z-50 w-full h-auto">
        <HeaderHeightTracker />
        <div className="w-full relative">
          <ScrollDropdownCloser />
          <div className="w-full bg-neutral-200">
            <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-3">
              <div className="hidden xl:grid xl:grid-cols-[auto_1fr] gap-8">
                <div className="flex items-center">
                  <LogoLink className="block">
                    <div className="font-bold tracking-tight text-black" style={{ fontSize: '36px' }}>
                      Logo
                    </div>
                  </LogoLink>
                </div>
                <div className="flex flex-col self-center gap-12">
                  <div className="flex items-center gap-6 justify-end">
                    <RegionLanguageSelector />
                  </div>
                </div>
              </div>
              <div className="flex xl:hidden items-center justify-between">
                <div className="flex items-center">
                  <LogoLink className="block">
                    <div className="font-bold tracking-tight text-black" style={{ fontSize: '24px' }}>
                      Logo
                    </div>
                  </LogoLink>
                </div>
                <MobileMenu navigation={[]} buttons={[]} subheaderItems={[]} />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Compact Header - Desktop Only */}
      <div className="hidden xl:block">
        <CompactHeader
          logo={header.data.logo}
          siteTitle={header.data.site_title}
          navigation={header.data.navigation}
          buttons={header.data.buttons}
        />
      </div>

      <header className="absolute top-0 left-0 z-50 w-full h-auto">
        <HeaderHeightTracker />
        
        {/* Announcement Bar */}
        {header.data.show_announcement && header.data.announcement_text && (
          <div className="w-full bg-dark-blue py-3 px-4">
            <div className="max-w-[88rem] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <p className="text-white text-xs sm:text-sm font-medium">
                {header.data.announcement_text}
              </p>
              {isFilled.link(header.data.announcement_link) && isFilled.keyText(header.data.announcement_link_text) && (
                <PrismicNextLink
                  field={header.data.announcement_link}
                  className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap group inline-flex items-center gap-1.5 transition-colors hover:text-gray-200"
                >
                  <span className="border-b border-transparent group-hover:border-white transition-all duration-300">
                    {header.data.announcement_link_text}
                  </span>
                  <ExternalLinkIcon 
                    className="w-[11px] h-[11px] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    color="currentColor"
                  />
                </PrismicNextLink>
              )}
            </div>
          </div>
        )}

        <div className="w-full relative">
          <ScrollDropdownCloser />
          <div className="w-full bg-neutral-100 border-b-3 border-neutral-200">
            <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-3">
              {/* Desktop Layout */}
              <div className="hidden xl:grid xl:grid-cols-[auto_1fr] gap-8">
                <div className="flex items-center">
                  <LogoLink className="block">
                    {header.data.logo.url ? (
                      <PrismicNextImage
                        field={header.data.logo}
                        className="w-auto object-contain"
                        style={{ 
                          height: '90px',
                          imageRendering: 'crisp-edges',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}
                      />
                    ) : header.data.site_title ? (
                      <div 
                        className="font-bold tracking-tight text-black"
                        style={{ 
                          fontSize: '36px',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility'
                        }}
                      >
                        {header.data.site_title}
                      </div>
                    ) : null}
                  </LogoLink>
                </div>

                <div className="flex flex-col self-center gap-5">
                  {header.data.show_subheader && (
                    <div className="flex items-center gap-6 justify-end border-b-2 border-gray-200 pb-3">
                      {header.data.subheader_items && header.data.subheader_items.length > 0 && (
                        header.data.subheader_items.map((item, index) => (
                          <NavigationItemWithPrefetch
                            key={index}
                            link={item.link}
                            label={item.label}
                            className="text-sm text-gray-700 hover:text-dark-blue hover:underline transition-colors"
                          />
                        ))
                      )}
                      <RegionLanguageSelector />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 xl:gap-8">
                    <div className="flex-1 flex justify-center">
                      <nav className="flex items-center gap-4 xl:gap-8">
                        {header.data.navigation && header.data.navigation.length > 0 && (
                          header.data.navigation.map((item: HeaderDocumentDataNavigationItem, index: number) => (
                            <NavigationItem key={index} item={item} index={index} />
                          ))
                        )}
                      </nav>
                    </div>
                    <div className="flex items-center">
                      {header.data.buttons && header.data.buttons.length > 0 && (
                        <HeaderButtons buttons={header.data.buttons} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="flex xl:hidden items-center justify-between">
                <div className="flex items-center">
                  <LogoLink className="block">
                    {header.data.logo.url ? (
                      <PrismicNextImage
                        field={header.data.logo}
                        className="w-auto object-contain"
                        style={{ 
                          height: '60px',
                          imageRendering: 'crisp-edges',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}
                      />
                    ) : header.data.site_title ? (
                      <div 
                        className="font-bold tracking-tight text-black"
                        style={{ 
                          fontSize: '24px',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility'
                        }}
                      >
                        {header.data.site_title}
                      </div>
                    ) : null}
                  </LogoLink>
                </div>
                <MobileMenu 
                  navigation={header.data.navigation} 
                  buttons={header.data.buttons}
                  subheaderItems={header.data.show_subheader ? header.data.subheader_items : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// Memoize to prevent unnecessary re-renders during locale transitions
export default memo(HeaderClient);
