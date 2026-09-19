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
import { defaultLocale, type LocaleCode } from "@/prismicio";
import { localizedChrome, localizedPath } from "@/lib/localized-routes";
import { trackPlausible } from "@/lib/plausible";
import { TurnstileField } from "@/components/turnstile-field";

interface ValidationError {
  field: string;
  message: string;
}

interface ContactFormProps {
  locale?: LocaleCode;
  successMessage: string;
  thankYouHeading: string;
  thankYouDescription: string;
  thankYouInfoTitle: string;
  thankYouInfoText: string;
}

export default function ContactForm({
  locale = defaultLocale,
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
  const [turnstileToken, setTurnstileToken] = useState("");


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
      const result = await submitContactForm({ ...formData, turnstileToken });

      if (result.success) {
        trackPlausible("Contact Submit", { page: "contact" });
        router.push(localizedPath("/contact/thank-you", locale));
        // Keep isSubmitting true until redirect completes
      } else {
        // Handle server-side validation errors
        if (result.validationErrors && result.validationErrors.length > 0) {
          setValidationErrors(result.validationErrors);
        } else {
          setError(
            result.error ||
              localizedChrome(
                locale,
                "Failed to submit form. Please try again.",
                "表单提交失败，请重试。",
                "फ़ॉर्म जमा नहीं हो सका। कृपया फिर से प्रयास करें।",
              ),
          );
        }
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(
        localizedChrome(
          locale,
          "An unexpected error occurred. Please try again.",
          "发生意外错误，请重试。",
          "एक अप्रत्याशित त्रुटि हुई। कृपया फिर से प्रयास करें।",
        ),
      );
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
            {localizedChrome(locale, "Please fix the following errors:", "请修正以下错误：", "कृपया निम्न त्रुटियाँ ठीक करें:")}
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
          {localizedChrome(locale, "Full Name", "姓名", "पूरा नाम")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder={localizedChrome(locale, "Enter first name...", "请输入姓名……", "पहला नाम दर्ज करें……")}
          required
        />
      </div>

      {/* Role or Position */}
      <div>
        <label htmlFor="role" className="block text-sm text-neutral-900 mb-2">
          {localizedChrome(locale, "Role or position", "职位", "भूमिका या पद")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="role"
          type="text"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          placeholder={localizedChrome(locale, "Enter role or position...", "请输入职位……", "भूमिका या पद दर्ज करें……")}
          required
        />
      </div>

      {/* Contact Number */}
      <div>
        <label htmlFor="contactNumber" className="block text-sm text-neutral-900 mb-2">
          {localizedChrome(locale, "Contact Number", "联系电话", "संपर्क नंबर")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={(e) => handleChange("contactNumber", e.target.value)}
          placeholder={localizedChrome(locale, "Enter contact number...", "请输入联系电话……", "संपर्क नंबर दर्ज करें……")}
          required
        />
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm text-neutral-900 mb-2">
          {localizedChrome(locale, "Company Name", "公司名称", "कंपनी का नाम")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="companyName"
          type="text"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          placeholder={localizedChrome(locale, "Enter company name...", "请输入公司名称……", "कंपनी का नाम दर्ज करें……")}
          required
        />
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="block text-sm text-neutral-900 mb-2">
          {localizedChrome(locale, "Email Address", "电子邮箱", "ईमेल पता")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={localizedChrome(locale, "Enter email address...", "请输入电子邮箱……", "ईमेल पता दर्ज करें……")}
          required
        />
      </div>

      {/* Enquiry Type */}
      <div>
        <label htmlFor="enquiryType" className="block text-sm text-neutral-900 mb-2">
          {localizedChrome(locale, "Enquiry Type", "询盘类型", "पूछताछ का प्रकार")} <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.enquiryType}
          onValueChange={(value: string) => handleChange("enquiryType", value)}
          required
        >
          <SelectTrigger id="enquiryType">
            <SelectValue placeholder={localizedChrome(locale, "Select an enquiry type", "请选择询盘类型", "पूछताछ का प्रकार चुनें")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">{localizedChrome(locale, "General Enquiry", "一般询盘", "सामान्य पूछताछ")}</SelectItem>
            <SelectItem value="quote">{localizedChrome(locale, "Request a Quote", "获取报价", "कोटेशन का अनुरोध")}</SelectItem>
            <SelectItem value="tracking">{localizedChrome(locale, "Tracking Support", "追踪支持", "ट्रैकिंग सहायता")}</SelectItem>
            <SelectItem value="partnership">{localizedChrome(locale, "Partnership Opportunity", "合作机会", "साझेदारी अवसर")}</SelectItem>
            <SelectItem value="other">{localizedChrome(locale, "Other", "其他", "अन्य")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm text-neutral-900 mb-2">
          {localizedChrome(locale, "Message", "留言", "संदेश")} <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder={localizedChrome(locale, "Enter your message...", "请输入您的留言……", "अपना संदेश दर्ज करें……")}
          required
          rows={6}
        />
      </div>

      <TurnstileField onToken={setTurnstileToken} />

      {/* Submit Button */}
      <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {localizedChrome(locale, "SUBMITTING...", "正在提交…", "जमा हो रहा है…")}
          </>
        ) : (
          localizedChrome(locale, "SUBMIT", "提交", "सबमिट करें")
        )}
      </Button>
    </form>
  );
}

