'use client';

import { create } from 'zustand';

/**
 * Zustand store for managing dropdown state across all navigation dropdowns.
 * 
 * Benefits over React Context:
 * - No Provider wrapper needed
 * - Automatic re-render optimization (only affected components re-render)
 * - Built-in grace period to prevent race conditions on open
 * - Can be accessed outside React components if needed
 */

interface DropdownStore {
  /** Currently open dropdown ID (null if none open) */
  openDropdownId: string | null;
  
  /** Timestamp when dropdown was opened (for grace period) */
  openedAt: number | null;
  
  /** Grace period in ms - ignore close attempts during this window */
  gracePeriodMs: number;
  
  /** Open a specific dropdown (closes others automatically) */
  openDropdown: (id: string) => void;
  
  /** Close a specific dropdown (respects grace period) */
  closeDropdown: (id?: string) => void;
  
  /** Force close without grace period check */
  forceClose: () => void;
  
  /** Check if a specific dropdown is open */
  isDropdownOpen: (id: string) => boolean;
  
  /** Check if we're within the grace period after opening */
  isInGracePeriod: () => boolean;
}

export const useDropdownStore = create<DropdownStore>((set, get) => ({
  openDropdownId: null,
  openedAt: null,
  gracePeriodMs: 150, // 150ms grace period after opening
  
  openDropdown: (id: string) => {
    set({ 
      openDropdownId: id,
      openedAt: Date.now()
    });
  },
  
  closeDropdown: (id?: string) => {
    const state = get();
    
    // If specific ID provided, only close if it matches
    if (id && state.openDropdownId !== id) {
      return;
    }
    
    // Check grace period - don't close if just opened
    if (state.isInGracePeriod()) {
      return;
    }
    
    set({ 
      openDropdownId: null,
      openedAt: null
    });
  },
  
  forceClose: () => {
    set({ 
      openDropdownId: null,
      openedAt: null
    });
  },
  
  isDropdownOpen: (id: string) => {
    return get().openDropdownId === id;
  },
  
  isInGracePeriod: () => {
    const { openedAt, gracePeriodMs } = get();
    if (!openedAt) return false;
    return Date.now() - openedAt < gracePeriodMs;
  },
}));

/**
 * Hook for components that only need to know if ANY dropdown is open
 * (useful for backdrop/overlay components)
 */
export const useIsAnyDropdownOpen = () => {
  return useDropdownStore(state => state.openDropdownId !== null);
};

/**
 * Hook for components that need to close all dropdowns
 * (useful for scroll handlers, click-outside, etc.)
 */
export const useCloseAllDropdowns = () => {
  return useDropdownStore(state => state.forceClose);
};
