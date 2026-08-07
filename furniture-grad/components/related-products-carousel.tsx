'use client';
import { useRef, useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';

const ITEMS_PER_PAGE = 2;

export function RelatedProductsCarousel({ products }: { products: Product[] }) {
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += ITEMS_PER_PAGE) {
    pages.push(products.slice(i, i + ITEMS_PER_PAGE));
  }

  const [activePage, setActivePage] = useState(0);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const desktopScrollerRef = useRef<HTMLDivElement>(null);

  const onMobileScroll = () => {
    const el = mobileScrollerRef.current;
    if (!el) return;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    setActivePage(page);
  };

  const goToPage = (i: number) => {
    const el = mobileScrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  // Прокрутка ленты товаров колесом мыши при наведении (десктоп) — конвертируем
  // вертикальный скролл в горизонтальный, как в ленте миниатюр галереи.
  useEffect(() => {
    const el = desktopScrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [products.length]);

  return (
    <div>
      {/* Мобильная версия — горизонтальный свайп по страницам, 2 карточки на странице */}
      <div className="md:hidden">
        <div
          ref={mobileScrollerRef}
          onScroll={onMobileScroll}
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

      {/* Десктоп — горизонтальная лента с фиксированной шириной карточек,
          листается ползунком (видимый скроллбар) или колесом мыши, без сжатия. */}
      <div
        ref={desktopScrollerRef}
        className="hidden md:flex gap-6 overflow-x-auto pb-3
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:bg-[#f0f0f0] [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#e67e22] [&::-webkit-scrollbar-thumb]:rounded-full"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#e67e22 #f0f0f0' }}
      >
        {products.map(p => (
          <div key={p.id} className="w-[260px] shrink-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
