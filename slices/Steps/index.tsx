"use client";

import { useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepsFlow } from "./steps-context";
import StepsCards from "./steps-cards";
import StepsForm from "./steps-form";
import StepsSummary from "./steps-summary";
import { StepNavigation } from "./step-navigation";
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
  const sliceRef = useRef<HTMLElement>(null);
  
  // Get step number from Prismic (supports multiple card steps)
  const stepNumber = slice.primary.step_number || (index + 1);

  const {
    currentStep,
    isCurrentStep,
    goToNextStep,
    goToPreviousStep,
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
    goToNextStep(sliceRef.current);
  };

  const handleFormSubmit = (data: Record<string, string>) => {
    setFormData(data);
    goToNextStep(sliceRef.current);
  };

  return (
    <section
      ref={sliceRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white py-16 lg:py-24"
    >
      <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
        {/* Step Indicator - single, aligned left */}
        <div className="w-full mb-16">
          <StepIndicator
            stepNumber={currentStep}
            stepTitle={slice.primary.step_title || "Step"}
            totalSteps={6}
          />
        </div>

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
              formHeading={slice.primary.form_heading || "DETAILS"}
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
            />
          )}

          {/* Step 3: Summary */}
          {slice.variation === "summary" && (
            <StepsSummary
              heading={slice.primary.summary_heading || "Thank you!"}
              description={slice.primary.summary_description || []}
              contactEmail={slice.primary.contact_email || ""}
              contactTimeframe={slice.primary.contact_timeframe || ""}
              onReset={resetFlow}
            />
          )}

            {/* Step Navigation - back button only, hidden on step 1 and summary */}
            {slice.variation !== "summary" && (
              <StepNavigation
                currentStep={currentStep}
                onPrevious={() => goToPreviousStep(sliceRef.current)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Steps;
