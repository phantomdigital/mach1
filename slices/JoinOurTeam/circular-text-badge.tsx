"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PrismicNextImage } from "@prismicio/next";
import type { ImageField } from "@prismicio/client";

export interface CircularTextBadgeProps {
  /** Icons to cycle through (each item has an icon field) */
  icons?: Array<{ icon?: ImageField<never> | { url?: string | null } | null }>;
  /** Background color of the circle */
  circleColor: string;
  /** Text color around the circle */
  textColor?: string;
  /** Text segments - joined with dots between each */
  textSegments: Array<{ text?: string | null }>;
  /** Position: 'top-right' (default) or 'top-left' for flipped layout */
  position?: "top-right" | "top-left";
  /** Seconds between icon changes */
  iconInterval?: number;
}

/**
 * Badge with circular text around the perimeter and icons that cycle in the center.
 * Text segments are separated by dots (•).
 */
export function CircularTextBadge({
  icons = [],
  circleColor,
  textColor = "#ffffff",
  textSegments,
  position = "top-right",
  iconInterval = 6,
}: CircularTextBadgeProps): React.ReactElement {
  const validIcons = icons?.filter((i) => i.icon?.url) ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (validIcons.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % validIcons.length);
    }, iconInterval * 1000);
    return () => clearInterval(id);
  }, [validIcons.length, iconInterval]);

  const currentIcon = validIcons[index]?.icon;
  const [radius, setRadius] = useState(58);
  const [fontSize, setFontSize] = useState(11);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w >= 1024) {
        setRadius(58);
        setFontSize(11);
      } else if (w >= 640) {
        setRadius(46);
        setFontSize(10);
      } else {
        setRadius(34);
        setFontSize(9);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const segments = textSegments?.filter((s) => s.text?.trim()) ?? [];
  const fullText =
    segments.length > 0
      ? segments.map((s) => s.text!.trim()).join(" • ") + " • "
      : "";
  const letters = fullText.split("");

  const positionClasses =
    position === "top-left"
      ? "top-0 left-0 -translate-y-2/3 sm:-translate-x-2/5 sm:-translate-y-2/5 origin-top-left"
      : "top-0 right-0 -translate-y-2/3 sm:translate-x-2/5 sm:-translate-y-2/5 origin-top-right";

  return (
    <div
      className={`absolute z-20 w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 shadow-none ring-0 ${positionClasses}`}
    >
      <div
        className="relative w-full h-full flex items-center justify-center rounded-full shadow-none ring-0"
        style={{ backgroundColor: circleColor }}
      >
        {/* Circular text following the circumference */}
        {letters.length > 0 && (
          <div className="absolute inset-0 animate-[spin_15s_linear_infinite]">
            {letters.map((letter, i) => {
              const angle = (i * 360) / letters.length;
              const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
              const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
              const isDot = letter === "•";

              return (
                <span
                  key={`${letter}-${i}`}
                  className="absolute font-bold uppercase"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    transformOrigin: "center",
                    fontFamily: '"JetBrains Mono", monospace',
                    letterSpacing: "0.5px",
                    fontSize: `${fontSize}px`,
                    color: isDot ? `${textColor}80` : textColor,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        )}

        {/* Center: cycling icons or placeholder */}
        <div className="relative z-10 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full overflow-visible bg-white/15 shrink-0">
          <AnimatePresence mode="wait">
            {currentIcon?.url ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <PrismicNextImage
                  field={currentIcon as ImageField<never>}
                  className="w-full h-full object-contain"
                  width={88}
                  height={88}
                  quality={90}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-white text-xs sm:text-sm font-bold opacity-80">?</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
