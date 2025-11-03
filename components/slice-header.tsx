import type { KeyTextField } from "@prismicio/client";

interface SliceHeaderProps {
  subheading?: KeyTextField;
  className?: string;
  lineColor?: "light" | "dark";
  textColor?: string;
  textAlign?: "left" | "center" | "right";
}

/**
 * Reusable slice header component
 * Features a subheading using h5 (JetBrains Mono via global CSS) with a full-width separator line
 * Supports left, center, or right alignment
 */
export function SliceHeader({ 
  subheading, 
  className = "",
  lineColor = "light",
  textColor = "text-neutral-600",
  textAlign = "left"
}: SliceHeaderProps) {
  if (!subheading) return null;

  const lineColorClass = lineColor === "dark" 
    ? "bg-neutral-800" 
    : "bg-neutral-400";

  const alignClass = textAlign === "center" 
    ? "text-center" 
    : textAlign === "right" 
    ? "text-right" 
    : "text-left";

  // For centered text, use a shorter centered line; for left/right, use full width
  const lineWrapperClass = textAlign === "center"
    ? "flex justify-center"
    : "w-full";

  const lineWidthClass = textAlign === "center"
    ? "w-16" // Shorter line for centered
    : "w-full";

  return (
    <div className={`w-full mb-6 ${className}`}>
      <h5 className={`text-sm ${textColor} uppercase tracking-wider mb-2 ${alignClass}`}>
        {subheading}
      </h5>
      <div className={lineWrapperClass}>
        <div className={`${lineWidthClass} h-px ${lineColorClass}`} />
      </div>
    </div>
  );
}

