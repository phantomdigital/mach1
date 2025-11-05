import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient, defaultLocale, type LocaleCode } from "@/prismicio";
import { isFilled } from "@prismicio/client";
import { headers } from "next/headers";
import { NavigationDropdown } from "./navigation-dropdown";
import { HeaderButtons } from "./header-buttons";
import { ScrollDropdownCloser } from "./scroll-dropdown-closer";
import { RegionLanguageSelector } from "./region-language-selector";
import { MobileMenu } from "./mobile-menu";
import { HeaderHeightTracker } from "./header-height-tracker";
import { CompactHeader } from "./compact-header";
import { ExternalLinkIcon } from "./external-link-icon";
import { getLocaleFromPathname } from "@/lib/locale-helpers";
import type { HeaderDocumentDataNavigationItem } from "@/types.generated";

// Server component for simple navigation items
const NavigationItem = ({ item, index }: { item: HeaderDocumentDataNavigationItem; index: number }) => {
  if (!item.has_dropdown || !item.dropdown_items || item.dropdown_items.length === 0) {
    // Simple navigation item without dropdown
    return (
      <PrismicNextLink
        key={index}
        field={item.link}
        className="text-black font-semibold text-[1.25rem] px-5 inline-flex items-center group h-full"
      >
        <span className="border-b-2 border-transparent group-hover:border-dark-blue transition-all duration-300 inline-block py-1">
          {item.label}
        </span>
      </PrismicNextLink>
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
};

interface HeaderProps {
  forcedLocale?: string;
}

export default async function Header({ forcedLocale }: HeaderProps = {}) {
  const client = createClient();
  
  // Get locale - use forced locale from client wrapper if provided, otherwise detect from headers
  let locale: LocaleCode = defaultLocale;
  
  if (forcedLocale) {
    // Use locale passed from client wrapper
    locale = forcedLocale as LocaleCode;
  } else {
    // Fallback to header detection (for SSR/initial load)
  try {
      const headersList = await headers();
      const pathname = headersList.get("x-pathname");
      if (pathname) {
        locale = getLocaleFromPathname(pathname);
      } else {
        const referer = headersList.get("referer");
        if (referer) {
          try {
            const url = new URL(referer);
            locale = getLocaleFromPathname(url.pathname);
          } catch {
            // Invalid URL, use default
          }
        }
      }
    } catch (error) {
      console.warn("Could not detect locale from headers:", error);
      locale = defaultLocale;
    }
  }
  
  // Try to fetch header in the detected locale, fallback to default locale if not found
  let header;
  try {
    // Fetch header with no cache to ensure it updates when locale changes
    header = await client.getSingle("header", { 
      lang: locale,
      fetchOptions: { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    });
  } catch (error: unknown) {
    // If header doesn't exist in requested locale, fallback to default locale
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`Header not found in locale ${locale}, falling back to default locale. Error:`, errorMessage);
    try {
      header = await client.getSingle("header", { 
        lang: defaultLocale,
        fetchOptions: { 
          cache: 'no-store',
          next: { revalidate: 0 }
        }
      });
    } catch (fallbackError) {
      console.error("Header not found in any locale:", fallbackError);
      // Will fall through to the catch block below
      throw fallbackError;
    }
  }
  
  if (header) {
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
          {/* Track header height dynamically for mobile menu positioning */}
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
          
          {/* White background - full width */}
          <div className="w-full bg-neutral-100 border-b-3 border-neutral-200">
              
              {/* Content container with max-width and padding */}
              <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-3">
                {/* Desktop Layout: Grid with Logo and Navigation */}
                <div className="hidden xl:grid xl:grid-cols-[auto_1fr] gap-8">
                  
                  {/* Left Column: Logo (spans full height) */}
                  <div className="flex items-center">
                    <PrismicNextLink href="/" className="block">
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
                    </PrismicNextLink>
                  </div>

                  {/* Right Column: Sub-header & Main Navigation stacked */}
                  <div className="flex flex-col self-center gap-5">
                    
                    {/* Top: Sub-Header / Utility Bar */}
                    {header.data.show_subheader && (
                      <div className="flex items-center gap-6 justify-end border-b-2 border-gray-200 pb-3">
                        {/* Sub-header links */}
                        {header.data.subheader_items && header.data.subheader_items.length > 0 && (
                          header.data.subheader_items.map((item, index) => (
                            <PrismicNextLink
                              key={index}
                              field={item.link}
                              className="text-sm text-gray-700 hover:text-dark-blue hover:underline transition-colors"
                            >
                              {item.label}
                            </PrismicNextLink>
                          ))
                        )}
                        
                        {/* Location Selector */}
                        <RegionLanguageSelector />
                      </div>
                    )}

                    {/* Bottom: Main Navigation & Buttons */}
                    <div className="flex items-center justify-between gap-4 xl:gap-8">
                      {/* Centered Navigation */}
                      <div className="flex-1 flex justify-center">
                        <nav className="flex items-center gap-4 xl:gap-8">
                          {header.data.navigation && header.data.navigation.length > 0 && (
                            header.data.navigation.map((item: HeaderDocumentDataNavigationItem, index: number) => (
                              <NavigationItem key={index} item={item} index={index} />
                            ))
                          )}
                        </nav>
                      </div>

                      {/* Right-aligned Buttons */}
                      <div className="flex items-center">
                        {header.data.buttons && header.data.buttons.length > 0 && (
                          <HeaderButtons buttons={header.data.buttons} />
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Mobile Layout: Simplified header with logo and menu */}
                <div className="flex xl:hidden items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center">
                    <PrismicNextLink href="/" className="block">
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
                    </PrismicNextLink>
                  </div>

                  {/* Mobile Menu */}
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
  
  // If we get here, header wasn't found in any locale
    console.warn("No header document found in Prismic");
    // Return minimal fallback header - no content, just structure
    return (
      <header className="absolute top-0 left-0 z-50 w-full h-auto">
        {/* Track header height dynamically for mobile menu positioning */}
        <HeaderHeightTracker />
        
        {/* No announcement bar in fallback */}

        <div className="w-full relative">
          <ScrollDropdownCloser />
            
            {/* White background - full width */}
            <div className="w-full bg-neutral-200">
              
              {/* Content container with max-width and padding */}
              <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-3">
                {/* Desktop Layout: Grid with Logo and Navigation */}
                <div className="hidden xl:grid xl:grid-cols-[auto_1fr] gap-8">
                  
                  {/* Left Column: Logo Placeholder (spans full height) */}
                  <div className="flex items-center">
                    <PrismicNextLink href="/" className="block">
                      <div 
                        className="font-bold tracking-tight text-black"
                        style={{ 
                          fontSize: '36px',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility'
                        }}
                      >
                        Logo
                      </div>
                    </PrismicNextLink>
                  </div>

                  {/* Right Column: Sub-header & Main Navigation stacked */}
                  <div className="flex flex-col self-center gap-12">
                    
                    {/* Top: Sub-Header / Utility Bar */}
                    <div className="flex items-center gap-6 justify-end">
                      <span className="text-sm text-gray-500">No utility links configured</span>
                      
                      {/* Location Selector */}
                      <RegionLanguageSelector />
                    </div>

                    {/* Bottom: Main Navigation & Buttons Placeholder */}
                    <div className="flex items-center justify-between gap-8">
                      {/* Centered Navigation Placeholder */}
                      <div className="flex-1 flex justify-center">
                        <nav className="flex items-center">
                          <span className="text-black/50 font-medium text-sm tracking-widest px-5">
                            No navigation configured
                          </span>
                        </nav>
                      </div>

                      {/* Right-aligned Buttons Placeholder */}
                      <div className="flex items-center">
                        <span className="text-black/50 font-medium text-sm tracking-widest">
                          No buttons configured
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Mobile Layout: Simplified header with logo */}
                <div className="flex xl:hidden items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center">
                    <PrismicNextLink href="/" className="block">
                      <div 
                        className="font-bold tracking-tight text-black"
                        style={{ 
                          fontSize: '24px',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility'
                        }}
                      >
                        Logo
                      </div>
                    </PrismicNextLink>
                  </div>

                  {/* Mobile Menu - Fallback with empty data */}
                  <MobileMenu 
                    navigation={[]}
                    buttons={[]}
                    subheaderItems={[]}
                  />
                </div>
              </div>
            </div>
        </div>
      </header>
    );
}
