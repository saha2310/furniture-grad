'use client';
import Link from 'next/link';
import { Widget } from '@/lib/types';
import { deleteWidget } from '@/actions/widgets';
import { Button } from '@/components/ui/button';
import { DeletableRow } from '@/components/admin/deletable-row';

export function WidgetRow({ widget }: { widget: Widget }) {
  return (
    <DeletableRow onDelete={() => deleteWidget(widget.id)} toastLabel="Удаляем виджет…">
      {({ onDeleteClick, rowClassName }) => (
        <div className={`bg-white p-6 rounded-2xl shadow flex justify-between items-center ${rowClassName}`}>
          <div>
            <div className="font-bold text-lg text-[#2c3e50]">{widget.name}</div>
            <div className="text-sm text-[#95a5a6] mt-1">Порядок: {widget.sort_order}</div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/widgets/${widget.id}/edit`}>
              <Button variant="outline">Редактировать</Button>
            </Link>
            <Button variant="outline" className="text-red-500 hover:border-red-500" onClick={onDeleteClick}>
              Удалить
            </Button>
          </div>
        </div>
      )}
    </DeletableRow>
  );
}
