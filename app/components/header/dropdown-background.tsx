/**
 * DropdownBackground Component
 * 
 * Renders dynamic SVG backgrounds for navigation dropdown menus.
 * Supports two variants: with-image (wider) and no-image (compact).
 * 
 * Features:
 * - Dynamic width scaling based on content
 * - Preserves corner angles and rounded edges
 * - Maintains proper drop shadows and borders
 * - Scales middle sections while keeping edges intact
 * - Modern fade transitions between images
 */

import type { ImageField } from "@prismicio/client";

/**
 * Generate optimized Prismic image URL with proper sizing and quality
 * This gives us the same optimisation benefits as PrismicNextImage
 */
const getOptimizedImageUrl = (image: ImageField | undefined, width = 1000, height = 400): string => {
  if (!image?.url) return '';
  
  const url = new URL(image.url);
  
  // Add Prismic image optimization parameters (same as PrismicNextImage)
  url.searchParams.set('auto', 'format,compress'); // Auto WebP/AVIF + compression
  url.searchParams.set('fit', 'crop'); // Crop to exact dimensions
  url.searchParams.set('w', width.toString()); // Width optimization
  url.searchParams.set('h', height.toString()); // Height optimization
  url.searchParams.set('q', '95'); // Quality (85% is optimal balance)
  url.searchParams.set('fm', 'webp'); // Force WebP format for better compression
  
  return url.toString();
};

interface DropdownBackgroundProps {
  /** Whether the dropdown includes an image area */
  hasImage?: boolean;
  /** Dynamic height based on content */
  height?: number;
  /** Dynamic width based on text content */
  width?: number;
  /** Number of navigation items for horizontal separators */
  itemCount?: number;
  /** Width of the longest text for line length calculation */
  longestTextWidth?: number;
  /** Additional CSS classes */
  className?: string;
  /** Prismic image field for the dropdown */
  image?: ImageField;
  /** Previous image for crossfade transition */
  previousImage?: ImageField;
  /** Unique key for image transitions */
  imageKey?: string;
  /** Unique identifier for this dropdown instance */
  dropdownId?: string;
}

