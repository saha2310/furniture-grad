'use client';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { deleteCategory } from '@/actions/categories';
import { Button } from '@/components/ui/button';
import { DeletableRow } from '@/components/admin/deletable-row';

export function CategoryRow({ category }: { category: Category }) {
  return (
    <DeletableRow onDelete={() => deleteCategory(category.id)} toastLabel="Удаляем категорию…">
      {({ onDeleteClick, rowClassName }) => (
        <div className={`flex justify-between items-center p-4 border-b border-[#eee] last:border-0 ${rowClassName}`}>
          <div>
            <div className="font-bold text-[#2c3e50]">{category.name}</div>
            <div className="text-sm text-[#95a5a6]">/{category.slug}</div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/categories/${category.id}/edit`}>
              <Button variant="outline">Редактировать</Button>
            </Link>
            <Button variant="outline" className="text-red-500 hover:border-red-500" onClick={onDeleteClick}>
              Удалить
            </Button>
          </div>
        </div>
      )}
    </DeletableRow>
  );
}
