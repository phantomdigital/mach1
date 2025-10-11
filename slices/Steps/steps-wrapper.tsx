"use client";

import { Suspense } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Steps from "./steps-client";

export type StepsProps = SliceComponentProps<Content.StepsSlice>;

function StepsLoader() {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
        <div className="w-full flex items-center justify-center py-20">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      </div>
    </section>
  );
}

export default function StepsWrapper(props: StepsProps) {
  return (
    <Suspense fallback={<StepsLoader />}>
      <Steps {...props} />
    </Suspense>
  );
}

