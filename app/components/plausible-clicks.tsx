"use client";

import { useEffect } from "react";
import { trackPlausible } from "@/lib/plausible";

function quotePath(pathname: string) {
  return pathname.replace(/^\/(zh-cn|hi-in)(?=\/|$)/, "") || "/";
}

function isQuoteCta(href: string) {
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    const path = quotePath(url.pathname);
    return path === "/quote";
  } catch {
    return false;
  }
}

export function PlausibleClicks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      if (href.startsWith("tel:")) {
        trackPlausible("Phone Click", {
          number: href.replace(/^tel:/, ""),
        });
        return;
      }

      if (isQuoteCta(href)) {
        trackPlausible("Get Quote Click", {
          page: quotePath(window.location.pathname),
        });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
