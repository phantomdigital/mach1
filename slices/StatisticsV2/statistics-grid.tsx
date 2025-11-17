"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  number?: string | null;
  suffix?: string | null;
  label?: string | null;
}

interface PrismicStatItem {
  number?: { text?: string } | null;
  suffix?: { text?: string } | null;
  label?: { text?: string } | null;
}

interface StatisticsGridProps {
  statistics: PrismicStatItem[];
}

// Counter animation component
function CountUpNumber({ 
  target, 
  suffix = "",
  duration = 2 
}: { 
  target: string; 
  suffix?: string | null;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Parse the target number (handle K, M suffixes in the number itself)
  const parseTarget = (value: string): number => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleanValue) || 0;
  };

  const targetNumber = parseTarget(target);

  // Use Intersection Observer instead of framer-motion to avoid conflicts
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Don't set up observer if already animated
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Add a small delay to let GSAP animations settle
          setTimeout(() => {
            let startTime: number | null = null;
            let animationFrame: number;

            const animate = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
              
              // Smoother easing function - ease out expo
              const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              
              setCount(Math.floor(targetNumber * easeOutExpo));

              if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
              } else {
                setCount(targetNumber);
              }
            };

            animationFrame = requestAnimationFrame(animate);
          }, 300); // Delay to allow GSAP card animation to complete

          observer.unobserve(element);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-50px"
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, targetNumber, duration]);

  return (
    <div ref={ref} className="text-4xl lg:text-5xl xl:text-6xl font-bold text-dark-blue mb-2 transition-transform duration-300 group-hover:scale-110">
      {count}
      {suffix && (
        <span className="text-mach1-green">{suffix}</span>
      )}
    </div>
  );
}

export default function StatisticsGrid({ statistics }: StatisticsGridProps) {
  if (!statistics || statistics.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
      {statistics.map((stat, index) => {
        // Extract text values from Prismic fields
        const number = typeof stat.number === 'string' ? stat.number : stat.number?.text;
        const suffix = typeof stat.suffix === 'string' ? stat.suffix : stat.suffix?.text;
        const label = typeof stat.label === 'string' ? stat.label : stat.label?.text;
        
        
        return (
          <div 
            key={index}
            data-animate="stat-card"
            className="group relative bg-neutral-100 transition-all duration-300 overflow-hidden"
            style={{
              clipPath: 'polygon(0% 0%, 98% 0%, 100% 4%, 100% 100%, 2% 100%, 0% 98%)'
            }}
          >
            {/* Accent bar - animates on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-mach1-green" />
            
            {/* Content */}
            <div className="relative px-6 py-8 lg:py-12 text-center">
              {/* Number with count-up animation */}
              {number && (
                <CountUpNumber 
                  target={number} 
                  suffix={suffix}
                  duration={2}
                />
              )}
              
              {/* Label */}
              {label && (
                <h5 className="text-dark-blue text-xs lg:text-sm uppercase tracking-wider">
                  {label}
                </h5>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

