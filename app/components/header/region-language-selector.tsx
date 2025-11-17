'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe, Loader2 } from 'lucide-react';
import { locales, defaultLocale, type LocaleCode } from '@/prismicio';

// Group locales by category
const groupedLocales = {
  english: locales.filter(l => l.code.startsWith('en-')) as readonly typeof locales[number][],
  asiaPacific: locales.filter(l => ['zh-cn', 'zh-tw', 'ja', 'ko', 'vi', 'th', 'id', 'hi-in'].includes(l.code)) as readonly typeof locales[number][],
  europe: locales.filter(l => ['es', 'fr', 'de'].includes(l.code)) as readonly typeof locales[number][],
};

export function RegionLanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract current locale from pathname (memoized for performance)
  const currentLocale = useMemo((): LocaleCode => {
    const pathParts = pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    const locale = locales.find(l => l.code === firstPart);
    return locale ? locale.code : defaultLocale;
  }, [pathname]);
  
  const currentLocaleData = useMemo(() => {
    return locales.find(l => l.code === currentLocale) || locales[0];
  }, [currentLocale]);
  
  // Start with only current locale - will update when API responds with available translations
  const [availableLocales, setAvailableLocales] = useState<LocaleCode[]>([currentLocale]);
  const [isLoadingLocales, setIsLoadingLocales] = useState(true);
  
  // Format display name - show just "English" for default locale
  const getDisplayName = (localeData: typeof currentLocaleData) => {
    if (localeData.code === defaultLocale) {
      return 'English';
    }
    return localeData.name;
  };

  const handleLocaleChange = (newLocaleCode: LocaleCode) => {
    // Remove current locale from pathname
    const pathParts = pathname.split('/').filter(Boolean);
    const isLocaleInPath = locales.some(l => l.code === pathParts[0]);
    
    let newPath: string;
    if (isLocaleInPath) {
      // Replace current locale
      pathParts[0] = newLocaleCode === defaultLocale ? '' : newLocaleCode;
      newPath = '/' + pathParts.filter(Boolean).join('/');
    } else {
      // Add locale if not default
      newPath = newLocaleCode === defaultLocale ? pathname : `/${newLocaleCode}${pathname}`;
    }

    // Navigate to new path
    router.push(newPath || '/');
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  // Fetch available translations for current page
  useEffect(() => {
    const fetchAvailableLocales = async () => {
      setIsLoadingLocales(true);
      
      try {
        // Extract page info from pathname
        const pathParts = pathname.split('/').filter(Boolean);
        const detectedLocale = pathParts[0] && locales.find(l => l.code === pathParts[0]);
        const currentLocale: LocaleCode = detectedLocale ? (detectedLocale.code as LocaleCode) : defaultLocale;
        
        // Determine document type and UID from pathname
        let docType: string | null = null;
        let uid: string | null = null;
        
        // Handle homepage
        if (pathname === '/' || (pathParts.length === 1 && locales.find(l => l.code === pathParts[0]))) {
          docType = 'home';
          uid = null;
        } else {
          // Handle different route patterns
          const pathWithoutLocale = currentLocale !== defaultLocale 
            ? pathParts.slice(1).join('/')
            : pathParts.join('/');
          
          // Check for known route prefixes
          if (pathWithoutLocale.startsWith('solutions/')) {
            docType = 'solution';
            uid = pathWithoutLocale.replace('solutions/', '');
          } else if (pathWithoutLocale.startsWith('specialties/')) {
            docType = 'specialty';
            uid = pathWithoutLocale.replace('specialties/', '');
          } else if (pathWithoutLocale.startsWith('news/')) {
            docType = 'news';
            uid = pathWithoutLocale.replace('news/', '');
          } else if (pathWithoutLocale.startsWith('job/')) {
            docType = 'job';
            uid = pathWithoutLocale.replace('job/', '');
          } else if (pathWithoutLocale.startsWith('careers/')) {
            // Careers pages might be pages or a special route
            docType = 'page';
            uid = pathWithoutLocale;
          } else if (pathWithoutLocale.startsWith('quote/')) {
            // Handle quote pages - check if it's quote/summary
            if (pathWithoutLocale === 'quote/summary') {
              // Check for available translations of the quote page
              docType = 'page';
              uid = 'quote';
            } else {
              // Other quote pages (like quote?step=1) - show all locales
              setAvailableLocales([currentLocale, defaultLocale]);
              setIsLoadingLocales(false);
              return;
            }
          } else {
            // Default to page type
            docType = 'page';
            uid = pathWithoutLocale;
          }
        }
        
        if (!docType) {
          // If we can't determine type, only show current locale
          setAvailableLocales([currentLocale]);
          setIsLoadingLocales(false);
          return;
        }
        
        // Fetch document to get alternate languages
        const response = await fetch(`/api/available-locales?type=${docType}${uid ? `&uid=${uid}` : ''}&lang=${currentLocale}`);
        if (response.ok) {
          const data = await response.json();
          // Always include current locale, add any available alternates
          const available = new Set([currentLocale, ...(data.availableLocales || [])]);
          setAvailableLocales(Array.from(available) as LocaleCode[]);
        } else {
          // If API fails, only show current locale (page might not exist in other languages)
          setAvailableLocales([currentLocale]);
        }
      } catch (error) {
        console.warn('Failed to fetch available locales:', error);
        // On error, only show current locale
        const pathParts = pathname.split('/').filter(Boolean);
        const detectedLocale = pathParts[0] && locales.find(l => l.code === pathParts[0]);
        const currentLocale: LocaleCode = detectedLocale ? (detectedLocale.code as LocaleCode) : defaultLocale;
        setAvailableLocales([currentLocale]);
      } finally {
        setIsLoadingLocales(false);
      }
    };
    
    fetchAvailableLocales();
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Filter locales to only show available translations
  const filterAvailableLocales = (localeList: readonly typeof locales[number][]) => {
    return localeList.filter(locale => availableLocales.includes(locale.code));
  };
  
  const filteredGroupedLocales = {
    english: filterAvailableLocales(groupedLocales.english),
    asiaPacific: filterAvailableLocales(groupedLocales.asiaPacific),
    europe: filterAvailableLocales(groupedLocales.europe),
  };

  const dropdownWidth = 280;

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button 
        className="text-sm text-gray-700 flex items-center gap-1.5 outline-none cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 transition-transform duration-200 flex-shrink-0" />
        <span className="hidden sm:inline-block text-base leading-none align-middle">{currentLocaleData.flag}</span>
        <span className="font-medium flex items-center">{getDisplayName(currentLocaleData)}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {/* Hover Bridge - covers gap between button and dropdown */}
      <div 
        className={`absolute top-full left-0 right-0 bg-transparent z-40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ height: '0.75rem' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Dropdown Content */}
      <div 
        className={`absolute right-0 z-50 transition-all duration-200 ease-out ${
          isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
            : 'opacity-0 -translate-y-2 pointer-events-none invisible'
        }`}
        style={{ top: 'calc(100% + 0.25rem)' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Container */}
        <div 
          className="relative bg-neutral-100 shadow-lg border border-gray-200"
          style={{ 
            width: `${dropdownWidth}px`
          }}
        >
          {/* Content Container */}
          <div 
            className="px-5 pt-5 pb-6"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h6 
                className="font-medium text-gray-500 uppercase tracking-widest" 
                style={{ 
                  color: '#747474',
                  fontSize: '0.55rem'
                }}
              >
                Select Region & Language
              </h6>
              {isLoadingLocales && (
                <Loader2 className="w-3 h-3 text-neutral-400 animate-spin" />
              )}
            </div>

            {/* English Section */}
            {filteredGroupedLocales.english.length > 0 && (
            <div className="mb-3">
              <div className="mb-2">
                <p 
                  className="font-medium text-gray-500 uppercase tracking-widest px-2" 
                  style={{ 
                    color: '#747474',
                    fontSize: '0.5rem'
                  }}
                >
                  English
                </p>
              </div>
              {filteredGroupedLocales.english.map((locale, idx) => (
                <div key={locale.code} className="relative group">
                  {/* Separator line */}
                  {idx < filteredGroupedLocales.english.length - 1 && (
                    <div 
                      className="absolute bottom-0 left-0 h-px w-full"
                      style={{ backgroundColor: '#DFDFDF' }}
                    />
                  )}
                  
                  {/* Active/Hover indicator bar on the left */}
                  <div 
                    className={`absolute left-0 top-0 w-0.5 h-full bg-gray-400 transition-opacity duration-200 ${
                      currentLocale === locale.code ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                  
                  <button
                    onClick={() => handleLocaleChange(locale.code)}
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer relative ${
                      currentLocale === locale.code 
                        ? 'text-black' 
                        : 'text-gray-700 hover:text-black'
                    }`}
                    style={{
                      fontFamily: 'var(--font-inter-tight), sans-serif',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      lineHeight: '100%'
                    }}
                  >
                    <span className="text-base leading-none flex items-center">{locale.flag}</span>
                    <span className="flex items-center">{getDisplayName(locale)}</span>
                  </button>
                </div>
              ))}
            </div>
            )}

            {/* Asia Pacific Section */}
            {filteredGroupedLocales.asiaPacific.length > 0 && (
              <div className="mb-3 pt-3" style={{ borderTop: '1px solid #DFDFDF' }}>
                <div className="mb-2">
                  <p 
                    className="font-medium text-gray-500 uppercase tracking-widest px-2" 
                    style={{ 
                      color: '#747474',
                      fontSize: '0.5rem'
                    }}
                  >
                    Asia Pacific
                  </p>
                </div>
                {filteredGroupedLocales.asiaPacific.map((locale, idx) => (
                  <div key={locale.code} className="relative group">
                    {idx < filteredGroupedLocales.asiaPacific.length - 1 && (
                      <div 
                        className="absolute bottom-0 left-0 h-px w-full"
                        style={{ backgroundColor: '#DFDFDF' }}
                      />
                    )}
                    
                    {/* Active/Hover indicator bar on the left */}
                    <div 
                      className={`absolute left-0 top-0 w-0.5 h-full bg-gray-400 transition-opacity duration-200 ${
                        currentLocale === locale.code ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                    
                    <button
                      onClick={() => handleLocaleChange(locale.code)}
                      className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer relative ${
                        currentLocale === locale.code 
                          ? 'text-black' 
                          : 'text-gray-700 hover:text-black'
                      }`}
                      style={{
                        fontFamily: 'var(--font-inter-tight), sans-serif',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        lineHeight: '100%'
                      }}
                    >
                      <span className="text-base leading-none flex items-center">{locale.flag}</span>
                      <span className="flex items-center">{locale.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Europe Section */}
            {filteredGroupedLocales.europe.length > 0 && (
              <div className="pt-3" style={{ borderTop: '1px solid #DFDFDF' }}>
                <div className="mb-2">
                  <p 
                    className="font-medium text-gray-500 uppercase tracking-widest px-2" 
                    style={{ 
                      color: '#747474',
                      fontSize: '0.5rem'
                    }}
                  >
                    Europe
                  </p>
                </div>
                {filteredGroupedLocales.europe.map((locale, idx) => (
                  <div key={locale.code} className="relative group">
                    {idx < filteredGroupedLocales.europe.length - 1 && (
                      <div 
                        className="absolute bottom-0 left-0 h-px w-full"
                        style={{ backgroundColor: '#DFDFDF' }}
                      />
                    )}
                    
                    {/* Active/Hover indicator bar on the left */}
                    <div 
                      className={`absolute left-0 top-0 w-0.5 h-full bg-gray-400 transition-opacity duration-200 ${
                        currentLocale === locale.code ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                    
                    <button
                      onClick={() => handleLocaleChange(locale.code)}
                      className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer relative ${
                        currentLocale === locale.code 
                          ? 'text-black' 
                          : 'text-gray-700 hover:text-black'
                      }`}
                      style={{
                        fontFamily: 'var(--font-inter-tight), sans-serif',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        lineHeight: '100%'
                      }}
                    >
                      <span className="text-base leading-none flex items-center">{locale.flag}</span>
                      <span className="flex items-center">{locale.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
