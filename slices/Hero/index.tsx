import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import HeroSlideshow from "./hero-slideshow";
import ServiceCarousel from "./service-carousel";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full min-h-[100dvh] relative bg-neutral-50"
    >
      {/* Container matching header width and padding */}
      <div className="w-full px-4 lg:px-8 relative">
        <div className="max-w-[112rem] mx-auto">
          {/* Text Content Section - Top with standard spacing */}
          <div className="pt-32 pb-12 lg:pt-40 lg:pb-16">
            <div className="max-w-3xl">
              {/* Subheading */}
              {slice.primary.subheading && (
                <h5 className="text-sm text-neutral-800 font-medium uppercase tracking-wide mb-4">
                  {slice.primary.subheading}
                </h5>
              )}
              
              {/* Main Title */}
              {slice.primary.title && (
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-800 leading-tight mb-6">
                  {slice.primary.title}
                </h1>
              )}
              
              {/* Description */}
              {slice.primary.description && (
                <p className="text-lg lg:text-xl text-neutral-600 leading-relaxed">
                  {slice.primary.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Image Section with SVG clip path */}
      {slice.items && slice.items.length > 0 && (
        <div className="w-full px-4 lg:px-8 relative">
          <div className="max-w-[112rem] mx-auto pb-16 lg:pb-24">
          <div 
            className="relative w-full aspect-[1279/579]"
            style={{
              clipPath: 'polygon(100% 26.86%, 83.96% 1.3%, 82.96% 0.76%, 81.83% 0%, 49.53% 0%, 49.53% 0.006%, 0% 0.006%, 0% 73.14%, 16.04% 98.7%, 17.04% 99.24%, 18.17% 100%, 50.47% 100%, 50.47% 99.994%, 100% 99.994%)'
            }}
          >
            <HeroSlideshow images={slice.items} />
            
            {/* Scanlines Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-100"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 0, 0, 0.1) 2px,
                  rgba(0, 0, 0, 0.1) 4px
                )`,
                mixBlendMode: 'overlay'
              }}
            />
            
            {/* Modern Corner Edge Glow - Top Left */}
            <div 
              className="absolute top-0 left-0 w-80 h-80 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top left, 
                  rgba(59, 130, 246, 0.15) 0%, 
                  rgba(139, 92, 246, 0.08) 30%, 
                  transparent 60%
                )`,
                filter: 'blur(1px)'
              }}
            />
            
            {/* Modern Corner Edge Glow - Top Right */}
            <div 
              className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top right, 
                  rgba(236, 72, 153, 0.12) 0%, 
                  rgba(59, 130, 246, 0.06) 30%, 
                  transparent 60%
                )`,
                filter: 'blur(1px)'
              }}
            />
            
            {/* Modern Corner Edge Glow - Bottom Left */}
            <div 
              className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
              style={{
                background: `radial-gradient(circle at bottom left, 
                  rgba(16, 185, 129, 0.18) 0%, 
                  rgba(59, 130, 246, 0.10) 35%, 
                  transparent 65%
                )`,
                filter: 'blur(1.5px)'
              }}
            />
            
            {/* Modern Corner Edge Glow - Bottom Right */}
            <div 
              className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none"
              style={{
                background: `radial-gradient(circle at bottom right, 
                  rgba(245, 158, 11, 0.14) 0%, 
                  rgba(236, 72, 153, 0.07) 30%, 
                  transparent 60%
                )`,
                filter: 'blur(1px)'
              }}
            />
          </div>

            {/* Animated Service Carousel - positioned over bottom right of image */}
            <div className="relative">
              <ServiceCarousel />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
