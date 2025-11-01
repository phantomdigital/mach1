"use client";

import { Content } from "@prismicio/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContentWithFixedHeight } from "./tab-content-fixed-height";

interface HomepageHeroTabsProps {
  slice: Content.HomepageHeroSlice;
}

export function HomepageHeroTabs({ slice }: HomepageHeroTabsProps) {
  return (
    <Tabs defaultValue="freight_solutions" className="w-full" onValueChange={(value) => {
      // Update active tab state in TabContentWithFixedHeight
      const event = new CustomEvent('tab-change', { detail: value });
      window.dispatchEvent(event);
    }}>
      <TabsList className="mb-6 bg-transparent p-0 h-auto border-b border-neutral-200 rounded-none gap-6">
        <TabsTrigger 
          value="freight_solutions" 
          className="pt-0 px-0 pb-2 text-sm font-medium text-neutral-600 data-[state=active]:text-neutral-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none border-0 border-b-2 border-transparent"
        >
          {slice.primary.tab_1_label || "Freight Solutions"}
        </TabsTrigger>
        <TabsTrigger 
          value="specialties" 
          className="pt-0 px-0 pb-2 text-sm font-medium text-neutral-600 data-[state=active]:text-neutral-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none border-0 border-b-2 border-transparent"
        >
          {slice.primary.tab_2_label || "Specialties"}
        </TabsTrigger>
      </TabsList>

      {/* Tab Content Container - maintains fixed height */}
      <TabContentWithFixedHeight slice={slice} />
    </Tabs>
  );
}

