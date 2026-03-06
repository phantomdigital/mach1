import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata, generateBreadcrumbSchema } from "@/lib/metadata";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const specialty = await client
    .getByUID("specialty", uid)
    .catch(() => notFound());

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Specialties", url: "/specialties" },
    { name: specialty.data.title || uid, url: `/specialties/${uid}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SliceZone
        slices={specialty.data.slices}
        components={components}
        context={{ pageTitle: specialty.data.title || uid }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const specialty = await client
    .getByUID("specialty", uid)
    .catch(() => notFound());

  // Generate specialty-specific keywords
  const specialtyKeywords = [
    uid.replace(/-/g, " "),
    "logistics specialty",
    "MACH1 expertise",
    "specialized freight",
    "transportation services",
    "supply chain",
  ];

  return generatePrismicMetadata(specialty, {
    url: `/specialties/${uid}`,
    keywords: specialtyKeywords,
    type: "article",
  });
}

export async function generateStaticParams() {
  const client = createClient();
  const specialties = await client.getAllByType("specialty");

  return specialties.map((specialty) => {
    return { uid: specialty.uid };
  });
}

