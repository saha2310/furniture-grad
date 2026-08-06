'use client';
import { useEffect, useRef, useState } from 'react';
import { ProductImage } from '@/lib/types';
import { ImagePlaceholder } from '@/components/image-placeholder';

const SWIPE_THRESHOLD = 50;

export function ProductGallery({
  mainImage,
  name,
  gallery,
}: {
  mainImage: string | null;
  name: string;
  gallery: ProductImage[];
}) {
  const images = [mainImage, ...gallery.map(g => g.image)].filter(Boolean) as string[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Прогреваем кэш браузера сразу при открытии товара — все фото качаются
  // в фоне один раз, поэтому клик по миниатюре просто мгновенно
  // переключает уже загруженную картинку, а не скачивает её заново.
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Закрытие лайтбокса по Escape, листание стрелками клавиатуры.
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  // Сбрасываем зум при переключении фото (стрелками/клавиатурой/свайпом),
  // чтобы следующее фото всегда открывалось в обычном масштабе.
  useEffect(() => {
    setZoomed(false);
  }, [activeIndex]);

  // Пока открыт лайтбокс — блокируем скролл страницы (колесо мыши и свайп),
  // и возвращаем как было при закрытии крестиком/Escape.
  useEffect(() => {
    if (!lightboxOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [lightboxOpen]);

  // Прокрутка ленты миниатюр колесом мыши при наведении — конвертируем
  // вертикальный скролл в горизонтальный. Слушатель навешан вручную (не через
  // onWheel), чтобы preventDefault реально сработал: React по умолчанию
  // регистрирует wheel как passive и глушит preventDefault внутри JSX-пропса.
  useEffect(() => {
    const el = thumbnailsRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex flex-col min-w-0">
        <div className="relative aspect-square md:aspect-auto md:h-[500px] overflow-hidden bg-[#f0f0f0]">
          <ImagePlaceholder className="w-full h-full" />
        </div>
      </div>
    );
  }

  const active = images[activeIndex];

  const prevImage = () => setActiveIndex(i => (i - 1 + images.length) % images.length);
  const nextImage = () => setActiveIndex(i => (i + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) prevImage();
      else nextImage();
    }
    setTouchStartX(null);
  };

  const arrows = images.length > 1 && (
    <>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          prevImage();
        }}
        aria-label="Предыдущее фото"
        className="absolute z-10 left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-xl text-[#2c3e50] shadow-md transition-colors"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          nextImage();
        }}
        aria-label="Следующее фото"
        className="absolute z-10 right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-xl text-[#2c3e50] shadow-md transition-colors"
      >
        ›
      </button>
    </>
  );

  return (
    <div className="flex flex-col min-w-0">
      <div
        className="relative aspect-square md:aspect-auto md:h-[500px] overflow-hidden bg-[#f0f0f0] cursor-zoom-in"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        <img src={active} alt={name} className="w-full h-full object-contain" />
        {arrows}
        {images.length > 1 && (
          <div className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-white bg-black/60 rounded-full px-2.5 py-1">
              {activeIndex + 1} / {images.length}
            </span>
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  aria-label={`Фото ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === activeIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="flex gap-2 p-3 overflow-x-auto bg-[#f8f9fa]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-[#e67e22]' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Закрыть"
            className="absolute z-20 top-4 right-4 w-11 h-11 flex items-center justify-center text-4xl leading-none text-white/90 hover:text-white transition-colors"
          >
            ×
          </button>
          <div
            className={`relative w-full h-full flex items-center justify-center p-4 md:p-12 ${
              zoomed ? 'overflow-auto' : 'overflow-hidden'
            }`}
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={active}
              alt={name}
              onClick={e => {
                e.stopPropagation();
                setZoomed(z => !z);
              }}
              className={
                zoomed
                  ? 'max-w-none max-h-none w-auto h-auto cursor-zoom-out'
                  : 'max-w-full max-h-full object-contain cursor-zoom-in'
              }
            />
            {!zoomed && arrows}
          </div>
        </div>
      )}
    </div>
  );
}
