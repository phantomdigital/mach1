/**
 * ExternalLinkIcon Component
 * 
 * A clean external link icon with diagonal arrow design.
 * Used in navigation dropdown items to indicate external links.
 */

interface ExternalLinkIconProps {
  /** Additional CSS classes */
  className?: string;
  /** Icon color - defaults to #262626 */
  color?: string;
}

export function ExternalLinkIcon({ 
  className = "w-[13px] h-[13px]", 
  color = "#262626" 
}: ExternalLinkIconProps) {
  return (
    <svg 
      viewBox="0 0 13 13" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12L12 1M12 1H1M12 1V12" 
        stroke={color} 
        strokeWidth="1.75" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
