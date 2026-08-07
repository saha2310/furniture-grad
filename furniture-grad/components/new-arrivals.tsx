import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';

export function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="flex items-center gap-2 text-3xl font-bold text-[#2c3e50]">
          <span className="text-2xl">✨</span> Новинки
        </h2>
        <Link
          href="/catalog?new=1"
          className="text-sm font-semibold text-[#2c3e50] hover:text-[#e67e22] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          Смотреть все <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 3).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

