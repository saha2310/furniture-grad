'use client';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageCropField } from '@/components/image-crop-field';
import { Category, Widget } from '@/lib/types';
import { useToast } from '@/lib/toast-context';

export function WidgetForm({
  action,
  categories,
  widget,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  widget?: Widget;
}) {
  const { runWithToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      runWithToast(widget ? 'Сохраняем изменения…' : 'Добавляем виджет…', () => action(formData));
    });
  };

  return (
    <form action={handleSubmit} className="bg-white p-6 rounded-2xl shadow mb-8 grid gap-4">
      {widget && <input type="hidden" name="current_image" value={widget.image || ''} />}

      <Input name="name" placeholder="Название виджета" defaultValue={widget?.name} required />

      <ImageCropField
        name="image_file"
        label="Изображение"
        aspect={16 / 9}
        defaultPreview={widget?.image}
        removable={!!widget}
      />

      <Input name="sort_order" type="number" placeholder="Порядок" defaultValue={widget?.sort_order ?? 0} />

      <div>
        <div className="text-sm font-bold text-[#2c3e50] mb-2">Категории:</div>
        <div className="flex flex-wrap gap-3">
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="category_ids"
                value={c.id}
                defaultChecked={widget?.category_ids?.includes(c.id)}
                className="accent-[#e67e22]"
              />
              <span className="text-sm">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_visible" defaultChecked={widget?.is_visible ?? true} className="w-5 h-5 accent-[#e67e22]" />
        <label>Видимый</label>
      </div>

      <Button type="submit" disabled={isPending} className="w-fit disabled:opacity-60">
        {widget ? 'Сохранить изменения' : 'Добавить виджет'}
      </Button>
    </form>
  );
}
