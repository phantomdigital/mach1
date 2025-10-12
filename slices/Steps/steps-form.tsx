"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NumberInputWithUnit } from "@/components/ui/number-input-with-unit";
import AddressAutocompleteInput from "./address-autocomplete-input";
import DatePickerInput from "./date-picker-input";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  unit?: string;
  column: "left" | "right" | "full";
  width: "full" | "half" | "third" | "quarter" | "fifth";
}

interface StepsFormProps {
  formHeading: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void> | void;
}

export default function StepsForm({
  formHeading,
  fields,
  onSubmit,
}: StepsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent scrolling during submission
  useEffect(() => {
    if (isSubmitting) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Just unlock scrolling without changing position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isSubmitting]);

  // Separate fields by column
  const leftFields = fields.filter((f) => f.column === "left");
  const rightFields = fields.filter((f) => f.column === "right");
  const fullFields = fields.filter((f) => f.column === "full");

  // Get width class based on field width setting
  const getWidthClass = (width: string) => {
    switch (width) {
      case "half":
        return "w-1/2";
      case "third":
        return "w-1/3";
      case "quarter":
        return "w-1/4";
      case "fifth":
        return "w-1/5";
      default:
        return "w-full";
    }
  };

  // Get max items per row based on field width
  const getMaxItemsPerRow = (width: string) => {
    switch (width) {
      case "half":
        return 2;
      case "third":
        return 3;
      case "quarter":
        return 4;
      case "fifth":
        return 5;
      default:
        return 1;
    }
  };

  const renderField = (field: FormField) => {
    const widthClass = getWidthClass(field.width);
    const baseInputClass =
      "w-full bg-transparent border-b border-neutral-300 pb-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors";

    switch (field.type) {
      case "address":
        return (
          <div key={field.name} className={widthClass}>
            <AddressAutocompleteInput
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(name, value) => setFormData({ ...formData, [name]: value })}
              placeholder={field.placeholder}
              required={field.required}
              label={field.label}
            />
          </div>
        );

      case "date":
        return (
          <div key={field.name} className={widthClass}>
            <DatePickerInput
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(name, value) => setFormData({ ...formData, [name]: value })}
              placeholder={field.placeholder}
              required={field.required}
              label={field.label}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className={widthClass}>
            <label className="block text-neutral-800 text-sm mb-2">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              className={`${baseInputClass} resize-none`}
            />
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className={widthClass}>
            <label className="block text-neutral-800 text-sm mb-4">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <div className="flex flex-wrap gap-4">
              {field.options?.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.toLowerCase().replace(/\s+/g, "-")}
                    checked={
                      formData[field.name] ===
                      option.toLowerCase().replace(/\s+/g, "-")
                    }
                    onChange={(e) => handleRadioChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-4 h-4"
                  />
                  <span className="text-neutral-800 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "select":
        return (
          <div key={field.name} className={widthClass}>
            <label className="block text-neutral-800 text-sm mb-2">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
              className={baseInputClass}
            >
              <option value="">{field.placeholder || "Select an option"}</option>
              {field.options?.map((option) => (
                <option
                  key={option}
                  value={option.toLowerCase().replace(/\s+/g, "-")}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        // text, email, tel, number
        // Check if it's a number field with unit options
        if (field.type === "number" && (field.unit || field.options)) {
          const unitOptions = field.options ? field.options : [];
          return (
            <div key={field.name} className={widthClass}>
              <NumberInputWithUnit
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(name, value) => setFormData({ ...formData, [name]: value })}
                label={field.label}
                required={field.required}
                placeholder={field.placeholder}
                unit={field.unit}
                unitOptions={unitOptions}
                onUnitChange={(unit) => {
                  // Optionally store the unit in form data
                  setFormData({ ...formData, [`${field.name}_unit`]: unit });
                }}
              />
            </div>
          );
        }
        
        return (
          <div key={field.name} className={widthClass}>
            <label className="block text-neutral-800 text-sm mb-2">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <div className="flex items-center gap-2">
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className={baseInputClass}
              />
              {field.unit && !field.options && (
                <span className="text-neutral-400 text-xs whitespace-nowrap">
                  {field.unit}
                </span>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Form Heading */}
      {formHeading && (
        <div className="mb-12">
          <h5 className="text-neutral-800 text-sm mb-8">{formHeading}</h5>
        </div>
      )}

      {/* Full Width Fields (if any) */}
      {fullFields.length > 0 && (
        <div className="space-y-8 mb-8">
          {fullFields.map((field) => renderField(field))}
        </div>
      )}

      {/* Two Column Layout - matches card grid */}
      {(leftFields.length > 0 || rightFields.length > 0) && (
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {(() => {
              const renderedIndices = new Set<number>();
              return leftFields.map((field, index) => {
                // Skip if already rendered as part of a group
                if (renderedIndices.has(index)) return null;

                // If field width is less than full, group consecutive fields of same width
                if (field.width !== "full") {
                  const maxItemsPerRow = getMaxItemsPerRow(field.width);
                  const groupedFields = [field];
                  const groupedIndices = [index];
                  
                  // Look ahead for consecutive fields of the same width (up to max per row)
                  for (let i = index + 1; i < leftFields.length && groupedFields.length < maxItemsPerRow; i++) {
                    if (leftFields[i].width === field.width && leftFields[i].width !== "full") {
                      groupedFields.push(leftFields[i]);
                      groupedIndices.push(i);
                    } else {
                      break; // Stop at first different width
                    }
                  }
                  
                  // Mark all grouped indices as rendered
                  groupedIndices.forEach(i => renderedIndices.add(i));
                  
                  // Adjust gap based on field width
                  const gapClass = field.width === "fifth" || field.width === "quarter" ? "gap-2" : "gap-4";
                  
                  return (
                    <div key={`group-${field.name}`} className={`flex ${gapClass}`}>
                      {groupedFields.map((f) => renderField(f))}
                    </div>
                  );
                }
                
                renderedIndices.add(index);
                return renderField(field);
              });
            })()}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {(() => {
              const renderedIndices = new Set<number>();
              return rightFields.map((field, index) => {
                // Skip if already rendered as part of a group
                if (renderedIndices.has(index)) return null;

                // If field width is less than full, group consecutive fields of same width
                if (field.width !== "full") {
                  const maxItemsPerRow = getMaxItemsPerRow(field.width);
                  const groupedFields = [field];
                  const groupedIndices = [index];
                  
                  // Look ahead for consecutive fields of the same width (up to max per row)
                  for (let i = index + 1; i < rightFields.length && groupedFields.length < maxItemsPerRow; i++) {
                    if (rightFields[i].width === field.width && rightFields[i].width !== "full") {
                      groupedFields.push(rightFields[i]);
                      groupedIndices.push(i);
                    } else {
                      break; // Stop at first different width
                    }
                  }
                  
                  // Mark all grouped indices as rendered
                  groupedIndices.forEach(i => renderedIndices.add(i));
                  
                  // Adjust gap based on field width
                  const gapClass = field.width === "fifth" || field.width === "quarter" ? "gap-2" : "gap-4";
                  
                  return (
                    <div key={`group-${field.name}`} className={`flex ${gapClass}`}>
                      {groupedFields.map((f) => renderField(f))}
                    </div>
                  );
                }
                
                renderedIndices.add(index);
                return renderField(field);
              });
            })()}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-12 flex justify-center gap-4">
        <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
          SUBMIT
        </Button>
        
        {/* Development Skip Button */}
        {process.env.NODE_ENV === "development" && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="px-8"
            onClick={() => onSubmit({})}
            disabled={isSubmitting}
          >
            SKIP (DEV)
          </Button>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overscrollBehavior: 'none',
              touchAction: 'none'
            }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-dark-blue animate-spin mx-auto mb-4" />
              <p className="text-neutral-800 font-medium">Processing your quote request...</p>
              <p className="text-neutral-500 text-sm mt-2">Please wait while we send your request...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
