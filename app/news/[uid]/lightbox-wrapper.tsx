"use client";

import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import type { RichTextField, ImageField } from "@prismicio/client";
import styles from "./lightbox-wrapper.module.css";

interface LightboxWrapperProps {
  featuredImage: ImageField;
  content: RichTextField;
}

interface LightboxSlide {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function LightboxWrapper({ featuredImage, content }: LightboxWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [slides, setSlides] = useState<LightboxSlide[]>([]);

  useEffect(() => {
    // Collect all images from featured image and content
    const allSlides: LightboxSlide[] = [];

    // Add featured image if it exists
    if (featuredImage?.url) {
      allSlides.push({
        src: featuredImage.url,
        alt: (featuredImage.alt as string) || "Featured image",
        width: featuredImage.dimensions?.width,
        height: featuredImage.dimensions?.height,
      });
    }

    // Add images from rich text content
    if (content && Array.isArray(content)) {
      content.forEach((block) => {
        if ('type' in block && block.type === "image" && 'url' in block && block.url) {
          allSlides.push({
            src: block.url as string,
            alt: ('alt' in block ? block.alt as string : undefined) || "Article image",
            width: 'dimensions' in block ? (block.dimensions as { width?: number })?.width : undefined,
            height: 'dimensions' in block ? (block.dimensions as { height?: number })?.height : undefined,
          });
        }
      });
    }

    setSlides(allSlides);
  }, [featuredImage, content]);

  useEffect(() => {
    // Add click handlers to all images in the document
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const imgSrc = target.getAttribute("src");
        
        // Find the index of the clicked image in slides
        const index = slides.findIndex((slide) => slide.src === imgSrc);
        if (index !== -1) {
          e.preventDefault();
          setPhotoIndex(index);
          setIsOpen(true);
        }
      }
    };

    // Attach to document to catch all image clicks
    document.addEventListener("click", handleImageClick);

    return () => {
      document.removeEventListener("click", handleImageClick);
    };
  }, [slides]);

  return (
    <div className={styles.lightbox}>
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          },
          button: {
            filter: "none",
          },
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
        carousel={{
          finite: slides.length <= 1,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </div>
  );
}

