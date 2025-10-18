"use client";

import { useLenis } from "@/hooks/use-lenis";

interface TableOfContentsItem {
  id: number;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const lenis = useLenis();

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element && lenis) {
      // Use Lenis for smooth scrolling with offset for header
      lenis.scrollTo(element, {
        offset: -128, // 32 * 4 = 128px offset for header
        duration: 1.2,
      });
    } else if (element) {
      // Fallback to native scrollIntoView if Lenis not available
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (items.length === 0) return null;

  return (
    <aside className="order-1 lg:order-2">
      <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
        <h3 className="text-neutral-800 text-sm font-bold mb-4 uppercase tracking-wider">
          Table of Contents
        </h3>
        <nav>
          <ol className="space-y-2 text-sm">
            {items.map((item) => (
              <li 
                key={item.id}
                className={item.level === 3 ? 'pl-4' : ''}
              >
                <a 
                  href={`#section-${item.id}`}
                  onClick={(e) => handleScrollToSection(e, `section-${item.id}`)}
                  className="text-neutral-600 hover:text-dark-blue hover:underline transition-colors font-medium block leading-relaxed cursor-pointer"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </aside>
  );
}

