/**
 * Step Animations Configuration
 * 
 * Professional and sleek animation variants for multi-step flow transitions.
 * Uses Framer Motion for smooth, performant animations.
 */

import type { Variants } from "framer-motion";

/**
 * Animation variants for step content
 * Fade in from slight offset with smooth easing
 */
export const stepContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve for smoothness
    },
  },
  exit: {
    opacity: 0,
    y: -10, // Reduced movement for softer exit
    scale: 0.99, // Less scale change for subtlety
    transition: {
      duration: 0.4, // Slightly longer for smoother fade
      ease: [0.4, 0, 0.2, 1], // Gentler easing curve
    },
  },
};

/**
 * Animation variants for step indicators
 * Smooth scale and color transitions
 */
export const stepIndicatorVariants: Variants = {
  inactive: {
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  active: {
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  completed: {
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * Animation variants for navigation buttons
 * Subtle hover and tap feedback
 */
export const navigationButtonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
  disabled: {
    opacity: 0.5,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Animation variants for cards
 * Staggered entrance with subtle lift on hover
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.1, // Stagger delay
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Container variants for staggering children
 */
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Spring configuration for smooth, natural motion
 */
export const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

/**
 * Transition configuration for page changes
 */
export const pageTransition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
};

