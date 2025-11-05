import { locales, defaultLocale, type LocaleCode } from '@/prismicio';

/**
 * Extract locale from a pathname
 * @param pathname - The pathname to extract locale from (e.g., "/zh-cn/quote" or "/quote")
 * @returns The locale code or default locale
 */
export function getLocaleFromPathname(pathname: string): LocaleCode {
  const pathParts = pathname.split('/').filter(Boolean);
  const firstPart = pathParts[0];
  
  // Check if first segment is a valid locale code
  const locale = locales.find(l => l.code === firstPart);
  return locale ? locale.code : defaultLocale;
}

/**
 * Get the pathname without the locale prefix
 * @param pathname - The pathname (e.g., "/zh-cn/quote" or "/quote")
 * @returns The pathname without locale (e.g., "/quote")
 */
export function getPathnameWithoutLocale(pathname: string): string {
  const pathParts = pathname.split('/').filter(Boolean);
  const firstPart = pathParts[0];
  
  // Check if first segment is a valid locale code
  const isLocale = locales.some(l => l.code === firstPart);
  
  if (isLocale) {
    // Remove locale prefix
    return '/' + pathParts.slice(1).join('/');
  }
  
  return pathname;
}

/**
 * Add locale prefix to a pathname
 * @param pathname - The pathname (e.g., "/quote")
 * @param locale - The locale code (e.g., "zh-cn")
 * @returns The pathname with locale prefix (e.g., "/zh-cn/quote") or original if default locale
 */
export function addLocaleToPathname(pathname: string, locale: LocaleCode): string {
  if (locale === defaultLocale) {
    return pathname;
  }
  
  // Remove leading slash, add locale, then add slash back
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `/${locale}${cleanPath}`;
}

