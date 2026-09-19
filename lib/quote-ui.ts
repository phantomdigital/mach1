import { defaultLocale, type LocaleCode } from "@/prismicio";
import { isHindi, isSimplifiedChinese } from "@/lib/localized-routes";

function hasNativeScript(value: string, locale: LocaleCode) {
  if (isSimplifiedChinese(locale)) return /[\u4e00-\u9fff]/.test(value);
  if (isHindi(locale)) return /[\u0900-\u097F]/.test(value);
  return true;
}

const LOADING_MESSAGES_KEY = "steps_loading_messages";

const SERVICE_TYPE_ACRONYMS = new Set(["3pl", "aqis", "fcl", "lcl"]);
const SERVICE_TYPE_SMALL_WORDS = new Set(["and", "or", "of", "the", "a", "an", "to", "for"]);

export function formatServiceType(type: string) {
  return type
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (SERVICE_TYPE_ACRONYMS.has(lower)) return lower.toUpperCase();
      if (index > 0 && SERVICE_TYPE_SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function skipsQuotePackages(selectedCard: string | null | undefined) {
  if (!selectedCard) return false;
  const value = selectedCard.toLowerCase();
  return (
    value.includes("warehousing") ||
    value.includes("3pl") ||
    value.includes("storage") ||
    value.includes("warehouse")
  );
}

/** CMS chrome copied from English still looks Latin; keep real Chinese values. */
export function quoteChrome(
  value: string | null | undefined,
  fallback: string,
  locale: LocaleCode = defaultLocale
) {
  if (!value?.trim()) return fallback;
  if (locale !== defaultLocale && !hasNativeScript(value, locale) && /[A-Za-z]{3,}/.test(value)) {
    return fallback;
  }
  return value;
}

export function writeQuoteLoadingMessages(
  locale: LocaleCode,
  loading?: string | null,
  loadingSubMessage?: string | null
) {
  if (typeof window === "undefined") return;
  const copy = quoteCopy(locale);
  sessionStorage.setItem(
    LOADING_MESSAGES_KEY,
    JSON.stringify({
      locale,
      loading: quoteChrome(loading, copy.loadingForm, locale),
      loadingSubMessage: quoteChrome(loadingSubMessage, copy.loadingWait, locale),
    })
  );
}

export function readQuoteLoadingMessages(locale: LocaleCode) {
  const copy = quoteCopy(locale);
  if (typeof window === "undefined") {
    return { loading: copy.loadingForm, loadingSubMessage: copy.loadingWait };
  }

  try {
    const stored = sessionStorage.getItem(LOADING_MESSAGES_KEY);
    if (stored) {
      const messages = JSON.parse(stored) as {
        locale?: string;
        loading?: string;
        loadingSubMessage?: string;
      };
      if (messages.locale === locale) {
        return {
          loading: quoteChrome(messages.loading, copy.loadingForm, locale),
          loadingSubMessage: quoteChrome(messages.loadingSubMessage, copy.loadingWait, locale),
        };
      }
    }
  } catch {
    // Ignore stale or invalid cache and use locale fallbacks.
  }

  return { loading: copy.loadingForm, loadingSubMessage: copy.loadingWait };
}

export function quoteCopy(locale: LocaleCode = defaultLocale) {
  if (isSimplifiedChinese(locale)) {
    return {
      loadingForm: "正在加载报价表单...",
      loadingWait: "请稍候",
      loading: "加载中...",
      loadingSummary: "正在加载报价摘要...",
      submit: "提交",
      continue: "继续",
      submitting: "提交中...",
      skip: "跳过",
      stepFallback: "步骤",
      stepOf: (step: number, total: number) => `第 ${step} 步 / 共 ${total} 步`,
      previousStep: "上一步",
      details: "详细信息",
      warehousingDetails: "仓储详情",
      packageDetails: "货物信息",
      thankYou: "谢谢！",
      weReceived: "我们已收到您的请求。",
      weReceivedBody:
        "我们的物流专员将在 24 小时内通过 {email} 与您联系，讨论您的具体需求。我们期待了解如何帮助您优化供应链。",
      startQuote: "开始报价",
      selectOption: "请选择",
      required: (label: string) => `请填写${label}`,
      validEmail: "请输入有效的电子邮箱",
      validPhone: "请输入有效的联系电话",
      positiveNumber: (label: string) => `${label}必须为正数`,
      fixErrors: "请修正以下错误：",
      dismissError: "关闭错误提示",
      sendFailed: "报价请求发送失败，请重试。",
      unexpectedError: "发生意外错误，请重试。",
      processing: "正在处理您的报价请求...",
      processingWait: "请稍候，正在发送您的请求...",
      packageWord: "货物",
      packageN: (n: number) => `货物 ${n}`,
      removePackage: "删除货物",
      addPackage: "添加另一件货物",
      shippingWhat: "您要运输什么？",
      shippingPlaceholder: "请输入货物描述……",
      pickup: "提货地址",
      pickupPlaceholder: "请输入提货地址……",
      delivery: "送货地址",
      deliveryPlaceholder: "请输入送货地址……",
      weight: "重量",
      quantity: "数量",
      length: "长度",
      width: "宽度",
      height: "高度",
      selectDate: "选择日期",
      countrySelect: (country: string) => `请从下拉列表中选择地址，以确保位于${country}`,
      countryOnly: (country: string) => `仅接受${country}地址。请从建议中选择。`,
      countries: {
        AU: "澳大利亚",
        US: "美国",
        GB: "英国",
        CA: "加拿大",
        NZ: "新西兰",
      } as Record<string, string>,
      quoteReceived: "已收到报价请求",
      goHome: "返回首页",
      serviceType: "服务类型",
      origin: "始发地",
      destination: "目的地",
      faqs: "常见问题",
      haveAChat: "在线咨询",
      getHelp: "获取帮助",
      contactUs: "联系我们",
      liveChat: "在线客服",
      noData: "未找到报价数据",
      redirecting: "正在跳转至首页...",
      quoteError: "报价出错",
      somethingWrong: "出了点问题",
      errorDescription: "处理您的报价请求时出现问题。您可以重新提交或从头开始。",
      tryAgain: "重试",
      startOver: "重新开始",
      backHome: "返回首页",
      na: "无",
    };
  }

  if (isHindi(locale)) {
    return {
      loadingForm: "आपका कोट फ़ॉर्म लोड हो रहा है...",
      loadingWait: "कृपया प्रतीक्षा करें",
      loading: "लोड हो रहा है...",
      loadingSummary: "कोट सारांश लोड हो रहा है...",
      submit: "सबमिट करें",
      continue: "जारी रखें",
      submitting: "भेजा जा रहा है...",
      skip: "छोड़ें",
      stepFallback: "चरण",
      stepOf: (step: number, total: number) => `चरण ${step} / ${total}`,
      previousStep: "पिछला चरण",
      details: "विवरण",
      warehousingDetails: "वेयरहाउसिंग विवरण",
      packageDetails: "माल की जानकारी",
      thankYou: "धन्यवाद!",
      weReceived: "हमें आपका अनुरोध मिल गया है।",
      weReceivedBody:
        "हमारा लॉजिस्टिक्स विशेषज्ञ 24 घंटे के भीतर {email} पर आपसे संपर्क करेगा। हम आपकी आपूर्ति श्रृंखला को बेहतर बनाने में मदद करने के लिए उत्सुक हैं।",
      startQuote: "कोट शुरू करें",
      selectOption: "विकल्प चुनें",
      required: (label: string) => `${label} आवश्यक है`,
      validEmail: "कृपया मान्य ईमेल दर्ज करें",
      validPhone: "कृपया मान्य फ़ोन नंबर दर्ज करें",
      positiveNumber: (label: string) => `${label} धनात्मक संख्या होनी चाहिए`,
      fixErrors: "कृपया ये त्रुटियाँ सुधारें:",
      dismissError: "त्रुटि बंद करें",
      sendFailed: "कोट अनुरोध नहीं भेजा जा सका। कृपया फिर कोशिश करें।",
      unexpectedError: "अप्रत्याशित त्रुटि हुई। कृपया फिर कोशिश करें।",
      processing: "आपका कोट अनुरोध प्रोसेस हो रहा है...",
      processingWait: "कृपया प्रतीक्षा करें, आपका अनुरोध भेजा जा रहा है...",
      packageWord: "पैकेज",
      packageN: (n: number) => `पैकेज ${n}`,
      removePackage: "पैकेज हटाएँ",
      addPackage: "एक और पैकेज जोड़ें",
      shippingWhat: "आप क्या भेज रहे हैं?",
      shippingPlaceholder: "माल का विवरण दर्ज करें……",
      pickup: "पिकअप पता",
      pickupPlaceholder: "पिकअप पता दर्ज करें……",
      delivery: "डिलीवरी पता",
      deliveryPlaceholder: "डिलीवरी पता दर्ज करें……",
      weight: "वज़न",
      quantity: "मात्रा",
      length: "लंबाई",
      width: "चौड़ाई",
      height: "ऊँचाई",
      selectDate: "तारीख चुनें",
      countrySelect: (country: string) => `सुनिश्चित करें कि पता ${country} में है — सूची से चुनें`,
      countryOnly: (country: string) => `केवल ${country} पते स्वीकार हैं। सुझावों में से चुनें।`,
      countries: {
        AU: "ऑस्ट्रेलिया",
        US: "संयुक्त राज्य",
        GB: "यूनाइटेड किंगडम",
        CA: "कनाडा",
        NZ: "न्यूज़ीलैंड",
      } as Record<string, string>,
      quoteReceived: "कोट अनुरोध प्राप्त",
      goHome: "होम पर जाएँ",
      serviceType: "सेवा प्रकार",
      origin: "उद्गम",
      destination: "गंतव्य",
      faqs: "सामान्य प्रश्न",
      haveAChat: "बात करें",
      getHelp: "मदद लें",
      contactUs: "संपर्क करें",
      liveChat: "लाइव चैट",
      noData: "कोट डेटा नहीं मिला",
      redirecting: "होम पेज पर जा रहे हैं...",
      quoteError: "कोट त्रुटि",
      somethingWrong: "कुछ गलत हो गया",
      errorDescription: "आपका कोट अनुरोध प्रोसेस करते समय समस्या हुई। आप फिर से भेज सकते हैं या शुरू से शुरू कर सकते हैं।",
      tryAgain: "फिर कोशिश करें",
      startOver: "फिर से शुरू करें",
      backHome: "होम पर वापस",
      na: "उपलब्ध नहीं",
    };
  }

  return {
    loadingForm: "Loading your quote form...",
    loadingWait: "Please wait a moment",
    loading: "Loading...",
    loadingSummary: "Loading your quote summary...",
    submit: "SUBMIT",
    continue: "CONTINUE",
    submitting: "SUBMITTING...",
    skip: "SKIP",
    stepFallback: "Step",
    stepOf: (step: number, total: number) => `Step ${step}/${total}`,
    previousStep: "Previous step",
    details: "DETAILS",
    warehousingDetails: "WAREHOUSING DETAILS",
    packageDetails: "PACKAGE DETAILS",
    thankYou: "Thank you!",
    weReceived: "We have received your request.",
    weReceivedBody:
      "One of our logistics specialists will contact you at {email} within 24 hours to discuss your requirements. We're looking forward to learning how we can help optimise your supply chain.",
    startQuote: "Start Quote",
    selectOption: "Select an option",
    required: (label: string) => `${label} is required`,
    validEmail: "Please enter a valid email address",
    validPhone: "Please enter a valid phone number",
    positiveNumber: (label: string) => `${label} must be a positive number`,
    fixErrors: "Please fix the following errors:",
    dismissError: "Dismiss error",
    sendFailed: "Failed to send quote request. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
    processing: "Processing your quote request...",
    processingWait: "Please wait while we send your request...",
    packageWord: "Package",
    packageN: (n: number) => `Package ${n}`,
    removePackage: "Remove package",
    addPackage: "Add Another Package",
    shippingWhat: "What are you shipping?",
    shippingPlaceholder: "Enter what you are shipping...",
    pickup: "Pickup Address",
    pickupPlaceholder: "Enter pickup address...",
    delivery: "Delivery Address",
    deliveryPlaceholder: "Enter delivery address...",
    weight: "Weight",
    quantity: "Quantity",
    length: "Length",
    width: "Width",
    height: "Height",
    selectDate: "Select date",
    countrySelect: (country: string) =>
      `Please select an address from the dropdown to ensure it's in ${country}`,
    countryOnly: (country: string) =>
      `Only ${country} addresses accepted. Select from suggestions.`,
    countries: {
      AU: "Australia",
      US: "United States",
      GB: "United Kingdom",
      CA: "Canada",
      NZ: "New Zealand",
    } as Record<string, string>,
    quoteReceived: "Quote Received",
    goHome: "GO TO HOME",
    serviceType: "Service Type",
    origin: "Origin",
    destination: "Destination",
    faqs: "FAQs",
    haveAChat: "HAVE A CHAT",
    getHelp: "Get help",
    contactUs: "CONTACT US",
    liveChat: "LIVE CHAT",
    noData: "No quote data found",
    redirecting: "Redirecting you to the home page...",
    quoteError: "Quote Error",
    somethingWrong: "Something went wrong",
    errorDescription:
      "We encountered an issue processing your quote request. You can try submitting again or start over.",
    tryAgain: "Try Again",
    startOver: "Start Over",
    backHome: "Back to Home",
    na: "N/A",
  };
}
