import { ReactNode } from 'react';
import { Product } from '@/lib/types';

// Отдельный блок "Характеристики" (структура страницы, п.4) — полная таблица
// параметров товара. Отличается от краткой сводки цвет/размер в основном
// блоке справа: сюда добавлены категория, артикул и наличие, чтобы вся
// техническая информация была собрана в одном месте.
export function ProductCharacteristics({ product }: { product: Product }) {
  const rows: { label: string; value: ReactNode }[] = [];

  if (product.categories?.name) rows.push({ label: 'Категория', value: product.categories.name });
  if (product.colors) {
    rows.push({
      label: 'Цвет',
      value: (
        <span className="flex items-center gap-2 justify-self-end">
          <span
            className="w-4 h-4 rounded-full border border-[#999] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] shrink-0"
            style={{ backgroundColor: product.colors.hex }}
          />
          {product.colors.name}
        </span>
      ),
    });
  }
  if (product.size) rows.push({ label: 'Размер', value: product.size });
  if (product.material) rows.push({ label: 'Материал', value: product.material });
  if (product.sku) rows.push({ label: 'Артикул', value: product.sku });
  rows.push({
    label: 'Наличие',
    value: (
      <span className={product.in_stock ? 'text-[#27ae60] font-semibold' : 'text-[#e74c3c] font-semibold'}>
        {product.in_stock ? 'В наличии' : 'Нет в наличии'}
      </span>
    ),
  });

  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#2c3e50] mb-4">Характеристики</h2>
      <div className="text-sm">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-[140px_1fr] gap-3 items-start py-3 border-t border-[#e5e7eb] ${
              i === rows.length - 1 ? 'border-b' : ''
            }`}
          >
            <span className="text-[#64748b] font-medium">{row.label}</span>
            <span className="text-[#2c3e50] font-semibold text-right break-words">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
