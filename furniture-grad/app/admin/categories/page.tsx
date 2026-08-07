import { getAllCategoriesForAdmin, createCategory } from '@/actions/categories';
import { CategoryForm } from '@/components/admin/category-form';
import { CategoryRow } from '@/components/admin/category-row';

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesForAdmin();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Категории</h1>

      <CategoryForm action={createCategory} />

      <div className="bg-white rounded-2xl shadow">
        {categories.map(c => (
          <CategoryRow key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
