'use client';

import { useCallback, useEffect, useRef, type FocusEvent, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

interface UseDropdownInteractionParams {
  dropdownId: string;
  isOpen: boolean;
  closeDelayMs?: number;
  wrapperRef: RefObject<HTMLDivElement | null>;
  dropdownContentRef: RefObject<HTMLDivElement | null>;
  openDropdown: (id: string) => void;
  closeDropdown: (id?: string) => void;
  forceClose: () => void;
  isInGracePeriod: () => boolean;
  isPointInDropdownShape: (clientX: number, clientY: number, contentRect: DOMRect) => boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface UseDropdownInteractionResult {
  handlePointerEnter: (e?: ReactPointerEvent<HTMLElement>) => void;
  handlePointerLeave: (e?: ReactPointerEvent<HTMLElement>) => void;
  handleBlur: (e: FocusEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  handleFocus: () => void;
}

export function useDropdownInteraction({
  dropdownId,
  isOpen,
  closeDelayMs = 140,
  wrapperRef,
  dropdownContentRef,
  openDropdown,
  closeDropdown,
  forceClose,
  isInGracePeriod,
  isPointInDropdownShape,
  onOpen,
  onClose,
}: UseDropdownInteractionParams): UseDropdownInteractionResult {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingClose = useCallback((): void => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback((): void => {
    clearPendingClose();
    closeTimeoutRef.current = setTimeout(() => {
      closeDropdown(dropdownId);
      onClose();
      closeTimeoutRef.current = null;
    }, closeDelayMs);
  }, [clearPendingClose, closeDropdown, closeDelayMs, dropdownId, onClose]);

  const handlePointerEnter = useCallback((e?: ReactPointerEvent<HTMLElement>): void => {
    if (e && e.pointerType !== 'mouse') return;
    clearPendingClose();
    onOpen();
    openDropdown(dropdownId);
  }, [clearPendingClose, dropdownId, onOpen, openDropdown]);

  const handlePointerLeave = useCallback((e?: ReactPointerEvent<HTMLElement>): void => {
    if (e && e.pointerType !== 'mouse') return;
    scheduleClose();
  }, [scheduleClose]);

  const handleFocus = useCallback((): void => {
    handlePointerEnter();
  }, [handlePointerEnter]);

  const handleBlur = useCallback((e: FocusEvent<HTMLDivElement>): void => {
    const nextFocused = e.relatedTarget as Node | null;
    if (!nextFocused || !e.currentTarget.contains(nextFocused)) {
      scheduleClose();
    }
  }, [scheduleClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      clearPendingClose();
      forceClose();
      onClose();
      wrapperRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    }
  }, [clearPendingClose, forceClose, onClose, wrapperRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (isInGracePeriod()) return;

      const contentEl = dropdownContentRef.current;
      const wrapperEl = wrapperRef.current;
      if (!contentEl || !wrapperEl) return;

      const wrapperRect = wrapperEl.getBoundingClientRect();
      const contentRect = contentEl.getBoundingClientRect();

      const inWrapper = (
        e.clientX >= wrapperRect.left &&
        e.clientX <= wrapperRect.right &&
        e.clientY >= wrapperRect.top &&
        e.clientY <= wrapperRect.bottom
      );

      if (!inWrapper) return;

      if (e.clientY < contentRect.top) {
        clearPendingClose();
        return;
      }

      if (!isPointInDropdownShape(e.clientX, e.clientY, contentRect)) {
        scheduleClose();
        return;
      }

      clearPendingClose();
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => document.removeEventListener('pointermove', handlePointerMove);
  }, [
    clearPendingClose,
    dropdownContentRef,
    isInGracePeriod,
    isOpen,
    isPointInDropdownShape,
    scheduleClose,
    wrapperRef,
  ]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return {
    handlePointerEnter,
    handlePointerLeave,
    handleBlur,
    handleKeyDown,
    handleFocus,
  };
}
