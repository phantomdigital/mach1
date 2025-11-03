"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { KeyTextField } from "@prismicio/client";

gsap.registerPlugin(ScrollTrigger);

interface HeadingWithUnderlineProps {
  heading: KeyTextField;
  textColor: string;
}

export default function HeadingWithUnderline({ heading, textColor }: HeadingWithUnderlineProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const textSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!headingRef.current || !underlineRef.current || !containerRef.current || !heading) return;

    const words = heading.split(" ");
    if (words.length < 2) return; // Need at least 2 words

    // Get the width of the text span to create proper SVG path
    const textSpan = containerRef.current.querySelector('span:first-child');
    if (!textSpan) return;

    const updatePath = () => {
      const textWidth = textSpan.getBoundingClientRect().width;
      
      // Create a smooth, pen-tool style path with subtle organic variation
      const baseY = 10; // Base vertical position - lowered for emphasis
      
      // Create a smooth curved path with minimal variation (like a pen stroke)
      // Use a simple sine wave for subtle organic feel, but keep it smooth
      const segments = 20; // More segments for smoother curve
      const segmentWidth = textWidth / segments;
      const maxVariation = 1.5; // Subtle variation for pen-tool effect
      
      let pathData = `M 0 ${baseY}`;
      
      for (let i = 1; i <= segments; i++) {
        const x = i * segmentWidth;
        // Single smooth sine wave for pen-tool effect
        const variation = Math.sin((i / segments) * Math.PI * 2) * maxVariation;
        const y = baseY + variation;
        
        // Use smooth quadratic curves
        if (i === 1) {
          pathData += ` Q ${x * 0.5} ${y} ${x} ${y}`;
        } else {
          const prevX = (i - 1) * segmentWidth;
          const prevY = baseY + Math.sin(((i - 1) / segments) * Math.PI * 2) * maxVariation;
          const controlX = prevX + (x - prevX) * 0.5;
          const controlY = (prevY + y) / 2;
          pathData += ` Q ${controlX} ${controlY} ${x} ${y}`;
        }
      }
      
      if (underlineRef.current) {
        underlineRef.current.setAttribute('d', pathData);
        
        // Get the total path length for animation
        const pathLengthValue = underlineRef.current.getTotalLength();
        underlineRef.current.style.strokeDasharray = `${pathLengthValue}`;
        underlineRef.current.style.strokeDashoffset = `${pathLengthValue}`;
      }
    };

    // Initial path setup
    updatePath();

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });
    resizeObserver.observe(textSpan);

    // Create ScrollTrigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: headingRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (underlineRef.current && textSpanRef.current) {
          const pathLength = underlineRef.current.getTotalLength();
          
          // Create timeline to sync underline and text color animations
          const tl = gsap.timeline();
          
          // Animate underline drawing
          tl.fromTo(underlineRef.current, 
            {
              strokeDashoffset: pathLength,
            },
            {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: "power3.out", // Stronger deceleration - slows significantly near completion
            }
          );
          
          // Simultaneously animate text color from current color to red
          tl.to(textSpanRef.current, {
            color: "#ef4444", // red-500
            duration: 1.2,
            ease: "power3.out",
          }, 0); // Start at the same time as underline animation
        }
      },
    });

    return () => {
      scrollTrigger.kill();
      resizeObserver.disconnect();
    };
  }, [heading]);

  if (!heading) return null;

  const words = heading.split(" ");
  const lastTwoWords = words.length >= 2 ? words.slice(-2).join(" ") : heading;
  const restOfText = words.length >= 2 ? words.slice(0, -2).join(" ") : "";

  return (
    <h2 
      ref={headingRef}
      className={`${textColor} text-3xl lg:text-5xl font-extrabold text-neutral-800 leading-tight tracking-tight mt-4 mb-6 inline-block`}
    >
      {restOfText && <span>{restOfText} </span>}
      <span ref={containerRef} className="relative inline-block">
        <span ref={textSpanRef} style={{ color: textColor === "text-neutral-100" ? "#f5f5f5" : "#262626" }}>
          {lastTwoWords}
        </span>
        <svg
          className="absolute bottom-0 left-0 w-full h-3 overflow-visible pointer-events-none"
          style={{ height: '12px' }}
        >
          <path
            ref={underlineRef}
            stroke="#ed1e24"
            strokeWidth="4"
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 0,
              strokeDashoffset: 0,
            }}
          />
        </svg>
      </span>
    </h2>
  );
}

