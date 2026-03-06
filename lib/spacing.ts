/**
 * Spacing utilities for consistent margins and paddings across slices and pages
 */

export type MarginTopSize = "none" | "small" | "medium" | "large" | "extra-large";
export type PaddingSize = "none" | "small" | "medium" | "large" | "extra-large" | "extra-extra-large";

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
 * Get responsive margin-bottom class for slices and page content
 */
export function getMarginBottomClass(size: MarginTopSize = "large"): string {
  const margins: Record<MarginTopSize, string> = {
    none: "mb-0",
    small: "mb-6 lg:mb-12",
    medium: "mb-12 lg:mb-24",
    large: "mb-30 lg:mb-48",
    "extra-large": "mb-40 lg:mb-64",
  };

  return margins[size];
}

/**
 * Get padding-top class with same scale as margin-top.
 * Use when you need the "margin" space to have a background color (padding is inside the element).
 */
export function getPaddingTopFromMarginSize(size: MarginTopSize = "large"): string {
  const paddings: Record<MarginTopSize, string> = {
    none: "pt-0",
    small: "pt-6 lg:pt-12",
    medium: "pt-12 lg:pt-24",
    large: "pt-30 lg:pt-48",
    "extra-large": "pt-40 lg:pt-64",
  };
  return paddings[size];
}

/**
 * Get padding-bottom class with same scale as margin-bottom.
 * Use when you need the "margin" space to have a background color (padding is inside the element).
 */
export function getPaddingBottomFromMarginSize(size: MarginTopSize = "large"): string {
  const paddings: Record<MarginTopSize, string> = {
    none: "pb-0",
    small: "pb-6 lg:pb-12",
    medium: "pb-12 lg:pb-24",
    large: "pb-30 lg:pb-48",
    "extra-large": "pb-40 lg:pb-64",
  };
  return paddings[size];
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
 * Maximum width of 100rem (1600px) with responsive horizontal padding
 */
export function getContainerClass(): string {
  return "w-full max-w-[88rem] mx-auto px-4 lg:px-8";
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
    "extra-large": "py-24 lg:py-32",
    "extra-extra-large": "py-56 lg:py-[22rem]",
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
    "extra-large": "pt-24 lg:pt-32",
    "extra-extra-large": "pt-56 lg:pt-[22rem]",
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
    "extra-large": "pb-24 lg:pb-32",
    "extra-extra-large": "pb-56 lg:pb-[22rem]",
  };
  return paddings[size];
}

/**
 * Get responsive top padding class with mobile-only padding
 * Useful for sections that need padding on mobile but not on desktop
 */
export function getPaddingTopClassMobileOnly(size: PaddingSize = "medium"): string {
  const paddings: Record<PaddingSize, string> = {
    none: "pt-0",
    small: "pt-8 lg:pt-0",
    medium: "pt-16 lg:pt-0",
    large: "pt-24 lg:pt-0",
    "extra-large": "pt-32 lg:pt-0",
    "extra-extra-large": "pt-56 lg:pt-0",
  };
  return paddings[size];
}

