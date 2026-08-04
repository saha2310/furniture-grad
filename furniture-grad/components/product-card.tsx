'use client';
import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { useContactModal } from '@/lib/contact-modal-context';
import { ImagePlaceholder } from '@/components/image-placeholder';
import { FavoriteButton } from '@/components/favorite-button';
import { isOptimizableImageUrl } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const { open } = useContactModal();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] group">
      <Link href={`/catalog/${product.slug}`} className="block relative h-[220px] overflow-hidden">
        {product.image ? (
          isOptimizableImageUrl(product.image) ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            // Ссылка не с *.supabase.co (например, старые данные с внешним URL) —
            // next/image упал бы с ошибкой "hostname is not configured".
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )
        ) : (
          <ImagePlaceholder className="w-full h-full" />
        )}
        <FavoriteButton productId={product.id} className="absolute top-2 right-2 w-9 h-9" />
      </Link>
      <div className="p-5 bg-[#f8f9fa] border border-[#e67e22] rounded-b-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-[#e67e22] font-bold uppercase tracking-wider">
            {product.categories?.name || 'Мебель'}
          </div>
          {product.colors && (
            <span
              className="w-4 h-4 rounded-full border border-[#999] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] shrink-0"
              style={{ backgroundColor: product.colors.hex }}
              title={product.colors.name}
            />
          )}
        </div>
        <Link href={`/catalog/${product.slug}`}>
          <h3 className="text-lg font-bold text-[#2c3e50] mb-2 leading-tight hover:text-[#e67e22] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[#7f8c8d] mb-4 line-clamp-2">{product.description}</p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-[22px] font-extrabold text-[#2c3e50]">
            {product.price.toLocaleString('ru-RU')} ₽
            {product.old_price && (
              <span className="text-sm text-[#95a5a6] line-through ml-2 font-normal">
                {product.old_price.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
          <button
            onClick={open}
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 bg-[#e67e22] text-white hover:bg-[#d35400] hover:scale-105 self-start sm:self-auto"
          >
            Связаться
          </button>
        </div>
      </div>
    </div>
  );
}
