import Image from 'next/image';
import Link from 'next/link';
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
      <section className="max-w-[1400px] mx-auto px-4 pt-6 md:pt-8">
        <div className="relative rounded-[2rem] overflow-hidden bg-[#f3ede3] min-h-[320px] md:min-h-[420px] flex items-end justify-center">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </>
          ) : (
            // Декоративная композиция вместо фото — та же цветовая пара
            // бренда (тёмно-синий + оранжевый), что и в шапке/кнопках.
            <div className="absolute inset-0 overflow-hidden" aria-hidden>
              <div className="absolute -top-20 -left-20 w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#e67e22]" />
              <div className="absolute -bottom-24 -right-16 w-72 h-72 md:w-80 md:h-80 rounded-full bg-[#e67e22]/90" />
              <div
                className="absolute bottom-0 left-0 w-full h-2/3 bg-[#2c3e50]"
                style={{ clipPath: 'ellipse(65% 100% at 30% 100%)' }}
              />
            </div>
          )}

          <Link
            href="/catalog"
            className="relative z-10 mb-10 md:mb-14 inline-flex items-center justify-center bg-[#e67e22] text-white font-extrabold text-xl md:text-3xl uppercase px-10 py-4 md:px-16 md:py-6 rounded-full shadow-[0_10px_30px_rgba(230,126,34,0.4)] hover:bg-[#d35400] hover:scale-105 transition-all duration-300"
          >
            Каталог
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="flex items-center gap-2 text-3xl font-bold text-[#2c3e50]">
            <span className="grid grid-cols-2 gap-1" aria-hidden>
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#e67e22]" />
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#e67e22]" />
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#e67e22]" />
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#e67e22]" />
            </span>
            Категории
          </h2>
          <Link
            href="/categories"
            className="text-sm font-semibold text-[#2c3e50] hover:text-[#e67e22] transition-colors whitespace-nowrap flex items-center gap-1"
          >
            Все категории <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(cat => (
            <CategoryTile key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      <NewArrivals products={newProducts} />
    </>
  );
}

