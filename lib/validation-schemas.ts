import { z } from "zod";

/**
 * Shared validation schemas using Zod
 * Used for both client-side and server-side validation
 */

// Contact form validation schema
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be no more than 100 characters"),
  
  role: z
    .string()
    .min(1, "Role or position is required")
    .max(100, "Role must be no more than 100 characters"),
  
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .refine((val) => /^[\+]?[\d\s\-\(\)]{10,}$/.test(val), "Please enter a valid phone number"),
  
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name must be no more than 200 characters"),
  
  email: z
    .string()
    .min(1, "Email address is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address"),
  
  enquiryType: z
    .string()
    .min(1, "Please select an enquiry type"),
  
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be no more than 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Steps form validation schema (for quote flow)
export const stepsFormSchema = z.record(z.string(), z.any());

// Package validation schema
export const packageSchema = z.object({
  description: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  weight: z.number().positive().optional(),
  weightUnit: z.string().optional(),
  quantity: z.number().positive().optional(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  dimensionUnit: z.string().optional(),
});

export type PackageData = z.infer<typeof packageSchema>;

// Common field validation helpers
export const commonValidators = {
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address"),
  phone: z.string().refine((val) => /^[\+]?[\d\s\-\(\)]{10,}$/.test(val), "Please enter a valid phone number"),
  required: z.string().min(1, "This field is required"),
  optionalText: z.string().max(500, "Text must be no more than 500 characters").optional(),
  longText: z.string().min(10, "Must be at least 10 characters").max(1000, "Must be no more than 1000 characters"),
  positiveNumber: z.number().positive("Must be a positive number"),
  url: z.string().refine((val) => {
    try { new URL(val); return true; } catch { return false; }
  }, "Please enter a valid URL").optional(),
} as const;

/**
 * Utility function to convert Zod errors to our ValidationError format
 */
export function zodErrorsToValidationErrors(error: z.ZodError) {
  return error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

/**
 * Safe parse with custom error handling
 */
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false as const,
      errors: zodErrorsToValidationErrors(result.error),
    };
  }
  
  return {
    success: true as const,
    data: result.data,
  };
}
