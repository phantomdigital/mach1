import { defaultLocale, type LocaleCode } from "@/prismicio";

export function localizedPath(path: string, locale: LocaleCode = defaultLocale) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale ? normalizedPath : `/${locale}${normalizedPath}`;
}

export function localeForIntl(locale: LocaleCode) {
  return locale === "zh-cn" ? "zh-CN" : "en-AU";
}

export function isSimplifiedChinese(locale: LocaleCode) {
  return locale === "zh-cn";
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

export function localizedNewsLabel(value: string, locale: LocaleCode) {
  return isSimplifiedChinese(locale) ? simplifiedChineseNewsLabels[value] ?? value : value;
}
