"use client";

import { PrismicNextLink } from "@prismicio/next";
import { HeroButton } from "@/components/ui/hero-button";
import type { LinkField } from "@prismicio/client";

interface FooterCtaButtonsProps {
  primaryButton?: {
    text: string;
    link: LinkField;
  };
  secondaryButton?: {
    text: string;
    link: LinkField;
  };
}

export function FooterCtaButtons({ primaryButton, secondaryButton }: FooterCtaButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      {primaryButton && (
        <HeroButton asChild>
          <PrismicNextLink 
            field={primaryButton.link}
            className="!bg-white/10 !text-white hover:!bg-white/20 backdrop-blur-sm border border-white/20"
          >
            {primaryButton.text}
          </PrismicNextLink>
        </HeroButton>
      )}
      
      {secondaryButton && (
        <HeroButton asChild>
          <PrismicNextLink 
            field={secondaryButton.link}
            className="!bg-white/10 !text-white hover:!bg-white/20 backdrop-blur-sm border border-white/20"
          >
            {secondaryButton.text}
          </PrismicNextLink>
        </HeroButton>
      )}
    </div>
  );
}
