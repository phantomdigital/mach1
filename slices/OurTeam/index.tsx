import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { TeamGrid } from "./team-grid";

/**
 * Props for `OurTeam`.
 */
export type OurTeamProps = SliceComponentProps<Content.OurTeamSlice>;

/**
 * Component for "OurTeam" Slices.
 */
const OurTeam = ({ slice }: OurTeamProps): React.ReactElement => {
  const teamMembers = slice.items.map((item, index) => ({
    name: item.name || "",
    position: item.position || "",
    department: item.department || "Other",
    image: item.image,
    bio: item.bio,
    email: item.email,
    linkedin: item.linkedin,
    index,
  }));

  return (
    <section className="w-full">
      {/* White Content Section */}
      <div className="w-full bg-white pb-24 lg:pb-32">
        {/* Header with Container */}
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          {slice.primary.subheading && (
            <h5 className="text-neutral-800 text-sm font-medium mb-4 uppercase tracking-wider">
              {slice.primary.subheading}
            </h5>
          )}
          {slice.primary.heading && (
            <h2 className="text-neutral-800 text-4xl lg:text-6xl font-bold leading-tight">
              {slice.primary.heading}
            </h2>
          )}
          {slice.primary.description && (
            <p className="text-neutral-600 text-lg lg:text-xl leading-relaxed mt-6 max-w-2xl">
              {slice.primary.description}
            </p>
          )}
        </div>

        {/* Team Grid with Tab Navigation (Client Component) - Full Width */}
        <TeamGrid 
          teamMembers={teamMembers} 
          enableDialog={slice.primary.enable_dialog ?? false}
        />
      </div>
    </section>
  );
};

export default OurTeam;
