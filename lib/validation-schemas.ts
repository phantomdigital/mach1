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

// File attachment schema for job applications
export const fileAttachmentSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  content: z.string().min(1, "File content is required"), // base64 encoded
  contentType: z.string().min(1, "Content type is required"),
  size: z.number().positive("File size must be positive"),
});

// Job application form validation schema
export const jobApplicationSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be no more than 100 characters"),
  
  email: z
    .string()
    .min(1, "Email address is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address"),
  
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => /^[\+]?[\d\s\-\(\)]{10,}$/.test(val), "Please enter a valid phone number"),
  
  jobTitle: z
    .string()
    .min(1, "Job title is required"),
  
  applicationEmail: z
    .string()
    .min(1, "Application email is required"),
  
  resume: fileAttachmentSchema.refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB max
    "Resume must be less than 5MB"
  ).refine(
    (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.contentType),
    "Resume must be PDF, DOC, or DOCX"
  ),
  
  coverLetter: fileAttachmentSchema.optional().refine(
    (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB max
    "Cover letter must be less than 5MB"
  ).refine(
    (file) => !file || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.contentType),
    "Cover letter must be PDF, DOC, or DOCX"
  ),
  
  otherFiles: z.array(fileAttachmentSchema).optional().default([]).refine(
    (files) => files.every(file => file.size <= 5 * 1024 * 1024), // 5MB max per file
    "Each file must be less than 5MB"
  ).refine(
    (files) => {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      return totalSize <= 15 * 1024 * 1024; // 15MB total
    },
    "Total file size must be less than 15MB"
  ),
});

export type JobApplicationData = z.infer<typeof jobApplicationSchema>;
export type FileAttachment = z.infer<typeof fileAttachmentSchema>;

// Package validation schema
export const packageSchema = z.object({
  id: z.string(),
  description: z
    .string()
    .min(1, "Package description is required")
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description must be no more than 200 characters"),
  origin: z
    .string()
    .min(1, "Pickup address is required")
    .min(5, "Please enter a complete address"),
  destination: z
    .string()
    .min(1, "Delivery address is required")
    .min(5, "Please enter a complete address"),
  weight: z
    .string()
    .min(1, "Weight is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Weight must be a positive number"),
  weightUnit: z.string().min(1, "Weight unit is required"),
  length: z
    .string()
    .min(1, "Length is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Length must be a positive number"),
  width: z
    .string()
    .min(1, "Width is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Width must be a positive number"),
  height: z
    .string()
    .min(1, "Height is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Height must be a positive number"),
  dimensionUnit: z.string().min(1, "Dimension unit is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Quantity must be a positive number"),
});

export type PackageData = z.infer<typeof packageSchema>;

// Quote form base validation schema
export const quoteFormBaseSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be no more than 100 characters"),
  
  email: z
    .string()
    .min(1, "Email address is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address"),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[\d\s\-\(\)]{10,}$/.test(val), "Please enter a valid phone number"),
  
  companyName: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 200, "Company name must be no more than 200 characters"),
});

// Full quote request validation schema (with packages)
export const quoteRequestSchema = z.object({
  serviceType: z.string().optional(),
  formData: z.record(z.string(), z.any()), // Allow any form fields
  packages: z.array(packageSchema).optional().default([]),
});

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

// Steps form validation schema (for quote flow - flexible for dynamic fields)
export const stepsFormSchema = z.record(z.string(), z.any());

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
