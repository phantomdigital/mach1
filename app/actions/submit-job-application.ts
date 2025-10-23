"use server";

import { Resend } from "resend";
import type { Attachment } from "resend";
import JobApplicationEmail from "@/emails/job-application-email";
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

    // Determine the recipient email (use application-specific email if provided, otherwise default)
    const recipientEmail = validatedData.applicationEmail || "careers@mach1logistics.com.au";

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

    // Send email using Resend with attachments
    const { data, error } = await resend.emails.send({
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

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: "Failed to send application. Please try again later.",
      };
    }

    console.log("Job application email sent successfully:", data?.id);

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

