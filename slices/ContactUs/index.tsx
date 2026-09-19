import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import ContactForm from "./contact-form";
import { encodeEmailForJS } from "@/lib/email-obfuscation";
import { ObfuscatedEmail } from "@/components/obfuscated-email";
import { defaultLocale, type LocaleCode } from "@/prismicio";
import { localizedChrome } from "@/lib/localized-routes";

/**
 * Props for `ContactUs`.
 */
export type ContactUsProps = SliceComponentProps<any>;

/**
 * Component for "ContactUs" Slices.
 */
const ContactUs = ({ slice, context }: ContactUsProps): React.ReactElement => {
  const locale = ((context as { locale?: LocaleCode } | undefined)?.locale ?? defaultLocale) as LocaleCode;
  // Get margin top class based on selection (responsive: smaller on mobile)
  const getMarginTopClass = () => {
    switch (slice.primary.margin_top) {
      case 'none':
        return 'mt-0';
      case 'small':
        return 'mt-6 lg:mt-12';
      case 'medium':
        return 'mt-12 lg:mt-24';
      case 'large':
        return 'mt-30 lg:mt-48';
      case 'extra-large':
        return 'mt-40 lg:mt-64';
      default:
        return 'mt-30 lg:mt-48';
    }
  };

  return (
    <section className={`w-full py-16 lg:py-24 bg-white mb-30 ${getMarginTopClass()}`}>
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-40">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            {/* Heading */}
            {slice.primary.heading && (
              <h2 className="text-neutral-800 text-2xl lg:text-4xl">
                {slice.primary.heading}
              </h2>
            )}

            {/* Email */}
            {slice.primary.email && (
              <ObfuscatedEmail 
                email={encodeEmailForJS(slice.primary.email)}
                isBase64Encoded={true}
                className="block text-dark-blue text-sm underline hover:text-dark-blue/80 transition-colors"
              />
            )}

            {/* Locations */}
            {slice.items.length > 0 && (
              <div className="space-y-6 mt-8">
                {slice.items.map((item: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <h3 className="text-neutral-800 text-sm font-medium">
                      {item.location_name}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {item.location_type}:{" "}
                      <a
                        href={`tel:${item.phone_number?.replace(/\s/g, '')}`}
                        className="text-dark-blue underline hover:text-dark-blue/80 transition-colors"
                      >
                        {item.phone_number}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <ContactForm
              locale={locale}
              successMessage={
                slice.primary.success_message ||
                localizedChrome(locale, "Thank you! We'll be in touch soon.", "谢谢！我们会尽快与您联系。", "धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।")
              }
              thankYouHeading={
                slice.primary.thank_you_heading ||
                localizedChrome(locale, "Message Received!", "已收到您的消息！", "संदेश प्राप्त हुआ!")
              }
              thankYouDescription={
                slice.primary.thank_you_description ||
                localizedChrome(
                  locale,
                  "We've received your enquiry and a member of our team will get back to you as soon as possible.",
                  "我们已收到您的询盘，团队成员将尽快与您联系。",
                  "हमें आपकी पूछताछ मिल गई है, और हमारी टीम जल्द ही आपसे संपर्क करेगी।",
                )
              }
              thankYouInfoTitle={
                slice.primary.thank_you_info_title ||
                localizedChrome(locale, "What happens next?", "接下来会怎样？", "आगे क्या होगा?")
              }
              thankYouInfoText={
                slice.primary.thank_you_info_text ||
                localizedChrome(
                  locale,
                  "Our team typically responds within 24 hours during business days. For urgent enquiries, please call us directly.",
                  "我们的团队通常会在工作日 24 小时内回复。如需紧急协助，请直接致电。",
                  "हमारी टीम आमतौर पर कार्य दिवसों में 24 घंटे के भीतर जवाब देती है। तत्काल पूछताछ के लिए कृपया हमें सीधे कॉल करें।",
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

