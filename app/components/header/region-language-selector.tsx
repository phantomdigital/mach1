'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { locales, defaultLocale, type LocaleCode } from '@/prismicio';

// Group locales by category
const groupedLocales = {
  english: locales.filter(l => l.code.startsWith('en-')),
  asiaPacific: locales.filter(l => ['zh-cn', 'zh-tw', 'ja', 'ko', 'vi', 'th', 'id'].includes(l.code)),
  europe: locales.filter(l => ['es', 'fr', 'de'].includes(l.code)),
};

export function RegionLanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract current locale from pathname
  const getCurrentLocale = (): LocaleCode => {
    const pathParts = pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    
    // Check if the first part is a valid locale code
    const locale = locales.find(l => l.code === firstPart);
    return locale ? locale.code : defaultLocale;
  };

  const currentLocale = getCurrentLocale();
  const currentLocaleData = locales.find(l => l.code === currentLocale) || locales[0];

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
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate dropdown height based on content
  const headerHeight = 48;
  const sectionHeaderHeight = 28;
  const itemHeight = 41;
  const totalSections = 1 + (groupedLocales.asiaPacific.length > 0 ? 1 : 0) + (groupedLocales.europe.length > 0 ? 1 : 0);
  const totalItems = groupedLocales.english.length + groupedLocales.asiaPacific.length + groupedLocales.europe.length;
  const contentHeight = headerHeight + (totalSections * sectionHeaderHeight) + (totalItems * itemHeight) + 20;
  const dropdownHeight = Math.min(contentHeight, 400);
  const dropdownWidth = 280;

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button 
        className="text-sm text-gray-700 hover:text-dark-blue transition-colors flex items-center gap-1.5 outline-none cursor-pointer"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLocaleData.flag}</span>
        <span className="font-medium">{currentLocaleData.name}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {/* Hover Bridge */}
      <div 
        className={`absolute top-full left-0 w-full h-2 bg-transparent z-40 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none hidden'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Dropdown Content */}
      <div 
        className={`absolute right-0 z-50 transition-opacity duration-150 ${
          isOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none hidden'
        }`}
        style={{ top: '32px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* SVG Background Container */}
        <div className="relative" style={{ width: `${dropdownWidth}px`, height: `${dropdownHeight}px` }}>
          {/* Simple rounded rectangle background */}
          <div 
            className="absolute inset-0 bg-white rounded-md shadow-lg border border-gray-200"
            style={{ width: `${dropdownWidth}px`, height: `${dropdownHeight}px` }}
          />

          {/* Content Container with Scrolling */}
          <div 
            className="absolute inset-0 overflow-y-auto px-5 pt-10 pb-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 #F7FAFC'
            }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <div className="mb-4">
              <h6 
                className="font-medium text-gray-500 uppercase tracking-widest" 
                style={{ 
                  color: '#747474',
                  fontSize: '0.55rem'
                }}
              >
                Select Region & Language
              </h6>
            </div>

            {/* English Section */}
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
              {groupedLocales.english.map((locale, idx) => (
                <div key={locale.code} className="relative group">
                  {/* Separator line */}
                  {idx < groupedLocales.english.length - 1 && (
                    <div 
                      className="absolute bottom-0 left-0 h-px w-full"
                      style={{ backgroundColor: '#DFDFDF' }}
                    />
                  )}
                  
                  {/* Hover indicator bar */}
                  <div 
                    className="absolute left-0 top-0 w-0.5 h-full bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                  />
                  
                  <button
                    onClick={() => handleLocaleChange(locale.code)}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer text-mach-gray hover:text-black relative"
                    style={{
                      fontFamily: 'var(--font-inter-tight), sans-serif',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      lineHeight: '100%'
                    }}
                  >
                    <span className="text-base">{locale.flag}</span>
                    <span>{locale.name}</span>
                    {currentLocale === locale.code && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-dark-blue" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Asia Pacific Section */}
            {groupedLocales.asiaPacific.length > 0 && (
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
                {groupedLocales.asiaPacific.map((locale, idx) => (
                  <div key={locale.code} className="relative group">
                    {idx < groupedLocales.asiaPacific.length - 1 && (
                      <div 
                        className="absolute bottom-0 left-0 h-px w-full"
                        style={{ backgroundColor: '#DFDFDF' }}
                      />
                    )}
                    
                    <div 
                      className="absolute left-0 top-0 w-0.5 h-full bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                    />
                    
                    <button
                      onClick={() => handleLocaleChange(locale.code)}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer text-mach-gray hover:text-black relative"
                      style={{
                        fontFamily: 'var(--font-inter-tight), sans-serif',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        lineHeight: '100%'
                      }}
                    >
                      <span className="text-base">{locale.flag}</span>
                      <span>{locale.name}</span>
                      {currentLocale === locale.code && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-dark-blue" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Europe Section */}
            {groupedLocales.europe.length > 0 && (
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
                {groupedLocales.europe.map((locale, idx) => (
                  <div key={locale.code} className="relative group">
                    {idx < groupedLocales.europe.length - 1 && (
                      <div 
                        className="absolute bottom-0 left-0 h-px w-full"
                        style={{ backgroundColor: '#DFDFDF' }}
                      />
                    )}
                    
                    <div 
                      className="absolute left-0 top-0 w-0.5 h-full bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                    />
                    
                    <button
                      onClick={() => handleLocaleChange(locale.code)}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer text-mach-gray hover:text-black relative"
                      style={{
                        fontFamily: 'var(--font-inter-tight), sans-serif',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        lineHeight: '100%'
                      }}
                    >
                      <span className="text-base">{locale.flag}</span>
                      <span>{locale.name}</span>
                      {currentLocale === locale.code && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-dark-blue" />
                      )}
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
