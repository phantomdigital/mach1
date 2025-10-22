"use server";

import { Resend } from "resend";
import ContactFormEmail from "@/emails/contact-form-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  fullName: string;
  role: string;
  contactNumber: string;
  companyName: string;
  email: string;
  enquiryType: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export async function submitContactForm(
  formData: ContactFormData
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

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.message) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Mach1 Logistics <noreply@testing.phantomdigital.au>",
      to: [process.env.EMAIL_TO || "admin@mach1logistics.com.au"], // Main recipient
      replyTo: formData.email, // Allow direct reply to customer
      subject: `New Contact Form Submission - ${formData.enquiryType}`,
      react: ContactFormEmail({
        fullName: formData.fullName,
        role: formData.role,
        contactNumber: formData.contactNumber,
        companyName: formData.companyName,
        email: formData.email,
        enquiryType: formData.enquiryType,
        message: formData.message,
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

