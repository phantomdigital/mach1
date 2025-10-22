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
import { submitContactForm } from "@/app/actions/send-contact-form";

interface ContactFormProps {
  successMessage: string;
  thankYouHeading: string;
  thankYouDescription: string;
  thankYouInfoTitle: string;
  thankYouInfoText: string;
}

export default function ContactForm({ 
  successMessage, 
  thankYouHeading,
  thankYouDescription,
  thankYouInfoTitle,
  thankYouInfoText 
}: ContactFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        // Redirect to thank you page
        router.push("/contact/thank-you");
      } else {
        setError(result.error || "Failed to submit form. Please try again.");
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
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
        {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
      </Button>
    </form>
  );
}

