'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Widget } from '@/lib/types';
import { deleteWidget, toggleWidgetVisible } from '@/actions/widgets';
import { Button } from '@/components/ui/button';
import { DeletableRow } from '@/components/admin/deletable-row';
import { useToast } from '@/lib/toast-context';

export function WidgetRow({ widget }: { widget: Widget }) {
  const { runWithToast } = useToast();
  const [isVisible, setIsVisible] = useState(widget.is_visible);

  const handleToggle = () => {
    const next = !isVisible;
    setIsVisible(next); // мгновенно меняем состояние в интерфейсе
    runWithToast(next ? 'Показываем виджет…' : 'Скрываем виджет…', () => toggleWidgetVisible(widget.id, next));
  };

  return (
    <DeletableRow onDelete={() => deleteWidget(widget.id)} toastLabel="Удаляем виджет…">
      {({ onDeleteClick, rowClassName }) => (
        <div className={`bg-white p-6 rounded-2xl shadow flex justify-between items-center ${!isVisible ? 'opacity-50' : ''} ${rowClassName}`}>
          <div>
            <div className="font-bold text-lg text-[#2c3e50]">{widget.name}</div>
            <div className="text-sm text-[#95a5a6] mt-1">Порядок: {widget.sort_order}{!isVisible && ' · скрыт'}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleToggle}>
              {isVisible ? 'Скрыть' : 'Показать'}
            </Button>
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
