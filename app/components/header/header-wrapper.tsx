'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/locale-helpers';
import HeaderClient from './header-client';
import type { HeaderDocument } from '@/types.generated';

interface HeaderWrapperProps {
  initialHeader: HeaderDocument | null;
}

/**
 * Client wrapper that receives server-rendered header and updates on locale changes
 */
export default function HeaderWrapper({ initialHeader }: HeaderWrapperProps) {
  const pathname = usePathname();
  const [headerData, setHeaderData] = useState<HeaderDocument | null>(initialHeader);
  const previousHeaderRef = useRef<HeaderDocument | null>(initialHeader);
  const currentLocaleRef = useRef<string | null>(initialHeader?.lang || null);
  const hasInitialHeader = useRef(!!initialHeader);

  useEffect(() => {
    const fetchHeader = async () => {
      const locale = getLocaleFromPathname(pathname);
      
      // If we have initial header and the locale matches, don't fetch
      if (hasInitialHeader.current && currentLocaleRef.current === locale) {
        hasInitialHeader.current = false; // Clear flag after first check
        return;
      }
      
      // Check if locale has actually changed
      if (currentLocaleRef.current === locale) {
        return; // Already have the correct locale
      }
      
      try {
        const response = await fetch(`/api/header?lang=${locale}`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setHeaderData(data);
          previousHeaderRef.current = data;
          currentLocaleRef.current = locale;
        } else {
          // Fallback to default locale
          const defaultResponse = await fetch(`/api/header?lang=en-us`, {
            cache: 'no-store'
          });
          if (defaultResponse.ok) {
            const defaultData = await defaultResponse.json();
            setHeaderData(defaultData);
            previousHeaderRef.current = defaultData;
            currentLocaleRef.current = 'en-us';
          } else if (previousHeaderRef.current) {
            // If fetch fails but we have previous data, keep showing it
            setHeaderData(previousHeaderRef.current);
          }
        }
      } catch (error) {
        console.error('Failed to fetch header:', error);
        // On error, keep showing previous header if available
        if (previousHeaderRef.current) {
          setHeaderData(previousHeaderRef.current);
        }
      }
    };

    fetchHeader();
  }, [pathname]);

  // Always show header data (either new or previous during transition)
  return <HeaderClient header={headerData || previousHeaderRef.current} />;
}

