"use client";

import { PrismicNextLink } from "@prismicio/next";
import { HeroButton } from "@/components/ui/hero-button";
import type { LinkField } from "@prismicio/client";

interface FreightServicesButtonProps {
  buttonText: string;
  buttonLink: LinkField;
}

export default function FreightServicesButton({ buttonText, buttonLink }: FreightServicesButtonProps) {
  return (
    <HeroButton asChild size="small">
      <PrismicNextLink field={buttonLink}>
        {buttonText}
      </PrismicNextLink>
    </HeroButton>
  );
}
