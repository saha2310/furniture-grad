import Image from 'next/image';
import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import { getSettings } from '@/actions/settings';
import { CategoryTile } from '@/components/category-tile';
import { NewArrivals } from '@/components/new-arrivals';
import { isOptimizableImageUrl } from '@/lib/utils';

export default async function HomePage() {
  const [categories, newProducts, settings] = await Promise.all([
    getCategories(),
    getProducts({ isNew: true }),
    getSettings(),
  ]);

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        {settings.hero_image ? (
          <>
            {isOptimizableImageUrl(settings.hero_image) ? (
              <Image
                src={settings.hero_image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.hero_image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c3e50] to-[#4a3524]" />
        )}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg max-md:text-3xl">
            Создайте уют в своём доме
          </h1>
          <p className="text-xl opacity-90 max-md:text-base">
            Качественная мебель по доступным ценам с доставкой по всей стране
          </p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-[1400px] mx-auto">
        <h2 className="text-3xl font-bold text-[#2c3e50] mb-8">📂 Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map(cat => (
            <CategoryTile key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      <NewArrivals products={newProducts} />
    </>
  );
}
