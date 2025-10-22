"use client"

import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { HeroButton } from "@/components/ui/hero-button"
import { cn } from "@/lib/utils"

interface JobApplicationDialogProps {
  jobTitle: string
  applicationEmail?: string | null
  children: React.ReactNode
  closingDate?: string | null
}

export function JobApplicationDialog({
  jobTitle,
  applicationEmail,
  children,
  closingDate,
}: JobApplicationDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })
  const [files, setFiles] = useState<{
    resume: File | null
    coverLetterFile: File | null
    other: File[]
  }>({
    resume: null,
    coverLetterFile: null,
    other: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Reset form when modal closes
      if (!isOpen && isSubmitted) {
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            fullName: "",
            email: "",
            phone: "",
          })
          setFiles({
            resume: null,
            coverLetterFile: null,
            other: []
          })
        }, 300)
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isSubmitted])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create list of attached files
    const attachments: string[] = []
    if (files.resume) attachments.push(`Resume: ${files.resume.name}`)
    if (files.coverLetterFile) attachments.push(`Cover Letter: ${files.coverLetterFile.name}`)
    if (files.other.length > 0) {
      files.other.forEach((file, index) => {
        attachments.push(`Supporting Document ${index + 1}: ${file.name}`)
      })
    }

    // Create mailto link with form data
    const subject = `Application for ${jobTitle}`
    const body = `
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

${attachments.length > 0 ? `DOCUMENTS TO ATTACH:\n${attachments.join('\n')}` : ''}
    `.trim()

    const mailtoLink = `mailto:${applicationEmail || "careers@mach1logistics.com.au"}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    window.location.href = mailtoLink

    // Show thank you message
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 500)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'resume' | 'coverLetterFile' | 'other'
  ) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    if (type === 'other') {
      // For "other" documents, allow multiple files
      setFiles((prev) => ({
        ...prev,
        other: [...prev.other, ...Array.from(selectedFiles)]
      }))
    } else {
      // For resume and cover letter, single file only
      setFiles((prev) => ({
        ...prev,
        [type]: selectedFiles[0]
      }))
    }
  }

  const removeFile = (type: 'resume' | 'coverLetterFile', index?: number) => {
    if (type === 'resume' || type === 'coverLetterFile') {
      setFiles((prev) => ({
        ...prev,
        [type]: null
      }))
    }
  }

  const removeOtherFile = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      other: prev.other.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col p-0 gap-0 max-h-[90vh]">
        {/* Sticky Header - Just Title */}
        <div className="sticky top-0 z-10 bg-white px-8 lg:px-12 pt-8 lg:pt-6 pb-6 border-b border-neutral-200">
          <DialogHeader>
            <DialogTitle>{isSubmitted ? "Thank You!" : `Apply for ${jobTitle}`}</DialogTitle>
          </DialogHeader>
        </div>

        {isSubmitted ? (
          /* Thank You Message */
          <div className="flex-1 flex items-center justify-center px-8 lg:px-12 py-12">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-mach1-green rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">
                Application Submitted Successfully!
              </h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                Your email client should have opened with your application details. 
                Please attach your documents and send the email to complete your application.
              </p>
              <p className="text-sm text-neutral-500">
                We&apos;ll review your application and get back to you soon.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Content */}
          <div 
            className="flex-1 overflow-y-auto px-8 lg:px-12 py-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d4d4d4 transparent'
            }}
            onWheel={(e) => {
              // Ensure scroll events are handled by this element
              e.stopPropagation()
            }}
          >
            <div className="space-y-6">
              {/* Description moved here */}
              <DialogDescription>
                Fill out the form below to apply for this position. We&apos;ll get back to you
                as soon as possible.
                {closingDate && (
                  <span className="block mt-2 text-neutral-700 font-medium">
                    Applications close on {closingDate}
                  </span>
                )}
              </DialogDescription>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Full Name *
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john.smith@example.com"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+61 4XX XXX XXX"
                className="w-full"
              />
            </div>


            {/* Resume Upload */}
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Resume / CV *
              </label>
              <div className="space-y-2">
                <label
                  htmlFor="resume"
                  className={cn(
                    "flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors",
                    files.resume && "border-mach1-green bg-mach1-green/5"
                  )}
                >
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>{files.resume ? files.resume.name : "Click to upload resume (PDF)"}</span>
                  </div>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'resume')}
                    className="hidden"
                    required
                  />
                </label>
                {files.resume && (
                  <button
                    type="button"
                    onClick={() => removeFile('resume')}
                    className="text-xs text-red-600 hover:text-red-700 underline"
                  >
                    Remove file
                  </button>
                )}
              </div>
            </div>

            {/* Cover Letter File Upload (Optional) */}
            <div>
              <label
                htmlFor="coverLetterFile"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Cover Letter Document (Optional)
              </label>
              <div className="space-y-2">
                <label
                  htmlFor="coverLetterFile"
                  className={cn(
                    "flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors",
                    files.coverLetterFile && "border-mach1-green bg-mach1-green/5"
                  )}
                >
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>{files.coverLetterFile ? files.coverLetterFile.name : "Click to upload cover letter (PDF)"}</span>
                  </div>
                  <input
                    id="coverLetterFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'coverLetterFile')}
                    className="hidden"
                  />
                </label>
                {files.coverLetterFile && (
                  <button
                    type="button"
                    onClick={() => removeFile('coverLetterFile')}
                    className="text-xs text-red-600 hover:text-red-700 underline"
                  >
                    Remove file
                  </button>
                )}
              </div>
            </div>

            {/* Other Documents Upload (Optional) */}
            <div>
              <label
                htmlFor="otherDocs"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Supporting Documents (Optional)
              </label>
              <div className="space-y-2">
                <label
                  htmlFor="otherDocs"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add certificates, portfolio, references, etc.</span>
                  </div>
                  <input
                    id="otherDocs"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileChange(e, 'other')}
                    className="hidden"
                  />
                </label>
                {files.other.length > 0 && (
                  <div className="space-y-1">
                    {files.other.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs text-neutral-600 bg-neutral-50 px-3 py-2 rounded">
                        <span className="truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeOtherFile(index)}
                          className="text-red-600 hover:text-red-700 ml-2 underline flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-10 bg-white px-8 lg:px-12 py-6 border-t border-neutral-200">
            <HeroButton
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "OPENING EMAIL..." : "SUBMIT APPLICATION"}
            </HeroButton>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

