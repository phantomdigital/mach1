import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import ContactForm from "./contact-form";

/**
 * Props for `ContactUs`.
 */
export type ContactUsProps = SliceComponentProps<any>;

/**
 * Component for "ContactUs" Slices.
 */
const ContactUs = ({ slice }: ContactUsProps): React.ReactElement => {
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
      <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
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
              <a
                href={`mailto:${slice.primary.email}`}
                className="block text-dark-blue text-sm underline hover:text-dark-blue/80 transition-colors"
              >
                {slice.primary.email}
              </a>
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
            <ContactForm successMessage={slice.primary.success_message || "Thank you! We'll be in touch soon."} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

