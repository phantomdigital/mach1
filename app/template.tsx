"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDropdownState } from "./components/header/dropdown-state-context";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { closeDropdown } = useDropdownState();

  useEffect(() => {
    // Close any open dropdowns immediately on navigation
    closeDropdown();
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Also reset Lenis scroll position if available
    const lenis = (window as typeof window & { __lenis?: { scrollTo: (value: number, options?: { immediate?: boolean }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, closeDropdown]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

