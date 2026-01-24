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
      const offset = 128;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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

