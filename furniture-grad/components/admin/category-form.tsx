'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageCropField } from '@/components/image-crop-field';
import { Category } from '@/lib/types';

export function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => void;
  category?: Category;
}) {
  return (
    <form action={action} className="bg-white p-6 rounded-2xl shadow mb-8 grid grid-cols-3 gap-4 max-md:grid-cols-1">
      {category && (
        <>
          <input type="hidden" name="current_slug" value={category.slug} />
          <input type="hidden" name="current_image" value={category.image || ''} />
        </>
      )}

      <Input name="name" placeholder="Название" defaultValue={category?.name} required />

      <ImageCropField
        name="image_file"
        label="Изображение"
        aspect={4 / 3}
        defaultPreview={category?.image}
      />

      <Input name="sort_order" type="number" placeholder="Порядок" defaultValue={category?.sort_order ?? 0} />

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} className="w-5 h-5 accent-[#e67e22]" />
        <label>Активна</label>
      </div>

      <textarea
        name="description"
        placeholder="Описание (необязательно)"
        defaultValue={category?.description ?? ''}
        className="col-span-3 w-full px-3 py-2 border-2 border-[#ddd] rounded-lg max-md:col-span-1"
        rows={2}
      />

      <Button type="submit" className="col-span-3 max-md:col-span-1 w-fit">
        {category ? 'Сохранить изменения' : 'Добавить'}
      </Button>
    </form>
  );
}
