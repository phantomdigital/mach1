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
  const solution = await client
    .getByUID("solution", uid)
    .catch(() => notFound());

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Solutions", url: "/solutions" },
    { name: solution.data.title || uid, url: `/solutions/${uid}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SliceZone
        slices={solution.data.slices}
        components={components}
        context={{ pageTitle: solution.data.title || uid }}
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
  const solution = await client
    .getByUID("solution", uid)
    .catch(() => notFound());

  // Generate solution-specific keywords
  const solutionKeywords = [
    uid.replace(/-/g, " "),
    "logistics solution",
    "MACH1 services",
    "transportation",
    "freight forwarding",
    "supply chain",
  ];

  return generatePrismicMetadata(solution, {
    url: `/solutions/${uid}`,
    keywords: solutionKeywords,
    type: "article",
  });
}

export async function generateStaticParams() {
  const client = createClient();
  const solutions = await client.getAllByType("solution");

  return solutions.map((solution) => {
    return { uid: solution.uid };
  });
}
