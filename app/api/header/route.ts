import { NextRequest, NextResponse } from 'next/server';
import { createClient, defaultLocale, locales, type LocaleCode } from '@/prismicio';

/**
 * Validates that the provided locale code is in the allowed list
 */
function validateLocale(locale: string | null): LocaleCode {
  if (!locale) {
    return defaultLocale;
  }
  
  // Check if locale is in the allowed list
  const validLocale = locales.find(l => l.code === locale);
  if (validLocale) {
    return validLocale.code;
  }
  
  // Invalid locale - return default
  return defaultLocale;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedLang = searchParams.get('lang');
    
    // Validate and sanitize locale input
    const lang = validateLocale(requestedLang);
    
    const client = createClient();
    
    // Try to fetch header in requested locale, fallback to default
    let header;
    try {
      header = await client.getSingle("header", { 
        lang,
        fetchOptions: { 
          cache: 'no-store',
          next: { revalidate: 0 }
        }
      });
    } catch (error: unknown) {
      // Log the error for debugging (but don't expose details to client)
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Header API: Not found in locale ${lang}, error:`, errorMessage);
      
      // Fallback to default locale if header doesn't exist in requested locale
      // Only try fallback if we're not already using the default locale
      if (lang !== defaultLocale) {
        try {
          header = await client.getSingle("header", { 
            lang: defaultLocale,
            fetchOptions: { 
              cache: 'no-store',
              next: { revalidate: 0 }
            }
          });
        } catch (fallbackError) {
          console.error("Header API: Not found in default locale either:", fallbackError);
          return NextResponse.json(
            { error: 'Header not found' },
            { status: 404 }
          );
        }
      } else {
        // Already tried default locale, return 404
        return NextResponse.json(
          { error: 'Header not found' },
          { status: 404 }
        );
      }
    }
    
    // Set appropriate cache headers for public content
    return NextResponse.json(header, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: unknown) {
    // Log full error for server-side debugging
    console.error('Error fetching header:', error);
    
    // Return generic error to client (don't leak internal details)
    return NextResponse.json(
      { error: 'Failed to fetch header' },
      { status: 500 }
    );
  }
}

