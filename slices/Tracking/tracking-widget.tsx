'use client';

import { useEffect, useRef } from 'react';

interface TrackingWidgetProps {
  urlPrefix: string;
  variant: 'compact' | 'large';
  placeholderText?: string;
}

declare global {
  interface Window {
    lxb1?: any;
  }
}

export function TrackingWidget({ urlPrefix, variant, placeholderText }: TrackingWidgetProps) {
  const scriptLoadedRef = useRef(false);
  const placeholderObserverRef = useRef<MutationObserver | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Prevent double loading in development (React StrictMode)
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const scriptUrl = `https://${urlPrefix}.logixboard.com/widget.js`;

    // Step 1: Initialize lxb1 function queue (this must come first)
    window.lxb1 = window.lxb1 || function () { 
      (window.lxb1.q = window.lxb1.q || []).push(arguments);
    };

    // Step 2: Create and insert the script element
    const script = document.createElement('script');
    const firstScript = document.getElementsByTagName('script')[0];
    script.id = 'lxb1';
    script.src = scriptUrl;
    script.async = true;

    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Step 3: Call init immediately (it gets queued and processed when script loads)
    window.lxb1('init', { urlPrefix, variant });

    // Step 4: Set and maintain custom placeholder text if provided
    if (placeholderText) {
      const setupPlaceholder = () => {
        const input = document.querySelector('#lxb-search-widget input.zpP_6r_gtV8O-d_gw-TTw') as HTMLInputElement;
        
        if (!input) return;

        // Set initial placeholder
        input.placeholder = placeholderText;

        // Watch for attribute changes (Logixboard may reset placeholder)
        placeholderObserverRef.current = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'placeholder') {
              const currentInput = mutation.target as HTMLInputElement;
              if (currentInput.placeholder !== placeholderText) {
                currentInput.placeholder = placeholderText;
              }
            }
          });
        });

        placeholderObserverRef.current.observe(input, {
          attributes: true,
          attributeFilter: ['placeholder']
        });
      };

      // Watch for widget insertion
      const insertionObserver = new MutationObserver(() => {
        const input = document.querySelector('#lxb-search-widget input.zpP_6r_gtV8O-d_gw-TTw');
        if (input) {
          setupPlaceholder();
          insertionObserver.disconnect();
        }
      });

      insertionObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Cleanup insertion observer after 10 seconds if input not found
      cleanupTimeoutRef.current = setTimeout(() => {
        insertionObserver.disconnect();
      }, 10000);
    }

    // Cleanup on unmount
    return () => {
      // Clean up observers
      if (placeholderObserverRef.current) {
        placeholderObserverRef.current.disconnect();
        placeholderObserverRef.current = null;
      }

      // Clean up timeout
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      
      // Clean up script
      const existingScript = document.getElementById('lxb1');
      if (existingScript) {
        existingScript.remove();
      }

      // Clean up widget element
      const widgetElement = document.getElementById('lxb-search-widget');
      if (widgetElement) {
        widgetElement.innerHTML = '';
      }

      // Clear the lxb1 function
      if (window.lxb1) {
        delete window.lxb1;
      }
    };
  }, [urlPrefix, variant, placeholderText]);

  const widgetStyles = variant === 'compact' 
    ? { width: '320px', height: '245px' }
    : { minWidth: '320px', minHeight: '280px', width: '100%' };

  return (
    <div 
      id="lxb-search-widget" 
      style={widgetStyles}
      className="mx-auto"
    />
  );
}

