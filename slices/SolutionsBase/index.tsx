import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeroButton } from "@/components/ui/hero-button";
import { Button } from "@/components/ui/button";
import { 
  getMarginTopClass,
  getPaddingTopClass, 
  getPaddingBottomClass,
  type MarginTopSize,
  type PaddingSize 
} from "@/lib/spacing";

/**
 * Props for `SolutionsBase`.
 */
export type SolutionsBaseProps = SliceComponentProps<Content.SolutionsBaseSlice>;

/**
 * Component for "SolutionsBase" Slices.
 * A flexible content slice with header image, breadcrumbs, rich text, and full-width images.
 */
const SolutionsBase = ({ slice }: SolutionsBaseProps): React.ReactElement => {
  const primary = slice.primary;
  // Get spacing from Prismic or use defaults
  const marginTop = (primary.margin_top as MarginTopSize) || "large";
  const paddingTop = (primary.padding_top as PaddingSize) || "large";
  const paddingBottom = (primary.padding_bottom as PaddingSize) || "large";
  const backgroundColor = primary.background_color || "#ffffff";
  const cardBackgroundColor = primary.card_background_color || "#F0FCFB";

  // Extract headings for table of contents
  const tableOfContents = (() => {
    if (!slice.primary.content || !Array.isArray(slice.primary.content)) return [];
    return slice.primary.content
      .filter((block: { type?: string }) => block.type === "heading2" || block.type === "heading3")
      .map((block: { type?: string; text?: string }, index: number) => ({
        id: index + 1,
        text: block.text || "",
        level: (block.type === "heading2" ? 2 : 3) as 2 | 3,
      }));
  })();

  const headingIndexRef = { current: 0 };

  // Custom serializer for rich text with proper typography hierarchy and IDs for TOC links
  const components: JSXMapSerializer = {
    heading2: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h2 id={id} className="text-black text-3xl lg:text-4xl font-bold leading-tight mt-12 mb-6 first:mt-0 scroll-mt-32">
          {children}
        </h2>
      );
    },
    heading3: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h3 id={id} className="text-neutral-800 text-xl lg:text-2xl font-semibold leading-tight mt-8 mb-4 scroll-mt-32">
          {children}
        </h3>
      );
    },
    heading4: ({ children }) => (
      <h4 className="text-neutral-800 text-lg lg:text-xl font-semibold leading-tight mt-6 mb-3">
        {children}
      </h4>
    ),
    heading5: ({ children }) => (
      <h5 className="text-neutral-800 text-base lg:text-lg font-semibold leading-tight mt-4 mb-2">
        {children}
      </h5>
    ),
    heading6: ({ children }) => (
      <h6 className="text-neutral-800 text-sm lg:text-base font-semibold leading-tight mt-4 mb-2">
        {children}
      </h6>
    ),
    paragraph: ({ children }) => (
      <p className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4">
        {children}
      </p>
    ),
    list: ({ children }) => (
      <ul className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4 ml-5 list-disc space-y-2">
        {children}
      </ul>
    ),
    oList: ({ children }) => (
      <ol className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4 ml-5 list-decimal space-y-2">
        {children}
      </ol>
    ),
    listItem: ({ children }) => (
      <li className="text-neutral-700">
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
    ),
    hyperlink: ({ children, node }) => {
      const linkData = node.data as { url?: string; target?: string };
      return (
        <a
          href={linkData.url}
          {...(linkData.target ? { target: linkData.target } : {})}
          rel={linkData.target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-mach1-green hover:text-green-700 underline transition-colors"
        >
          {children}
        </a>
      );
    },
  };

  return (
    <section 
      className={`w-full ${getMarginTopClass(marginTop)} ${getPaddingTopClass(paddingTop)} ${getPaddingBottomClass(paddingBottom)}`}
      style={{ backgroundColor }}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8">
        {/* Hero Image - same width as content below */}
        {slice.primary.hero_image?.url && (
          <div className="w-full pt-12 lg:pt-20">
            <div 
              className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-neutral-100 overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 2.5rem) 0, 100% 2rem, 100% 100%, 0 100%)',
              }}
            >
              <PrismicNextImage
                field={slice.primary.hero_image}
                className="w-full h-full object-cover"
                priority
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 2.5rem) 0, 100% 2rem, 100% 100%, 0 100%)',
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
                }}
              />
            </div>
          </div>
        )}

        {/* Two columns: content left, band right */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
          {/* Left col: Breadcrumbs, H1, Rich Text */}
          <div className="py-12 lg:py-16">
              {(slice.primary.breadcrumb_home_text || slice.primary.breadcrumb_current_text) && (
                <nav className="flex items-center gap-2 mb-8 lg:mb-12">
                  {slice.primary.breadcrumb_home_text && (
                    <>
                      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                        {slice.primary.breadcrumb_home_text}
                      </Link>
                      {slice.primary.breadcrumb_current_text && <ChevronRight className="w-4 h-4 text-neutral-400" />}
                    </>
                  )}
                  {slice.primary.breadcrumb_current_text && (
                    <span className="text-sm text-neutral-900 font-medium">{slice.primary.breadcrumb_current_text}</span>
                  )}
                </nav>
              )}
              {slice.primary.heading && (
                <h1 className="text-black text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-8 lg:mb-12">
                  {slice.primary.heading}
                </h1>
              )}
              {slice.primary.content && (
                <div className="prose prose-sm lg:prose-base max-w-none">
                  <PrismicRichText field={slice.primary.content} components={components} />
                </div>
              )}
          </div>

          {/* Right: Band - full height, sticky on scroll */}
          <div 
            className="lg:min-h-full pt-12 lg:pt-16 px-6 lg:px-8 pb-6 lg:pb-8 space-y-4 lg:sticky lg:top-[calc(var(--header-height,128px)+1rem)]"
            style={{ backgroundColor: cardBackgroundColor }}
          >
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              {slice.primary.card_description || "Contact us today for a customised freight solution. Our team is ready to help with your logistics needs."}
            </p>

            {slice.items && slice.items.length > 0 && (
              <div className="space-y-4">
                {slice.items.map((item, index) => (
                  item.contact_label && item.contact_value && (
                    <div key={index} className="space-y-1">
                      <p className="text-xs text-neutral-500 uppercase tracking-wide">
                        {item.contact_label}
                      </p>
                      <p className="text-neutral-800 font-medium text-sm">
                        {item.contact_value}
                      </p>
                    </div>
                  )
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2">
              <HeroButton asChild size="small">
                <Link href="/quote">Get a Quote</Link>
              </HeroButton>
              <Button asChild variant="subtle" className="!px-0">
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-neutral-800">
                  Contact Us
                </Link>
              </Button>
            </div>

            {tableOfContents.length > 0 && (
              <>
                <div className="border-t border-neutral-300 pt-4 mt-4" />
                <nav>
                  <h4 className="text-neutral-800 text-[11px] font-semibold uppercase tracking-wider mb-3">
                    On this page
                  </h4>
                  <ol className="space-y-1.5 text-[11px]">
                    {tableOfContents.map((item) => (
                      <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                        <a
                          href={`#section-${item.id}`}
                          className="text-neutral-600 hover:text-neutral-900 hover:underline transition-colors block leading-relaxed"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SolutionsBase;
