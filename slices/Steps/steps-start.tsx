"use client";

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
  const imageUrl = image && 'url' in image ? image.url : null;
  const isSvg = imageUrl?.endsWith('.svg');

  const handleStart = () => {
    // Trigger step change with scroll to top
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch overflow-visible">
        {/* Left: Image with road - truck driving from horizon */}
        {imageUrl && (
          <div className="w-full lg:w-auto lg:max-w-[400px] flex-shrink-0 self-end">
            <motion.div
              className="w-full h-auto max-h-[261px] origin-bottom overflow-hidden"
              initial={{ x: -300, scale: 0 }}
              animate={{ x: 0, scale: 1 }}
              transition={{
                duration: 4,
                ease: [0.08, 0.7, 0.3, 1],
                delay: 0.3
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
            <div className="h-8 bg-neutral-300 -ml-[100vw] pl-[100vw]"></div>
          </div>
        )}

        {/* Right: Text content stacked vertically */}
        <div className="flex flex-col gap-8 flex-1 justify-center">
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

            <HeroButton onClick={handleStart}>
              {buttonText || "Start Quote"}
            </HeroButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

