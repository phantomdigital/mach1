"use server";

import { Resend } from "resend";
import ContactFormEmail from "@/emails/contact-form-email";
import { contactFormSchema, safeValidate } from "@/lib/validation-schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormResponse {
  success: boolean;
  error?: string;
  message?: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

export async function submitContactForm(
  formData: unknown
): Promise<ContactFormResponse> {
  try {
    // Validate environment variable
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return {
        success: false,
        error: "Email service is not configured. Please contact support.",
      };
    }

    // Server-side validation with Zod
    const validation = safeValidate(contactFormSchema, formData);
    if (!validation.success) {
      return {
        success: false,
        error: "Please fix the validation errors.",
        validationErrors: validation.errors,
      };
    }

    const validatedData = validation.data;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Mach1 Logistics <noreply@testing.phantomdigital.au>",
      to: [process.env.EMAIL_TO || "admin@mach1logistics.com.au"], // Main recipient
      replyTo: validatedData.email, // Allow direct reply to customer
      subject: `New Contact Form Submission - ${validatedData.enquiryType}`,
      react: ContactFormEmail({
        fullName: validatedData.fullName,
        role: validatedData.role,
        contactNumber: validatedData.contactNumber,
        companyName: validatedData.companyName,
        email: validatedData.email,
        enquiryType: validatedData.enquiryType,
        message: validatedData.message,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: "Failed to send email. Please try again later.",
      };
    }

    console.log("Email sent successfully:", data?.id);

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

