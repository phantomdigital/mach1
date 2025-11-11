import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { ImageOff, Globe, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServicesButton from "./services-button";
import ServicesAnimation from "./services-animation";
import { SliceHeader } from "@/components/slice-header";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { createClient } from "@/prismicio";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";


/**
 * Props for `Services`.
 */
export type ServicesProps = SliceComponentProps<Content.ServicesSlice>;

/**
 * Component for "Services" Slices.
 */
const Services = async ({ slice }: ServicesProps): Promise<React.ReactElement> => {
    // Fetch all specialties from Prismic
    const client = createClient();
    const specialties = await client.getAllByType("specialty");
    
    // Handle spacing values from Prismic (trim empty strings, fallback to defaults)
    // Type assertion is safe because Prismic model restricts values to valid options
    const marginTop = getMarginTopClass(
        ((slice.primary.margin_top && slice.primary.margin_top.trim()) || "large") as MarginTopSize
    );
    const paddingTop = getPaddingTopClass(
        ((slice.primary.padding_top && slice.primary.padding_top.trim()) || "large") as PaddingSize
    );
    const paddingBottom = getPaddingBottomClass(
        ((slice.primary.padding_bottom && slice.primary.padding_bottom.trim()) || "large") as PaddingSize
    );
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
                <ServicesAnimation>
                    <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
                        {/* Header */}
                        <div data-animate="header">
                            <SliceHeader subheading={slice.primary.subheading} textColor="text-neutral-800" />
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Left Column - Mosaic Image Collage */}
                            <div className="relative h-[500px] lg:h-[600px]">
                            {/* Two-column split grid with asymmetric heights */}
                            <div className="grid grid-cols-2 gap-4 h-full">
                                {/* Left Column - Two stacked images */}
                                <div className="flex flex-col gap-4">
                                    {/* Top Left - Image 1 (Taller: 60%) */}
                                    <div className="relative overflow-hidden rounded-xs bg-neutral-200 border border-neutral-300 h-[60%]" data-animate="image">
                                        {"image_1" in slice.primary && slice.primary.image_1?.url ? (
                                            <PrismicNextImage
                                                field={slice.primary.image_1}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 50vw, 25vw"
                                                quality={90}
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-16 h-16 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Left - Image 2 (Shorter: 40%) */}
                                    <div className="relative overflow-hidden rounded-xs bg-neutral-200 border border-neutral-300 flex-1" data-animate="image">
                                        {"image_2" in slice.primary && slice.primary.image_2?.url ? (
                                            <PrismicNextImage
                                                field={slice.primary.image_2}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 50vw, 25vw"
                                                quality={90}
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
                                        <div className="relative bg-mach1-green text-white p-4 rounded-xs flex items-center gap-3" data-animate="statistic">
                                            {"statistic_icon" in slice.primary && slice.primary.statistic_icon?.url ? (
                                                <div className="w-6 h-6 flex-shrink-0">
                                                    <PrismicNextImage
                                                        field={slice.primary.statistic_icon}
                                                        width={24}
                                                        height={24}
                                                        className="w-full h-full object-contain filter brightness-0 invert"
                                                        quality={85}
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
                                    <div className="relative overflow-hidden rounded-xs bg-neutral-200 border border-neutral-300 flex-1" data-animate="image">
                                        {"image_3" in slice.primary && slice.primary.image_3?.url ? (
                                            <PrismicNextImage
                                                field={slice.primary.image_3}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 50vw, 25vw"
                                                quality={90}
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
                            <div className="flex flex-col justify-center space-y-8" data-animate="left-column">
                                {/* Main Heading */}
                                <h2 className="text-3xl lg:text-5xl font-bold text-neutral-800 leading-tight tracking-tight">
                                    {slice.primary.heading || "Innovative Logistics Solutions"}
                                </h2>

                                {/* Description */}
                                <p className="text-base text-neutral-600 leading-relaxed">
                                    {slice.primary.description || "Our journey began with a vision to revolutionize the logistics industry. Meet the dedicated professionals behind Seon."}
                                </p>

                                {/* Specialties List - Fetched from Prismic */}
                                {specialties && specialties.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {specialties.map((specialty) => (
                                            <div key={specialty.uid} className="flex items-start gap-3" data-animate="specialty">
                                                <svg 
                                                    className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                    strokeLinecap="square"
                                                    strokeLinejoin="miter"
                                                >
                                                    <path d="M9 6l6 6-6 6" />
                                                </svg>
                                                <span className="text-lg font-semibold text-neutral-800">
                                                    {specialty.data.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* CTA Button - animates with left-column parent, no separate animation needed */}
                                <div className="pt-4 inline-flex">
                                    {slice.primary.button_text && slice.primary.button_link ? (
                                        <Button asChild variant="subtle" className="!px-0">
                                            <PrismicNextLink 
                                                field={slice.primary.button_link}
                                                className="inline-flex items-center gap-1.5 text-neutral-800"
                                            >
                                                <span>{slice.primary.button_text}</span>
                                                <ExternalLinkIcon className="w-2.5 h-2.5" color="currentColor" />
                                            </PrismicNextLink>
                                        </Button>
                                    ) : (
                                        <Button variant="subtle" size="lg" disabled>
                                            <span className="inline-flex items-center gap-1.5">
                                                <span>About us</span>
                                                <ExternalLinkIcon className="w-2.5 h-2.5" color="currentColor" />
                                            </span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </ServicesAnimation>
            </section>
        );
    }

    // Default Grid variation
    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className={`w-full ${marginTop} ${paddingTop} ${paddingBottom} overflow-visible`}
            style={{ backgroundColor }}
        >
            <ServicesAnimation>
                <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8 overflow-visible">
                    {/* Add SliceHeader for consistent subheading treatment */}
                    <div data-animate="header">
                        <SliceHeader subheading={slice.primary.subheading} textColor="text-neutral-800" />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative overflow-visible">
                        {/* Left Side - Content (appears first on mobile and desktop) */}
                        <div className="lg:col-span-4 lg:order-1 flex flex-col justify-start lg:sticky lg:top-24 lg:self-start lg:h-fit" data-animate="left-column">
                            <div className="lg:pr-8 space-y-6">
                            {/* Section Heading */}
                            {slice.primary.heading && (
                                <h2 className="text-3xl lg:text-5xl font-bold text-neutral-800 leading-tight tracking-tight">
                                    {slice.primary.heading}
                                </h2>
                            )}

                            {/* Section Description */}
                            {slice.primary.description && (
                                <p className="text-base text-neutral-600 leading-relaxed">
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
                        </div>

                        {/* Right Side - Services Grid (appears second on mobile and desktop) */}
                        <div className="lg:col-span-8 lg:order-2">
                        {slice.items && slice.items.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                                {slice.items.map((item, index) => (
                                    <div key={index} data-animate="card" className="space-y-5 border-b-4 border-neutral-200 px-6 py-8 lg:px-8 lg:py-10 rounded-t-sm bg-neutral-50">
                                        {/* Service Icon */}
                                        {item.service_icon && item.service_icon.url ? (
                                            <div className="h-9 lg:h-11 w-auto flex items-center justify-start my-8">
                                                <PrismicNextImage
                                                    field={item.service_icon}
                                                    width={120}
                                                    height={44}
                                                    className="h-full w-auto object-contain"
                                                    alt=""
                                                    quality={85}
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
                                        </div>
                                    ))}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </ServicesAnimation>
        </section>
    );
};

export default Services;
