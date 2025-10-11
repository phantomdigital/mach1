"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface StepsState {
  selectedCard: string;
  formData: Record<string, string> | null;
}

const STORAGE_KEY = "steps_flow_data";

function getStoredData(): StepsState {
  if (typeof window === "undefined") return { selectedCard: "", formData: null };
  
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { selectedCard: "", formData: null };
    }
  }
  return { selectedCard: "", formData: null };
}

function setStoredData(state: StepsState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Dispatch custom event to notify other slice instances
  window.dispatchEvent(new CustomEvent("stepsDataChange", { detail: state }));
}

export function useStepsFlow(stepNumber: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<StepsState>(getStoredData);

  // Get current step from URL, default to 1
  const currentStep = parseInt(searchParams.get("step") || "1", 10);
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

  const goToStep = (step: number, sliceRef?: HTMLElement | null) => {
    // Only scroll if the slice top is out of view
    if (sliceRef) {
      const rect = sliceRef.getBoundingClientRect();
      const isAboveViewport = rect.top < 0;
      
      if (isAboveViewport) {
        // Scroll to the slice position
        sliceRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    
    // Update URL with new step
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const goToNextStep = (sliceRef?: HTMLElement | null) => {
    goToStep(currentStep + 1, sliceRef);
  };

  const goToPreviousStep = (sliceRef?: HTMLElement | null) => {
    if (currentStep > 1) {
      goToStep(currentStep - 1, sliceRef);
    }
  };

  const setSelectedCard = (value: string) => {
    updateData({ selectedCard: value });
  };

  const setFormData = (formData: Record<string, string>) => {
    updateData({ formData });
  };

  const resetFlow = () => {
    const resetData = { selectedCard: "", formData: null };
    setData(resetData);
    setStoredData(resetData);
    goToStep(1);
  };

  return {
    currentStep,
    selectedCard: data.selectedCard,
    formData: data.formData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    setSelectedCard,
    setFormData,
    resetFlow,
    isCurrentStep,
  };
}
