"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PrismicNextImage } from "@prismicio/next";
import { ImageFieldImage, ImageField } from "@prismicio/client";

interface CarouselItem {
  image: ImageField;
  alt_text: string | null;
}

interface CarouselAnimationProps {
  items: CarouselItem[];
  imageWidth: number;
  gap: number;
  scrollSpeed: number;
}

/**
 * GSAP horizontalLoop helper function for seamless infinite scrolling
 * Source: https://gsap.com/docs/v3/HelperFunctions/helpers/horizontalLoop/
 * Full-featured version with responsive support and window resize handling
 */
function horizontalLoop(items: HTMLElement[], config: any) {
  items = gsap.utils.toArray(items) as HTMLElement[];
  config = config || {};
  
  let timeline: gsap.core.Timeline;
  
  gsap.context(() => {
    const tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => {
        void tl.totalTime(tl.rawTime() + tl.duration() * 100);
      },
    });
    
    const length = items.length;
    const startX = items[0].offsetLeft;
    const times: number[] = [];
    const widths: number[] = [];
    const spaceBefore: number[] = [];
    const xPercents: number[] = [];
    let curIndex = 0;
    const pixelsPerSecond = (config.speed || 1) * 100;
    const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1);
    const container = items[0].parentNode as HTMLElement;
    let totalWidth: number;
    
    const getTotalWidth = () =>
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      spaceBefore[0] +
      items[length - 1].offsetWidth * (gsap.getProperty(items[length - 1], "scaleX") as number) +
      (parseFloat(config.paddingRight) || 0);
    
    const populateWidths = () => {
      let b1 = container.getBoundingClientRect();
      let b2;
      items.forEach((el, i) => {
        widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px") as string) / widths[i]) * 100 +
            (gsap.getProperty(el, "xPercent") as number)
        );
        b2 = el.getBoundingClientRect();
        spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
        b1 = b2;
      });
      gsap.set(items, {
        xPercent: (i) => xPercents[i],
      });
      totalWidth = getTotalWidth();
    };
    
    const populateTimeline = () => {
      tl.clear();
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const curX = (xPercents[i] / 100) * widths[i];
        const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
        const distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);
        
        tl.to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond,
          },
          0
        )
          .fromTo(
            item,
            {
              xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
            },
            {
              xPercent: xPercents[i],
              duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
              immediateRender: false,
            },
            distanceToLoop / pixelsPerSecond
          )
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      }
    };
    
    const refresh = (deep?: boolean) => {
      const progress = tl.progress();
      tl.progress(0, true);
      populateWidths();
      if (deep) populateTimeline();
      if (deep) tl.progress(progress, true);
    };
    
    const onResize = () => refresh(true);
    
    gsap.set(items, { x: 0 });
    populateWidths();
    populateTimeline();
    
    window.addEventListener("resize", onResize);
    
    tl.progress(1, true).progress(0, true);
    
    if (config.reversed) {
      tl.reverse();
    }
    
    timeline = tl;
    
    return () => window.removeEventListener("resize", onResize);
  });
  
  return timeline!;
}

export function CarouselAnimation({
  items,
  imageWidth,
  gap,
  scrollSpeed,
}: CarouselAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const container = containerRef.current;
    const carouselItems = gsap.utils.toArray(".carousel-item") as HTMLElement[];

    if (carouselItems.length === 0) return;

    // Create seamless infinite loop using horizontalLoop helper
    // Don't pass paddingRight - the gap is already handled by CSS
    // Adjust speed based on viewport width for consistent feel across devices
    const viewportWidth = window.innerWidth;
    const speedMultiplier = viewportWidth < 768 ? 0.6 : viewportWidth < 1024 ? 0.8 : 1;
    
    animationRef.current = horizontalLoop(carouselItems, {
      repeat: -1,
      speed: scrollSpeed * speedMultiplier,
      paddingRight: 0,
    });

    // Pause on hover
    const handleMouseEnter = () => {
      if (animationRef.current) {
        gsap.to(animationRef.current, { timeScale: 0, duration: 0.5 });
      }
    };

    const handleMouseLeave = () => {
      if (animationRef.current) {
        gsap.to(animationRef.current, { timeScale: 1, duration: 0.5 });
      }
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [items, imageWidth, gap, scrollSpeed]);

  if (items.length === 0) return null;

  // Calculate how many times to duplicate based on viewport width
  // We need enough items to fill the viewport + extra for seamless looping
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const itemTotalWidth = imageWidth + gap;
  const itemsNeededForViewport = Math.ceil(viewportWidth / itemTotalWidth);
  // Render enough to cover 4x viewport width for truly seamless looping
  const duplicateCount = Math.max(4, Math.ceil((itemsNeededForViewport * 4) / items.length));
  
  return (
    <div ref={containerRef} className="relative overflow-hidden w-full">
      <div className="flex items-start" style={{ gap: `${gap}px`, lineHeight: 0 }}>
        {Array(duplicateCount).fill(null).map((_, setIndex) => 
          items.map((item, itemIndex) => (
            <div
              key={`${setIndex}-${itemIndex}`}
              className="carousel-item flex-shrink-0 relative"
              style={{ width: `${imageWidth}px` }}
            >
              {item.image?.url && (
                <div 
                  className="relative bg-neutral-200 p-[1.25px]"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                  }}
                >
                  <div 
                    className="relative overflow-hidden"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))'
                    }}
                  >
                    <PrismicNextImage
                      field={item.image as ImageFieldImage}
                      className="w-full h-auto object-cover"
                      style={{ width: `${imageWidth}px` }}
                      sizes={`${imageWidth}px`}
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

