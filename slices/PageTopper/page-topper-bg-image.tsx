import { PrismicNextImage } from "@prismicio/next";
import { ImageField } from "@prismicio/client";

interface PageTopperBgImageProps {
  heroImage: ImageField;
  imagePosition?: 'top' | 'center' | 'bottom';
}

/**
 * Server component that renders the background image.
 * Animation is handled by the parent client wrapper.
 * Image is SSR'd in its final position for instant display.
 */
export function PageTopperBgImage({ heroImage, imagePosition = 'center' }: PageTopperBgImageProps) {
  // Map position to Tailwind classes
  const getPositionClass = () => {
    switch (imagePosition) {
      case 'top':
        return 'object-top';
      case 'bottom':
        return 'object-bottom';
      case 'center':
      default:
        return 'object-center';
    }
  };

  return (
    <PrismicNextImage 
      field={heroImage} 
      fill
      className={`object-cover ${getPositionClass()}`}
      priority
      fetchPriority="high"
      sizes="100vw"
      quality={85}
      loading="eager"
    />
  );
}
