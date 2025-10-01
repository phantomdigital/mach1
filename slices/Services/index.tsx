import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { ImageOff } from "lucide-react";
import ServicesButton from "./services-button";

/**
 * Props for `Services`.
 */
export type ServicesProps = SliceComponentProps<Content.ServicesSlice>;

/**
 * Component for "Services" Slices.
 */
const Services = ({ slice }: ServicesProps): JSX.Element => {
    return (
        <>


            <section
                data-slice-type={slice.slice_type}
                data-slice-variation={slice.variation}
                className="w-full py-16 lg:py-24 bg-white"
            >
                <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
                    {/* Separator Line */}
                    <div className="w-full max-w-[110rem] mx-auto  mb-8">
                        <div className="w-full h-[40px] flex items-center bg-transparent">
                            <svg
                                width="100%"
                                height="40"
                                viewBox="0 0 1273 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-auto"
                            >
                                <path
                                    d="M0.499998 1.00003L1235.63 1C1242.96 1 1250.12 3.689 1256.12 8.70996L1272 22"
                                    stroke="#262626"
                                    strokeWidth="0.5"
                                    strokeMiterlimit="10"
                                    opacity="0.75"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Left Side - Services Grid */}
                        <div className="lg:col-span-8">
                            {slice.items && slice.items.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10 ">
                                    {slice.items.map((item, index) => {
                                        console.log('Service item:', index, 'has icon:', !!item.service_icon?.url);
                                        return (
                                            <div
                                                key={index}
                                                className="group hover:translate-y-[-2px] transition-transform duration-300"
                                            >
                                                {/* Service Icon */}
                                                <div className="mb-4">
                                                    <div className="w-12 h-12 flex items-start justify-start overflow-hidden">
                                                        {item.service_icon && item.service_icon.url ? (
                                                            <PrismicNextImage
                                                                field={item.service_icon}
                                                                className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <ImageOff className="w-8 h-8 text-mach1-red opacity-100 transition-opacity duration-300" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Service Title */}
                                                {item.service_title && (
                                                    <h3
                                                        className="text-lg font-semibold text-gray-900 mb-3 leading-tight group-hover:text-black transition-colors duration-300"
                                                        style={{ fontFamily: 'var(--font-inter-tight)' }}
                                                    >
                                                        {item.service_title}
                                                    </h3>
                                                )}

                                                {/* Service Description */}
                                                {item.service_description && (
                                                    <p
                                                        className="text-sm text-gray-600 leading-relaxed"
                                                        style={{ fontFamily: 'var(--font-inter)' }}
                                                    >
                                                        {item.service_description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right Side - Content */}
                        <div className="lg:col-span-4 flex flex-col align-start justify-start">
                            <div className="lg:pl-8">
                                {/* Section Heading */}
                                {slice.primary.heading && (
                                    <h2
                                        className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                                        style={{ fontFamily: 'var(--font-inter-tight)' }}
                                    >
                                        {slice.primary.heading}
                                    </h2>
                                )}

                                {/* Section Description */}
                                {slice.primary.description && (
                                    <p
                                        className="text-base text-gray-600 leading-relaxed mb-8"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        {slice.primary.description}
                                    </p>
                                )}

                                {/* CTA Button */}
                                {slice.primary.button_text && slice.primary.button_link && (
                                    <ServicesButton
                                        buttonText={slice.primary.button_text}
                                        buttonLink={slice.primary.button_link}
                                    />
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Services;
