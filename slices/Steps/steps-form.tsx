"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  onSubmit: (data: Record<string, string>) => void;
}

export default function StepsForm({
  formHeading,
  fields,
  onSubmit,
}: StepsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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

  const renderField = (field: FormField) => {
    const widthClass = getWidthClass(field.width);
    const baseInputClass =
      "w-full bg-transparent border-b border-neutral-300 pb-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors";

    switch (field.type) {
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
        // text, email, tel, number, date
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
              {field.unit && (
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
            {leftFields.map((field) => {
              // If field width is less than full, group them in a flex container
              if (field.width !== "full") {
                const groupedFields = leftFields.filter(
                  (f) => f.width === field.width && leftFields.indexOf(f) >= leftFields.indexOf(field)
                );
                if (groupedFields[0] === field) {
                  return (
                    <div key={`group-${field.name}`} className="flex gap-4">
                      {groupedFields.map((f) => renderField(f))}
                    </div>
                  );
                }
                return null;
              }
              return renderField(field);
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {rightFields.map((field) => {
              // If field width is less than full, group them in a flex container
              if (field.width !== "full") {
                const groupedFields = rightFields.filter(
                  (f) => f.width === field.width && rightFields.indexOf(f) >= rightFields.indexOf(field)
                );
                if (groupedFields[0] === field) {
                  return (
                    <div key={`group-${field.name}`} className="flex gap-4">
                      {groupedFields.map((f) => renderField(f))}
                    </div>
                  );
                }
                return null;
              }
              return renderField(field);
            })}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-12 flex justify-center">
        <Button type="submit" size="lg" className="px-8">
          SUBMIT
        </Button>
      </div>
    </form>
  );
}
