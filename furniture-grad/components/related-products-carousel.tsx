'use client';
import { useRef, useState } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';

const ITEMS_PER_PAGE = 2;

export function RelatedProductsCarousel({ products }: { products: Product[] }) {
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += ITEMS_PER_PAGE) {
    pages.push(products.slice(i, i + ITEMS_PER_PAGE));
  }

  const [activePage, setActivePage] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    setActivePage(page);
  };

  const goToPage = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Мобильная версия — горизонтальный свайп по страницам, 2 карточки на странице */}
      <div className="md:hidden">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory -mx-5 px-5"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {pages.map((page, i) => (
            <div key={i} className="w-full shrink-0 snap-start grid grid-cols-2 gap-4 pr-4 last:pr-0">
              {page.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ))}
        </div>

        {pages.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Страница ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activePage ? 'bg-[#e67e22]' : 'bg-[#e0e0e0]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Десктоп — обычная сетка, без изменений в поведении */}
      <div className="hidden md:grid md:grid-cols-4 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
