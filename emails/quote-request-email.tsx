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

interface QuoteRequestEmailProps {
  serviceType?: string;
  formData: Record<string, string>;
  packages?: Package[];
}

export default function QuoteRequestEmail({
  serviceType,
  formData,
  packages = [],
}: QuoteRequestEmailProps) {
  // Base URL for assets - must be absolute URL for emails
  // Use localhost in development for React Email preview
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? "http://localhost:3000" 
    : (process.env.NEXT_PUBLIC_BASE_URL || "https://mach1logistics.com.au");
  
  // Logo URL - using PNG format for better email compatibility
  const logoUrl = `${baseUrl}/logo/email-logo.png`;

  // Format field name for display
  const formatFieldName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
      .trim();
  };

  // Format service type
  const formatServiceType = (type: string) => {
    const withoutUnderscores = type.replace(/_/g, ' ');
    return withoutUnderscores.charAt(0).toUpperCase() + withoutUnderscores.slice(1);
  };

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
            {/* Logo Header with Dark Blue Background */}
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
              New Quote Request Received
            </Heading>
            
            <Text className="mx-0 my-4 px-10 text-base leading-7 text-neutral-600">
              You have received a new quote request from your website.
            </Text>

            <Hr className="mx-10 my-8 border-neutral-200" />

            {/* Service Type */}
            {serviceType && (
              <Section className="px-10">
                <div className="relative mb-6">
                  <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                    Service Type
                  </Heading>
                  <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
                </div>
                
                <div className="mb-8 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <span className="inline-block rounded bg-mach1-green px-4 py-2 text-base font-bold uppercase tracking-wide text-white">
                    {formatServiceType(serviceType)}
                  </span>
                </div>
              </Section>
            )}

            {/* Form Details */}
            {formData && Object.keys(formData).filter(key => key !== 'packages').length > 0 && (
              <Section className="px-10">
                <div className="relative mb-6">
                  <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                    Customer Details
                  </Heading>
                  <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
                </div>
                
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <table className="m-0 w-full border-collapse">
                    <tbody>
                      {Object.entries(formData)
                        .filter(([key]) => key !== 'packages')
                        .map(([key, value]) => (
                          <tr key={key}>
                            <td className="w-[140px] px-0 py-3 pr-4 align-top text-[13px] font-semibold uppercase tracking-wide text-mach-gray">
                              {formatFieldName(key)}:
                            </td>
                            <td className="px-0 py-3 align-top text-base text-mach1-black">
                              {key.toLowerCase().includes('email') ? (() => {
                                const obfuscated = obfuscateMailtoLink(String(value));
                                return (
                                  <a href={obfuscated.href} className="font-semibold text-dark-blue no-underline" dangerouslySetInnerHTML={{ __html: obfuscated.display }} />
                                );
                              })() : key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel') ? (
                                <a 
                                  href={`tel:${value?.replace(/\s/g, '') || ''}`} 
                                  className="font-semibold text-dark-blue no-underline"
                                >
                                  {value}
                                </a>
                              ) : (
                                value || 'N/A'
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Package Details */}
            {packages && packages.length > 0 && (
              <>
                <Hr className="mx-10 my-8 border-neutral-200" />
                
                <Section className="px-10">
                  <div className="relative mb-6">
                    <Heading className="border-l-[4px] border-dark-blue pl-3 text-xl font-bold text-dark-blue">
                      Package Details
                    </Heading>
                    <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-mach1-green" />
                  </div>
                  
                  <div className="relative overflow-hidden rounded-lg border-2 border-neutral-200 bg-white p-6">
                    {/* Green accent corner */}
                    <div className="absolute left-0 top-0 h-12 w-12 border-l-[4px] border-t-[4px] border-mach1-green" />
                    
                    {packages.map((pkg, index) => (
                      <div key={pkg.id} className={index > 0 ? "mt-6 pt-6 border-t border-neutral-200" : ""}>
                        <Heading className="m-0 mb-4 text-base font-bold text-dark-blue">
                          Package {index + 1}
                        </Heading>
                        
                        {pkg.description && (
                          <Text className="m-0 mb-3 text-sm text-neutral-600">
                            <span className="font-semibold text-mach-gray">Description:</span> {pkg.description}
                          </Text>
                        )}
                        
                        {(pkg.origin || pkg.destination) && (
                          <div className="mb-3">
                            {pkg.origin && (
                              <Text className="m-0 mb-2 text-sm text-neutral-600">
                                <span className="font-semibold text-mach-gray">From:</span> {pkg.origin}
                              </Text>
                            )}
                            {pkg.destination && (
                              <Text className="m-0 mb-2 text-sm text-neutral-600">
                                <span className="font-semibold text-mach-gray">To:</span> {pkg.destination}
                              </Text>
                            )}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4">
                          {pkg.weight && (
                            <Text className="m-0 text-sm text-neutral-600">
                              <span className="font-semibold text-mach-gray">Weight:</span> {pkg.weight} {pkg.weightUnit}
                            </Text>
                          )}
                          {pkg.quantity && (
                            <Text className="m-0 text-sm text-neutral-600">
                              <span className="font-semibold text-mach-gray">Qty:</span> {pkg.quantity}
                            </Text>
                          )}
                        </div>
                        
                        {(pkg.length || pkg.width || pkg.height) && (
                          <Text className="m-0 mt-2 text-sm text-neutral-600">
                            <span className="font-semibold text-mach-gray">Dimensions:</span>{' '}
                            {pkg.length && `L: ${pkg.length}${pkg.dimensionUnit}`}
                            {pkg.width && ` × W: ${pkg.width}${pkg.dimensionUnit}`}
                            {pkg.height && ` × H: ${pkg.height}${pkg.dimensionUnit}`}
                          </Text>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            <Hr className="mx-10 my-8 border-neutral-200" />

            {/* Footer with Dark Blue Background */}
            <Section className="relative m-0 bg-dark-blue px-10 py-8 text-center">
              {/* Top corner accents */}
              <div className="absolute left-0 top-0 h-12 w-12 border-l-[4px] border-t-[4px] border-mach1-green" />
              <div className="absolute right-0 top-0 h-12 w-12 border-r-[4px] border-t-[4px] border-mach1-green" />
              
              <Text className="m-0 text-sm leading-6 text-neutral-200">
                This quote request was submitted from the quote form on
              </Text>
              <Text className="m-0 mt-2 text-base font-bold leading-6 text-white">
                <a href={baseUrl} className="font-semibold text-mach1-green no-underline">
                  mach1logistics.com.au
                </a>
              </Text>
              <Text className="m-0 mt-4 text-xs leading-6 text-neutral-400">
                Reply to this email to contact the customer directly.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

