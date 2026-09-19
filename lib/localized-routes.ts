import { defaultLocale, type LocaleCode } from "@/prismicio";

export function localizedPath(path: string, locale: LocaleCode = defaultLocale) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale ? normalizedPath : `/${locale}${normalizedPath}`;
}

export function localeForIntl(locale: LocaleCode) {
  if (locale === "zh-cn") return "zh-CN";
  if (locale === "hi-in") return "hi-IN";
  return "en-AU";
}

export function isSimplifiedChinese(locale: LocaleCode) {
  return locale === "zh-cn";
}

export function isHindi(locale: LocaleCode) {
  return locale === "hi-in";
}

export function localizedChrome(
  locale: LocaleCode,
  english: string,
  chinese: string,
  hindi: string
) {
  if (isSimplifiedChinese(locale)) return chinese;
  if (isHindi(locale)) return hindi;
  return english;
}

const simplifiedChineseNewsLabels: Record<string, string> = {
  "Company News": "公司新闻",
  "Industry Insights": "行业洞察",
  "Case Studies": "案例研究",
  "Product Updates": "服务更新",
  Events: "活动",
  Article: "文章",
  "Press Release": "新闻稿",
  Update: "更新",
  Announcement: "公告",
  Event: "活动",
};

const hindiNewsLabels: Record<string, string> = {
  "Company News": "कंपनी समाचार",
  "Industry Insights": "उद्योग अंतर्दृष्टि",
  "Case Studies": "केस स्टडी",
  "Product Updates": "सेवा अपडेट",
  Events: "इवेंट",
  Article: "लेख",
  "Press Release": "प्रेस विज्ञप्ति",
  Update: "अपडेट",
  Announcement: "घोषणा",
  Event: "इवेंट",
};

export function localizedNewsLabel(value: string, locale: LocaleCode) {
  if (isSimplifiedChinese(locale)) return simplifiedChineseNewsLabels[value] ?? value;
  if (isHindi(locale)) return hindiNewsLabels[value] ?? value;
  return value;
}
