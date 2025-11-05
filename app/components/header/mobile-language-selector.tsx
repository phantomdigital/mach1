'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { locales, defaultLocale, type LocaleCode } from '@/prismicio';

// Group locales by category
const groupedLocales = {
  english: locales.filter(l => l.code.startsWith('en-')),
  asiaPacific: locales.filter(l => ['zh-cn', 'zh-tw', 'ja', 'ko', 'vi', 'th', 'id', 'hi-in'].includes(l.code)),
  europe: locales.filter(l => ['es', 'fr', 'de'].includes(l.code)),
};

interface MobileLanguageSelectorProps {
  onLocaleChange?: () => void;
}

export function MobileLanguageSelector({ onLocaleChange }: MobileLanguageSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Extract current locale from pathname
  const getCurrentLocale = (): LocaleCode => {
    const pathParts = pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    const locale = locales.find(l => l.code === firstPart);
    return locale ? locale.code : defaultLocale;
  };
  
  // Start with only current locale - will update when API responds
  const [availableLocales, setAvailableLocales] = useState<LocaleCode[]>([getCurrentLocale()]);
  const [isLoadingLocales, setIsLoadingLocales] = useState(true);

  const currentLocale = getCurrentLocale();
  const currentLocaleData = locales.find(l => l.code === currentLocale) || locales[0];
  
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
    onLocaleChange?.(); // Close mobile menu if callback provided
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

  // Fetch available translations for current page
  useEffect(() => {
    const fetchAvailableLocales = async () => {
      setIsLoadingLocales(true);
      
      try {
        const pathParts = pathname.split('/').filter(Boolean);
        const detectedLocale = pathParts[0] && locales.find(l => l.code === pathParts[0]);
        const currentLocale: LocaleCode = detectedLocale ? (detectedLocale.code as LocaleCode) : defaultLocale;
        
        let docType: string | null = null;
        let uid: string | null = null;
        
        if (pathname === '/' || (pathParts.length === 1 && locales.find(l => l.code === pathParts[0]))) {
          docType = 'home';
          uid = null;
        } else {
          const pathWithoutLocale = currentLocale !== defaultLocale 
            ? pathParts.slice(1).join('/')
            : pathParts.join('/');
          
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
            docType = 'page';
            uid = pathWithoutLocale;
          }
        }
        
        if (!docType) {
          setAvailableLocales([currentLocale]);
          setIsLoadingLocales(false);
          return;
        }
        
        const response = await fetch(`/api/available-locales?type=${docType}${uid ? `&uid=${uid}` : ''}&lang=${currentLocale}`);
        if (response.ok) {
          const data = await response.json();
          const available = new Set([currentLocale, ...(data.availableLocales || [])]);
          setAvailableLocales(Array.from(available) as LocaleCode[]);
        } else {
          setAvailableLocales([currentLocale]);
        }
      } catch (error) {
        console.warn('Failed to fetch available locales:', error);
        const pathParts = pathname.split('/').filter(Boolean);
        const detectedLocale = pathParts[0] && locales.find(l => l.code === pathParts[0]);
        const errorLocale: LocaleCode = detectedLocale ? (detectedLocale.code as LocaleCode) : defaultLocale;
        setAvailableLocales([errorLocale]);
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
  const filterAvailableLocales = <T extends { code: LocaleCode; name: string; flag: string }>(localeList: T[]) => {
    return localeList.filter(locale => availableLocales.includes(locale.code));
  };
  
  const filteredGroupedLocales = {
    english: filterAvailableLocales(groupedLocales.english),
    asiaPacific: filterAvailableLocales(groupedLocales.asiaPacific),
    europe: filterAvailableLocales(groupedLocales.europe),
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 text-black font-semibold text-lg hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <span className="text-lg leading-none">{currentLocaleData.flag}</span>
          <span>{getDisplayName(currentLocaleData)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoadingLocales && (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.05
                }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: {
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1]
                },
                opacity: {
                  duration: 0.2
                }
              }
            }}
            className="overflow-hidden mt-2 ml-4 border-l-2 border-gray-200 pl-4"
          >
            <div className="space-y-1">
              {/* English Section */}
              {filteredGroupedLocales.english.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                    English
                  </p>
                  {filteredGroupedLocales.english.map((locale) => (
                    <div key={locale.code} className="relative">
                      {/* Active indicator */}
                      {currentLocale === locale.code && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-400" />
                      )}
                      <button
                        onClick={() => handleLocaleChange(locale.code)}
                        className={`w-full text-left px-3 py-2.5 rounded transition-colors flex items-center gap-3 ${
                          currentLocale === locale.code 
                            ? 'text-black font-semibold bg-gray-100' 
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl leading-none">{locale.flag}</span>
                        <span className="text-sm">{getDisplayName(locale)}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Asia Pacific Section */}
              {filteredGroupedLocales.asiaPacific.length > 0 && (
                <div className="mb-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                    Asia Pacific
                  </p>
                  {filteredGroupedLocales.asiaPacific.map((locale) => (
                    <div key={locale.code} className="relative">
                      {/* Active indicator */}
                      {currentLocale === locale.code && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-400" />
                      )}
                      <button
                        onClick={() => handleLocaleChange(locale.code)}
                        className={`w-full text-left px-3 py-2.5 rounded transition-colors flex items-center gap-3 ${
                          currentLocale === locale.code 
                            ? 'text-black font-semibold bg-gray-100' 
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl leading-none">{locale.flag}</span>
                        <span className="text-sm">{locale.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Europe Section */}
              {filteredGroupedLocales.europe.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                    Europe
                  </p>
                  {filteredGroupedLocales.europe.map((locale) => (
                    <div key={locale.code} className="relative">
                      {/* Active indicator */}
                      {currentLocale === locale.code && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-400" />
                      )}
                      <button
                        onClick={() => handleLocaleChange(locale.code)}
                        className={`w-full text-left px-3 py-2.5 rounded transition-colors flex items-center gap-3 ${
                          currentLocale === locale.code 
                            ? 'text-black font-semibold bg-gray-100' 
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl leading-none">{locale.flag}</span>
                        <span className="text-sm">{locale.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

