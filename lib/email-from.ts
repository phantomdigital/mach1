import { SITE_URL } from "@/lib/site-url";

const FROM_DISPLAY_NAME = "MACH1 Logistics";

function withDisplayName(raw: string | undefined, fallbackAddress: string) {
  const value = (raw || fallbackAddress).trim();
  if (value.includes("<") && value.includes(">")) return value;
  return `${FROM_DISPLAY_NAME} <${value}>`;
}

export function companyEmailFrom() {
  return withDisplayName(process.env.EMAIL_FROM, "noreply@mach1logistics.com.au");
}

export function customerEmailFrom() {
  return withDisplayName(
    process.env.EMAIL_FROM_CUSTOMER || process.env.EMAIL_FROM,
    "team@mach1logistics.com.au"
  );
}

export function teamReplyTo(fallback = "quotes@mach1logistics.com.au") {
  return (process.env.EMAIL_TO || fallback).trim();
}

export { SITE_URL as emailSiteUrl };
