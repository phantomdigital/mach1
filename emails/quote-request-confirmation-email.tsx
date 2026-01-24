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
  Link,
  Tailwind,
} from "@react-email/components";

interface QuoteRequestConfirmationEmailProps {
  customerName: string;
  serviceType?: string;
}

export default function QuoteRequestConfirmationEmail({
  customerName,
  serviceType,
}: QuoteRequestConfirmationEmailProps) {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? "http://localhost:3000" 
    : (process.env.NEXT_PUBLIC_BASE_URL || "https://mach1logistics.com.au");
  const logoUrl = `${baseUrl}/logo/email-logo.png`;

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
                "mach1-green": "#0EA5E9",
                "mach-gray": "#747474",
                "dark-blue": "#141433",
              },
              fontFamily: {
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
              Quote Request Received
            </Heading>
            
            <Text className="mx-0 my-4 px-10 text-base leading-7 text-neutral-600">
              Hi {customerName},
            </Text>

            <Text className="mx-0 my-4 px-10 text-base leading-7 text-neutral-600">
              Thank you for requesting a quote{serviceType ? ` for ${serviceType}` : ''} with MACH1 Logistics. 
              We have received your request and our team is currently reviewing your requirements.
            </Text>

            <Text className="mx-0 my-4 px-10 text-base leading-7 text-neutral-600">
              One of our logistics specialists will contact you within <span className="font-bold text-dark-blue">24 hours</span> to discuss your needs and provide you with a detailed, competitive quote.
            </Text>

            <Hr className="mx-10 my-8 border-neutral-200" />

            <Section className="px-10">
              {/* Section Header with Corner Accent */}
              <div className="relative mb-6">
                <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                  What Happens Next?
                </Heading>
                <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
              </div>

              {/* Process Steps */}
              <Section className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mach1-green text-sm font-bold text-white">
                    1
                  </div>
                  <Text className="m-0 text-base text-neutral-600">
                    <span className="font-semibold text-dark-blue">Review:</span> Our team carefully reviews your requirements and specifications.
                  </Text>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mach1-green text-sm font-bold text-white">
                    2
                  </div>
                  <Text className="m-0 text-base text-neutral-600">
                    <span className="font-semibold text-dark-blue">Contact:</span> A logistics specialist will reach out to discuss your needs in detail.
                  </Text>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mach1-green text-sm font-bold text-white">
                    3
                  </div>
                  <Text className="m-0 text-base text-neutral-600">
                    <span className="font-semibold text-dark-blue">Quote:</span> We provide you with a detailed, competitive quote tailored to your requirements.
                  </Text>
                </div>
              </Section>
            </Section>

            <Text className="mx-0 my-4 px-10 text-base leading-7 text-neutral-600">
              In the meantime, if you have any urgent questions or need to provide additional information, please don't hesitate to reach out.
            </Text>

            <Hr className="mx-10 my-8 border-neutral-200" />

           
            {/* Footer */}
            <Section className="bg-neutral-50 px-10 py-8 mt-8">
            
              <Text className="mx-0 my-2 text-center text-xs text-neutral-400">
                This email was sent because you requested a quote on our website.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
