'use client';

import { PrismicNextLink } from "@prismicio/next";
import { HeroButton } from "@/components/ui/hero-button";
import type { HeaderDocument, HeaderDocumentDataButtonsItem } from "@/types.generated";

interface HeaderButtonsProps {
  buttons: HeaderDocument["data"]["buttons"];
}

export function HeaderButtons({ buttons }: HeaderButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      {buttons.map((button: HeaderDocumentDataButtonsItem, index: number) => (
        <HeroButton key={index} asChild size="small">
          <PrismicNextLink field={button.link}>
            {button.label}
          </PrismicNextLink>
        </HeroButton>
      ))}
    </div>
  );
}
