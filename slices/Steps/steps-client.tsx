"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepsFlow } from "./steps-context";
import StepsStart from "./steps-start";
import StepsCards from "./steps-cards";
import StepsForm from "./steps-form";
import StepsPackages from "./steps-packages";
import StepsSummary from "./steps-summary";

import { StepIndicator } from "./step-indicator";
import { stepContentVariants } from "./step-animations";

/**
 * Props for `Steps`.
 */
export type StepsProps = SliceComponentProps<Content.StepsSlice>;

/**
 * Component for "Steps" Slices.
 * Each variation renders as a different step in the multi-step flow.
 */
const Steps = ({ slice, index }: StepsProps): React.ReactElement | null => {
  const router = useRouter();
  const sliceRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get step number from Prismic (0 for start, then 1, 2, 3...)
  const stepNumber = slice.variation === "start" ? 0 : (slice.primary.step_number || (index + 1));

  const {
    currentStep,
    isCurrentStep,
    isTransitioning,
    goToNextStep,
    goToPreviousStep,
    goToSummary,
    selectedCard,
    setSelectedCard,
    setFormData,
    formData,
    resetFlow,
  } = useStepsFlow(stepNumber);

  // Only render if this is the current step
  if (!isCurrentStep) {
    return null;
  }

  const handleCardSelect = (value: string) => {
    setSelectedCard(value);
    goToNextStep();
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    // Merge with existing formData instead of replacing
    setFormData({ ...(formData || {}), ...data });
    
    // Check if selected service requires packages step
    // Skip packages for warehousing, 3PL, or storage services
    const skipPackages = selectedCard && (
      selectedCard.toLowerCase().includes('warehousing') ||
      selectedCard.toLowerCase().includes('3pl') ||
      selectedCard.toLowerCase().includes('storage') ||
      selectedCard.toLowerCase().includes('warehouse')
    );
    
    if (skipPackages) {
      // Show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      goToSummary();
    } else {
      // Transport/shipping services need package details
      goToNextStep();
    }
  };

  const handlePackagesSubmit = async (packages: any[]) => {
    // Merge packages with existing formData
    setFormData({ ...(formData || {}), packages: JSON.stringify(packages) });
    
    // Show loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    goToSummary();
  };

  return (
    <>
      <section
        ref={sliceRef}
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={`w-full bg-white ${
          currentStep > 0 
            ? "pt-62 pb-16 lg:pb-24" 
            : "py-16 lg:py-24"
        }`}
      >
        <div ref={containerRef} className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
          {/* Step Indicator - only show for steps 1+ (not start) */}
          {currentStep > 0 && (
            <div className="w-full mb-12 md:mb-16">
              <StepIndicator
                stepNumber={currentStep}
                stepTitle={slice.primary.step_title || "Step"}
                totalSteps={6}
                onBack={currentStep > 1 ? () => goToPreviousStep() : undefined}
              />
            </div>
          )}

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
          <motion.div
            key={`step-${currentStep}`}
            variants={stepContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex flex-col items-center"
          >
            {/* Step 0: Start */}
            {slice.variation === "start" && (
              <StepsStart
                image={(slice.primary as any).start_image}
                heading={(slice.primary as any).start_heading}
                description={(slice.primary as any).start_description}
                buttonText={(slice.primary as any).start_button_text}
                onStart={() => goToNextStep(true)}
              />
            )}

            {/* Step 1: Cards */}
            {slice.variation === "cards" && (
              <StepsCards
          cards={slice.items.map((item) => ({
            label: item.card_label || "",
            value: item.card_value || "",
            hasLinkIcon: item.has_link_icon || false,
            image: item.card_image,
            isTextOption: item.is_text_option || false,
          }))}
              onSelect={handleCardSelect}
            />
          )}

          {/* Step 2: Form */}
          {slice.variation === "form" && (
            <StepsForm
              formHeading={
                selectedCard && (
                  selectedCard.toLowerCase().includes('warehousing') ||
                  selectedCard.toLowerCase().includes('3pl') ||
                  selectedCard.toLowerCase().includes('storage') ||
                  selectedCard.toLowerCase().includes('warehouse')
                )
                  ? "WAREHOUSING DETAILS"
                  : (slice.primary.form_heading || "SHIPMENT DETAILS")
              }
              fields={slice.items.map((item) => ({
                label: item.field_label || "",
                name: item.field_name || "",
                type: item.field_type || "text",
                placeholder: item.field_placeholder || "",
                required: item.field_required !== false,
                options: item.field_options
                  ? item.field_options.split(",").map((opt) => opt.trim())
                  : undefined,
                unit: item.field_unit || undefined,
                column: (item.field_column || "left") as "left" | "right" | "full",
                width: (item.field_width || "full") as
                  | "full"
                  | "half"
                  | "third"
                  | "quarter"
                  | "fifth",
              }))}
              onSubmit={handleFormSubmit}
              initialData={formData}
            />
          )}

          {/* Step 2b: Packages */}
          {slice.variation === ("packages" as any) && (
            <StepsPackages
              packagesHeading={(slice.primary as any).packages_heading || "PACKAGE DETAILS"}
              selectedCard={selectedCard}
              onSubmit={handlePackagesSubmit}
            />
          )}

          {/* Step 3: Summary */}
          {slice.variation === "summary" && (
            <StepsSummary
              heading={slice.primary.summary_heading || "Thank you!"}
              description={slice.primary.summary_description || []}
              contactEmail={slice.primary.contact_email || ""}
              contactTimeframe={slice.primary.contact_timeframe || ""}
              selectedCard={selectedCard}
              formData={formData}
              onReset={resetFlow}
            />
          )}

          </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default Steps;
