import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img,
  Tailwind,
} from "@react-email/components";
import { obfuscateMailtoLink } from "@/lib/email-obfuscation";

interface JobApplicationEmailProps {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  resumeFileName: string;
  coverLetterFileName?: string;
  otherFileNames?: string[];
}

export default function JobApplicationEmail({
  fullName,
  email,
  phone,
  jobTitle,
  resumeFileName,
  coverLetterFileName,
  otherFileNames = [],
}: JobApplicationEmailProps) {
  // Base URL for assets - must be absolute URL for emails
  // Use localhost in development for React Email preview
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? "http://localhost:3000" 
    : (process.env.NEXT_PUBLIC_BASE_URL || "https://mach1logistics.com.au");
  
  // Logo URL - using PNG format for better email compatibility
  const logoUrl = `${baseUrl}/logo/email-logo.png`;

  // Obfuscate email for display to prevent bot scraping
  const obfuscatedEmail = obfuscateMailtoLink(email);

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                "mach1-red": "#ED1E24",
                "mach1-blue": "#0000FF",
                "mach1-black": "#262626",
                "mach1-green": "#0AAE88",
                "mach-gray": "#747474",
                "dark-blue": "#141433",
              },
              fontFamily: {
                // Use web-safe fonts for email compatibility
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="bg-neutral-100 font-sans">
          <Container className="mx-auto mb-16 max-w-[600px] bg-white p-0">
            {/* Logo Header with Dark Blue Background and Angled Bottom */}
            <Section className="relative bg-dark-blue px-10 pb-12 pt-10 text-center">
              <Img
                src={logoUrl}
                alt="MACH1 Logistics"
                width="200"
                className="mx-auto inline-block"
                style={{ height: 'auto' }}
              />
              {/* Decorative corner accent */}
              <div className="absolute bottom-0 right-0 h-16 w-16 border-b-[6px] border-r-[6px] border-mach1-green" />
            </Section>

            {/* Green Accent Strip */}
            <Section className="m-0 h-1.5 bg-mach1-green" />

            <Heading className="mx-0 mb-4 mt-8 px-10 text-[28px] font-bold leading-tight text-dark-blue">
              New Job Application Received
            </Heading>
            
            <Text className="mx-0 my-4 px-10 text-base leading-7 text-neutral-600">
              A new candidate has applied for the <span className="font-bold text-dark-blue">{jobTitle}</span> position.
            </Text>

            <Hr className="mx-10 my-8 border-neutral-200" />

            <Section className="px-10">
              {/* Section Header with Corner Accent */}
              <div className="relative mb-6">
                <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                  Applicant Details
                </Heading>
                <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
              </div>
              
              {/* Applicant Details Card */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                <table className="m-0 w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                        Position:
                      </td>
                      <td className="px-0 py-3 align-top text-base text-mach1-black">
                        <span className="inline-block rounded bg-mach1-green px-3 py-1 text-sm font-bold uppercase tracking-wide text-white">
                          {jobTitle}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                        Full Name:
                      </td>
                      <td className="px-0 py-3 align-top text-base text-mach1-black">
                        {fullName}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                        Email:
                      </td>
                      <td className="px-0 py-3 align-top text-base text-mach1-black">
                        <a href={obfuscatedEmail.href} className="font-semibold text-dark-blue no-underline" dangerouslySetInnerHTML={{ __html: obfuscatedEmail.display }} />
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                        Phone:
                      </td>
                      <td className="px-0 py-3 align-top text-base text-mach1-black">
                        <a 
                          href={`tel:${phone?.replace(/\s/g, '') || ''}`} 
                          className="font-semibold text-dark-blue no-underline"
                        >
                          {phone}
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Hr className="mx-10 my-8 border-neutral-200" />

            <Section className="px-10">
              {/* Documents Header with Corner Accent */}
              <div className="relative mb-6">
                <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                  Submitted Documents
                </Heading>
                <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
              </div>
              
              {/* Documents Card */}
              <div className="relative overflow-hidden rounded-lg border-2 border-neutral-200 bg-white p-6">
                {/* Green accent corner */}
                <div className="absolute left-0 top-0 h-12 w-12 border-l-[4px] border-t-[4px] border-mach1-green" />
                
                {/* Resume */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mach1-green">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <Text className="m-0 text-xs font-semibold uppercase tracking-wide text-mach-gray">
                      Resume / CV
                    </Text>
                    <Text className="m-0 text-sm font-semibold text-mach1-black">
                      {resumeFileName}
                    </Text>
                  </div>
                </div>

                {/* Cover Letter */}
                {coverLetterFileName && (
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-blue">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <Text className="m-0 text-xs font-semibold uppercase tracking-wide text-mach-gray">
                        Cover Letter
                      </Text>
                      <Text className="m-0 text-sm font-semibold text-mach1-black">
                        {coverLetterFileName}
                      </Text>
                    </div>
                  </div>
                )}

                {/* Other Documents */}
                {otherFileNames && otherFileNames.length > 0 && (
                  <div>
                    <Text className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-mach-gray">
                      Supporting Documents
                    </Text>
                    {otherFileNames.map((fileName, index) => (
                      <div key={index} className="mb-2 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200">
                          <svg className="h-4 w-4 text-mach1-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </div>
                        <Text className="m-0 text-sm text-mach1-black">
                          {fileName}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}

                <Hr className="my-6 border-neutral-200" />

                {/* Important Notice */}
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <Text className="m-0 mb-1 text-sm font-bold text-green-900">
                        Files Attached
                      </Text>
                      <Text className="m-0 text-sm leading-relaxed text-green-800">
                        All documents submitted by the applicant are attached to this email for your review.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Hr className="mx-10 my-8 border-neutral-200" />

            {/* Footer with Dark Blue Background and Corner Accents */}
            <Section className="relative m-0 bg-dark-blue px-10 py-8 text-center">
              {/* Top corner accents */}
              <div className="absolute left-0 top-0 h-12 w-12 border-l-[4px] border-t-[4px] border-mach1-green" />
              <div className="absolute right-0 top-0 h-12 w-12 border-r-[4px] border-t-[4px] border-mach1-green" />
              
              <Text className="m-0 text-sm leading-6 text-neutral-200">
                This application was submitted from the careers page on
              </Text>
              <Text className="m-0 mt-2 text-base font-bold leading-6 text-white">
                <a href={baseUrl} className="font-semibold text-mach1-green no-underline">
                  mach1logistics.com.au
                </a>
              </Text>
              <Text className="m-0 mt-4 text-xs leading-6 text-neutral-400">
                Reply to this email to contact the candidate directly.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

