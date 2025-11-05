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

/**
 * Navigation item that prefetches on hover for instant navigation
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
        router.prefetch(url);
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
        router.prefetch(url);
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

