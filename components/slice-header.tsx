import type { KeyTextField } from "@prismicio/client";

interface SliceHeaderProps {
  subheading?: KeyTextField;
  className?: string;
  lineColor?: "light" | "dark";
  textColor?: string;
}

/**
 * Reusable slice header component
 * Features a left-aligned subheading using h5 (JetBrains Mono via global CSS) with a full-width separator line
 */
export function SliceHeader({ 
  subheading, 
  className = "",
  lineColor = "light",
  textColor = "text-neutral-600"
}: SliceHeaderProps) {
  if (!subheading) return null;

  const lineColorClass = lineColor === "dark" 
    ? "bg-neutral-800" 
    : "bg-neutral-400";

  return (
    <div className={`w-full mb-6 ${className}`}>
      <h5 className={`text-sm ${textColor} uppercase tracking-wider mb-2`}>
        {subheading}
      </h5>
      <div className={`w-full h-px ${lineColorClass}`} />
    </div>
  );
}

