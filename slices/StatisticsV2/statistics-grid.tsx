"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatItem {
  number?: string | null;
  suffix?: string | null;
  label?: string | null;
}

interface StatisticsGridProps {
  statistics: StatItem[];
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse the target number (handle K, M suffixes in the number itself)
  const parseTarget = (value: string): number => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleanValue) || 0;
  };

  const targetNumber = parseTarget(target);

  useEffect(() => {
    if (!isInView) return;

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

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, targetNumber, duration]);

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
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
      {statistics.map((stat, index) => (
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
            {stat.number && (
              <CountUpNumber 
                target={stat.number} 
                suffix={stat.suffix}
                duration={2}
              />
            )}
            
            {/* Label */}
            {stat.label && (
              <h5 className="text-dark-blue text-xs lg:text-sm uppercase tracking-wider">
                {stat.label}
              </h5>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

