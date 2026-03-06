"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const viewport = { once: true, margin: "-50px", amount: 0.3 };
const transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

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
