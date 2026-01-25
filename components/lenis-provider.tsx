"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * Lenis smooth scrolling provider.
 * Uses native wheel/touch input and keeps ScrollTrigger in sync.
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      lerp: 0.1,
    });

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    (window as typeof window & { lenis?: Lenis }).lenis = lenis;

    document.documentElement.classList.add("lenis", "lenis-smooth");
    document.body.classList.add("lenis", "lenis-smooth");

    return () => {
      lenis.off("scroll", handleScroll);
      lenis.destroy();
      gsap.ticker.remove(raf);
      delete (window as typeof window & { lenis?: Lenis }).lenis;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      document.body.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return <>{children}</>;
}
