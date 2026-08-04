'use client';
import { Color } from '@/lib/types';
import { deleteColor } from '@/actions/colors';
import { Button } from '@/components/ui/button';
import { DeletableRow } from '@/components/admin/deletable-row';

export function ColorRow({ color }: { color: Color }) {
  return (
    <DeletableRow onDelete={() => deleteColor(color.id)} toastLabel="Удаляем цвет…">
      {({ onDeleteClick, rowClassName }) => (
        <tr className={`border-t border-[#eee] ${rowClassName}`}>
          <td className="p-4">
            <span
              className="inline-block w-6 h-6 rounded-full border border-[#999] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
              style={{ backgroundColor: color.hex }}
            />
          </td>
          <td className="p-4">{color.name}</td>
          <td className="p-4">
            <Button variant="outline" className="text-red-500 hover:border-red-500" onClick={onDeleteClick}>
              Удалить
            </Button>
          </td>
        </tr>
      )}
    </DeletableRow>
  );
}
