import { getColors, createColor } from '@/actions/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorRow } from '@/components/admin/color-row';
import { ToastForm } from '@/components/admin/toast-form';

export default async function AdminColorsPage() {
  const colors = await getColors();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Цвета</h1>
      <p className="text-[#7f8c8d] mb-6 max-w-[500px]">
        Эти цвета можно выбирать при создании товара — так фильтр «цвет» в каталоге
        реально работает, а не просто текст.
      </p>

      <ToastForm action={createColor} toastLabel="Добавляем цвет…" className="bg-white p-6 rounded-2xl shadow mb-8 flex gap-4 items-end max-md:flex-col max-md:items-stretch">
        <div className="flex-1">
          <label className="text-sm text-[#7f8c8d] block mb-1">Название</label>
          <Input name="name" placeholder="Например, Ореховый" required />
        </div>
        <div>
          <label className="text-sm text-[#7f8c8d] block mb-1">Цвет</label>
          <input type="color" name="hex" defaultValue="#cccccc" className="w-16 h-10 rounded-lg border-2 border-[#b5b5b5] cursor-pointer" />
        </div>
        <Button type="submit">Добавить</Button>
      </ToastForm>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full min-w-[360px]">
          <thead className="bg-[#f8f9fa]">
            <tr>
              <th className="text-left p-4">Цвет</th>
              <th className="text-left p-4">Название</th>
              <th className="p-4 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {colors.map(c => (
              <ColorRow key={c.id} color={c} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
