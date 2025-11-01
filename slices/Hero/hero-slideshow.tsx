'use client';

import { useState, useEffect } from 'react';
import { PrismicNextImage } from '@prismicio/next';
import type { ImageField } from '@prismicio/client';

interface HeroSlideshowProps {
  images: { image: ImageField }[];
  slideDuration?: number;
}

const HeroSlideshow = ({ images, slideDuration = 5 }: HeroSlideshowProps): React.ReactElement => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const fadeDuration = 2000; // 2 seconds fade transition
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, fadeDuration);
    }, slideDuration * 1000); // Convert seconds to milliseconds

    return () => clearInterval(interval);
  }, [images.length, slideDuration]);

  // If no images or only one image, don't render slideshow
  if (!images || images.length === 0) return <></>;
  if (images.length === 1) {
    return (
      <PrismicNextImage
        field={images[0].image}
        className="w-full h-full object-cover opacity-90 scale-105 animate-slow-pan"
        priority
        fill
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((item, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              isActive ? 'opacity-90' : 'opacity-0'
            }`}
          >
            <PrismicNextImage
              field={item.image}
              className="w-full h-full object-cover"
              priority={index === 0}
              fill
            />
          </div>
        );
      })}
    </div>
  );
};

export default HeroSlideshow;
