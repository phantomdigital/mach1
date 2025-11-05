"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getLocaleFromPathname, addLocaleToPathname } from "@/lib/locale-helpers";

interface StepsState {
  selectedCard: string;
  formData: Record<string, string> | null;
  isTransitioning: boolean;
  loadingMessage?: string;
  loadingSubmessage?: string;
}

const STORAGE_KEY = "steps_flow_data";

function getStoredData(): StepsState {
  if (typeof window === "undefined") return { selectedCard: "", formData: null, isTransitioning: false };
  
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...parsed, isTransitioning: false }; // Never persist transition state
    } catch {
      return { selectedCard: "", formData: null, isTransitioning: false };
    }
  }
  return { selectedCard: "", formData: null, isTransitioning: false };
}

function setStoredData(state: StepsState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Dispatch custom event to notify other slice instances
  window.dispatchEvent(new CustomEvent("stepsDataChange", { detail: state }));
}

export function useStepsFlow(stepNumber: number) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<StepsState>(getStoredData);

  // Get current step from URL, default to 0 (start screen) if no step param
  const currentStep = searchParams.get("step") ? parseInt(searchParams.get("step")!, 10) : 0;
  const isCurrentStep = currentStep === stepNumber;

  // Listen for data changes from other slices
  useEffect(() => {
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent<StepsState>;
      setData(customEvent.detail);
    };

    window.addEventListener("stepsDataChange", handleDataChange);
    return () => {
      window.removeEventListener("stepsDataChange", handleDataChange);
    };
  }, []);

  const updateData = (updates: Partial<StepsState>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    setStoredData(newData);
  };

  const goToStep = useCallback((step: number, scrollToTop: boolean = false) => {
    // Save current scroll position (unless we want to scroll to top)
    const scrollY = scrollToTop ? 0 : window.scrollY;
    
    // Start transition with loading state
    setData(prev => ({ ...prev, isTransitioning: true }));
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Scroll to top if requested, otherwise restore scroll position
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: scrollToTop ? 'smooth' : 'auto' });
      
      // End transition after navigation
      setTimeout(() => {
        setData(prev => ({ ...prev, isTransitioning: false }));
      }, 500);
    });
  }, [router, searchParams]);

  const goToNextStep = (scrollToTop: boolean = false) => {
    goToStep(currentStep + 1, scrollToTop);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    } else if (currentStep === 1) {
      // Go back to start screen (step 0) - remove step param
      const resetData = { selectedCard: "", formData: null, isTransitioning: false };
      setData(resetData);
      setStoredData(resetData);
      router.push(window.location.pathname, { scroll: false });
    }
  };

  const setSelectedCard = (value: string) => {
    updateData({ selectedCard: value });
  };

  const setFormData = (formData: Record<string, string>) => {
    updateData({ formData });
  };

  const resetFlow = () => {
    const resetData = { selectedCard: "", formData: null, isTransitioning: false };
    setData(resetData);
    setStoredData(resetData);
    // Return to start screen (step 0) - remove step param
    router.push(window.location.pathname, { scroll: false });
  };

  const goToSummary = () => {
    // Preserve locale when navigating to summary
    const locale = getLocaleFromPathname(pathname);
    const summaryPath = addLocaleToPathname("/quote/summary", locale);
    router.push(summaryPath);
  };

  const setLoadingMessages = (loadingMessage?: string, loadingSubmessage?: string) => {
    updateData({ loadingMessage, loadingSubmessage });
  };

  return {
    currentStep,
    selectedCard: data.selectedCard,
    formData: data.formData,
    isTransitioning: data.isTransitioning,
    loadingMessage: data.loadingMessage,
    loadingSubmessage: data.loadingSubmessage,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    goToSummary,
    setSelectedCard,
    setFormData,
    setLoadingMessages,
    resetFlow,
    isCurrentStep,
  };
}
