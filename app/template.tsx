"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCloseAllDropdowns } from "./components/header/dropdown-store";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const forceClose = useCloseAllDropdowns();

  useEffect(() => {
    forceClose();
    // Safety: clear any stale scroll locks that might block wheel scrolling
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, 0);
  }, [pathname, forceClose]);

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

