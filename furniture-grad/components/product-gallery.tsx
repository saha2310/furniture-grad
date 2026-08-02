'use client';
import { useState } from 'react';
import Image from 'next/image';
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

  return (
    <div className="h-[500px] max-md:h-[300px] flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        {active ? (
          <Image
            src={active}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
            priority
          />
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
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                active === src ? 'border-[#e67e22]' : 'border-transparent'
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
