"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import ContactFormEmail from "@/emails/contact-form-email";
import { contactFormSchema, safeValidate } from "@/lib/validation-schemas";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

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
    // Rate limiting check (5 requests per hour per IP)
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimit = await checkRateLimit(`contact-form:${clientId}`, 5, 60 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for contact form: ${clientId}`);
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }

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

    // Sanitize subject line inputs to prevent header injection
    const sanitizeForSubject = (str: string): string => {
      return str.replace(/[\r\n]/g, '').substring(0, 50); // Remove newlines and limit length
    };

    // Normalize email address (trim and lowercase)
    const normalizedEmail = validatedData.email.trim().toLowerCase();

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MACH1 Logistics <noreply@mach1logistics.com.au>",
      to: [process.env.EMAIL_TO || "quotes@mach1logistics.com.au"], // Main recipient
      replyTo: normalizedEmail, // Allow direct reply to customer
      subject: `New Contact Form Submission - ${sanitizeForSubject(validatedData.enquiryType)}`,
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

