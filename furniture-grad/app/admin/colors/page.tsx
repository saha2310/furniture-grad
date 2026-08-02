import { getColors, createColor, deleteColor } from '@/actions/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function AdminColorsPage() {
  const colors = await getColors();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Цвета</h1>
      <p className="text-[#7f8c8d] mb-6 max-w-[500px]">
        Эти цвета можно выбирать при создании товара — так фильтр «цвет» в каталоге
        реально работает, а не просто текст.
      </p>

      <form action={createColor} className="bg-white p-6 rounded-2xl shadow mb-8 flex gap-4 items-end max-md:flex-col max-md:items-stretch">
        <div className="flex-1">
          <label className="text-sm text-[#7f8c8d] block mb-1">Название</label>
          <Input name="name" placeholder="Например, Ореховый" required />
        </div>
        <div>
          <label className="text-sm text-[#7f8c8d] block mb-1">Цвет</label>
          <input type="color" name="hex" defaultValue="#cccccc" className="w-16 h-10 rounded-lg border-2 border-[#ddd] cursor-pointer" />
        </div>
        <Button type="submit">Добавить</Button>
      </form>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f8f9fa]">
            <tr>
              <th className="text-left p-4">Цвет</th>
              <th className="text-left p-4">Название</th>
              <th className="p-4 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {colors.map(c => (
              <tr key={c.id} className="border-t border-[#eee]">
                <td className="p-4">
                  <span className="inline-block w-6 h-6 rounded-full border border-[#ddd]" style={{ backgroundColor: c.hex }} />
                </td>
                <td className="p-4">{c.name}</td>
                <td className="p-4">
                  <form action={deleteColor.bind(null, c.id)}>
                    <Button variant="outline" className="text-red-500 hover:border-red-500">Удалить</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
