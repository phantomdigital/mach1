"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface StepIndicatorProps {
  stepNumber: number;
  stepTitle: string;
  totalSteps: number;
  onBack?: () => void;
}

interface TickerDigitProps {
  digit: string;
  shouldAnimate: boolean;
}

function TickerDigit({ digit, shouldAnimate }: TickerDigitProps) {
  return (
    <div className="relative overflow-hidden inline-block" style={{ height: "96px", width: "60px" }}>
      {shouldAnimate ? (
        <AnimatePresence mode="wait">
          <motion.span
            key={digit}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ 
              duration: 0.5, 
              ease: [0.45, 0, 0.55, 1]
            }}
            className="text-8xl font-bold text-neutral-200 absolute inset-0 flex items-center justify-center"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span
          className="text-8xl font-bold text-neutral-200 absolute inset-0 flex items-center justify-center"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {digit}
        </span>
      )}
    </div>
  );
}

export function StepIndicator({
  stepNumber,
  stepTitle,
  totalSteps,
  onBack,
}: StepIndicatorProps) {
  const previousStepRef = useRef<number>(stepNumber);
  const currentDigits = String(stepNumber).padStart(2, "0").split("");
  const previousDigits = String(previousStepRef.current).padStart(2, "0").split("");
  
  // Update ref after animation has started
  useEffect(() => {
    previousStepRef.current = stepNumber;
  }, [stepNumber]);
  
  return (
    <div className="flex items-center gap-4 md:gap-6">
      {/* Back Button - only show if onBack is provided (step 2+) */}
      {onBack && (
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 text-neutral-800 cursor-pointer transition-colors duration-200 flex-shrink-0"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}
      
      {/* Large background number with overlaid title */}
      <div className="relative flex items-center">
        {/* Individual digits - only animate the ones that change */}
        <div className="flex">
          {currentDigits.map((digit, index) => (
            <TickerDigit 
              key={index} 
              digit={digit} 
              shouldAnimate={digit !== previousDigits[index]}
            />
          ))}
        </div>
        
        {/* Step title overlaid on number */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${stepNumber}-${stepTitle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-start pl-3 pointer-events-none"
          >
            <span
              className="text-xs uppercase tracking-widest font-semibold text-neutral-800"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {stepTitle}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Horizontal line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:block flex-1 h-px bg-neutral-200"
      />
    </div>
  );
}

