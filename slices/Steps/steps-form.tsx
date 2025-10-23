"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NumberInputWithUnit } from "@/components/ui/number-input-with-unit";
import AddressAutocompleteInput from "./address-autocomplete-input";
import DatePickerInput from "./date-picker-input";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  initialData?: Record<string, string> | null;
}

export default function StepsForm({
  formHeading,
  fields,
  onSubmit,
  initialData,
}: StepsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update form data if initialData changes (e.g., when navigating back)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.name];
      
      // Required field validation
      if (field.required && (!value || value.trim() === '')) {
        errors[field.name] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.name] = 'Please enter a valid email address';
        }
      }
      
      // Phone validation
      if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
          errors[field.name] = 'Please enter a valid phone number';
        }
      }
      
      // Number validation
      if (field.type === 'number' && value && value !== '') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
          errors[field.name] = `${field.label} must be a positive number`;
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationErrors({});
    
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    const hasError = !!validationErrors[field.name];
    const baseInputClass =
      `w-full bg-transparent border-b pb-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none transition-colors ${
        hasError 
          ? 'border-red-500 focus:border-red-600' 
          : 'border-neutral-300 focus:border-neutral-800'
      }`;

    switch (field.type) {
      case "address":
        return (
          <div key={field.name} className={widthClass} data-error={hasError}>
            <AddressAutocompleteInput
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(name, value) => {
                setFormData({ ...formData, [name]: value });
                if (validationErrors[name]) {
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                  });
                }
              }}
              placeholder={field.placeholder}
              required={field.required}
              label={field.label}
            />
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.name} className={widthClass} data-error={hasError}>
            <DatePickerInput
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(name, value) => {
                setFormData({ ...formData, [name]: value });
                if (validationErrors[name]) {
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                  });
                }
              }}
              placeholder={field.placeholder}
              required={field.required}
              label={field.label}
            />
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className={widthClass} data-error={hasError}>
            <label className="block text-neutral-800 text-sm mb-2">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={4}
              className={`${baseInputClass} resize-none`}
            />
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className={widthClass} data-error={hasError}>
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
                    className="w-4 h-4"
                  />
                  <span className="text-neutral-800 text-sm">{option}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className={widthClass} data-error={hasError}>
            <label className="block text-neutral-800 text-sm mb-2">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
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
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        );

      default:
        // text, email, tel, number
        // Check if it's a number field with unit options
        if (field.type === "number" && (field.unit || field.options)) {
          const unitOptions = field.options ? field.options : [];
          return (
            <div key={field.name} className={widthClass} data-error={hasError}>
              <NumberInputWithUnit
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(name, value) => {
                  setFormData({ ...formData, [name]: value });
                  if (validationErrors[name]) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[name];
                      return newErrors;
                    });
                  }
                }}
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
              {hasError && (
                <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>
              )}
            </div>
          );
        }
        
        return (
          <div key={field.name} className={widthClass} data-error={hasError}>
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
                className={baseInputClass}
              />
              {field.unit && !field.options && (
                <span className="text-neutral-400 text-xs whitespace-nowrap">
                  {field.unit}
                </span>
              )}
            </div>
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        );
    }
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Form Heading */}
      {formHeading && (
        <div className="mb-12">
          <h5 className="text-neutral-800 text-sm mb-8">{formHeading}</h5>
        </div>
      )}

      {/* Validation Errors Alert */}
      <AnimatePresence>
        {hasErrors && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8"
          >
            <Alert variant="destructive">
              <AlertDescription>
                <div className="font-medium mb-2">Please fix the following errors:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Width Fields (if any) */}
      {fullFields.length > 0 && (
        <div className="space-y-8 mb-8">
          {fullFields.map((field) => renderField(field))}
        </div>
      )}

      {/* Two Column Layout - matches card grid */}
      {(leftFields.length > 0 || rightFields.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-8 grid-cols-1">
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
            
            {/* Submit Button - in left column */}
            <div className="mt-12 space-y-4">
              <Button 
                type="submit" 
                variant="hero"
                disabled={isSubmitting}
                className="w-full"
              >
                SUBMIT
              </Button>
              
              {/* Development Skip Button */}
              {process.env.NODE_ENV === "development" && (
                <div className="flex justify-start">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onSubmit({})}
                    disabled={isSubmitting}
                  >
                    SKIP
                  </Button>
                </div>
              )}
            </div>
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

    </form>
  );
}
