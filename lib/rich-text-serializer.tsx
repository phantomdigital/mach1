import React from "react";
import type { JSXMapSerializer } from "@prismicio/react";
import type { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Rich text serializer matching SolutionsBase typography.
 * Use for news articles, content pages, etc.
 */
export function createRichTextComponents(): JSXMapSerializer {
  const headingIndexRef = { current: 0 };

  return {
    heading2: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h2
          id={id}
          className="text-black text-3xl lg:text-4xl font-bold leading-tight mt-12 mb-6 first:mt-0 scroll-mt-32"
        >
          {children}
        </h2>
      );
    },
    heading3: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h3
          id={id}
          className="text-neutral-800 text-xl lg:text-2xl font-semibold leading-tight mt-8 mb-4 scroll-mt-32"
        >
          {children}
        </h3>
      );
    },
    heading4: ({ children }) => (
      <h4 className="text-neutral-800 text-lg lg:text-xl font-semibold leading-tight mt-6 mb-3">
        {children}
      </h4>
    ),
    heading5: ({ children }) => (
      <h5 className="text-neutral-800 text-base lg:text-lg font-semibold leading-tight mt-0 mb-2">
        {children}
      </h5>
    ),
    heading6: ({ children }) => (
      <h6 className="text-neutral-800 text-sm lg:text-base font-semibold leading-tight !mt-0 mb-0 pb-0">
        {children}
      </h6>
    ),
    paragraph: ({ children }) => (
      <p className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4">
        {children}
      </p>
    ),
    list: ({ children }) => (
      <ul className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4 ml-5 list-disc space-y-2">
        {children}
      </ul>
    ),
    oList: ({ children }) => (
      <ol className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4 ml-5 list-decimal space-y-2">
        {children}
      </ol>
    ),
    listItem: ({ children }) => (
      <li className="text-neutral-700">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    hyperlink: ({ children, node }) => {
      const linkData = node.data as { url?: string; target?: string };
      return (
        <a
          href={linkData.url}
          {...(linkData.target ? { target: linkData.target } : {})}
          rel={linkData.target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-mach1-green hover:text-green-700 underline transition-colors"
        >
          {children}
        </a>
      );
    },
    image: ({ node }) => {
      const field = node as unknown as ImageField & {
        data?: { label?: string };
        label?: string;
      };
      if (!field?.url) return null;

      const altText = field.alt ?? "";
      const isIcon =
        field.data?.label === "icon" ||
        field.label === "icon" ||
        /^\[icon(\S*)\]\s*/i.test(altText);
      const iconMatch = altText.match(/^\[icon(:\s*(\d+)\s*,\s*(\d+))?\]\s*/i);
      const displayAlt = isIcon
        ? altText.replace(/^\[icon(:\s*\d+\s*,\s*\d+)?\]\s*/i, "").trim()
        : altText;

      const iconPx =
        iconMatch?.[2] != null ? Math.min(16, parseInt(iconMatch[2], 10)) : 0;
      const iconPy =
        iconMatch?.[3] != null ? Math.min(16, parseInt(iconMatch[3], 10)) : 0;
      const iconPadding = {
        paddingLeft: iconPx,
        paddingRight: iconPx,
        paddingTop: iconPy,
        paddingBottom: iconPy,
      };
      const iconNoMargin = iconPx === 0 && iconPy === 0;

      if (isIcon) {
        return (
          <span className="not-prose block">
            <figure
              className={`inline-block ${iconNoMargin ? "my-0" : "my-4"}`}
              style={iconPadding}
            >
              <PrismicNextImage
                field={{ ...field, alt: displayAlt || null }}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded"
                sizes="64px"
              />
            </figure>
          </span>
        );
      }

      const chamferClip =
        "polygon(0 0, calc(100% - 2.5rem) 0, 100% 2rem, 100% 100%, 0 100%)";
      return (
        <figure className="my-6 flex flex-col gap-0">
          <PrismicNextImage
            field={field}
            className="w-full object-cover block overflow-hidden shrink-0"
            style={{ clipPath: chamferClip }}
            sizes="(max-width: 896px) 100vw, 896px"
          />
          {field.alt && (
            <figcaption className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-4 py-2.5 !text-[11px] text-neutral-500 shrink-0 !mt-0">
              <span className="!text-[10px]">{field.alt}</span>
            </figcaption>
          )}
        </figure>
      );
    },
  };
}
