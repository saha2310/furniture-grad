'use client';
import { useState } from 'react';
import { ProductImage } from '@/lib/types';
import { deleteProductImage } from '@/actions/products';
import { useToast } from '@/lib/toast-context';

export function ExistingGallery({ productId, images }: { productId: string; images: ProductImage[] }) {
  const { runWithToast } = useToast();
  const [items, setItems] = useState(images);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleDelete = (imageId: string, image: ProductImage) => {
    setRemovingId(imageId);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== imageId));
      runWithToast('Удаляем фото…', () => deleteProductImage(imageId, productId)).then(success => {
        // Не удалось удалить на сервере — возвращаем фото в галерею.
        if (!success) {
          setItems(prev => (prev.some(i => i.id === image.id) ? prev : [...prev, image]));
          setRemovingId(null);
        }
      });
    }, 200);
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-bold text-[#2c3e50] mb-4">Дополнительные фото</h2>
      <div className="flex flex-wrap gap-3">
        {items.map(img => (
          <div
            key={img.id}
            className={`relative group transition-all duration-200 ease-out ${
              removingId === img.id ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            <img src={img.image} alt="" className="w-24 h-24 object-cover rounded-lg border border-[#b5b5b5]" />
            <button
              type="button"
              onClick={() => handleDelete(img.id, img)}
              aria-label="Удалить фото"
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md text-red-500 text-sm leading-none border border-[#ddd] opacity-80 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-50 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
