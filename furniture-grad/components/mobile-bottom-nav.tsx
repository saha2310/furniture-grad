'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContactModal } from '@/lib/contact-modal-context';

const items = [
  { href: '/', label: 'Главная', icon: '🏠' },
  { href: '/catalog', label: 'Каталог', icon: '📂' },
  { href: '/favorites', label: 'Избранное', icon: '♡' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { open } = useContactModal();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[900] bg-white border-t border-[#eee] flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map(item => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${
              active ? 'text-[#e67e22]' : 'text-[#7f8c8d]'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={open}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-[#7f8c8d]"
      >
        <span className="text-lg leading-none">💬</span>
        Связаться
      </button>
    </nav>
  );
}
