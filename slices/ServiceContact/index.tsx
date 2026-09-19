import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import ServiceContactForm from "./service-contact-form";
import { defaultLocale, type LocaleCode } from "@/prismicio";
import { localizedChrome } from "@/lib/localized-routes";

type ServiceContactProps = SliceComponentProps<any>;

const marginTopClasses: Record<string, string> = {
  none: "mt-0",
  small: "mt-6 lg:mt-12",
  medium: "mt-12 lg:mt-24",
  large: "mt-30 lg:mt-48",
  "extra-large": "mt-40 lg:mt-64",
};

/**
 * Component for "Service Contact" slices.
 */
const ServiceContact = ({ slice, context }: ServiceContactProps): React.ReactElement => {
  const locale = ((context as { locale?: LocaleCode } | undefined)?.locale ?? defaultLocale) as LocaleCode;
  const pageTitle =
    (context as { pageTitle?: string } | undefined)?.pageTitle ||
    localizedChrome(locale, "this service", "此项服务", "यह सेवा");
  const mtClass = marginTopClasses[slice.primary?.margin_top || "large"] || marginTopClasses.large;
  const submitButtonText =
    slice.primary?.submit_button_text ||
    localizedChrome(locale, "Send Enquiry", "发送询盘", "पूछताछ भेजें");

  const defaultHeading = [
    {
      type: "heading2",
      text: localizedChrome(
        locale,
        `Interested in ${pageTitle}? Get in touch.`,
        `对此服务感兴趣？欢迎联系我们`,
        `${pageTitle} में रुचि है? हमसे संपर्क करें।`,
      ),
      spans: [],
    },
  ];

  const defaultSubtext = [
    {
      type: "paragraph",
      text: localizedChrome(
        locale,
        "Tell us what you need and our team will get back to you shortly.",
        "请告诉我们您的需求，我们的团队将尽快回复。",
        "हमें बताएं कि आपको क्या चाहिए, हमारी टीम जल्द ही आपसे संपर्क करेगी।",
      ),
      spans: [],
    },
  ];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${mtClass} py-12 lg:py-24 bg-neutral-50`}
    >
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-2 mb-6 lg:mb-20 text-center">
            <div className="text-neutral-900">
              <PrismicRichText
                field={slice.primary?.heading || defaultHeading}
                components={{
                  heading2: ({ children }) => (
                    <h2 className="text-2xl lg:text-3xl font-semibold leading-tight tracking-tight">
                      {children}
                    </h2>
                  ),
                  heading3: ({ children }) => (
                    <h3 className="text-xl lg:text-2xl font-semibold leading-tight tracking-tight">
                      {children}
                    </h3>
                  ),
                  paragraph: ({ children }) => (
                    <p className="text-2xl lg:text-3xl font-semibold leading-tight tracking-tight">
                      {children}
                    </p>
                  ),
                }}
              />
            </div>
            <div className="text-neutral-600 text-sm lg:text-[15px] leading-relaxed max-w-xl mx-auto">
              <PrismicRichText
                field={slice.primary?.subtext || defaultSubtext}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-sm lg:text-[15px] leading-relaxed m-0">{children}</p>
                  ),
                }}
              />
            </div>
          </div>

          <ServiceContactForm pageTitle={pageTitle} submitButtonText={submitButtonText} locale={locale} />
        </div>
      </div>
    </section>
  );
};

export default ServiceContact;
