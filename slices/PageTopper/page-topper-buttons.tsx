'use client';

import { PrismicNextLink } from "@prismicio/next";
import { motion } from "framer-motion";
import { useState } from "react";
import type { KeyTextField, LinkField } from "@prismicio/client";

interface PageTopperButtonsProps {
  button1Text?: KeyTextField;
  button1Link?: LinkField;
  button1Style?: string;
  button2Text?: KeyTextField;
  button2Link?: LinkField;
  button2Style?: string;
}

export function PageTopperButtons({
  button1Text,
  button1Link,
  button1Style = "default",
  button2Text,
  button2Link,
  button2Style = "secondary"
}: PageTopperButtonsProps) {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  const renderButton = (
    text: KeyTextField | undefined,
    link: LinkField | undefined,
    style: string | undefined,
    index: number
  ) => {
    // Don't render if text is empty or undefined
    if (!text || (typeof text === 'string' && text.trim() === '')) return null;
    if (!link) return null;

    const isHovered = hoveredButton === index;

    // Secondary style - text with arrow (like header dropdown)
    if (style === "secondary") {
      return (
        <PrismicNextLink
          key={index}
          field={link}
          className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200"
          onMouseEnter={() => setHoveredButton(index)}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <span 
            className="font-medium text-[15px] uppercase"
            style={{ 
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontWeight: 400,
              letterSpacing: '0.02em'
            }}
          >
            {text}
          </span>
          <motion.svg 
            width="13" 
            height="13" 
            viewBox="0 0 13 13" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
            animate={{
              x: isHovered ? 3 : 0,
              y: isHovered ? -3 : 0
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            <path 
              d="M1 12L12 1M12 1H1M12 1V12" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinejoin="round"
            />
          </motion.svg>
        </PrismicNextLink>
      );
    }

    // Hero-light style - lighter colored button with animation for dark backgrounds
    if (style === "hero-light") {
      return (
        <PrismicNextLink
          key={index}
          field={link}
          className="inline-flex items-center bg-neutral-100 text-dark-blue rounded-2xl pl-6 pr-1 h-[45px] w-auto font-medium text-[13px] uppercase hover:bg-white/90 transition-all duration-200 gap-3"
          style={{ 
            fontFamily: 'var(--font-jetbrains-mono), monospace', 
            fontWeight: 400, 
            fontStyle: 'normal', 
            lineHeight: '1' 
          }}
          onMouseEnter={() => setHoveredButton(index)}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <div className="relative overflow-hidden h-[1em] flex items-center justify-center whitespace-nowrap" style={{ lineHeight: '1' }}>
            <motion.span
              className="flex items-center justify-center h-full"
              animate={{
                y: isHovered ? "-150%" : "0%"
              }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {text}
            </motion.span>
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: "150%" }}
              animate={{
                y: isHovered ? "0%" : "150%"
              }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {text}
            </motion.span>
          </div>
          <div className="w-[37px] h-[37px] bg-neutral-300 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <motion.svg 
              width="11" 
              height="11" 
              viewBox="0 0 9 9" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute"
              animate={{
                x: isHovered ? "150%" : "0%",
                y: isHovered ? "-150%" : "0%"
              }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <path d="M1 8L8 1M8 1H1M8 1V8" stroke="black" strokeLinejoin="round"/>
            </motion.svg>
            <motion.svg 
              width="11" 
              height="11" 
              viewBox="0 0 9 9" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute"
              initial={{ x: "-200%", y: "200%" }}
              animate={{
                x: isHovered ? "0%" : "-200%",
                y: isHovered ? "0%" : "200%"
              }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <path d="M1 8L8 1M8 1H1M8 1V8" stroke="black" strokeLinejoin="round"/>
            </motion.svg>
          </div>
        </PrismicNextLink>
      );
    }

    // Default style - dark blue button with animation
    return (
      <PrismicNextLink
        key={index}
        field={link}
        className="inline-flex items-center bg-dark-blue text-white rounded-2xl pl-6 pr-1 h-[45px] w-auto font-medium text-[13px] uppercase hover:bg-[#1e2366] transition-all duration-200 gap-3"
        style={{ 
          fontFamily: 'var(--font-jetbrains-mono), monospace', 
          fontWeight: 400, 
          fontStyle: 'normal', 
          lineHeight: '1' 
        }}
        onMouseEnter={() => setHoveredButton(index)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <div className="relative overflow-hidden h-[1em] flex items-center justify-center whitespace-nowrap" style={{ lineHeight: '1' }}>
          <motion.span
            className="flex items-center justify-center h-full"
            animate={{
              y: isHovered ? "-150%" : "0%"
            }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: "150%" }}
            animate={{
              y: isHovered ? "0%" : "150%"
            }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {text}
          </motion.span>
        </div>
        <div className="w-[37px] h-[37px] bg-white rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <motion.svg 
            width="11" 
            height="11" 
            viewBox="0 0 9 9" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            animate={{
              x: isHovered ? "150%" : "0%",
              y: isHovered ? "-150%" : "0%"
            }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <path d="M1 8L8 1M8 1H1M8 1V8" stroke="#2b2e7f" strokeLinejoin="round"/>
          </motion.svg>
          <motion.svg 
            width="11" 
            height="11" 
            viewBox="0 0 9 9" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            initial={{ x: "-200%", y: "200%" }}
            animate={{
              x: isHovered ? "0%" : "-200%",
              y: isHovered ? "0%" : "200%"
            }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <path d="M1 8L8 1M8 1H1M8 1V8" stroke="#2b2e7f" strokeLinejoin="round"/>
          </motion.svg>
        </div>
      </PrismicNextLink>
    );
  };

  const button1 = renderButton(button1Text, button1Link, button1Style, 1);
  const button2 = renderButton(button2Text, button2Link, button2Style, 2);

  // If no buttons to render, don't render the container
  if (!button1 && !button2) {
    return null;
  }

  return (
    <div className="flex items-center gap-6 mt-8">
      {button1}
      {button2}
    </div>
  );
}

