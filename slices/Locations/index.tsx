import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { LocationsMap } from "./locations-map";
import { LocationsNav } from "./locations-nav";
import { obfuscateMailtoLink } from "@/lib/email-obfuscation";

/**
 * Props for `Locations`.
 */
export type LocationsProps = SliceComponentProps<Content.LocationsSlice>;

/**
 * Component for "Locations" Slices.
 */
const Locations = ({ slice }: LocationsProps): React.ReactElement => {
  const locations = slice.items.map((item, index) => ({
    name: item.location_name || "",
    type: item.location_type || "",
    state: item.state || "VIC",
    address: item.address || "",
    phone: item.phone || "",
    email: item.email || "",
    index,
  }));

  // Prepare nav data
  const navLocations = locations.map((location) => ({
    name: location.name,
    state: location.state,
    index: location.index,
  }));

  return (
    <section className="w-full">
      {/* White Content Section */}
      <div className="w-full bg-white pb-24 lg:pb-32">
        {/* Sticky Navigation */}
        {locations.length > 1 && <LocationsNav locations={navLocations} />}

        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8 mt-12 pt-12 ">
          {/* Locations Grid */}
          <div className="space-y-24">
            {locations.map((location) => (
              <div 
                key={location.index}
                id={`location-${location.index}`}
                className="scroll-mt-40"
              >
                {/* Location Content */}
                <div className="space-y-8">
                  {/* Location Name and Type */}
                  <div>
                    <h3 className="text-neutral-800 text-4xl font-semibold leading-[48px]">
                      {location.name}
                    </h3>
                    <p className="text-neutral-800 text-4xl font-normal leading-[48px]">
                      {location.type}
                    </p>
                  </div>

                  {/* Location Details */}
                  <div className="space-y-2">
                    <p className="text-neutral-800 text-xl font-medium leading-loose">
                      {location.address}
                    </p>
                    <p className="text-neutral-400 text-xl font-normal leading-loose">
                      Phone: <a href={`tel:${location.phone}`} className="underline hover:text-neutral-600 transition-colors">{location.phone}</a>
                    </p>
                    <p className="text-neutral-400 text-xl font-normal leading-loose">
                      Email: {location.email && (() => {
                        const obfuscated = obfuscateMailtoLink(location.email);
                        return (
                          <a href={obfuscated.href} className="underline hover:text-neutral-600 transition-colors" dangerouslySetInnerHTML={{ __html: obfuscated.display }} />
                        );
                      })()}
                    </p>
                  </div>

                  {/* Full Width Map with Clipping Mask */}
                  <div 
                    className="w-full bg-neutral-200 p-[1.25px]"
                    style={{
                      aspectRatio: 'auto',
                      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                    }}
                  >
                    <div 
                      className="w-full overflow-hidden h-[400px] lg:h-auto"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))',
                        aspectRatio: 'auto 2.8 / 1'
                      }}
                    >
                      <LocationsMap locations={[location]} />
                    </div>
                  </div>
                </div>

                {/* Divider between locations (except last) */}
                {location.index < locations.length - 1 && (
                  <div className="mt-24 border-t border-neutral-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
