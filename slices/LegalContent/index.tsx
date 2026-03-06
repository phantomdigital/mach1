import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { 
  getPaddingTopFromMarginSize,
  getPaddingBottomFromMarginSize,
  getPaddingTopClass, 
  getPaddingBottomClass,
  type MarginTopSize,
  type PaddingSize 
} from "@/lib/spacing";
import { LegalHeader } from "./legal-header";
import { TableOfContents } from "./table-of-contents";
import { ScrollToTopButton } from "./scroll-to-top-button";
import { ObfuscatedEmail } from "@/components/obfuscated-email";
import { encodeEmailForJS } from "@/lib/email-obfuscation";

/**
 * Email regex pattern to detect email addresses in text content
 */
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

/**
 * Function to process text content and replace emails with obfuscated components
 */
const processTextForEmails = (text: string) => {
  if (!text || typeof text !== 'string') return text;
  
  const emails = text.match(EMAIL_REGEX);
  if (!emails || emails.length === 0) return text;
  
  // Split text by emails and create array of text parts and email components
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  
  emails.forEach((email, index) => {
    const emailIndex = text.indexOf(email, lastIndex);
    
    // Add text before email
    if (emailIndex > lastIndex) {
      parts.push(text.substring(lastIndex, emailIndex));
    }
    
    // Encode email with base64 for server-side obfuscation
    const encodedEmail = encodeEmailForJS(email);
    
    // Add obfuscated email component with base64 encoded email
    parts.push(
      <ObfuscatedEmail 
        key={`email-${index}`}
        email={encodedEmail}
        isBase64Encoded={true}
        className="text-mach1-green hover:text-green-700 underline"
      />
    );
    
    lastIndex = emailIndex + email.length;
  });
  
  // Add remaining text after last email
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
};

/**
 * Props for `LegalContent`.
 */
export type LegalContentProps = SliceComponentProps<Content.LegalContentSlice>;

/**
 * Component for "LegalContent" Slices.
 * Used for Privacy Policy, Terms & Conditions, and other legal pages.
 */
const LegalContent = ({ slice }: LegalContentProps): React.ReactElement => {
  // Extract headings from content for table of contents
  const generateTableOfContents = () => {
    if (!slice.primary.content || !Array.isArray(slice.primary.content)) return [];
    
    return slice.primary.content
      .filter((block: any) => 
        block.type === 'heading2' || 
        block.type === 'heading3'
      )
      .map((block: any, index: number) => ({
        id: index + 1,
        text: block.text || '',
        level: (block.type === 'heading2' ? 2 : 3) as 2 | 3,
      }));
  };

  const tableOfContents = slice.primary.show_table_of_contents ? generateTableOfContents() : [];
  
  // Get spacing from Prismic or use defaults
  const marginTop = ((slice.primary as any).margin_top as MarginTopSize) || "large";
  const marginBottom = ((slice.primary as any).margin_bottom as MarginTopSize) || "large";
  const paddingTop = ((slice.primary as any).padding_top as PaddingSize) || "large";
  const paddingBottom = ((slice.primary as any).padding_bottom as PaddingSize) || "large";

  // Create a ref to track heading index across renders
  const headingIndexRef = { current: 0 };
  
  // Custom serializer matching SolutionsBase/specialty typography, with IDs for TOC and email obfuscation
  const components: JSXMapSerializer = {
    heading1: ({ children }) => (
      <h1 className="text-black text-4xl lg:text-5xl font-bold leading-tight mt-12 mb-6 first:mt-0">
        {children}
      </h1>
    ),
    heading2: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h2 id={id} className="text-black text-3xl lg:text-4xl font-bold leading-tight mt-12 mb-6 first:mt-0 scroll-mt-32">
          {children}
        </h2>
      );
    },
    heading3: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h3 id={id} className="text-neutral-800 text-xl lg:text-2xl font-semibold leading-tight mt-8 mb-4 scroll-mt-32">
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
    paragraph: ({ children }) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') return processTextForEmails(child);
        return child;
      });
      return (
        <p className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4">
          {processedChildren}
        </p>
      );
    },
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
    listItem: ({ children }) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') return processTextForEmails(child);
        return child;
      });
      return <li className="text-neutral-700">{processedChildren}</li>;
    },
    strong: ({ children }) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') return processTextForEmails(child);
        return child;
      });
      return <strong className="font-semibold text-neutral-900">{processedChildren}</strong>;
    },
    em: ({ children }) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') return processTextForEmails(child);
        return child;
      });
      return <em className="italic">{processedChildren}</em>;
    },
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
    preformatted: ({ children }) => (
      <pre className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-4 p-4 bg-neutral-100 rounded overflow-x-auto">
        {children}
      </pre>
    ),
  };

  return (
    <section className="w-full" style={{ paddingTop: 'var(--header-height, 128px)' }}>
      <div className={`w-full bg-neutral-100 border-b-3 border-neutral-200 ${getPaddingTopFromMarginSize(marginTop)} ${getPaddingBottomFromMarginSize(marginBottom)}`}>
        {/* Page Header */}
        <div className={`w-full ${getPaddingTopClass(paddingTop)} ${getPaddingBottomClass(paddingBottom)}`}>
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
            <LegalHeader pageTitle={slice.primary.page_title} />
          </div>
        </div>

        {/* Content Grid - white background */}
        <div className={`w-full bg-white ${getPaddingBottomClass(paddingBottom)}`}>
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="order-2 lg:order-1 max-w-4xl pt-8 lg:pt-24">
                <div className="prose prose-sm lg:prose-base max-w-none">
                  <PrismicRichText field={slice.primary.content} components={components} />
                </div>
              </div>

              {/* Table of Contents - Sidebar */}
              <TableOfContents items={tableOfContents} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </section>
  );
};

export default LegalContent;

