"use client";

import { createContext, useContext, ReactNode } from "react";

interface LegalDatesContextType {
  firstPublicationDate?: string | null;
  lastPublicationDate?: string | null;
}

const LegalDatesContext = createContext<LegalDatesContextType | undefined>(undefined);

export function LegalDatesProvider({ 
  children, 
  firstPublicationDate, 
  lastPublicationDate 
}: { 
  children: ReactNode;
  firstPublicationDate?: string | null;
  lastPublicationDate?: string | null;
}) {
  return (
    <LegalDatesContext.Provider value={{ firstPublicationDate, lastPublicationDate }}>
      {children}
    </LegalDatesContext.Provider>
  );
}

export function useLegalDates() {
  const context = useContext(LegalDatesContext);
  return context || { firstPublicationDate: null, lastPublicationDate: null };
}

