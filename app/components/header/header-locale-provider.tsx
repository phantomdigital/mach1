'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/locale-helpers';
import HeaderClient from './header-client';
import type { HeaderDocument } from '@/types.generated';

/**
 * Minimal client wrapper that detects locale and fetches header data
 * Passes data to a server-rendered content component
 */
export default function HeaderLocaleProvider() {
  const pathname = usePathname();
  const [headerData, setHeaderData] = useState<HeaderDocument | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const previousHeaderRef = useRef<HeaderDocument | null>(null);

  useEffect(() => {
    const fetchHeader = async () => {
      const locale = getLocaleFromPathname(pathname);
      
      try {
        const response = await fetch(`/api/header?lang=${locale}`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setHeaderData(data);
          previousHeaderRef.current = data; // Keep previous header for smooth transitions
          setIsInitialLoad(false);
        } else {
          // Fallback to default locale
          const defaultResponse = await fetch(`/api/header?lang=en-us`, {
            cache: 'no-store'
          });
          if (defaultResponse.ok) {
            const defaultData = await response.json();
            setHeaderData(defaultData);
            previousHeaderRef.current = defaultData;
            setIsInitialLoad(false);
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
        setIsInitialLoad(false);
      }
    };

    fetchHeader();
  }, [pathname]);

  // Show minimal loading state only on initial load
  // When switching locales, keep showing the previous header until new one loads
  if (isInitialLoad && !headerData) {
    return <HeaderClient header={null} />;
  }

  // Always show header data (either new or previous during transition)
  return <HeaderClient header={headerData || previousHeaderRef.current} />;
}
