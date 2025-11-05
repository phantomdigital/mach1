import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient, defaultLocale } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata } from "@/lib/metadata";

export default async function Home() {
  const client = createClient();
  // Fetch from default locale (en-us)
  const page = await client.getSingle("home", { lang: defaultLocale }).catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("home", { lang: defaultLocale }).catch(() => notFound());

  return generatePrismicMetadata(page, {
    url: "/",
    keywords: ["home", "logistics solutions", "freight services", "MACH1"],
  });
}
