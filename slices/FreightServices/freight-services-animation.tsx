"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const viewport = { once: true, margin: "-80px", amount: 0.15 };
const transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

/** Wraps the whole section - animates in when it enters the viewport (like Job slice) */
export function SectionAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ContentBlockAnimation({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ ...transition, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ServiceBlockAnimation({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ ...transition, delay: index * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

/** Animated accent line that grows down when it enters the viewport */
export function AnimatedAccentLine() {
  return (
    <div className="flex flex-col items-center self-stretch min-h-0">
      <motion.div
        className="w-0.5 flex-1 min-h-[1px] bg-mach1-green flex-shrink-0"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={viewport}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "top" }}
      />
    </div>
  );
}
