"use client";

import { useState, useEffect, useRef } from "react";
import { PrismicRichText } from "@prismicio/react";
import { RichTextField, LinkField } from "@prismicio/client";
import { HeroButton } from "@/components/ui/hero-button";
import { motion } from "framer-motion";

interface StepsStartProps {
  image: LinkField;
  heading: string | null;
  description: RichTextField;
  buttonText: string | null;
  onStart: () => void;
}

export default function StepsStart({
  image,
  heading,
  description,
  buttonText,
  onStart,
}: StepsStartProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageUrl = image && 'url' in image ? image.url : null;
  const isSvg = imageUrl?.endsWith('.svg');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isInView]);

  const handleStart = () => {
    // Trigger step change with scroll to top
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="w-full"
    >
      <div ref={containerRef} className="flex flex-col lg:flex-row gap-8 lg:gap-26 items-stretch overflow-visible">
        {/* Left: Image with road - truck driving from horizon */}
        {imageUrl && (
          <div className="w-full lg:w-auto lg:max-w-[400px] flex-shrink-0 self-end">
            <motion.div
              className="w-full h-auto max-h-[261px] origin-bottom overflow-hidden"
              initial={{ x: -300, scale: 0 }}
              animate={isInView ? { x: 0, scale: 1 } : { x: -300, scale: 0 }}
              transition={{
                duration: 4,
                ease: [0.08, 0.7, 0.3, 1],
                delay: 1.0
              }}
              style={{ transformOrigin: "bottom center" }}
            >
              <img
                src={imageUrl}
                alt="Truck animation"
                className="w-full h-auto object-contain"
              />
            </motion.div>
            {/* Road - extends to left edge using negative margin */}
            <motion.div
              className="h-8 bg-mach1-green -ml-[100vw] pl-[100vw] border-b-6 border-green-300"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0
              }}
              style={{ transformOrigin: "left center" }}
            />
          </div>
        )}

        {/* Right: Text content stacked vertically */}
        <motion.div 
          className="flex flex-col gap-8 w-full lg:w-1/2 justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3
          }}
        >
          {/* Top text container: Heading */}
          <div>
            {heading && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                {heading}
              </h2>
            )}
          </div>

          {/* Bottom text container: Description + Button */}
          <div>
            {description && (
              <div className="text-base md:text-lg text-gray-600 mb-8 prose prose-gray max-w-none [&_p]:mb-4 [&_p]:leading-relaxed">
                <PrismicRichText field={description} />
              </div>
            )}

            <HeroButton onClick={handleStart} className="mt-auto">
              {buttonText || "Start Quote"}
            </HeroButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

