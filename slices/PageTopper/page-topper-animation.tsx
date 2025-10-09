"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Home } from "lucide-react";
import Link from "next/link";

interface PageTopperAnimationProps {
  subheading?: string;
  heading?: string;
}

export function PageTopperAnimation({ subheading, heading }: PageTopperAnimationProps) {
  const homeIconRef = useRef<HTMLAnchorElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);

    document.fonts.ready.then(() => {
      const textElements = [];
      
      if (subheadingRef.current && subheading) {
        textElements.push(subheadingRef.current);
      }
      
      if (headingRef.current && heading) {
        textElements.push(headingRef.current);
      }

      // Create timeline for coordinated animations
      const tl = gsap.timeline();

      // Animate home icon first
      if (homeIconRef.current) {
        gsap.set(homeIconRef.current, { opacity: 0, y: 20 });
        tl.to(homeIconRef.current, {
          duration: 0.6,
          opacity: 1,
          y: 0,
          ease: "expo.out",
        });
      }

      // Set initial opacity for text elements
      if (textElements.length > 0) {
        gsap.set(textElements, { opacity: 1 });

        // Create SplitText instances and add to timeline
        const splits = textElements.map((element, index) => {
          return SplitText.create(element, {
            type: "words,lines",
            linesClass: "line",
            autoSplit: true,
            mask: "lines",
            onSplit: (self) => {
              const delay = homeIconRef.current ? 0.2 : 0; // Delay text if home icon exists
              tl.from(self.lines, {
                duration: 0.6,
                yPercent: 100,
                opacity: 0,
                stagger: 0.1,
                ease: "expo.out",
              }, delay + (index * 0.1));
            },
          });
        });

        // Cleanup on unmount
        return () => {
          splits.forEach((split) => split.revert());
        };
      }
    });
  }, [subheading, heading]);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 mb-5">
        {/* Home Breadcrumb */}
        <Link 
          ref={homeIconRef}
          href="/"
          className="text-red-200 text-sm lg:text-xs font-bold tracking-wider uppercase px-4 py-2 bg-mach1-red rounded-2xl w-fit flex items-center hover:bg-red-700 transition-colors opacity-0"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {/* Separator */}
        {subheading && (
          <>

            {/* Current Page Breadcrumb */}
            <h5 
              ref={subheadingRef}
              className="text-red-200 text-sm lg:text-xs font-bold tracking-wider uppercase px-4 py-2 bg-mach1-red rounded-2xl w-fit opacity-0"
            >
              {subheading}
            </h5>
          </>
        )}
      </nav>

      {/* Heading */}
      {heading && (
        <h2 
          ref={headingRef}
          className="text-neutral-100 text-4xl lg:text-6xl font-bold leading-tight opacity-0"
        >
          {heading}
        </h2>
      )}
    </div>
  );
}

