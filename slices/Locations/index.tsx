import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { LocationsMap } from "./locations-map";
import { LocationDivider } from "./location-divider";

/**
 * Props for `Locations`.
 */
export type LocationsProps = SliceComponentProps<Content.LocationsSlice>;

/**
 * Component for "Locations" Slices.
 */
const Locations = ({ slice }: LocationsProps): JSX.Element => {
  const locations = slice.items.map(item => ({
    name: item.location_name || "",
    type: item.location_type || "",
    address: item.address || "",
    phone: item.phone || "",
    email: item.email || "",
  }));

  return (
    <section className="w-full">
      {/* White Content Section */}
      <div className="w-full bg-white py-16 lg:py-24">
        <div className="w-full max-w-[112rem] mx-auto px-4 lg:px-8">

          {/* Locations Grid */}
          <div className="space-y-24">
            {locations.map((location, index) => (
              <div key={index}>
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
                      Email: <a href={`mailto:${location.email}`} className="underline hover:text-neutral-600 transition-colors">{location.email}</a>
                    </p>
                  </div>

                  {/* Full Width Map with Clipping Mask */}
                  <div 
                    className="w-full overflow-hidden"
                    style={{
                      aspectRatio: '2.8 / 1', // More compact ratio (originally 2.21/1)
                      clipPath: `polygon(
                        100% 26.9%, 
                        83.96% 1.3%, 
                        49.52% 0%, 
                        0% 0%, 
                        0% 73.1%, 
                        16.04% 98.7%, 
                        50.48% 100%, 
                        100% 100%
                      )`
                    }}
                  >
                    <LocationsMap locations={[location]} />
                  </div>
                </div>

                {/* Divider between locations (except last) */}
                {index < locations.length - 1 && (
                  <div className="mt-24">
                    <LocationDivider />
                  </div>
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
