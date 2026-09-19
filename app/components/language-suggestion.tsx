"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { defaultLocale, type LocaleCode } from "@/prismicio";
import { getLocaleFromPathname, pathForLocale } from "@/lib/locale-helpers";
import {
  detectBrowserLocale,
  readLocalePreference,
  readSuggestOverride,
  suggestionCopy,
  writeLocalePreference,
} from "@/lib/locale-preference";
import { trackPlausible } from "@/lib/plausible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeroButton } from "@/components/ui/hero-button";
import { Button } from "@/components/ui/button";

export function LanguageSuggestion() {
  const pathname = usePathname();
  const router = useRouter();
  const [suggested, setSuggested] = useState<LocaleCode | null>(null);
  const switchingRef = useRef(false);

  useEffect(() => {
    const currentLocale = getLocaleFromPathname(pathname);
    if (currentLocale !== defaultLocale) {
      setSuggested(null);
      return;
    }

    const override = readSuggestOverride();
    if (override) {
      const timeout = window.setTimeout(() => setSuggested(override), 500);
      return () => window.clearTimeout(timeout);
    }

    if (readLocalePreference()) {
      setSuggested(null);
      return;
    }

    const detected = detectBrowserLocale();
    if (!detected || detected === defaultLocale) {
      setSuggested(null);
      return;
    }

    const timeout = window.setTimeout(() => setSuggested(detected), 500);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  const dismiss = () => {
    if (switchingRef.current) {
      switchingRef.current = false;
      setSuggested(null);
      return;
    }
    if (suggested) {
      trackPlausible("Language Prompt", { action: "stay", locale: suggested });
    }
    writeLocalePreference("dismissed");
    setSuggested(null);
  };

  const switchLocale = () => {
    if (!suggested) return;
    switchingRef.current = true;
    trackPlausible("Language Prompt", { action: "switch", locale: suggested });
    trackPlausible("Language Switch", { from: defaultLocale, to: suggested });
    writeLocalePreference(suggested);
    setSuggested(null);
    router.push(pathForLocale(pathname, suggested));
  };

  const copy = suggested ? suggestionCopy(suggested) : null;

  return (
    <Dialog open={Boolean(suggested)} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="max-w-md p-6 sm:p-8">
        <DialogHeader>
          <div className="mb-3 flex h-10 w-10 items-center justify-center bg-neutral-100">
            <Globe className="h-5 w-5 text-neutral-700" />
          </div>
          <DialogTitle className="text-xl lg:text-2xl">
            {copy?.title}
          </DialogTitle>
          <DialogDescription>{copy?.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-3 sm:justify-start">
          <HeroButton size="small" onClick={switchLocale}>
            {copy?.switchLabel}
          </HeroButton>
          <Button type="button" variant="ghost" onClick={dismiss}>
            {copy?.stayLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
