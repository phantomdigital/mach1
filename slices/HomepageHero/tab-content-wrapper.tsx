"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";

interface TabContentWrapperProps {
  value: string;
  activeTab: string;
  className?: string;
  children: React.ReactNode;
}

export function TabContentWrapper({ value, activeTab, className, children }: TabContentWrapperProps) {
  const isActive = value === activeTab;

  return (
    <div
      className={`${className || ""} ${isActive ? "block" : "hidden"} ${isActive ? "" : "absolute inset-0 invisible pointer-events-none"}`}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
}

