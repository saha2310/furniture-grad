import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Общий компонент хлебных крошек. Последний пункт (обычно текущая страница)
// не кликабельный — рендерится как обычный текст.
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm mb-6 max-md:mb-4 overflow-x-auto whitespace-nowrap">
      <ol className="flex items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#c7ccd1]">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="text-[#7f8c8d] hover:text-[#e67e22] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-[#2c3e50] font-medium' : 'text-[#7f8c8d]'}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
