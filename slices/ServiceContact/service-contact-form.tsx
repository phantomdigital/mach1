"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { submitContactForm } from "@/app/actions/send-contact-form";

interface ServiceContactFormProps {
  pageTitle: string;
  submitButtonText: string;
}

interface ServiceContactState {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  message: string;
}

const initialState: ServiceContactState = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ServiceContactForm({
  pageTitle,
  submitButtonText,
}: ServiceContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ServiceContactState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedPageTitle = useMemo(() => pageTitle?.trim() || "Unknown Service Page", [pageTitle]);

  const handleChange = (field: keyof ServiceContactState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitContactForm({
        fullName: formData.fullName,
        role: "Service Page Visitor",
        contactNumber: formData.phone,
        companyName: formData.companyName,
        email: formData.email,
        enquiryType: "Service Page Enquiry",
        message: `[Page: ${normalizedPageTitle}]\n\n${formData.message}`,
      });

      if (!result.success) {
        setError(result.error || "Unable to send your enquiry right now.");
        setIsSubmitting(false);
        return;
      }

      const emailParam = encodeURIComponent(formData.email);
      router.push(`/contact/thank-you?email=${emailParam}`);
      // Keep isSubmitting true until redirect completes
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6 max-w-xl mx-auto">
      <input type="hidden" name="pageTitle" value={normalizedPageTitle} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-5 lg:space-y-10">
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Full name"
          required
        />
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          placeholder="Company name"
          required
        />
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email address"
          required
        />
        <Input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Phone number"
          required
        />
        <Textarea
          name="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="How can we help?"
          rows={5}
          required
        />
      </div>

      <div className="flex justify-center">
        <Button type="submit" variant="hero" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
}
