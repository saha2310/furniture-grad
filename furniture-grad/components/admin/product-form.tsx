'use client';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageCropField } from '@/components/image-crop-field';
import { GalleryUploadField } from '@/components/gallery-upload-field';
import { Category, Color, Product } from '@/lib/types';
import { useToast } from '@/lib/toast-context';

export function ProductForm({
  action,
  categories,
  colors,
  product,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  colors: Color[];
  product?: Product;
}) {
  const { runWithToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      runWithToast(product ? 'Сохраняем изменения…' : 'Добавляем товар…', () => action(formData));
    });
  };

  return (
    <form action={handleSubmit} className="bg-white p-6 rounded-2xl shadow mb-8 grid grid-cols-2 gap-4 max-md:grid-cols-1">
      {product && (
        <>
          <input type="hidden" name="current_slug" value={product.slug} />
          <input type="hidden" name="current_image" value={product.image || ''} />
        </>
      )}

      <Input name="name" placeholder="Название" defaultValue={product?.name} required />
      <Input name="price" type="number" step="1" min="0" placeholder="Цена, целыми рублями (без копеек)" defaultValue={product?.price} required />
      <Input name="old_price" type="number" step="1" min="0" placeholder="Старая цена, целыми рублями (если есть скидка)" defaultValue={product?.old_price ?? ''} />

      <select
        name="category_id"
        defaultValue={product?.category_id ?? ''}
        className="w-full px-3 py-2 border-2 border-[#b5b5b5] rounded-lg"
      >
        <option value="">Без категории</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select
        name="color_id"
        defaultValue={product?.color_id ?? ''}
        className="w-full px-3 py-2 border-2 border-[#b5b5b5] rounded-lg"
      >
        <option value="">Без цвета</option>
        {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <Input name="size" placeholder="Размер, например 180×90×75 см" defaultValue={product?.size ?? ''} />
      <Input name="material" placeholder="Материал, например массив дуба" defaultValue={product?.material ?? ''} />

      <ImageCropField
        name="image_file"
        label="Основное фото"
        aspect={4 / 3}
        defaultPreview={product?.image}
        removable={!!product}
      />
      <GalleryUploadField name="gallery_files" />

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_new" defaultChecked={product?.is_new} /> Новинка
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} /> Активен
        </label>
      </div>

      <textarea
        name="description"
        placeholder="Описание"
        defaultValue={product?.description ?? ''}
        className="col-span-2 w-full px-3 py-2 border-2 border-[#b5b5b5] rounded-lg max-md:col-span-1"
        rows={3}
      />

      <Button type="submit" disabled={isPending} className="col-span-2 max-md:col-span-1 disabled:opacity-60">
        {product ? 'Сохранить изменения' : 'Добавить товар'}
      </Button>
    </form>
  );
}
