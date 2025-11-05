import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/prismicio';
import type { AlternateLanguage, PrismicDocument } from '@prismicio/client';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const docType = searchParams.get('type');
    const uid = searchParams.get('uid');
    const lang = searchParams.get('lang') || 'en-us';
    
    if (!docType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }
    
    const client = createClient();
    
    // Fetch the document based on type
    let document: PrismicDocument | undefined;
    try {
      if (docType === 'home') {
        document = await client.getSingle('home', { lang });
      } else if (uid) {
        // Fetch by UID for other types
        // We need to type assert since docType comes from query params
        document = await client.getByUID(
          docType as 'page' | 'solution' | 'specialty' | 'news' | 'job' | 'author', 
          uid, 
          { lang }
        ) as PrismicDocument;
      } else {
        return NextResponse.json(
          { error: 'UID is required for this document type' },
          { status: 400 }
        );
      }
    } catch {
      // Document not found - return empty array
      return NextResponse.json({ availableLocales: [] });
    }
    
    // Extract available locales from alternate_languages
    const availableLocales: string[] = [];
    
    if (document.alternate_languages && document.alternate_languages.length > 0) {
      // Add all alternate language codes
      document.alternate_languages.forEach((alt: AlternateLanguage) => {
        if (alt.lang && !availableLocales.includes(alt.lang)) {
          availableLocales.push(alt.lang);
        }
      });
    }
    
    // Also check if the document exists in other locales by trying to fetch them
    // This handles cases where alternate_languages might not be fully populated
    const allLocales = ['en-us', 'zh-cn', 'hi-in'];
    for (const locale of allLocales) {
      if (locale === lang) continue; // Skip current locale
      
      try {
        if (docType === 'home') {
          await client.getSingle('home', { lang: locale });
        } else if (uid) {
          await client.getByUID(
            docType as 'page' | 'solution' | 'specialty' | 'news' | 'job' | 'author', 
            uid, 
            { lang: locale }
          );
        }
        // If fetch succeeds, document exists in this locale
        if (!availableLocales.includes(locale)) {
          availableLocales.push(locale);
        }
      } catch {
        // Document doesn't exist in this locale, skip
      }
    }
    
    return NextResponse.json({ availableLocales });
  } catch (error) {
    console.error('Error fetching available locales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available locales' },
      { status: 500 }
    );
  }
}

