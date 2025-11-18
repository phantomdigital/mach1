"use client";

import dynamic from "next/dynamic";

// Dynamically import GlobeBackground to avoid SSR issues with Three.js
const GlobeBackground = dynamic(() => import("./globe-background"), {
  ssr: false,
});

export default function GlobeBackgroundWrapper() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-30">
      <GlobeBackground />
    </div>
  );
}

