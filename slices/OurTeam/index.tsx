import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { TeamClippedShape } from "./team-clipped-shape";
import { TeamDivider } from "./team-divider";
import { HeaderSeparator } from "@/components/ui/header-separator";

/**
 * Props for `OurTeam`.
 */
export type OurTeamProps = SliceComponentProps<Content.OurTeamSlice>;

/**
 * Component for "OurTeam" Slices.
 */
const OurTeam = ({ slice }: OurTeamProps): JSX.Element => {
  const teamMembers = slice.items.map(item => ({
    name: item.name || "",
    position: item.position || "",
    image: item.image,
  }));

  return (
    <section className="w-full py-16 lg:py-24 bg-white">
      <div className="w-full mt-48 mx-auto px-4 lg:px-20">
      {/* Header */}
      <div className="mb-16">
        {slice.primary.subheading && (
          <div 
            className="text-neutral-800 text-sm font-medium mb-4 uppercase"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            {slice.primary.subheading}
          </div>
        )}
        {slice.primary.heading && (
          <h2 className="text-neutral-800 text-4xl lg:text-6xl font-bold font-inter-tight leading-tight">
            {slice.primary.heading}
          </h2>
        )}
        {slice.primary.description && (
          <p className="text-neutral-600 text-lg font-normal font-inter-tight leading-relaxed mt-6 max-w-2xl">
            {slice.primary.description}
          </p>
        )}
        
        {/* Header Separator */}
        <div className="mt-12">
          <HeaderSeparator />
        </div>
      </div>

        {/* Team Members Grid */}
        <div className="space-y-24">
          {/* Create rows of 3 team members */}
          {Array.from({ length: Math.ceil(teamMembers.length / 3) }, (_, rowIndex) => (
            <div key={rowIndex}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {teamMembers.slice(rowIndex * 3, (rowIndex + 1) * 3).map((member, index) => (
                  <div key={rowIndex * 3 + index} className="group">
                    {/* Team Member Card */}
                    <TeamClippedShape className="aspect-square relative bg-neutral-100">
                      {member.image && member.image.url ? (
                        <PrismicNextImage
                          field={member.image}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          alt=""
                        />
                      ) : (
                        // Placeholder when no image is provided
                        <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                            <svg 
                              className="w-8 h-8 text-neutral-400" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </TeamClippedShape>

                    {/* Team Member Info */}
                    <div className="mt-6">
                      <h3 className="text-neutral-800 text-xl font-semibold font-inter-tight leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-neutral-600 text-base font-normal font-inter-tight leading-relaxed mt-1">
                        {member.position}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider between rows (except last) */}
              {rowIndex < Math.ceil(teamMembers.length / 3) - 1 && (
                <div className="mt-24">
                  <TeamDivider />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
