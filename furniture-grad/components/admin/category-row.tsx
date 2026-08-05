'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Category } from '@/lib/types';
import { deleteCategory, toggleCategoryActive } from '@/actions/categories';
import { Button } from '@/components/ui/button';
import { DeletableRow } from '@/components/admin/deletable-row';
import { useToast } from '@/lib/toast-context';

export function CategoryRow({ category }: { category: Category }) {
  const { runWithToast } = useToast();
  const [isActive, setIsActive] = useState(category.is_active);

  const handleToggle = () => {
    const next = !isActive;
    setIsActive(next); // мгновенно меняем состояние в интерфейсе
    runWithToast(next ? 'Показываем категорию…' : 'Скрываем категорию…', () => toggleCategoryActive(category.id, next));
  };

  return (
    <DeletableRow onDelete={() => deleteCategory(category.id)} toastLabel="Удаляем категорию…">
      {({ onDeleteClick, rowClassName }) => (
        <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b border-[#eee] last:border-0 ${!isActive ? 'opacity-50' : ''} ${rowClassName}`}>
          <div>
            <div className="font-bold text-[#2c3e50]">{category.name}</div>
            <div className="text-sm text-[#95a5a6]">/{category.slug}{!isActive && ' · скрыта'}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleToggle}>
              {isActive ? 'Скрыть' : 'Показать'}
            </Button>
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
