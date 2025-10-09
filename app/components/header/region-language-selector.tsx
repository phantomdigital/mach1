'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from 'lucide-react';
import { locales, defaultLocale, type LocaleCode } from '@/prismicio';

export function RegionLanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLocaleChange = (newLocaleCode: string) => {
    const newLocale = newLocaleCode as LocaleCode;
    
    // Remove current locale from pathname
    const pathParts = pathname.split('/').filter(Boolean);
    const isLocaleInPath = locales.some(l => l.code === pathParts[0]);
    
    let newPath: string;
    if (isLocaleInPath) {
      // Replace current locale
      pathParts[0] = newLocale === defaultLocale ? '' : newLocale;
      newPath = '/' + pathParts.filter(Boolean).join('/');
    } else {
      // Add locale if not default
      newPath = newLocale === defaultLocale ? pathname : `/${newLocale}${pathname}`;
    }

    // Navigate to new path
    router.push(newPath || '/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-sm text-gray-700 hover:text-dark-blue transition-colors flex items-center gap-1.5 outline-none">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLocaleData.flag}</span>
          {currentLocaleData.name}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[400px] overflow-y-auto">
        <DropdownMenuLabel>Select Region & Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentLocale} onValueChange={handleLocaleChange}>
          {/* English variants */}
          <DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">English</DropdownMenuLabel>
          {locales.filter(l => l.code.startsWith('en-')).map((locale) => (
            <DropdownMenuRadioItem key={locale.code} value={locale.code}>
              <span className="mr-2">{locale.flag}</span>
              {locale.name}
            </DropdownMenuRadioItem>
          ))}
          
          {/* Asian languages */}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">Asia Pacific</DropdownMenuLabel>
          {locales.filter(l => ['zh-cn', 'zh-tw', 'ja', 'ko', 'vi', 'th', 'id'].includes(l.code)).map((locale) => (
            <DropdownMenuRadioItem key={locale.code} value={locale.code}>
              <span className="mr-2">{locale.flag}</span>
              {locale.name}
            </DropdownMenuRadioItem>
          ))}
          
          {/* European languages */}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">Europe</DropdownMenuLabel>
          {locales.filter(l => ['es', 'fr', 'de'].includes(l.code)).map((locale) => (
            <DropdownMenuRadioItem key={locale.code} value={locale.code}>
              <span className="mr-2">{locale.flag}</span>
              {locale.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
