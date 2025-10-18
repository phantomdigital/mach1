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
    <div className="flex flex-row flex-wrap gap-2 lg:gap-4 items-start">
      {primaryButton && (
        <HeroButton asChild>
          <PrismicNextLink 
            field={primaryButton.link}
            className="!bg-white/10 !text-white hover:!bg-white/20 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
          >
            {primaryButton.text}
          </PrismicNextLink>
        </HeroButton>
      )}
      
      {secondaryButton && (
        <HeroButton asChild>
          <PrismicNextLink 
            field={secondaryButton.link}
            className="!bg-white/10 !text-white hover:!bg-white/20 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
          >
            {secondaryButton.text}
          </PrismicNextLink>
        </HeroButton>
      )}
    </div>
  );
}
