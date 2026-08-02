'use client';
import { useState } from 'react';
import { ProductImage } from '@/lib/types';

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
  const [active, setActive] = useState(images[0] || '/placeholder.jpg');

  return (
    <div className="h-[500px] max-md:h-[300px] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <img src={active} alt={name} className="w-full h-full object-cover" />
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
