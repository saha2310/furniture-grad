'use client';
import { useEffect, useState } from 'react';
import { useFavorites } from '@/lib/favorites-context';
import { getProductsByIds } from '@/actions/products';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    getProductsByIds(ids).then(setProducts);
  }, [ids]);

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">♥ Избранное</h1>

      {products === null ? (
        <p className="text-[#7f8c8d]">Загрузка…</p>
      ) : products.length === 0 ? (
        <p className="text-[#7f8c8d]">
          Пока пусто. Нажмите на сердечко на карточке товара, чтобы добавить его сюда.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
