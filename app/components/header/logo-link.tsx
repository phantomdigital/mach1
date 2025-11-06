'use client';

import { useRouter } from 'next/navigation';
import { PrismicNextLink } from "@prismicio/next";

interface LogoLinkProps {
  children: React.ReactNode;
  className?: string;
}

// Type definitions for Network Information API
interface NetworkInformation {
  effectiveType: '2g' | 'slow-2g' | '3g' | '4g';
  saveData: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

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
 * Logo link with smart prefetching for instant home page navigation
 */
export function LogoLink({ children, className }: LogoLinkProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    // Check if user is on a slow connection
    if ('connection' in navigator) {
      const conn = (navigator as NavigatorWithConnection).connection;
      if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData)) {
        return;
      }
    }

    // Prefetch home page when idle
    const prefetchHome = () => {
      router.prefetch('/');
    };

    if ('requestIdleCallback' in window) {
      (window as WindowWithIdleCallback).requestIdleCallback(prefetchHome, { timeout: 2000 });
    } else {
      setTimeout(prefetchHome, 100);
    }
  };

  return (
    <PrismicNextLink 
      href="/" 
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </PrismicNextLink>
  );
}

