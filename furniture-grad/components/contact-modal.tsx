'use client';
import { Contact } from '@/lib/types';

export function ContactModal({
  open,
  onClose,
  shopName,
  contacts,
}: {
  open: boolean;
  onClose: () => void;
  shopName: string;
  contacts: Contact[];
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-[90%] max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#eee] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#2c3e50]">{shopName}</h2>
          <button onClick={onClose} className="text-3xl text-[#95a5a6] hover:text-[#e74c3c] transition-colors">
            ×
          </button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {contacts.length === 0 ? (
            <div className="text-center py-6 text-[#95a5a6]">
              Продавец пока не указал контакты
            </div>
          ) : (
            contacts.map(c =>
              c.href ? (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-xl hover:bg-[#eee] transition-colors"
                >
                  <span className="font-bold text-[#2c3e50]">{c.label}</span>
                  <span className="text-[#e67e22]">{c.value}</span>
                </a>
              ) : (
                <div key={c.id} className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-xl">
                  <span className="font-bold text-[#2c3e50]">{c.label}</span>
                  <span className="text-[#e67e22]">{c.value}</span>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
