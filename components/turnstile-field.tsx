"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      remove: (id: string) => void;
    };
  }
}

interface TurnstileFieldProps {
  onToken: (token: string) => void;
}

export function TurnstileField({ onToken }: TurnstileFieldProps) {
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
  const elementRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!siteKey || !elementRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !elementRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(elementRef.current, {
        sitekey: siteKey,
        action: "turnstile-spin-v1",
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => onTokenRef.current(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
    }

    const interval = window.setInterval(() => {
      if (window.turnstile) {
        renderWidget();
        window.clearInterval(interval);
      }
    }, 200);

    return () => {
      window.clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={elementRef} className="cf-turnstile" data-action="turnstile-spin-v1" />
    </>
  );
}
