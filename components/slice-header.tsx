import type { KeyTextField } from "@prismicio/client";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";

interface SliceHeaderProps {
  subheading?: KeyTextField;
  className?: string;
  lineColor?: "light" | "dark";
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  variant?: "default" | "badge" | "badge-outline" | "underline" | "pill" | "accent-bar" | "minimal";
  badgeVariant?: VariantProps<typeof badgeVariants>["variant"];
  showLine?: boolean;
}

/**
 * Reusable slice header component
 * Features a subheading using h5 (JetBrains Mono via global CSS) with a full-width separator line
 * Supports left, center, or right alignment
 * Enhanced with optional badge variant for more visual interest
 */
export function SliceHeader({ 
  subheading, 
  className = "",
  lineColor = "light",
  textColor = "text-neutral-600",
  textAlign = "left",
  variant = "default",
  badgeVariant = "green",
  showLine = false
}: SliceHeaderProps) {
  if (!subheading) return null;

  // Get line color class based on variant
  const getLineColorClass = () => {
    // For badge variants, match the badge color with low opacity
    if (variant === "badge" && badgeVariant) {
      const badgeColorMap: Record<string, string> = {
        green: "bg-mach1-black/30",
        featured: "bg-dark-blue/30",
        closed: "bg-neutral-400/30",
        success: "bg-green-600/30",
        pending: "bg-amber-500/30",
        red: "bg-mach1-red/30",
        default: "bg-primary/30",
        secondary: "bg-secondary/30",
        destructive: "bg-destructive/30",
      };
      return badgeColorMap[badgeVariant] || "bg-mach1-green/30";
    }
    
    // For badge-outline, use neutral color with low opacity
    if (variant === "badge-outline") {
      return "bg-neutral-300/30";
    }
    
    // Default variant uses lineColor prop with low opacity
    return lineColor === "dark" ? "bg-neutral-800/30" : "bg-neutral-400/30";
  };

  const lineColorClass = getLineColorClass();

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

  // Underline variant - clean text with colored underline
  if (variant === "underline") {
    return (
      <div className={`w-full mb-2 ${className}`}>
        <h5 className={`text-sm ${textColor} uppercase tracking-wider ${alignClass} inline-block border-b-2 ${badgeVariant === "green" ? "border-mach1-green" : "border-neutral-400"}`}>
          {subheading}
        </h5>
      </div>
    );
  }

  // Pill variant - subtle background pill (less bold than badge)
  if (variant === "pill") {
    return (
      <div className={`w-full mb-2 ${className}`}>
        <div className={`flex ${alignClass === "text-center" ? "justify-center" : alignClass === "text-right" ? "justify-end" : "justify-start"}`}>
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-wider ${textColor} ${badgeVariant === "green" ? "bg-mach1-green/10" : "bg-neutral-100"}`}>
            {subheading}
          </span>
        </div>
      </div>
    );
  }

  // Accent bar variant - text with colored bar on left
  if (variant === "accent-bar") {
    return (
      <div className={`w-full mb-2 ${className}`}>
        <div className={`flex items-center gap-3 ${alignClass === "text-center" ? "justify-center" : alignClass === "text-right" ? "justify-end" : "justify-start"}`}>
          <div className={`w-1 h-6 ${badgeVariant === "green" ? "bg-mach1-green" : "bg-neutral-400"}`} />
          <h5 className={`text-sm ${textColor} uppercase tracking-wider ${alignClass}`}>
            {subheading}
          </h5>
        </div>
      </div>
    );
  }

  // Minimal variant - just clean text, no decoration
  if (variant === "minimal") {
    return (
      <div className={`w-full mb-2 ${className}`}>
        <h5 className={`text-sm ${textColor} uppercase tracking-wider ${alignClass}`}>
          {subheading}
        </h5>
      </div>
    );
  }

  // Badge variant - more visually interesting
  if (variant === "badge" || variant === "badge-outline") {
    // For centered badges, show lines on both sides (if showLine is true)
    if (textAlign === "center") {
      return (
        <div className={`w-full mb-2 ${className}`}>
          <div className="flex items-center justify-center gap-10">
            {showLine && (
              <>
                {/* Left line */}
                <div className={`flex-1 max-w-32 h-px ${lineColorClass}`} />
              </>
            )}
            
            {variant === "badge" ? (
              <Badge variant={badgeVariant} className="text-xs">
                {subheading}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                {subheading}
              </Badge>
            )}
            
            {showLine && (
              <>
                {/* Right line */}
                <div className={`flex-1 max-w-32 h-px ${lineColorClass}`} />
              </>
            )}
          </div>
        </div>
      );
    }
    
    // For left/right aligned badges, show single line extending from badge (if showLine is true)
    return (
      <div className={`w-full mb-2 ${className}`}>
        <div className={`flex items-center ${showLine ? 'gap-10' : ''} ${alignClass === "text-right" ? "justify-end" : "justify-start"}`}>
          {variant === "badge" ? (
            <Badge variant={badgeVariant} className="text-xs">
              {subheading}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-700">
              {subheading}
            </Badge>
          )}
          {showLine && (
            <div className={`flex-1 h-px ${lineColorClass}`} />
          )}
        </div>
      </div>
    );
  }

  // Default variant - enhanced with subtle background treatment
  return (
    <div className={`w-full mb-2 ${className}`}>
      <div className={`inline-flex items-center gap-3 ${alignClass === "text-center" ? "justify-center w-full" : alignClass === "text-right" ? "justify-end ml-auto" : ""}`}>
        <h5 className={`text-sm ${textColor} uppercase tracking-wider ${alignClass}`}>
          {subheading}
        </h5>
        {/* Decorative dot */}
        <div className={`w-1.5 h-1.5 rounded-full ${lineColor === "dark" ? "bg-neutral-800" : "bg-neutral-400"}`} />
      </div>
      <div className={`mt-3 ${lineWrapperClass}`}>
        <div className={`${lineWidthClass} h-px ${lineColorClass}`} />
      </div>
    </div>
  );
}

