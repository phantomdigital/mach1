"use client";

interface TableOfContentsItem {
  id: number;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height").trim() || "128",
        10
      );
      const offset = headerHeight + 16; // +1rem buffer to match sticky top
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      const lenis = (window as typeof window & { lenis?: { scrollTo: (target: number, options?: { duration?: number; easing?: (t: number) => number }) => void } }).lenis;

      if (lenis?.scrollTo) {
        lenis.scrollTo(offsetPosition, {
          duration: 0.8,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  if (items.length === 0) return null;

  return (
    <aside className="order-1 lg:order-2 lg:sticky lg:top-[calc(var(--header-height,128px)+1rem)] lg:self-start h-full lg:min-h-full">
      <div className="bg-[#F0FCFB] p-6 lg:p-8 h-full min-h-full">
        <h3 className="text-neutral-800 text-[11px] font-semibold mb-3 uppercase tracking-wider">
          On this page
        </h3>
        <nav>
          <ol className="space-y-1.5 text-[11px]">
            {items.map((item) => (
              <li 
                key={item.id}
                className={item.level === 3 ? 'pl-3' : ''}
              >
                <a 
                  href={`#section-${item.id}`}
                  onClick={(e) => handleScrollToSection(e, `section-${item.id}`)}
                  className="text-neutral-600 hover:text-neutral-900 hover:underline transition-colors leading-relaxed block cursor-pointer"
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

