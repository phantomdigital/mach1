import { headers } from "next/headers";
import { getLocaleFromPathname } from "@/lib/locale-helpers";
import { createClient, defaultLocale, type LocaleCode } from "@/prismicio";
import HeaderWrapper from "./header-wrapper";
import type { HeaderDocument } from "@/types.generated";

/**
 * Server component that fetches header data based on the current pathname
 * This component is dynamic but isolated from the rest of the layout
 */
export default async function HeaderServerWrapper() {
  let locale: LocaleCode = defaultLocale;
  
  try {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname");
    if (pathname) {
      locale = getLocaleFromPathname(pathname);
    }
  } catch (error) {
    console.warn("Could not detect locale from headers:", error);
  }
  
  // Fetch header for the detected locale
  const client = createClient();
  let initialHeader: HeaderDocument | null = null;
  
  try {
    initialHeader = await client.getSingle("header", { lang: locale });
  } catch (error) {
    console.warn(`Header not found in locale ${locale}, falling back to default locale.`);
    
    // Fallback to default locale
    if (locale !== defaultLocale) {
      try {
        initialHeader = await client.getSingle("header", { lang: defaultLocale });
      } catch (fallbackError) {
        console.error("Header not found in default locale either:", fallbackError);
      }
    }
  }
  
  return <HeaderWrapper initialHeader={initialHeader} />;
}

// Mark this component as dynamic (doesn't affect parent layout)
export const dynamic = 'force-dynamic';

