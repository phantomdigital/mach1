"use client";

import { PrismicNextLink } from "@prismicio/next";
import { HeroButton } from "@/components/ui/hero-button";
import type { LinkField } from "@prismicio/client";

interface ServicesButtonProps {
  buttonText: string;
  buttonLink: LinkField;
}

export default function ServicesButton({ buttonText, buttonLink }: ServicesButtonProps) {
  return (
    <HeroButton asChild>
      <PrismicNextLink field={buttonLink}>
        {buttonText}
      </PrismicNextLink>
    </HeroButton>
  );
}
