import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { NavigationDropdown } from "./navigation-dropdown";
import { HeaderButtons } from "./header-buttons";
import { DropdownStateProvider } from "./dropdown-state-context";
import { ScrollDropdownCloser } from "./scroll-dropdown-closer";
import type { HeaderDocumentDataNavigationItem } from "@/types.generated";

// Server component for simple navigation items
const NavigationItem = ({ item, index }: { item: HeaderDocumentDataNavigationItem; index: number }) => {
  if (!item.has_dropdown || !item.dropdown_items || item.dropdown_items.length === 0) {
    // Simple navigation item without dropdown
    return (
      <PrismicNextLink
        key={index}
        field={item.link}
        className="text-black rounded-sm hover:bg-white/10 font-medium text-sm uppercase px-3 py-2 rounded-base transition-colors duration-300"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {item.label}
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

export default async function Header() {
  const client = createClient();
  
  try {
    const header = await client.getSingle("header");
    
    return (
      <header className="fixed top-0 left-0 z-20 w-full h-auto bg-white/80 backdrop-blur-md border-b border-black/10 supports-[backdrop-filter]:bg-white/60">
          <div className="w-full px-4 lg:px-8 relative">

          <div className="relative min-h-[80px] lg:min-h-[80px] pt-2 max-w-[112rem] mx-auto">
            <DropdownStateProvider>
              <ScrollDropdownCloser />
              
              {/* Left-aligned Navigation */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <nav className="hidden lg:flex items-center space-x-8">
                  {header.data.navigation && header.data.navigation.length > 0 && (
                    header.data.navigation.map((item: HeaderDocumentDataNavigationItem, index: number) => (
                      <NavigationItem key={index} item={item} index={index} />
                    ))
                  )}
                </nav>
              </div>

              {/* Centered Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
                    fontSize: '28px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {header.data.site_title}
                </div>
                ) : null}
              </div>

              {/* Right-aligned Buttons */}
              <div className="absolute top-1/2 right-0 flex items-center space-x-3 -translate-y-1/2">
                {header.data.buttons && header.data.buttons.length > 0 && (
                  <HeaderButtons buttons={header.data.buttons} />
                )}

                {/* Mobile Menu Button */}
                <button className="lg:hidden flex items-center justify-center w-10 h-10 text-black">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </DropdownStateProvider>
          </div>
        </div>
      </header>
    );
  } catch {
    console.warn("No header document found in Prismic");
    // Return minimal fallback header - no content, just structure
    return (
      <header className="fixed top-0 left-0 z-20 w-full h-auto bg-white/90 backdrop-blur-md border-b border-black/10 supports-[backdrop-filter]:bg-white/60">
        <div className="w-full px-4 lg:px-8 relative">

          <div className="relative min-h-[80px] lg:min-h-[90px] pt-2 max-w-[112rem] mx-auto">
            <DropdownStateProvider>
              <ScrollDropdownCloser />
              
              {/* Left-aligned Navigation Placeholder */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <nav className="hidden lg:flex items-center space-x-8">
                  <span className="text-black/50 font-medium text-sm uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    No navigation configured
                  </span>
                </nav>
              </div>

              {/* Centered Logo Placeholder */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div 
                  className="font-bold tracking-tight text-black"
                  style={{ 
                    fontSize: '28px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  Logo
                </div>
              </div>

              {/* Right-aligned Buttons Placeholder */}
              <div className="absolute top-1/2 right-0 flex items-center space-x-3 -translate-y-1/2">
                <span className="text-black/50 font-medium text-sm uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  No buttons configured
                </span>

                {/* Mobile Menu Button */}
                <button className="lg:hidden flex items-center justify-center w-10 h-10 text-black">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </DropdownStateProvider>
          </div>
        </div>
      </header>
    );
  }
}