export function DropdownBackground({ 
  hasImage = false, 
  height = 490, 
  width, 
  className = "",
  image,
  previousImage,
  imageKey,
  dropdownId = "default"
}: DropdownBackgroundProps) {
  
  if (hasImage) {
    // =================================================================
    // WITH IMAGE VERSION - Wider layout with gray image area
    // =================================================================
    
    const topEdgeHeight = 85.5;    // Height to end of angled section
    const bottomEdgeHeight = 22;   // Height of bottom rounded section
    const safeHeight = Math.max(height, topEdgeHeight + bottomEdgeHeight + 50);
    const containerWidth = width || 878; // Default to Figma width
    
    // Calculate actual clipped image area dimensions
    const clipTopOffset = 63.9994;  // Top of clipped area
    const clipBottomOffset = -2; // Bottom margin in clipped area (negative extends below)
    const actualImageHeight = (height + 40) - clipTopOffset - clipBottomOffset; // True clipped height
    
    // Create unique clipPath ID for this dropdown instance
    const clipPathId = `grayAreaClip-${dropdownId}`;
    
    return (
      <div className={`absolute inset-0 ${className}`}>
        {/* Main Container SVG */}
        <svg 
          width={containerWidth} 
          height={height} 
          viewBox={`0 0 ${containerWidth} ${height}`} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full"
          style={{
            shapeRendering: 'geometricPrecision', // Crisp edges
            imageRendering: 'crisp-edges' // Crisp image rendering
          }}
        >
          <defs>
            <filter 
              id="filter0_d_191_832" 
              x="0.5" 
              y="0.5" 
              width="877" 
              height={height - 1} 
              filterUnits="userSpaceOnUse" 
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix 
                in="SourceAlpha" 
                type="matrix" 
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" 
                result="hardAlpha"
              />
              <feOffset dy="-1"/>
              <feGaussianBlur stdDeviation="8.75"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix 
                type="matrix" 
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
              />
              <feBlend 
                mode="normal" 
                in2="BackgroundImageFix" 
           
              />
              <feBlend 
                mode="normal" 
                in="SourceGraphic" 
               
                result="shape"
              />
            </filter>
          </defs>
          
          <g>
            {/* Main container path with dynamic height */}
            <path 
              d={`M18 19H772L827.5 58L860 81.5V${safeHeight - bottomEdgeHeight}C860 ${safeHeight - bottomEdgeHeight + 3}.761 857.761 ${safeHeight - bottomEdgeHeight + 5} 855 ${safeHeight - bottomEdgeHeight + 5}H23C20.2386 ${safeHeight - bottomEdgeHeight + 5} 18 ${safeHeight - bottomEdgeHeight + 3}.761 18 ${safeHeight - bottomEdgeHeight}V19Z`} 
              fill="#f5f5f5"
            />
            
            {/* Border stroke path */}
            <path 
              d={`M23 19.5H771.842L827.207 58.4043V58.4053L859.5 81.7549V${safeHeight - bottomEdgeHeight}C859.5 ${safeHeight - bottomEdgeHeight + 2}.485 857.485 ${safeHeight - bottomEdgeHeight + 4}.5 855 ${safeHeight - bottomEdgeHeight + 4}.5H23C20.5147 ${safeHeight - bottomEdgeHeight + 4}.5 18.5 ${safeHeight - bottomEdgeHeight + 2}.485 18.5 ${safeHeight - bottomEdgeHeight}V19.5Z`} 
              stroke="#D9D9D9"
            />
          </g>
        </svg>
        
        {/* Gray Image Area SVG - positioned absolutely on the right */}
        <svg 
          width="519" 
          height={height - 35} 
          viewBox={`0 0 519 ${height - 35}`} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="absolute right-0 top-0 h-full"
          style={{
            shapeRendering: 'geometricPrecision', // Crisp edges for geometric shapes
            imageRendering: 'crisp-edges' // Crisp image rendering
          }}
        >
          <defs>
            <clipPath id={clipPathId}>
              <path d={`M519 63.9994L435.783 3.91169C433.193 2.09117 430.149 1.03456 426.998 0.856079H257.217V0.870358L0 0.856079L0 ${(height - 35) - 63.644 + 2}L83.2169 ${(height - 35) - 3.556 + 2}C85.8069 ${(height - 35) - 1.735 + 2} 88.8507 ${(height - 35) - 0.679 + 2} 92.0016 ${(height - 35) - 0.5 + 2}H261.783V${(height - 35) - 0.514 + 2}L${519 - 4} ${(height - 35) - 0.5 + 2}A4 4 0 0 1 519 ${(height - 35) - 0.5 - 2}V63.9994Z`} />
            </clipPath>
            {/* Darken filter for first image */}
            <filter id={`darkenFilter-${dropdownId}`}>
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.8" intercept="0"/>
                <feFuncG type="linear" slope="0.8" intercept="0"/>
                <feFuncB type="linear" slope="0.8" intercept="0"/>
              </feComponentTransfer>
            </filter>
          </defs>
          
          {/* Gray background */}
          <path 
            d={`M519 63.9994L435.783 3.91169C433.193 2.09117 430.149 1.03456 426.998 0.856079H257.217V0.870358L0 0.856079L0 ${(height - 35) - 63.644 + 2}L83.2169 ${(height - 35) - 3.556 + 2}C85.8069 ${(height - 35) - 1.735 + 2} 88.8507 ${(height - 35) - 0.679 + 2} 92.0016 ${(height - 35) - 0.5 + 2}H261.783V${(height - 35) - 0.514 + 2}L${519 - 4} ${(height - 35) - 0.5 + 2}A4 4 0 0 1 519 ${(height - 35) - 0.5 - 2}V63.9994Z`} 
            fill="#D9D9D9"
          />
          
          {/* True crossfade - previous stays visible while new fades in */}
          <g clipPath={`url(#${clipPathId})`}>
            {/* Only render crossfade if we have a previous image to transition from */}
            {previousImage?.url && previousImage.url !== image?.url ? (
              <>
                {/* Previous image - stays visible during transition */}
                <image
                  href={getOptimizedImageUrl(previousImage, 1000, actualImageHeight)}
                  x="-240"
                  y="0"
                  width="1000"
                  height={actualImageHeight}
                  preserveAspectRatio="xMidYMid slice"
                  opacity="1"
                  style={{
                    imageRendering: 'crisp-edges'
                  }}
                />
                {/* New image - fades in on top */}
                <image
                  key={imageKey}
                  href={getOptimizedImageUrl(image, 1000, actualImageHeight)}
                  x="-240"
                  y="0"
                  width="1000"
                  height={actualImageHeight}
                  preserveAspectRatio="xMidYMid slice"
                  filter={`url(#darkenFilter-${dropdownId})`}
                  style={{
                    opacity: 0,
                    animation: `dropdownImageFade 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    willChange: 'opacity',
                    backfaceVisibility: 'hidden',
                    imageRendering: 'crisp-edges'
                  }}
                />
              </>
            ) : (
              /* First image or same image - render single image with no animation */
              image?.url && (
                <image
                  href={getOptimizedImageUrl(image, 1000, actualImageHeight)}
                  x="-240"
                  y="0"
                  width="1000"
                  height={actualImageHeight}
                  preserveAspectRatio="xMidYMid slice"
                  opacity="1"
                  filter={!previousImage?.url || previousImage.url === image.url ? `url(#darkenFilter-${dropdownId})` : undefined}
                  style={{
                    imageRendering: 'crisp-edges'
                  }}
                />
              )
            )}
          </g>
          
          {/* CSS for simple fade animation */}
          <defs>
            <style>
              {`
                @keyframes dropdownImageFade {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
              `}
            </style>
          </defs>
        </svg>
        
        {/* =================================================================
            DROPDOWN SEPARATOR LINES (WITH IMAGE VERSION)
            ================================================================= */}
        
        {/* Separator lines now handled in navigation component for consistent positioning */}
      </div>
    );
  }

  // =================================================================
  // NO IMAGE VERSION - Compact layout with dynamic width scaling
  // =================================================================
  
  const topEdgeHeight = 79.7345;  // Height to end of angled section
  const bottomEdgeHeight = 22;    // Height of bottom rounded section
  const safeHeight = Math.max(height, topEdgeHeight + bottomEdgeHeight + 30);
  
  // Dynamic width calculation - scales from center to preserve corners
  const baseWidth = 300;          // Original Figma width
  const targetWidth = width || baseWidth;
  const widthDifference = targetWidth - baseWidth;
  
  // Proper center-based scaling - preserves corner angles
  // Left corner stays fixed, middle section scales, right corner moves outward
  const baseH = 194.166;           // Original H coordinate (end of horizontal line)
  const baseL1 = 249.561;          // Original L1 coordinate (start of angled corner)  
  const baseL2 = 282;              // Original L2 coordinate (end of angled corner)
  const baseBorderL = 281.5;       // Original border L coordinate
  const baseBorderH = 194.011;     // Original border H coordinate
  const baseRightEdge = 277;       // Original right edge
  const baseRightEdgeBorder = 279.485; // Original right edge border
  
  // Scale strategy: Keep left fixed, stretch middle, move right corner
  const scaledH = baseH + widthDifference;                   // Extend horizontal line
  const scaledL1 = baseL1 + widthDifference;                 // Move corner start
  const scaledL2 = baseL2 + widthDifference;                 // Move corner end  
  const scaledBorderL = baseBorderL + widthDifference;       // Move border corner
  const scaledBorderH = baseBorderH + widthDifference;       // Move border horizontal
  const scaledRightEdge = baseRightEdge + widthDifference;   // Move right edge
  const scaledRightEdgeBorder = baseRightEdgeBorder + widthDifference; // Move right border
  const filterWidth = targetWidth - 1;                       // Filter width = SVG width - 1
  
  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg 
        width={targetWidth} 
        height={height} 
        viewBox={`0 0 ${targetWidth} ${height}`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full"
        style={{
          shapeRendering: 'geometricPrecision', // Crisp edges
          imageRendering: 'crisp-edges' // Crisp image rendering
        }}
      >
        <defs>
          <filter 
            id="filter0_d_338_832" 
            x="0.5" 
            y="0.5" 
            width={filterWidth} 
            height={height - 1} 
            filterUnits="userSpaceOnUse" 
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix 
              in="SourceAlpha" 
              type="matrix" 
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" 
              result="hardAlpha"
            />
            <feOffset dy="-1"/>
            <feGaussianBlur stdDeviation="8.75"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix 
              type="matrix" 
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend 
              mode="normal" 
              in2="BackgroundImageFix" 
          
            />
            <feBlend 
              mode="normal" 
              in="SourceGraphic" 
        
              result="shape"
            />
          </filter>
        </defs>
        
        <g>
          {/* Main container path - preserves corner angles, scales middle section */}
          <path 
            d={`M18 19H${scaledH}L${scaledL1} 56.8983L${scaledL2} 79.7345V${safeHeight - bottomEdgeHeight}C${scaledL2} ${safeHeight - bottomEdgeHeight + 3}.761 ${scaledRightEdge + 2.761} ${safeHeight - bottomEdgeHeight + 5} ${scaledRightEdge} ${safeHeight - bottomEdgeHeight + 5}H23C20.2386 ${safeHeight - bottomEdgeHeight + 5} 18 ${safeHeight - bottomEdgeHeight + 3}.761 18 ${safeHeight - bottomEdgeHeight}V19Z`} 
            fill="#f5f5f5"
          />
          
          {/* Border stroke path - follows same scaling pattern */}
          <path 
            d={`M23 19.5H${scaledBorderH}L${scaledBorderL} 79.9961V${safeHeight - bottomEdgeHeight}C${scaledBorderL} ${safeHeight - bottomEdgeHeight + 2}.485 ${scaledRightEdgeBorder} ${safeHeight - bottomEdgeHeight + 4}.5 ${scaledRightEdge} ${safeHeight - bottomEdgeHeight + 4}.5H23C20.5147 ${safeHeight - bottomEdgeHeight + 4}.5 18.5 ${safeHeight - bottomEdgeHeight + 2}.485 18.5 ${safeHeight - bottomEdgeHeight}V19.5Z`} 
            stroke="#D9D9D9"
          />
        </g>
        
        {/* =================================================================
            DROPDOWN SEPARATOR LINES
            ================================================================= */}
        
        {/* Vertical separator line now handled in navigation component for better positioning */}
        
        {/* Horizontal separator lines now handled in navigation component for better positioning */}
      </svg>
    </div>
  );
}