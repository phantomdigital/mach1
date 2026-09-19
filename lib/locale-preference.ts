import { defaultLocale, type LocaleCode } from "@/prismicio";

export const LOCALE_PREFERENCE_KEY = "mach1-locale-preference";

export type LocalePreference = LocaleCode | "dismissed";

/** Localhost-only: `?suggest=zh-cn` or `?suggest=hi-in` to preview the prompt. */
export function readSuggestOverride(): LocaleCode | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") return null;

  const value = new URLSearchParams(window.location.search).get("suggest");
  if (value === "zh-cn" || value === "hi-in") return value;
  return null;
}

export function detectBrowserLocale(): LocaleCode | null {
  if (typeof navigator === "undefined") return null;

  const languages = navigator.languages?.length
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [];

  for (const language of languages) {
    const lower = language.toLowerCase();
    if (lower.startsWith("zh")) return "zh-cn";
    if (lower.startsWith("hi")) return "hi-in";
  }

  return null;
}

export function readLocalePreference(): LocalePreference | null {
  try {
    const value = localStorage.getItem(LOCALE_PREFERENCE_KEY);
    if (value === "dismissed" || value === "en-us" || value === "zh-cn" || value === "hi-in") {
      return value;
    }
  } catch {
    // Private mode or blocked storage.
  }
  return null;
}

export function writeLocalePreference(value: LocalePreference) {
  try {
    localStorage.setItem(LOCALE_PREFERENCE_KEY, value);
  } catch {
    // Ignore persistence failures; the prompt may reappear.
  }
}

export function suggestionCopy(locale: LocaleCode) {
  if (locale === "zh-cn") {
    return {
      title: "本网站提供中文版本",
      description: "This site is also available in Chinese.",
      switchLabel: "切换到中文",
      stayLabel: "Stay on English",
    };
  }

  if (locale === "hi-in") {
    return {
      title: "यह साइट हिंदी में उपलब्ध है",
      description: "This site is also available in Hindi.",
      switchLabel: "हिंदी में देखें",
      stayLabel: "Stay on English",
    };
  }

  return {
    title: "This site is available in English",
    description: "Continue in English.",
    switchLabel: "Switch to English",
    stayLabel: "Stay on English",
  };
}
