import { createClient, defaultLocale, type LocaleCode } from "@/prismicio";

const FALLBACK_CAREERS_EMAIL = "careers@mach1logistics.com.au";

export async function resolveJobApplicationRecipient(jobUid: string, locale: LocaleCode = defaultLocale) {
  const client = createClient();
  const job = await client
    .getByUID("job", jobUid, { lang: locale })
    .catch(() => client.getByUID("job", jobUid, { lang: defaultLocale }));

  const isActive = job.data.active !== false;
  const closingDate = job.data.closing_date;
  const isPastClosingDate = Boolean(closingDate && new Date(closingDate) < new Date());
  if (!isActive || isPastClosingDate) {
    throw new Error("This position is no longer accepting applications.");
  }

  const cmsEmail = job.data.application_email?.trim();
  if (cmsEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cmsEmail)) {
    return cmsEmail;
  }

  return process.env.EMAIL_TO || FALLBACK_CAREERS_EMAIL;
}
