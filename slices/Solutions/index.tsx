import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import SolutionCard from "./solution-card";

/**
 * Props for `Solutions`.
 */
export type SolutionsProps = SliceComponentProps<Content.SolutionsSlice>;

/**
 * Component for "Solutions" Slices.
 */
const Solutions = async ({ slice }: SolutionsProps): Promise<JSX.Element> => {
  const client = createClient();
  
  // Fetch all solutions from Prismic
  const solutions = await client.getAllByType("solution");

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 lg:py-24"
    >
      <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Subheading */}
          {slice.primary.subheading && (
            <div 
              className="text-sm text-mach1-black font-medium mb-6 uppercase tracking-wide" 
              style={{ 
                fontFamily: 'var(--font-jetbrains-mono)',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
                fontFeatureSettings: '"kern" 1, "liga" 1',
                fontVariantLigatures: 'common-ligatures'
              }}
            >
              {slice.primary.subheading}
            </div>
          )}
          
          {/* Main Heading */}
          {slice.primary.heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {slice.primary.heading}
            </h2>
          )}
          
          {/* Description */}
          {slice.primary.description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {slice.primary.description}
            </p>
          )}
        </div>

        {/* Solutions Grid */}
        {solutions.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No solutions available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Solutions;
