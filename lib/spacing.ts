/**
 * Spacing utilities for consistent margins and paddings across slices and pages
 */

export type MarginTopSize = "none" | "small" | "medium" | "large" | "extra-large";
export type PaddingSize = "none" | "small" | "medium" | "large";

/**
 * Get responsive margin-top class for slices and page content
 * Use this when content doesn't have a PageTopper above it
 */
export function getMarginTopClass(size: MarginTopSize = "large"): string {
  const margins: Record<MarginTopSize, string> = {
    none: "mt-0",
    small: "mt-6 lg:mt-12",
    medium: "mt-12 lg:mt-24",
    large: "mt-30 lg:mt-48",
    "extra-large": "mt-40 lg:mt-64",
  };

  return margins[size];
}

/**
 * Get responsive padding-top and padding-bottom class for sections
 * Standard vertical spacing for slice sections
 */
export function getSectionPaddingClass(): string {
  return "py-16 lg:py-24";
}

/**
 * Get standard container class for consistent alignment
 * Maximum width of 110rem (1760px) with responsive horizontal padding
 */
export function getContainerClass(): string {
  return "w-full max-w-[110rem] mx-auto px-4 lg:px-8";
}

/**
 * Get standard full-width section wrapper class
 */
export function getSectionWrapperClass(background: "white" | "neutral" = "white"): string {
  const bgClass = background === "neutral" ? "bg-neutral-50" : "bg-white";
  return `w-full ${getSectionPaddingClass()} ${bgClass}`;
}

/**
 * Get responsive vertical padding class
 * Use this for customizable section padding
 */
export function getPaddingYClass(size: PaddingSize = "large"): string {
  const paddings: Record<PaddingSize, string> = {
    none: "py-0",
    small: "py-8 lg:py-12",
    medium: "py-12 lg:py-16",
    large: "py-16 lg:py-24",
  };
  return paddings[size];
}

/**
 * Get responsive top padding class
 */
export function getPaddingTopClass(size: PaddingSize = "large"): string {
  const paddings: Record<PaddingSize, string> = {
    none: "pt-0",
    small: "pt-8 lg:pt-12",
    medium: "pt-12 lg:pt-16",
    large: "pt-16 lg:pt-24",
  };
  return paddings[size];
}

/**
 * Get responsive bottom padding class
 */
export function getPaddingBottomClass(size: PaddingSize = "large"): string {
  const paddings: Record<PaddingSize, string> = {
    none: "pb-0",
    small: "pb-8 lg:pb-12",
    medium: "pb-12 lg:pb-16",
    large: "pb-16 lg:pb-24",
  };
  return paddings[size];
}

