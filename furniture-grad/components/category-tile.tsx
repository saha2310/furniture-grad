import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { ImagePlaceholder } from '@/components/image-placeholder';
import { isOptimizableImageUrl } from '@/lib/utils';

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/catalog?category=${category.id}`}
      className="group bg-white rounded-2xl p-3 md:p-4 flex flex-col items-center gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f5f1ea]">
        {category.image ? (
          isOptimizableImageUrl(category.image) ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 25vw, 12vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )
        ) : (
          <ImagePlaceholder className="w-full h-full" />
        )}
      </div>
      <h3 className="text-sm md:text-base font-bold text-[#2c3e50] text-center leading-tight break-words">
        {category.name}
      </h3>
    </Link>
  );
}

