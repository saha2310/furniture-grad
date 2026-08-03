import { getWidgets, createWidget } from '@/actions/widgets';
import { getCategories } from '@/actions/categories';
import { WidgetForm } from '@/components/admin/widget-form';
import { WidgetRow } from '@/components/admin/widget-row';

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
          <WidgetRow key={w.id} widget={w} />
        ))}
      </div>
    </div>
  );
}
