"use client";

import React from "react";

interface StatItem {
  number?: string | null;
  suffix?: string | null;
  label?: string | null;
  sub_label?: string | null;
}

interface NetworkStatsProps {
  statistics: StatItem[];
}

/**
 * Supabase-style statistics component
 * Displays stats in a centered row with top border dividers
 */
export default function NetworkStats({ statistics }: NetworkStatsProps) {
  if (!statistics || statistics.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-16 lg:mb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
        {statistics.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center pt-6 border-t-2 border-mach1-green/40"
          >
            {/* Number with suffix */}
            {stat.number && (
              <div className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold leading-none mb-2">
                {stat.number}
                {stat.suffix && (
                  <span className="text-mach1-green">{stat.suffix}</span>
                )}
              </div>
            )}
            
            {/* Label */}
            {stat.label && (
              <p className="text-neutral-300 text-sm lg:text-base leading-snug m-0">
                {stat.label}
              </p>
            )}
            
            {/* Sub-label (optional) */}
            {stat.sub_label && (
              <p className="text-neutral-400 text-xs lg:text-sm mt-1 m-0">
                {stat.sub_label}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

