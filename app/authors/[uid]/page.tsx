import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient, defaultLocale, type LocaleCode } from "@/prismicio";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { generateMetadata as generateCustomMetadata, languageAlternateMap, ogAlternateLocales, ogLocale } from "@/lib/metadata";
import { localizedChrome, localizedPath } from "@/lib/localized-routes";
import { createRichTextComponents } from "@/lib/rich-text-serializer";

type Params = { uid: string; locale?: LocaleCode };

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid, locale = defaultLocale } = await params;
  const client = createClient();
  let page: Content.AuthorDocument;
  try {
    page = await client.getByUID("author", uid, { lang: locale });
  } catch {
    notFound();
  }

  const name = page.data.name || "Author";

  return (
    <main>
      <section
        className="w-full bg-white pb-16 lg:pb-24"
        style={{ paddingTop: "var(--header-height, 128px)" }}
      >
        <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <nav aria-label="Back navigation">
              <Link
                href={localizedPath("/news", locale)}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-dark-blue transition-colors"
              >
                {localizedChrome(locale, "Back to News", "返回新闻", "समाचार पर वापस जाएँ")}
              </Link>
            </nav>

            <div className="flex items-start gap-6">
              {page.data.profile_photo?.url ? (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-neutral-200">
                  <PrismicNextImage field={page.data.profile_photo} fill className="object-cover" />
                </div>
              ) : null}
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">{name}</h1>
                {page.data.role ? (
                  <p className="mt-2 text-neutral-600">{page.data.role}</p>
                ) : null}
                {isFilled.link(page.data.linkedin) ? (
                  <p className="mt-3">
                    <PrismicNextLink
                      field={page.data.linkedin}
                      className="text-sm font-medium text-dark-blue underline"
                    >
                      LinkedIn
                    </PrismicNextLink>
                  </p>
                ) : null}
              </div>
            </div>

            {isFilled.richText(page.data.bio) ? (
              <div className="prose prose-neutral max-w-none">
                <PrismicRichText field={page.data.bio} components={createRichTextComponents()} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid, locale = defaultLocale } = await params;
  const client = createClient();
  try {
    const page = await client.getByUID("author", uid, { lang: locale });
    const title = page.data.name || "Author";
    return {
      ...generateCustomMetadata({
        title,
        description: page.data.role || `${title} at MACH1 Logistics`,
        url: localizedPath(`/authors/${uid}`, locale),
        locale,
        image: page.data.profile_photo?.url || undefined,
      }),
      openGraph: {
        locale: ogLocale(locale),
        alternateLocale: ogAlternateLocales(locale),
      },
      alternates: {
        languages: languageAlternateMap(`/authors/${uid}`),
      },
    };
  } catch {
    return { title: "Author | MACH1 Logistics" };
  }
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("author");
  return pages.map((page) => ({ uid: page.uid }));
}
