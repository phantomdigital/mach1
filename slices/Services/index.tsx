import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { ImageOff } from "lucide-react";
import ServicesButton from "./services-button";
import {
    ServicesGridAnimation,
    ServiceCardAnimation,
    ServicesRightSideAnimation,
} from "./services-animation-wrapper";

/**
 * Props for `Services`.
 */
export type ServicesProps = SliceComponentProps<Content.ServicesSlice>;

/**
 * Component for "Services" Slices.
 */
const Services = ({ slice }: ServicesProps): React.ReactElement => {
    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="w-full py-16 lg:py-24 bg-white"
        >
            <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Side - Services Grid */}
                    <div className="lg:col-span-8">
                        {slice.items && slice.items.length > 0 && (
                            <ServicesGridAnimation>
                                {slice.items.map((item, index) => (
                                    <ServiceCardAnimation key={index} index={index}>
                                        {/* Service Icon */}
                                        {item.service_icon && item.service_icon.url ? (
                                            <div className="h-14 lg:h-16 w-auto flex items-center justify-start my-8">
                                                <PrismicNextImage
                                                    field={item.service_icon}
                                                    className="h-full w-auto object-contain"
                                                    alt=""
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-14 lg:h-16 w-auto flex items-center justify-start mb-4">
                                                <ImageOff className="h-12 lg:h-14 w-auto text-mach-gray" />
                                            </div>
                                        )}

                                        {/* Service Title */}
                                        {item.service_title && (
                                            <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 leading-tight">
                                                {item.service_title}
                                            </h3>
                                        )}

                                        {/* Service Description */}
                                        {item.service_description && (
                                            <p className="text-base lg:text-lg text-neutral-600 leading-relaxed">
                                                {item.service_description}
                                            </p>
                                        )}
                                    </ServiceCardAnimation>
                                ))}
                            </ServicesGridAnimation>
                        )}
                    </div>

                    {/* Right Side - Content */}
                    <ServicesRightSideAnimation>
                        <div className="lg:pl-8 space-y-6">
                            {/* Section Heading */}
                            {slice.primary.heading && (
                                <h2 className="text-3xl lg:text-5xl font-bold text-neutral-800 leading-tight">
                                    {slice.primary.heading}
                                </h2>
                            )}

                            {/* Section Description */}
                            {slice.primary.description && (
                                <p className="text-lg text-neutral-600 leading-relaxed">
                                    {slice.primary.description}
                                </p>
                            )}

                            {/* CTA Button */}
                            {slice.primary.button_text && slice.primary.button_link && (
                                <div className="pt-2">
                                    <ServicesButton
                                        buttonText={slice.primary.button_text}
                                        buttonLink={slice.primary.button_link}
                                    />
                                </div>
                            )}
                        </div>
                    </ServicesRightSideAnimation>
                </div>
            </div>
        </section>
    );
};

export default Services;
