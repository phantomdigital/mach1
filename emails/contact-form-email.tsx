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

interface ContactFormEmailProps {
  fullName: string;
  role: string;
  contactNumber: string;
  companyName: string;
  email: string;
  enquiryType: string;
  message: string;
}

export default function ContactFormEmail({
  fullName,
  role,
  contactNumber,
  companyName,
  email,
  enquiryType,
  message,
}: ContactFormEmailProps) {
  const enquiryTypeLabels: Record<string, string> = {
    general: "General Enquiry",
    quote: "Request a Quote",
    tracking: "Tracking Support",
    partnership: "Partnership Opportunity",
    other: "Other",
  };

  // Base URL for assets - must be absolute URL for emails
  // For development, you may need to use ngrok or upload logo to a CDN
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mach1logistics.com.au";
  
  // Logo URL - using direct absolute path
  const logoUrl = `${baseUrl}/logo/MACH1LOGISTICS_LOGO_colour-1024x768.jpg`;

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
                height="150"
                className="mx-auto inline-block"
              />
              {/* Decorative corner accent */}
              <div className="absolute bottom-0 right-0 h-16 w-16 border-b-[6px] border-r-[6px] border-mach1-green" />
            </Section>

            {/* Green Accent Strip */}
            <Section className="m-0 h-1.5 bg-mach1-green" />

            <Heading className="mx-0 mb-4 mt-8 px-10 text-[28px] font-bold leading-tight text-dark-blue">
              New Contact Form Submission
            </Heading>
            
            <Text className="mx-0 my-4 px-10 text-base leading-7 text-neutral-600">
              You have received a new contact form submission from your website.
            </Text>

            <Hr className="mx-10 my-8 border-neutral-200" />

            <Section className="px-10">
              {/* Section Header with Corner Accent */}
              <div className="relative mb-6">
                <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                  Contact Details
                </Heading>
                <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
              </div>
              
              {/* Contact Details Card */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                <table className="m-0 w-full border-collapse">
                <tbody>
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
                      Role/Position:
                    </td>
                    <td className="px-0 py-3 align-top text-base text-mach1-black">
                      {role}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                      Email:
                    </td>
                    <td className="px-0 py-3 align-top text-base text-mach1-black">
                      <a href={`mailto:${email}`} className="font-semibold text-dark-blue no-underline">
                        {email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                      Contact Number:
                    </td>
                    <td className="px-0 py-3 align-top text-base text-mach1-black">
                      <a 
                        href={`tel:${contactNumber.replace(/\s/g, '')}`} 
                        className="font-semibold text-dark-blue no-underline"
                      >
                        {contactNumber}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                      Company Name:
                    </td>
                    <td className="px-0 py-3 align-top text-base text-mach1-black">
                      {companyName}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                      Enquiry Type:
                    </td>
                    <td className="px-0 py-3 align-top text-base text-mach1-black">
                      <span className="inline-block rounded bg-mach1-green px-3 py-1 text-sm font-bold uppercase tracking-wide text-white">
                        {enquiryTypeLabels[enquiryType] || enquiryType}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
            </Section>

            <Hr className="mx-10 my-8 border-neutral-200" />

            <Section className="px-10">
              {/* Message Header with Corner Accent */}
              <div className="relative mb-6">
                <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                  Message
                </Heading>
                <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
              </div>
              
              {/* Message Card */}
              <div className="relative overflow-hidden rounded-lg border-2 border-neutral-200 bg-white p-6">
                {/* Green accent corner */}
                <div className="absolute left-0 top-0 h-12 w-12 border-l-[4px] border-t-[4px] border-mach1-green" />
                <Text className="m-0 whitespace-pre-wrap text-base leading-7 text-mach1-black">
                  {message}
                </Text>
              </div>
            </Section>

            <Hr className="mx-10 my-8 border-neutral-200" />

            {/* Footer with Dark Blue Background and Corner Accents */}
            <Section className="relative m-0 bg-dark-blue px-10 py-8 text-center">
              {/* Top corner accents */}
              <div className="absolute left-0 top-0 h-12 w-12 border-l-[4px] border-t-[4px] border-mach1-green" />
              <div className="absolute right-0 top-0 h-12 w-12 border-r-[4px] border-t-[4px] border-mach1-green" />
              
              <Text className="m-0 text-sm leading-6 text-neutral-200">
                This email was sent from the contact form on
              </Text>
              <Text className="m-0 mt-2 text-base font-bold leading-6 text-white">
                <a href={baseUrl} className="font-semibold text-mach1-green no-underline">
                  mach1logistics.com.au
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
