/**
 * Form validation utilities for consistent error handling across the app
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate a single field value against rules
 */
export function validateField(
  value: string,
  rules: ValidationRule,
  fieldName: string
): string | null {
  // Required validation
  if (rules.required && (!value || value.trim() === "")) {
    return `${fieldName} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === "") {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} must be no more than ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    if (fieldName.toLowerCase().includes("email")) {
      return "Please enter a valid email address";
    }
    if (fieldName.toLowerCase().includes("phone")) {
      return "Please enter a valid phone number";
    }
    return `${fieldName} format is invalid`;
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

/**
 * Validate multiple fields at once
 */
export function validateForm(
  data: Record<string, string>,
  rules: Record<string, ValidationRule>
): ValidationError[] {
  const errors: ValidationError[] = [];

  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field] || "";
    const error = validateField(value, fieldRules, field);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
}

/**
 * Common validation rules
 */
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: true,
    pattern: /^[\+]?[\d\s\-\(\)]{10,}$/,
  },
  required: {
    required: true,
  },
  optionalText: {
    required: false,
    maxLength: 500,
  },
  longText: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
} as const;
