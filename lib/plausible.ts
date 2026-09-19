export type PlausibleProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: PlausibleProps },
    ) => void;
  }
}

export function trackPlausible(event: string, props?: PlausibleProps) {
  if (typeof window === "undefined" || typeof window.plausible !== "function") {
    return;
  }

  window.plausible(event, props ? { props } : undefined);
}
