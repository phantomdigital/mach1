"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Content, RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepsFlow } from "./steps-context";
import StepsStart from "./steps-start";
import StepsCards from "./steps-cards";
import StepsForm from "./steps-form";
import StepsPackages from "./steps-packages";
import StepsSummary from "./steps-summary";
import { Loader2 } from "lucide-react";
import { sendQuoteEmail } from "@/app/actions/send-quote-email";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { StepIndicator } from "./step-indicator";
import { stepContentVariants } from "./step-animations";
import { getMarginTopClass } from "@/lib/spacing";

/**
 * Props for `Steps`.
 */
export type StepsProps = SliceComponentProps<Content.StepsSlice> & {
  mainFaqs?: Array<{ faq_question: string | null; faq_answer: RichTextField | null }>;
};

/**
 * Component for "Steps" Slices.
 * Each variation renders as a different step in the multi-step flow.
 */
const Steps = ({ slice, index, mainFaqs = [] }: StepsProps): React.ReactElement | null => {
  const router = useRouter();
  const sliceRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoadingStep1, setIsLoadingStep1] = useState(false);
  const hasShownLoadingRef = useRef(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Get step number from Prismic (0 for start, then 1, 2, 3...)
  const stepNumber = slice.variation === "start" ? 0 : (slice.primary.step_number || (index + 1));

  const {
    currentStep,
    isCurrentStep,
    goToNextStep,
    goToPreviousStep,
    goToSummary,
    selectedCard,
    setSelectedCard,
    setFormData,
    formData,
    resetFlow,
  } = useStepsFlow(stepNumber);

  // Reset loading state when flow is reset (back to step 0)
  useEffect(() => {
    if (currentStep === 0) {
      hasShownLoadingRef.current = false;
    }
  }, [currentStep]);

  // Loading state for Step 1 - show spinner for 2.5 seconds when entering step 1 (only first time per flow)
  useEffect(() => {
    if (currentStep === 1 && stepNumber === 1 && slice.variation === "cards" && !hasShownLoadingRef.current) {
      setIsLoadingStep1(true);
      hasShownLoadingRef.current = true; // Mark as shown
      const timer = setTimeout(() => {
        setIsLoadingStep1(false);
      }, 1900);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, stepNumber, slice.variation]);

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
    const finalFormData = { ...(formData || {}), ...data };
    setFormData(finalFormData);
    
    // Check if selected service requires packages step
    // Skip packages for warehousing, 3PL, or storage services
    const skipPackages = selectedCard && (
      selectedCard.toLowerCase().includes('warehousing') ||
      selectedCard.toLowerCase().includes('3pl') ||
      selectedCard.toLowerCase().includes('storage') ||
      selectedCard.toLowerCase().includes('warehouse')
    );
    
    if (skipPackages) {
      // Send quote email for services without packages
      try {
        const result = await sendQuoteEmail({
          serviceType: selectedCard || undefined,
          formData: finalFormData,
          packages: [],
        });

        if (!result.success) {
          console.error("Failed to send quote email:", result.error);
          // Show error to user
          setEmailError(result.error || "Failed to send quote request. Please try again.");
          // Don't proceed to summary if validation failed
          if (result.validationErrors) {
            return;
          }
          // For other errors, still proceed to summary
        }
      } catch (error) {
        console.error("Error sending quote email:", error);
        setEmailError("An unexpected error occurred. Please try again.");
        // For unexpected errors, still proceed to summary
      }
      
      // Clear any previous errors
      setEmailError(null);
      
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
    const finalFormData = { ...(formData || {}), packages: JSON.stringify(packages) };
    setFormData(finalFormData);
    
    // Send quote email
    try {
      const result = await sendQuoteEmail({
        serviceType: selectedCard || undefined,
        formData: formData || {},
        packages,
      });

      if (!result.success) {
        console.error("Failed to send quote email:", result.error);
        // Show error to user
        setEmailError(result.error || "Failed to send quote request. Please try again.");
        // Don't proceed to summary if validation failed
        if (result.validationErrors) {
          return;
        }
        // For other errors, still proceed to summary
      }
    } catch (error) {
      console.error("Error sending quote email:", error);
      setEmailError("An unexpected error occurred. Please try again.");
      // For unexpected errors, still proceed to summary
    }
    
    // Clear any previous errors
    setEmailError(null);
    
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
            ? `${getMarginTopClass("extra-large")} pb-16 lg:pb-24` 
            : "py-16 lg:py-24"
        }`}
      >
        <div ref={containerRef} className="w-full max-w-[100rem] mx-auto px-4 lg:px-8">
          {/* Step Indicator - only show for steps 1+ (not start) - OUTSIDE AnimatePresence so it persists */}
          {currentStep > 0 && (
            <div className="w-full mb-16 md:mb-16 relative">
              <StepIndicator
                stepNumber={currentStep}
                stepTitle={slice.primary.step_title || "Step"}
                totalSteps={4}
                onBack={currentStep > 1 ? () => goToPreviousStep() : undefined}
              />
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {emailError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full mb-8"
              >
                <Alert variant="destructive" className="relative pr-12">
                  <AlertDescription>
                    {emailError}
                  </AlertDescription>
                  <button
                    onClick={() => setEmailError(null)}
                    className="absolute right-4 top-4 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Dismiss error"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Step Content - AnimatePresence only wraps the step content */}
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
                isLoadingStep1 ? (
                  <div className="flex items-center justify-center py-32 w-full">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-dark-blue animate-spin mx-auto mb-4" />
                      <p className="text-neutral-800 font-medium">Loading your quote form...</p>
                      <p className="text-neutral-500 text-sm mt-2">Please wait a moment</p>
                    </div>
                  </div>
                ) : (
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
                )
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
                      : (slice.primary.form_heading || "DETAILS")
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
                  faqs={
                    // Use main FAQs if available and use_main_faqs is true, otherwise use custom FAQs
                    (slice.primary as any).use_main_faqs && mainFaqs.length > 0
                      ? mainFaqs
                      : slice.items.map((item) => ({
                          faq_question: item.faq_question || null,
                          faq_answer: item.faq_answer || null,
                        }))
                  }
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
