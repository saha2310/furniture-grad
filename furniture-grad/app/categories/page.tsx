import { getCategories } from '@/actions/categories';
import { CategoryTile } from '@/components/category-tile';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Категории</h1>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-[#95a5a6] text-lg">Категории пока не добавлены</div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map(cat => (
            <CategoryTile key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
