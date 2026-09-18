import { createClient, defaultLocale } from "@/prismicio";
import type { FooterDocument } from "@/types.generated";
import FooterWrapper from "./footer-wrapper";

export default async function FooterServerWrapper() {
  const client = createClient();
  let initialFooter: FooterDocument | null = null;

  try {
    initialFooter = await client.getSingle("footer", { lang: defaultLocale });
  } catch (error) {
    console.warn("Footer not found in default locale:", error);
  }

  return <FooterWrapper initialFooter={initialFooter} />;
}
