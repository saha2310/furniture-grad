import Link from 'next/link';
import { getWidgets, createWidget, deleteWidget } from '@/actions/widgets';
import { getCategories } from '@/actions/categories';
import { Button } from '@/components/ui/button';
import { WidgetForm } from '@/components/admin/widget-form';
import { DeletableRow } from '@/components/admin/deletable-row';

export default async function AdminWidgetsPage() {
  const [widgets, categories] = await Promise.all([
    getWidgets(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Виджеты</h1>

      <WidgetForm action={createWidget} categories={categories} />

      <div className="grid gap-4">
        {widgets.map(w => (
          <DeletableRow key={w.id} onDelete={deleteWidget.bind(null, w.id)} toastLabel="Удаляем виджет…">
            {({ onDeleteClick, rowClassName }) => (
              <div className={`bg-white p-6 rounded-2xl shadow flex justify-between items-center ${rowClassName}`}>
                <div>
                  <div className="font-bold text-lg text-[#2c3e50]">{w.name}</div>
                  <div className="text-sm text-[#95a5a6] mt-1">Порядок: {w.sort_order}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/widgets/${w.id}/edit`}>
                    <Button variant="outline">Редактировать</Button>
                  </Link>
                  <Button variant="outline" className="text-red-500 hover:border-red-500" onClick={onDeleteClick}>
                    Удалить
                  </Button>
                </div>
              </div>
            )}
          </DeletableRow>
        ))}
      </div>
    </div>
  );
}
