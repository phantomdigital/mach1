import { defaultLocale, type LocaleCode } from "@/prismicio";
import { isHindi, isSimplifiedChinese } from "@/lib/localized-routes";
import { quoteCopy } from "@/lib/quote-ui";

export function trackingCopy(locale: LocaleCode = defaultLocale) {
  const shared = quoteCopy(locale);

  if (isSimplifiedChinese(locale)) {
    return {
      trackingNumber: "追踪编号",
      track: "追踪",
      placeholder: "请输入追踪编号……",
      warning: "将在新窗口中打开 Logixboard 货件追踪",
      validTracking: "请输入有效的追踪编号",
      moreInfo: "更多信息",
      dismissError: shared.dismissError,
      configurePrefix: "请在 Prismic 中配置 Logixboard 网址前缀",
      haveAChat: shared.haveAChat,
      getHelp: shared.getHelp,
      contactUs: shared.contactUs,
      liveChat: shared.liveChat,
      faqs: shared.faqs,
    };
  }

  if (isHindi(locale)) {
    return {
      trackingNumber: "ट्रैकिंग नंबर",
      track: "ट्रैक करें",
      placeholder: "ट्रैकिंग नंबर दर्ज करें……",
      warning: "यह Logixboard ट्रैकिंग एक नई विंडो में खोलेगा",
      validTracking: "कृपया मान्य ट्रैकिंग नंबर दर्ज करें",
      moreInfo: "अधिक जानकारी",
      dismissError: shared.dismissError,
      configurePrefix: "कृपया Prismic में Logixboard URL उपसर्ग सेट करें",
      haveAChat: shared.haveAChat,
      getHelp: shared.getHelp,
      contactUs: shared.contactUs,
      liveChat: shared.liveChat,
      faqs: shared.faqs,
    };
  }

  return {
    trackingNumber: "Tracking number",
    track: "Track",
    placeholder: "Enter tracking number...",
    warning: "This will open a new window to Logixboard tracking",
    validTracking: "Please enter a valid tracking number",
    moreInfo: "More information",
    dismissError: shared.dismissError,
    configurePrefix: "Please configure the Logixboard URL prefix in Prismic",
    haveAChat: shared.haveAChat,
    getHelp: shared.getHelp,
    contactUs: shared.contactUs,
    liveChat: shared.liveChat,
    faqs: shared.faqs,
  };
}
