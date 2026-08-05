'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { deleteProduct, toggleProductActive } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { DeletableRow } from '@/components/admin/deletable-row';
import { useToast } from '@/lib/toast-context';

export function ProductRow({ product }: { product: Product }) {
  const { runWithToast } = useToast();
  const [isActive, setIsActive] = useState(product.is_active);

  const handleToggle = () => {
    const next = !isActive;
    setIsActive(next); // мгновенно меняем состояние в интерфейсе
    runWithToast(next ? 'Показываем товар…' : 'Скрываем товар…', () => toggleProductActive(product.id, next));
  };

  return (
    <DeletableRow onDelete={() => deleteProduct(product.id)} toastLabel="Удаляем товар…">
      {({ onDeleteClick, rowClassName }) => (
        <tr className={`border-t border-[#eee] ${!isActive ? 'opacity-50' : ''} ${rowClassName}`}>
          <td className="p-4">{product.name}</td>
          <td className="p-4">{product.price.toLocaleString('ru-RU')} ₽</td>
          <td className="p-4">{product.categories?.name || '—'}</td>
          <td className="p-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={handleToggle}>
              {isActive ? 'Скрыть' : 'Показать'}
            </Button>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Button variant="outline">Редактировать</Button>
            </Link>
            <Button variant="outline" className="text-red-500 hover:border-red-500" onClick={onDeleteClick}>
              Удалить
            </Button>
          </td>
        </tr>
      )}
    </DeletableRow>
  );
}
