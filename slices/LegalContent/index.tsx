import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { 
  getMarginTopClass,
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
        className="text-blue-600 hover:text-blue-800 underline"
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
  const paddingTop = ((slice.primary as any).padding_top as PaddingSize) || "large";
  const paddingBottom = ((slice.primary as any).padding_bottom as PaddingSize) || "large";

  // Create a ref to track heading index across renders
  const headingIndexRef = { current: 0 };
  
  // Custom serializer to add IDs to headings for anchor links and obfuscate emails
  const components: JSXMapSerializer = {
    heading2: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h2 id={id} className="scroll-mt-32">
          {children}
        </h2>
      );
    },
    heading3: ({ children }) => {
      headingIndexRef.current++;
      const id = `section-${headingIndexRef.current}`;
      return (
        <h3 id={id} className="scroll-mt-32">
          {children}
        </h3>
      );
    },
    paragraph: ({ children }) => {
      // Process paragraph content for emails
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processTextForEmails(child);
        }
        return child;
      });
      
      return <p>{processedChildren}</p>;
    },
    listItem: ({ children }) => {
      // Process list item content for emails
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processTextForEmails(child);
        }
        return child;
      });
      
      return <li>{processedChildren}</li>;
    },
    strong: ({ children }) => {
      // Process strong text content for emails
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processTextForEmails(child);
        }
        return child;
      });
      
      return <strong>{processedChildren}</strong>;
    },
    em: ({ children }) => {
      // Process emphasized text content for emails
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processTextForEmails(child);
        }
        return child;
      });
      
      return <em>{processedChildren}</em>;
    },
  };

  return (
    <section className={`w-full bg-white ${getMarginTopClass(marginTop)}`}>
      {/* Page Header - Centered */}
      <div className={`w-full ${getPaddingTopClass(paddingTop)} py-24 lg:py-64`}>
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          <LegalHeader pageTitle={slice.primary.page_title} />
        </div>
      </div>

      {/* Content Grid */}
      <div className={`w-full ${getPaddingBottomClass(paddingBottom)}`}>
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="order-2 lg:order-1 max-w-4xl">
              <div className="prose prose-sm lg:prose-base xl:prose-lg max-w-none">
                <PrismicRichText field={slice.primary.content} components={components} />
              </div>
            </div>

            {/* Table of Contents - Sidebar */}
            <TableOfContents items={tableOfContents} />
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </section>
  );
};

export default LegalContent;

