"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import type { Attachment } from "resend";
import JobApplicationEmail from "@/emails/job-application-email";
import JobApplicationConfirmationEmail from "@/emails/job-application-confirmation-email";
import { jobApplicationSchema, safeValidate } from "@/lib/validation-schemas";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { companyEmailFrom, customerEmailFrom } from "@/lib/email-from";
import { resolveJobApplicationRecipient } from "@/lib/job-recipient";
import { sanitizeAttachmentFilename } from "@/lib/security";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { defaultLocale, type LocaleCode } from "@/prismicio";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface JobApplicationResponse {
  success: boolean;
  error?: string;
  message?: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

export async function submitJobApplication(
  formData: unknown
): Promise<JobApplicationResponse> {
  try {
    // Rate limiting check (3 requests per hour per IP - job applications are less frequent)
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimit = await checkRateLimit(`job-application:${clientId}`, 3, 60 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for job application: ${clientId}`);
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
    const validation = safeValidate(jobApplicationSchema, formData);
    if (!validation.success) {
      return {
        success: false,
        error: "Please fix the validation errors.",
        validationErrors: validation.errors,
      };
    }

    const payload = formData as { turnstileToken?: string; locale?: LocaleCode };
    const verified = await verifyTurnstileToken(payload.turnstileToken, clientId);
    if (!verified) {
      return { success: false, error: "Verification failed. Please try again." };
    }

    const validatedData = validation.data;

    const sanitizeForSubject = (str: string): string => {
      return str.replace(/[\r\n]/g, '').substring(0, 50);
    };

    let recipientEmail: string;
    try {
      recipientEmail = await resolveJobApplicationRecipient(
        validatedData.jobUid,
        payload.locale || defaultLocale
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "This position is no longer accepting applications.",
      };
    }

    // Prepare attachments for Resend
    const attachments: Attachment[] = [];

    // Add resume
    attachments.push({
          filename: sanitizeAttachmentFilename(validatedData.resume.filename),
          content: validatedData.resume.content,
        });

    // Add cover letter if provided
    if (validatedData.coverLetter) {
        attachments.push({
          filename: sanitizeAttachmentFilename(validatedData.coverLetter.filename),
          content: validatedData.coverLetter.content,
        });
    }

    // Add other files if provided
    if (validatedData.otherFiles && validatedData.otherFiles.length > 0) {
      validatedData.otherFiles.forEach((file) => {
        attachments.push({
          filename: sanitizeAttachmentFilename(file.filename),
          content: file.content,
        });
      });
    }

    // Send email to HR/hiring team with attachments
    const { data: hrEmailData, error: hrEmailError } = await resend.emails.send({
      from: companyEmailFrom(),
      to: [recipientEmail],
      replyTo: validatedData.email, // Allow direct reply to applicant
      subject: `Job Application: ${sanitizeForSubject(validatedData.jobTitle)} - ${sanitizeForSubject(validatedData.fullName)}`,
      react: JobApplicationEmail({
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        jobTitle: validatedData.jobTitle,
        resumeFileName: validatedData.resume.filename,
        coverLetterFileName: validatedData.coverLetter?.filename,
        otherFileNames: validatedData.otherFiles?.map((f) => f.filename) || [],
      }),
      attachments,
    });

    if (hrEmailError) {
      console.error("Resend error (HR email):", hrEmailError);
      return {
        success: false,
        error: "Failed to send application. Please try again later.",
      };
    }

    console.log("Job application email sent to HR successfully:", hrEmailData?.id);

    // Send confirmation email to applicant (no attachments needed)
    const { data: confirmationEmailData, error: confirmationEmailError } = await resend.emails.send({
      from: customerEmailFrom(),
      to: [validatedData.email],
      replyTo: recipientEmail,
      subject: `Application Received: ${sanitizeForSubject(validatedData.jobTitle)} Position`,
      react: JobApplicationConfirmationEmail({
        fullName: validatedData.fullName,
        jobTitle: validatedData.jobTitle,
        resumeFileName: validatedData.resume.filename,
        coverLetterFileName: validatedData.coverLetter?.filename,
        otherFileNames: validatedData.otherFiles?.map((f) => f.filename) || [],
      }),
    });

    if (confirmationEmailError) {
      console.error("Resend error (confirmation email):", confirmationEmailError);
      // Don't fail the whole process if confirmation email fails
      console.log("HR email sent successfully, but confirmation email failed");
    } else {
      console.log("Confirmation email sent to applicant successfully:", confirmationEmailData?.id);
    }

    return {
      success: true,
      message: "Your application has been submitted successfully!",
    };
  } catch (error) {
    console.error("Error submitting job application:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

