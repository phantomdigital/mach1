"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import QuoteRequestEmail from "@/emails/quote-request-email";
import QuoteRequestConfirmationEmail from "@/emails/quote-request-confirmation-email";
import { quoteRequestSchema, packageSchema } from "@/lib/validation-schemas";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Package {
  id: string;
  description: string;
  origin: string;
  destination: string;
  weight: string;
  weightUnit: string;
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
  quantity: string;
}

interface SendQuoteEmailParams {
  serviceType?: string;
  formData: Record<string, string>;
  packages?: Package[];
}

export async function sendQuoteEmail({
  serviceType,
  formData,
  packages = [],
}: SendQuoteEmailParams) {
  try {
    // Rate limiting check (5 requests per hour per IP)
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimit = await checkRateLimit(`quote-request:${clientId}`, 5, 60 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for quote request: ${clientId}`);
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }

    // SERVER-SIDE VALIDATION
    // Validate the entire request
    const validationResult = quoteRequestSchema.safeParse({
      serviceType,
      formData,
      packages,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      console.error("Validation failed:", errors);
      return { 
        success: false, 
        error: "Invalid form data. Please check all required fields.",
        validationErrors: errors 
      };
    }

    // Validate packages if provided
    if (packages.length > 0) {
      for (let i = 0; i < packages.length; i++) {
        const pkgValidation = packageSchema.safeParse(packages[i]);
        if (!pkgValidation.success) {
          const errors = pkgValidation.error.issues.map((err) => ({
            field: `packages[${i}].${err.path.join('.')}`,
            message: err.message,
          }));
          console.error(`Package ${i + 1} validation failed:`, errors);
          return { 
            success: false, 
            error: `Invalid package data for Package ${i + 1}`,
            validationErrors: errors 
          };
        }
      }
    }

    // Sanitize and validate email addresses
    const customerEmail = (formData.email || formData.Email || '').trim().toLowerCase();
    const customerName = (formData.fullName || formData.name || 'Customer').trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerEmail && !emailRegex.test(customerEmail)) {
      return { 
        success: false, 
        error: "Invalid customer email address" 
      };
    }

    // Sanitize subject line inputs to prevent header injection
    const sanitizeForSubject = (str: string): string => {
      return str.replace(/[\r\n]/g, '').substring(0, 50); // Remove newlines and limit length
    };

    // Check environment variables are set
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return { 
        success: false, 
        error: "Email service not configured" 
      };
    }

    if (!process.env.EMAIL_TO) {
      console.error("EMAIL_TO not configured");
      return { 
        success: false, 
        error: "Email recipient not configured" 
      };
    }

    // Send email to company
    const { data: companyData, error: companyError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MACH1 Logistics <noreply@mach1logistics.com.au>",
      to: process.env.EMAIL_TO,
      subject: `New Quote Request${serviceType ? ` - ${sanitizeForSubject(serviceType)}` : ''}${customerName ? ` from ${sanitizeForSubject(customerName)}` : ''}`,
      react: QuoteRequestEmail({
        serviceType,
        formData,
        packages,
      }),
      // Optional: Add reply-to if customer provided email
      ...(customerEmail && { replyTo: customerEmail }),
    });

    if (companyError) {
      console.error("Error sending quote email to company:", companyError);
      return { success: false, error: companyError.message };
    }

    console.log("Quote email sent to company successfully:", companyData);

    // Send confirmation email to customer (if they provided an email)
    if (customerEmail) {
      const { data: customerData, error: customerError } = await resend.emails.send({
        from: process.env.EMAIL_FROM_CUSTOMER || process.env.EMAIL_FROM || "MACH1 Logistics <team@mach1logistics.com.au>",
        to: customerEmail,
        subject: `Quote Request Received - MACH1 Logistics`,
        react: QuoteRequestConfirmationEmail({
          customerName,
          serviceType,
        }),
      });

      if (customerError) {
        console.error("Error sending confirmation email to customer:", customerError);
        // Don't fail the whole operation if customer email fails
        // The important email (to company) was already sent
        return { 
          success: true, 
          data: companyData,
          warning: "Quote received but confirmation email to customer failed" 
        };
      }

      console.log("Confirmation email sent to customer successfully:", customerData);
    }

    return { success: true, data: companyData };
  } catch (error) {
    console.error("Error in sendQuoteEmail:", error);
    
    // Check for specific error types
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        validationErrors: error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

