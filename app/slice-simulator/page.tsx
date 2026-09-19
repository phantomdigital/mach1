import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SliceSimulator,
  SliceSimulatorParams,
  getSlices,
} from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";

import { components } from "../../slices";

export const metadata: Metadata = {
  title: "Slice Simulator",
  robots: { index: false, follow: false },
};

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone slices={slices} components={components} />
    </SliceSimulator>
  );
}
