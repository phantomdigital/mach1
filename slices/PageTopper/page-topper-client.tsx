"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

interface PageTopperClientProps {
  children: ReactNode;
}

export function PageTopperClient({ children }: PageTopperClientProps): React.ReactElement | null {
  const searchParams = useSearchParams();
  
  // Hide PageTopper when in quote flow (step query param exists)
  const hasStepParam = searchParams.has("step");
  
  if (hasStepParam) {
    return null;
  }

  return <>{children}</>;
}

