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
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {primaryButton && (
        <HeroButton asChild>
          <PrismicNextLink 
            field={primaryButton.link}
            className="bg-zinc-600 text-zinc-100 hover:bg-zinc-700"
          >
            {primaryButton.text}
          </PrismicNextLink>
        </HeroButton>
      )}
      
      {secondaryButton && (
        <HeroButton asChild>
          <PrismicNextLink 
            field={secondaryButton.link}
            className="bg-zinc-100 text-neutral-400 border border-neutral-400 hover:bg-zinc-50"
          >
            {secondaryButton.text}
          </PrismicNextLink>
        </HeroButton>
      )}
    </div>
  );
}
