import Link from 'next/link';
import { getCategories, createCategory, deleteCategory } from '@/actions/categories';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/components/admin/category-form';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Категории</h1>

      <CategoryForm action={createCategory} />

      <div className="bg-white rounded-2xl shadow">
        {categories.map(c => (
          <div key={c.id} className="flex justify-between items-center p-4 border-b border-[#eee] last:border-0">
            <div>
              <div className="font-bold text-[#2c3e50]">{c.name}</div>
              <div className="text-sm text-[#95a5a6]">/{c.slug}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/categories/${c.id}/edit`}>
                <Button variant="outline">Редактировать</Button>
              </Link>
              <form action={deleteCategory.bind(null, c.id)}>
                <Button variant="outline" className="text-red-500 hover:border-red-500">Удалить</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
