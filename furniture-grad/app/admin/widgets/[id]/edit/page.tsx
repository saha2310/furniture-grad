import { notFound } from 'next/navigation';
import { getWidgetById, updateWidget } from '@/actions/widgets';
import { getCategories } from '@/actions/categories';
import { WidgetForm } from '@/components/admin/widget-form';
import { Widget } from '@/lib/types';

export default async function EditWidgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let widget: Widget;

  try {
    widget = await getWidgetById(id);
  } catch {
    notFound();
  }

  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Редактировать виджет</h1>
      <WidgetForm action={updateWidget.bind(null, id)} categories={categories} widget={widget} />
    </div>
  );
}
