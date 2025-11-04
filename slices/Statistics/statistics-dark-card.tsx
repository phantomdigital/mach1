"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatisticsDarkCardProps {
  percentage: string;
  title: string;
  description: string;
  index: number;
}

const StatisticsDarkCard = ({ percentage, title, description, index }: StatisticsDarkCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Extract the number from percentage (e.g., "35%+" -> 35)
  const targetNumber = parseInt(percentage.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = percentage.replace(/[0-9]/g, ''); // Get the suffix like "%+"
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    duration: 2
  });
  
  useEffect(() => {
    if (isInView) {
      // Start animation after a delay based on index for staggered effect
      const timer = setTimeout(() => {
        motionValue.set(targetNumber);
      }, index * 200 + 200);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, targetNumber, motionValue, index]);
  
  // Round the spring value for display
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return (
    <motion.article 
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
    >
      {/* Dark card container */}
      <div className="relative p-6 lg:p-8 rounded-lg bg-neutral-800">
        {/* Content container */}
        <div className="flex flex-col space-y-4">
          {/* Large metric */}
          <motion.div 
            className="text-5xl lg:text-6xl font-bold text-neutral-200 leading-tight"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            {displayValue}
            <span className="text-neutral-300 text-4xl lg:text-5xl font-medium ml-1">
              {suffix}
            </span>
          </motion.div>
          
          {/* Title */}
          <motion.h3 
            className="text-base lg:text-lg font-medium text-neutral-300 uppercase tracking-wider leading-tight"
            initial={{ opacity: 0, x: -15 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            {title}
          </motion.h3>
          
          {/* Curved separator line */}
          <motion.div 
            className="w-full h-4"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
            style={{ originX: 0 }}
          >
            <svg 
              width="100%" 
              height="16" 
              viewBox="0 0 540 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <motion.path 
                d="M0 1L501.004 1C508.668 1 516.144 3.2 522.407 7L539 15" 
                stroke="#737373" 
                strokeWidth="1"
                strokeMiterlimit="10"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.0, delay: index * 0.1 + 0.5 }}
              />
            </svg>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="text-neutral-300 text-sm lg:text-base leading-relaxed font-normal"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.article>
  );
};

export default StatisticsDarkCard;

