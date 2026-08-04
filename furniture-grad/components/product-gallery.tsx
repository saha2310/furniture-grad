'use client';
import { useEffect, useRef, useState } from 'react';
import { ProductImage } from '@/lib/types';
import { ImagePlaceholder } from '@/components/image-placeholder';

const SWIPE_THRESHOLD = 50;
const DRAG_THRESHOLD = 5;

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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

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

  if (images.length === 0) {
    return (
      <div className="flex flex-col">
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

  // Прокрутка полосы миниатюр зажатой мышью — на реальном телефоне свайп
  // работает нативно, но мышью (десктоп, эмуляторы устройств) тянуть
  // без этого нельзя, т.к. overflow-x:auto сам по себе не реагирует на drag.
  const handleThumbsMouseDown = (e: React.MouseEvent) => {
    const el = thumbsRef.current;
    if (!el) return;
    dragState.current = { isDown: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false };
  };

  const handleThumbsMouseMove = (e: React.MouseEvent) => {
    const el = thumbsRef.current;
    if (!el || !dragState.current.isDown) return;
    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const endThumbsDrag = () => {
    dragState.current.isDown = false;
  };

  const handleThumbClick = (i: number) => {
    // Если это был drag, а не клик — не переключаем фото.
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    setActiveIndex(i);
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
    <div className="flex flex-col">
      <div
        className="relative aspect-square md:aspect-auto md:h-[500px] overflow-hidden bg-[#f0f0f0] cursor-zoom-in"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        <img src={active} alt={name} className="w-full h-full object-contain" />
        {arrows}
      </div>
      {images.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 p-3 overflow-x-auto bg-[#f8f9fa] cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onMouseDown={handleThumbsMouseDown}
          onMouseMove={handleThumbsMouseMove}
          onMouseUp={endThumbsDrag}
          onMouseLeave={endThumbsDrag}
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleThumbClick(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-[#e67e22]' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
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
            className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={active} alt={name} className="max-w-full max-h-full object-contain" />
            {arrows}
          </div>
        </div>
      )}
    </div>
  );
}
