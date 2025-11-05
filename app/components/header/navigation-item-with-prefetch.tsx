'use client';

import { useRouter } from 'next/navigation';
import { PrismicNextLink } from "@prismicio/next";
import type { LinkField } from "@prismicio/client";

interface NavigationItemWithPrefetchProps {
  link: LinkField;
  label: string | null;
  className?: string;
  children?: React.ReactNode;
}

// Type definitions for Network Information API
interface NetworkInformation {
  effectiveType: '2g' | 'slow-2g' | '3g' | '4g';
  saveData: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

// Type definition for requestIdleCallback
interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining(): number;
}

interface WindowWithIdleCallback extends Window {
  requestIdleCallback(
    callback: (deadline: IdleDeadline) => void,
    options?: { timeout: number }
  ): number;
}

/**
 * Smart prefetching utility that respects browser resources
 * - Uses requestIdleCallback for non-blocking prefetch
 * - Checks network conditions (avoids on slow connections)
 * - Only prefetches when browser is idle
 */
const smartPrefetch = (url: string, router: ReturnType<typeof useRouter>) => {
  // Check if user is on a slow connection
  if ('connection' in navigator) {
    const conn = (navigator as NavigatorWithConnection).connection;
    // Skip prefetch on 2G, slow-2g, or save-data mode
    if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData)) {
      return;
    }
  }

  // Use requestIdleCallback if available, otherwise use setTimeout as fallback
  const prefetchWhenIdle = () => {
    router.prefetch(url);
  };

  if ('requestIdleCallback' in window) {
    // Wait for browser idle time - won't block critical resources
    (window as WindowWithIdleCallback).requestIdleCallback(prefetchWhenIdle, { timeout: 2000 });
  } else {
    // Fallback: small delay to not block initial render
    setTimeout(prefetchWhenIdle, 100);
  }
};

/**
 * Navigation item that intelligently prefetches on hover
 * Uses idle callbacks and respects network conditions
 */
export function NavigationItemWithPrefetch({ 
  link, 
  label, 
  className,
  children 
}: NavigationItemWithPrefetchProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    // Extract URL from Prismic link field
    if (link && 'url' in link && link.url) {
      // Direct URL - could be external or internal
      const url = link.url;
      
      // Only prefetch internal routes (starting with /)
      if (url.startsWith('/')) {
        smartPrefetch(url, router);
      }
    } else if (link && 'uid' in link && link.uid) {
      // Handle document links - construct URL based on link type
      const linkType = 'link_type' in link ? link.link_type : null;
      if (linkType === 'Document' && 'type' in link) {
        let url = '/';
        switch (link.type) {
          case 'home':
            url = '/';
            break;
          case 'page':
            url = `/${link.uid}`;
            break;
          case 'solution':
            url = `/solutions/${link.uid}`;
            break;
          case 'specialty':
            url = `/specialties/${link.uid}`;
            break;
          case 'news':
            url = `/news/${link.uid}`;
            break;
          case 'job':
            url = `/job/${link.uid}`;
            break;
          default:
            // For any other document types, try generic /{uid}
            url = `/${link.uid}`;
            break;
        }
        smartPrefetch(url, router);
      }
    }
  };

  return (
    <PrismicNextLink
      field={link}
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {children || label}
    </PrismicNextLink>
  );
}

