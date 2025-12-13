"use server";

import { Resend } from "resend";
import type { Attachment } from "resend";
import JobApplicationEmail from "@/emails/job-application-email";
import JobApplicationConfirmationEmail from "@/emails/job-application-confirmation-email";
import { jobApplicationSchema, safeValidate } from "@/lib/validation-schemas";

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

    const validatedData = validation.data;

    // Determine the recipient email (use application-specific email if provided, otherwise use env var)
    const recipientEmail = validatedData.applicationEmail || process.env.EMAIL_TO || "careers@mach1logistics.com.au";

    // Prepare attachments for Resend
    const attachments: Attachment[] = [];

    // Add resume
    attachments.push({
      filename: validatedData.resume.filename,
      content: validatedData.resume.content,
    });

    // Add cover letter if provided
    if (validatedData.coverLetter) {
      attachments.push({
        filename: validatedData.coverLetter.filename,
        content: validatedData.coverLetter.content,
      });
    }

    // Add other files if provided
    if (validatedData.otherFiles && validatedData.otherFiles.length > 0) {
      validatedData.otherFiles.forEach((file) => {
        attachments.push({
          filename: file.filename,
          content: file.content,
        });
      });
    }

    // Send email to HR/hiring team with attachments
    const { data: hrEmailData, error: hrEmailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Mach1 Logistics <noreply@testing.phantomdigital.au>",
      to: [recipientEmail],
      replyTo: validatedData.email, // Allow direct reply to applicant
      subject: `Job Application: ${validatedData.jobTitle} - ${validatedData.fullName}`,
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
      from: process.env.EMAIL_FROM || "Mach1 Logistics <noreply@testing.phantomdigital.au>",
      to: [validatedData.email],
      subject: `Application Received: ${validatedData.jobTitle} Position`,
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

