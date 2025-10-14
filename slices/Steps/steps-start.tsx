"use client";

import { PrismicRichText } from "@prismicio/react";
import { RichTextField } from "@prismicio/client";
import { HeroButton } from "@/components/ui/hero-button";
import { motion } from "framer-motion";

interface StepsStartProps {
  heading: string | null;
  description: RichTextField;
  buttonText: string | null;
  onStart: () => void;
}

export default function StepsStart({
  heading,
  description,
  buttonText,
  onStart,
}: StepsStartProps) {
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
      <div className="w-full max-w-[40%]">
        {heading && (
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            {heading}
          </h2>
        )}

        {description && (
          <div className="text-base md:text-lg text-gray-600 mb-8 prose prose-gray max-w-none [&_p]:mb-4 [&_p]:leading-relaxed">
            <PrismicRichText field={description} />
          </div>
        )}
      </div>

      <HeroButton onClick={handleStart}>
        {buttonText || "Start Quote"}
      </HeroButton>
    </motion.div>
  );
}

