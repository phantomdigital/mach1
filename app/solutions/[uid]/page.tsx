import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient, defaultLocale, type LocaleCode } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata, generateBreadcrumbSchema } from "@/lib/metadata";
import { isSimplifiedChinese, localizedPath } from "@/lib/localized-routes";

type Params = { uid: string; locale?: LocaleCode };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid, locale = defaultLocale } = await params;
  const client = createClient();
  const solution = await client
    .getByUID("solution", uid, { lang: locale })
    .catch(() => notFound());
  const chinese = isSimplifiedChinese(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: chinese ? "首页" : "Home", url: localizedPath("/", locale) },
    { name: chinese ? "解决方案" : "Solutions", url: localizedPath("/solutions", locale) },
    { name: solution.data.title || uid, url: localizedPath(`/solutions/${uid}`, locale) },
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
        context={{ pageTitle: solution.data.title || uid, locale }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid, locale = defaultLocale } = await params;
  const client = createClient();
  const solution = await client
    .getByUID("solution", uid, { lang: locale })
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
    url: localizedPath(`/solutions/${uid}`, locale),
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
