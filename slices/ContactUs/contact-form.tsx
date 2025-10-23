"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contactFormSchema, safeValidate } from "@/lib/validation-schemas";
import { submitContactForm } from "@/app/actions/send-contact-form";

interface ValidationError {
  field: string;
  message: string;
}

interface ContactFormProps {
  successMessage: string;
  thankYouHeading: string;
  thankYouDescription: string;
  thankYouInfoTitle: string;
  thankYouInfoText: string;
}

export default function ContactForm({ 
}: ContactFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    contactNumber: "",
    companyName: "",
    email: "",
    enquiryType: "",
    message: "",
  });


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors([]);

    // Client-side validation with Zod
    const validation = safeValidate(contactFormSchema, formData);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        // Redirect to thank you page with email parameter
        const emailParam = encodeURIComponent(formData.email);
        router.push(`/contact/thank-you?email=${emailParam}`);
      } else {
        // Handle server-side validation errors
        if (result.validationErrors && result.validationErrors.length > 0) {
          setValidationErrors(result.validationErrors);
        } else {
          setError(result.error || "Failed to submit form. Please try again.");
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors.some(err => err.field === field)) {
      setValidationErrors(prev => prev.filter(err => err.field !== field));
    }
  };

  // Helper to get field error
  const getFieldError = (fieldName: string) => {
    return validationErrors.find(err => err.field === fieldName)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Validation Errors Summary */}
      {validationErrors.length > 0 && !error && (
        <Alert variant="destructive">
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 list-disc list-inside space-y-1">
              {validationErrors.map((err, index) => (
                <li key={index} className="text-sm">{err.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm text-neutral-900 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Enter first name..."
          required
        />
      </div>

      {/* Role or Position */}
      <div>
        <label htmlFor="role" className="block text-sm text-neutral-900 mb-2">
          Role or position <span className="text-red-500">*</span>
        </label>
        <Input
          id="role"
          type="text"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          placeholder="Enter role or position..."
          required
        />
      </div>

      {/* Contact Number */}
      <div>
        <label htmlFor="contactNumber" className="block text-sm text-neutral-900 mb-2">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <Input
          id="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={(e) => handleChange("contactNumber", e.target.value)}
          placeholder="Enter contact number..."
          required
        />
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm text-neutral-900 mb-2">
          Company Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="companyName"
          type="text"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          placeholder="Enter company name..."
          required
        />
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="block text-sm text-neutral-900 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter email address..."
          required
        />
      </div>

      {/* Enquiry Type */}
      <div>
        <label htmlFor="enquiryType" className="block text-sm text-neutral-900 mb-2">
          Enquiry Type <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.enquiryType}
          onValueChange={(value: string) => handleChange("enquiryType", value)}
          required
        >
          <SelectTrigger id="enquiryType">
            <SelectValue placeholder="Select an enquiry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Enquiry</SelectItem>
            <SelectItem value="quote">Request a Quote</SelectItem>
            <SelectItem value="tracking">Tracking Support</SelectItem>
            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm text-neutral-900 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Enter your message..."
          required
          rows={6}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            SUBMITTING...
          </>
        ) : (
          "SUBMIT"
        )}
      </Button>
    </form>
  );
}

