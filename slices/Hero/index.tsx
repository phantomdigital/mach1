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
      className="w-full min-h-[100dvh] relative overflow-hidden"
    >
      {/* Full Width Image below header */}
      {slice.items && slice.items.length > 0 && (
        <div className="relative w-full pt-20 overflow-hidden bg-neutral-50">
          {/* Full width image container */}
          <div 
            className="relative w-full aspect-[1279/560]"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 73.13%, 83.96% 98.7%, 83.21% 99.48%, 82.28% 100%, 49.53% 100%, 49.53% 99.94%, 0% 99.94%, 0% 0%)'
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
            
            {/* Enhanced Gradient Scrim for Text Readability */}
            <div 
              className="absolute bottom-0 left-0 w-full h-96 pointer-events-none"
              style={{
                background: `linear-gradient(to top, 
                  rgba(0, 0, 0, 0.85) 0%, 
                  rgba(0, 0, 0, 0.65) 30%, 
                  rgba(0, 0, 0, 0.4) 60%, 
                  transparent 100%
                )`
              }}
            />
            
            {/* Text Overlay - positioned in bottom left with adjustable width */}
            <div className="absolute bottom-0 left-0 p-8 lg:p-12  w-full max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] z-10">
              <div className="flex flex-col items-start">
                {/* Subheading */}
                {slice.primary.subheading && (
                  <div 
                    className="text-sm text-white font-medium uppercase tracking-wide antialiased mb-2"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {slice.primary.subheading}
                  </div>
                )}
                
                {/* Main Title */}
                <h1 
                  className="text-lg sm:text-xl lg:text-2xl xl:text-5xl font-extrabold text-white leading-tight antialiased mb-4 lg:mb-6"
                  style={{ fontFamily: 'var(--font-inter-tight)' }}
                >
                  {slice.primary.title}
                </h1>
                
                {/* Description */}
                {slice.primary.description && (
                  <p 
                    className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed antialiased max-w-[600px]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {slice.primary.description}
                  </p>
                )}
              </div>
            </div>
            
          </div>
          
          {/* Animated Service Carousel - outside clipped area */}
          <ServiceCarousel />
        </div>
      )}
    </section>
  );
};

export default Hero;
