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
  const specialty = await client
    .getByUID("specialty", uid, { lang: locale })
    .catch(() => notFound());
  const chinese = isSimplifiedChinese(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: chinese ? "首页" : "Home", url: localizedPath("/", locale) },
    { name: chinese ? "专业服务" : "Specialties", url: localizedPath("/specialties", locale) },
    { name: specialty.data.title || uid, url: localizedPath(`/specialties/${uid}`, locale) },
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
        context={{ pageTitle: specialty.data.title || uid, locale }}
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
  const specialty = await client
    .getByUID("specialty", uid, { lang: locale })
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
    url: localizedPath(`/specialties/${uid}`, locale),
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

