'use client';
import { Contact } from '@/lib/types';
import { deleteContact } from '@/actions/contacts';
import { Button } from '@/components/ui/button';
import { DeletableRow } from '@/components/admin/deletable-row';

export function ContactRow({ contact }: { contact: Contact }) {
  return (
    <DeletableRow onDelete={() => deleteContact(contact.id)} toastLabel="Удаляем контакт…">
      {({ onDeleteClick, rowClassName }) => (
        <div className={`flex items-center justify-between p-4 border-b border-[#eee] last:border-0 ${rowClassName}`}>
          <div>
            <div className="font-bold text-[#2c3e50]">{contact.label}</div>
            <div className="text-sm text-[#7f8c8d]">{contact.value}</div>
          </div>
          <Button variant="outline" className="text-red-500 hover:border-red-500" onClick={onDeleteClick}>
            Удалить
          </Button>
        </div>
      )}
    </DeletableRow>
  );
}
