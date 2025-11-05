import { NextRequest, NextResponse } from 'next/server';
import { createClient, defaultLocale, type LocaleCode } from '@/prismicio';
import { getLocaleFromPathname } from '@/lib/locale-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || defaultLocale;
    
    const client = createClient();
    
    // Try to fetch header in requested locale, fallback to default
    let header;
    try {
      header = await client.getSingle("header", { 
        lang: lang as LocaleCode,
        fetchOptions: { 
          cache: 'no-store',
          next: { revalidate: 0 }
        }
      });
    } catch (error: any) {
      // Log the error for debugging
      console.warn(`Header API: Not found in locale ${lang}, error:`, error?.message || error);
      // Fallback to default locale if header doesn't exist in requested locale
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
    }
    
    return NextResponse.json(header);
  } catch (error) {
    console.error('Error fetching header:', error);
    return NextResponse.json(
      { error: 'Failed to fetch header' },
      { status: 500 }
    );
  }
}

