"use client";

import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { navigationButtonVariants } from "./step-animations";

interface StepNavigationProps {
  currentStep: number;
  onPrevious: () => void;
}

export function StepNavigation({
  currentStep,
  onPrevious,
}: StepNavigationProps) {
  // Only show on step 2+ (can go back to previous steps)
  // Hide on step 1 (no previous step)
  if (currentStep === 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-end mt-8">
      {/* Previous Button - only for going back */}
      <motion.button
        onClick={onPrevious}
        variants={navigationButtonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="w-12 h-12 rounded-full flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 text-neutral-800 cursor-pointer transition-colors duration-200"
        aria-label="Previous step"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

