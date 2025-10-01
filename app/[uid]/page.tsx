import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata } from "@/lib/metadata";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", uid);
    
    return (
      <main>
        <SliceZone slices={page.data.slices} components={components} />
      </main>
    );
  } catch (error) {
    // Page not found
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", uid);
    
    return generatePrismicMetadata(page, {
      url: `/${uid}`,
      keywords: [uid.replace(/-/g, " "), "MACH1 Logistics", "logistics services"],
    });
  } catch (error) {
    // Return default metadata for pages that don't exist
    return {
      title: "Page Not Found | MACH1 Logistics",
      description: "The requested page could not be found.",
    };
  }
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("page");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
