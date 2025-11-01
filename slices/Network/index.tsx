import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import NetworkDefault from "./network-default-client";
import NetworkOverview from "./network-overview";

/**
 * Props for `Network`.
 */
export type NetworkProps = SliceComponentProps<Content.NetworkSlice>;

/**
 * Component for "Network" Slices.
 */
const Network = ({ slice }: NetworkProps): JSX.Element => {
  // Route to the appropriate variation component
  if (slice.variation === "networkOverview") {
    return <NetworkOverview slice={slice} />;
  }
  
  // Default variation (3D globe)
  return <NetworkDefault slice={slice} />;
};

export default Network;
