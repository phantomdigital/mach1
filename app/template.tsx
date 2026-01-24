"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDropdownState } from "./components/header/dropdown-state-context";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { closeDropdown } = useDropdownState();

  useEffect(() => {
    closeDropdown();
    window.scrollTo(0, 0);
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

