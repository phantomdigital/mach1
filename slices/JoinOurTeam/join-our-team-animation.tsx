"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const viewport = { once: true, margin: "-50px", amount: 0.3 };
const transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export function ImageBlockAnimation({
  children,
  isFlipped,
  className,
}: {
  children: ReactNode;
  isFlipped: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: isFlipped ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={transition}
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
