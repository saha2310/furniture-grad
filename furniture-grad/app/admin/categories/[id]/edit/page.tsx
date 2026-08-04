import { notFound } from 'next/navigation';
import { getCategoryById, updateCategory } from '@/actions/categories';
import { CategoryForm } from '@/components/admin/category-form';
import { Category } from '@/lib/types';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let category: Category;

  try {
    category = await getCategoryById(id);
  } catch {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Редактировать категорию</h1>
      <CategoryForm action={updateCategory.bind(null, id)} category={category} />
    </div>
  );
}
