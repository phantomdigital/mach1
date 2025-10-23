"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompactHeaderVisible } from "@/hooks/use-compact-header-visible";

interface TeamNavProps {
  teamMembers: Array<{
    name: string;
    department: string;
    index: number;
  }>;
  onDepartmentChange: (department: string) => void;
}

export function TeamNav({ teamMembers, onDepartmentChange }: TeamNavProps) {
  // Track compact header visibility for desktop positioning
  const isCompactHeaderVisible = useCompactHeaderVisible();
  
  // Group team members by department
  const membersByDepartment = teamMembers.reduce((acc, member) => {
    const dept = member.department || "Other";
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, typeof teamMembers>);

  const departments = Object.keys(membersByDepartment);
  const [activeTab, setActiveTab] = useState(departments[0] || "");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onDepartmentChange(value);
  };

  // Don't render if only one department or no departments
  if (departments.length <= 1) {
    return null;
  }

  // Compact header height when visible (desktop only)
  const compactHeaderHeight = 85; // py-3 + 50px logo + border ≈ 74px

  return (
    <div 
      className="sticky z-30 bg-white border-b border-neutral-200 shadow-sm transition-all duration-300"
      style={{
        // On desktop: position below compact header when visible
        // On mobile: always at top (compact header is hidden on mobile)
        top: isCompactHeaderVisible ? `${compactHeaderHeight}px` : '0px'
      }}
    >
      <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8 py-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="inline-flex h-auto items-center justify-start gap-2 bg-transparent p-0 overflow-x-auto scrollbar-hide w-full">
            {departments.map((department) => (
              <TabsTrigger
                key={department}
                value={department}
                className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-neutral-800 data-[state=active]:text-white data-[state=inactive]:bg-neutral-100 data-[state=inactive]:text-neutral-600 hover:bg-neutral-200 data-[state=active]:hover:bg-neutral-800 data-[state=active]:shadow-none"
              >
                {department}
                <span className="ml-2 text-xs opacity-60">
                  ({membersByDepartment[department].length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

