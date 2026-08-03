'use client';
import { useEffect, useState } from 'react';
import { ProductImage } from '@/lib/types';
import { ImagePlaceholder } from '@/components/image-placeholder';

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
  const [active, setActive] = useState<string | null>(images[0] || null);

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

  return (
    <div className="h-[500px] max-md:h-[300px] flex flex-col">
      <div className="relative flex-1 overflow-hidden bg-[#f0f0f0]">
        {active ? (
          <img src={active} alt={name} className="w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder className="w-full h-full" />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-[#f8f9fa]">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(src)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                active === src ? 'border-[#e67e22]' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
