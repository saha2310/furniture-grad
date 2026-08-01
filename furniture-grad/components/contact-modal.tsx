'use client';

export function ContactModal({
  open,
  onClose,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  settings: Record<string, string>;
}) {
  if (!open) return null;

  const rows = [
    settings.seller_phone && {
      label: 'Телефон',
      value: settings.seller_phone,
      href: `tel:${settings.seller_phone.replace(/[^\d+]/g, '')}`,
    },
    settings.seller_email && {
      label: 'Email',
      value: settings.seller_email,
      href: `mailto:${settings.seller_email}`,
    },
    settings.seller_telegram && {
      label: 'Telegram',
      value: settings.seller_telegram,
      href: settings.seller_telegram.startsWith('http')
        ? settings.seller_telegram
        : `https://t.me/${settings.seller_telegram.replace('@', '')}`,
    },
    settings.seller_whatsapp && {
      label: 'WhatsApp',
      value: settings.seller_whatsapp,
      href: `https://wa.me/${settings.seller_whatsapp.replace(/[^\d]/g, '')}`,
    },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-[90%] max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#eee] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#2c3e50]">
            {settings.seller_name || 'Продавец'}
          </h2>
          <button onClick={onClose} className="text-3xl text-[#95a5a6] hover:text-[#e74c3c] transition-colors">
            ×
          </button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {rows.length === 0 ? (
            <div className="text-center py-6 text-[#95a5a6]">
              Продавец пока не указал контакты
            </div>
          ) : (
            rows.map(r => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-xl hover:bg-[#eee] transition-colors"
              >
                <span className="font-bold text-[#2c3e50]">{r.label}</span>
                <span className="text-[#e67e22]">{r.value}</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
