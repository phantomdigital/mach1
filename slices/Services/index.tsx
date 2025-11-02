import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { ImageOff, CheckCircle, Globe, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServicesButton from "./services-button";
import {
    ServicesGridAnimation,
    ServiceCardAnimation,
    ServicesRightSideAnimation,
} from "./services-animation-wrapper";
import { SliceHeader } from "@/components/slice-header";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";

/**
 * Props for `Services`.
 */
export type ServicesProps = SliceComponentProps<Content.ServicesSlice>;

/**
 * Component for "Services" Slices.
 */
const Services = ({ slice }: ServicesProps): React.ReactElement => {
    const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
    const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
    const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");
    const backgroundColor = slice.primary.background_color || "#ffffff";

    // Render Two Column variation
    if (slice.variation === "twoColumn") {
        return (
            <section
                data-slice-type={slice.slice_type}
                data-slice-variation={slice.variation}
                className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
                style={{ backgroundColor }}
            >
                <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <SliceHeader subheading={slice.primary.subheading} textColor="text-neutral-800" />

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Left Column - Mosaic Image Collage */}
                        <div className="relative h-[500px] lg:h-[600px]">
                            {/* Two-column split grid with asymmetric heights */}
                            <div className="grid grid-cols-2 gap-4 h-full">
                                {/* Left Column - Two stacked images */}
                                <div className="flex flex-col gap-4">
                                    {/* Top Left - Image 1 (Taller: 60%) */}
                                    <div className="relative overflow-hidden rounded-sm bg-neutral-200 border border-neutral-300 h-[60%]">
                                        {"image_1" in slice.primary && slice.primary.image_1?.url ? (
                                            <PrismicNextImage
                                                field={slice.primary.image_1}
                                                className="w-full h-full object-cover"
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-16 h-16 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Left - Image 2 (Shorter: 40%) */}
                                    <div className="relative overflow-hidden rounded-sm bg-neutral-200 border border-neutral-300 flex-1">
                                        {"image_2" in slice.primary && slice.primary.image_2?.url ? (
                                            <PrismicNextImage
                                                field={slice.primary.image_2}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageOff className="w-16 h-16 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Image and Stats Card */}
                                <div className="flex flex-col gap-4">
                                    {/* Statistics Card - Compact */}
                                    {"statistic_number" in slice.primary && (slice.primary.statistic_number || slice.primary.statistic_label) && (
                                        <div className="relative bg-mach1-green text-white p-4 rounded-sm flex items-center gap-3">
                                            {"statistic_icon" in slice.primary && slice.primary.statistic_icon?.url ? (
                                                <div className="w-6 h-6 flex-shrink-0">
                                                    <PrismicNextImage
                                                        field={slice.primary.statistic_icon}
                                                        className="w-full h-full object-contain filter brightness-0 invert"
                                                    />
                                                </div>
                                            ) : (
                                                <Globe className="w-6 h-6 flex-shrink-0" />
                                            )}
                                            <div>
                                                <div className="text-2xl font-bold leading-none mb-1">
                                                    {slice.primary.statistic_number || "16+"}
                                                </div>
                                                <div className="text-xs font-medium leading-tight">
                                                    {slice.primary.statistic_label || "Years of Experience"}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Top Right - Image 3 (Takes remaining space) */}
                                    <div className="relative overflow-hidden rounded-sm bg-neutral-200 border border-neutral-300 flex-1">
                                        {"image_3" in slice.primary && slice.primary.image_3?.url ? (
                                            <PrismicNextImage
                                                field={slice.primary.image_3}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageOff className="w-16 h-16 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Content */}
                        <div className="flex flex-col justify-center space-y-8">
                            {/* Main Heading */}
                            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-800 leading-tight">
                                {slice.primary.heading || "Innovative Logistics Solutions"}
                            </h2>

                            {/* Description */}
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                {slice.primary.description || "Our journey began with a vision to revolutionize the logistics industry. Meet the dedicated professionals behind Seon."}
                            </p>

                            {/* Specialties List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {slice.items && slice.items.length > 0 ? (
                                    slice.items.map((item, index) => {
                                        const specialtyTitle = "specialty_title" in item ? item.specialty_title : null;
                                        const specialtyIcon = "specialty_icon" in item ? item.specialty_icon : null;
                                        
                                        return specialtyTitle ? (
                                            <div key={index} className="flex items-center gap-3">
                                                {specialtyIcon?.url ? (
                                                    <div className="w-5 h-5 flex-shrink-0">
                                                        <PrismicNextImage
                                                            field={specialtyIcon}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                )}
                                                <span className="text-neutral-700 font-medium">
                                                    {specialtyTitle}
                                                </span>
                                            </div>
                                        ) : null;
                                    })
                                ) : (
                                    // Default placeholder specialties
                                    <>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span className="text-neutral-700 font-medium">Safety and Compliance</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span className="text-neutral-700 font-medium">Innovative Technology</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span className="text-neutral-700 font-medium">Continuous Improvement</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span className="text-neutral-700 font-medium">Prioritize Timely Deliveries</span>
                                        </div>
                                        <div className="flex items-center gap-3 col-span-full">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span className="text-neutral-700 font-medium">Quality Control System</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* CTA Button */}
                            <div className="pt-4">
                                {slice.primary.button_text && slice.primary.button_link ? (
                                    <Button asChild variant="hero" size="lg">
                                        <PrismicNextLink field={slice.primary.button_link}>
                                            {slice.primary.button_text}
                                        </PrismicNextLink>
                                    </Button>
                                ) : (
                                    <Button variant="hero" size="lg" disabled>
                                        About us
                                    </Button>
                                )}</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Default Grid variation
    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
            style={{ backgroundColor }}
        >
            <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
                {/* Add SliceHeader for consistent subheading treatment */}
                <SliceHeader subheading={slice.primary.subheading} textColor="text-neutral-800" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Side - Content (appears first on mobile and desktop) */}
                    <ServicesRightSideAnimation className="lg:col-span-4 lg:order-1">
                        <div className="lg:pr-8 space-y-6">
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
                                <div className="pt-2 inline-flex">
                                    <ServicesButton
                                        buttonText={slice.primary.button_text}
                                        buttonLink={slice.primary.button_link}
                                    />
                                </div>
                            )}
                        </div>
                    </ServicesRightSideAnimation>

                    {/* Right Side - Services Grid (appears second on mobile and desktop) */}
                    <div className="lg:col-span-8 lg:order-2">
                        {slice.items && slice.items.length > 0 && (
                            <ServicesGridAnimation>
                                {slice.items.map((item, index) => (
                                    <ServiceCardAnimation key={index} index={index}>
                                        {/* Service Icon */}
                                        {item.service_icon && item.service_icon.url ? (
                                            <div className="h-9 lg:h-11 w-auto flex items-center justify-start my-8">
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
                                            <p className="text-xs lg:text-sm text-neutral-600 leading-relaxed">
                                                {item.service_description}
                                            </p>
                                        )}
                                    </ServiceCardAnimation>
                                ))}
                            </ServicesGridAnimation>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
