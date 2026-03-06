import { createClient, defaultLocale } from "@/prismicio";
import HeaderWrapper from "./header-wrapper";
import type { HeaderDocument } from "@/types.generated";

/**
 * Server component that fetches header data. Uses default locale for the initial
 * server render to allow static generation (e.g. /job/[uid]). The client-side
 * HeaderWrapper detects locale from pathname and refetches when needed.
 */
export default async function HeaderServerWrapper() {
  const client = createClient();
  let initialHeader: HeaderDocument | null = null;
  
  try {
    initialHeader = await client.getSingle("header", { lang: defaultLocale });
  } catch (error) {
    console.warn("Header not found in default locale:", error);
  }
  
  return <HeaderWrapper initialHeader={initialHeader} />;
}

