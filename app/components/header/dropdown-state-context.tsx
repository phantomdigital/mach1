'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

interface DropdownStateContextType {
  /** Currently open dropdown ID (null if none open) */
  openDropdownId: string | null;
  /** Open a specific dropdown (closes others automatically) */
  openDropdown: (id: string) => void;
  /** Close a specific dropdown (only if it's currently open) */
  closeDropdown: (id?: string) => void;
  /** Check if a specific dropdown is open */
  isDropdownOpen: (id: string) => boolean;
}

const DropdownStateContext = createContext<DropdownStateContextType | undefined>(undefined);

interface DropdownStateProviderProps {
  children: ReactNode;
}

export function DropdownStateProvider({ children }: DropdownStateProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const openDropdown = useCallback((id: string) => {
    // Immediately open the requested dropdown
    setOpenDropdownId(id);
  }, []);

  const closeDropdown = useCallback((id?: string) => {
    // If specific ID provided, only close if it matches the currently open dropdown
    // If no ID provided, close any open dropdown
    setOpenDropdownId(current => {
      if (id && current !== id) {
        return current; // Don't close if different dropdown is open
      }
      return null; // Close the dropdown
    });
  }, []);

  const isDropdownOpen = useCallback((id: string) => {
    return openDropdownId === id;
  }, [openDropdownId]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    openDropdownId,
    openDropdown,
    closeDropdown,
    isDropdownOpen,
  }), [openDropdownId, openDropdown, closeDropdown, isDropdownOpen]);

  return (
    <DropdownStateContext.Provider value={value}>
      {children}
    </DropdownStateContext.Provider>
  );
}

export function useDropdownState() {
  const context = useContext(DropdownStateContext);
  if (context === undefined) {
    throw new Error('useDropdownState must be used within a DropdownStateProvider');
  }
  return context;
}
