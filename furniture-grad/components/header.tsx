'use client';
import Link from 'next/link';
import { useContactModal } from '@/lib/contact-modal-context';
import { useFavorites } from '@/lib/favorites-context';

export function Header({ shopName }: { shopName: string }) {
  const { open } = useContactModal();
  const { ids } = useFavorites();

  return (
    <header className="bg-gradient-to-r from-[#2c3e50] to-[#1a252f] text-white px-10 py-5 flex justify-between items-center sticky top-0 z-[100] shadow-[0_2px_20px_rgba(0,0,0,0.3)] max-md:px-5">
      <Link href="/" className="text-[28px] font-bold tracking-wide">{shopName}</Link>
      <nav className="flex gap-6 items-center max-md:hidden">
        <Link href="/" className="hover:text-[#e67e22] transition-colors">Главная</Link>
        <Link href="/catalog" className="hover:text-[#e67e22] transition-colors">Каталог</Link>
        <Link href="/favorites" className="hover:text-[#e67e22] transition-colors flex items-center gap-1">
          ♥ Избранное{ids.length > 0 && <span className="text-xs bg-[#e67e22] rounded-full px-1.5 py-0.5">{ids.length}</span>}
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/favorites" className="md:hidden relative w-10 h-10 flex items-center justify-center text-xl">
          ♥
          {ids.length > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] bg-[#e67e22] rounded-full w-4 h-4 flex items-center justify-center">
              {ids.length}
            </span>
          )}
        </Link>
        <button
          onClick={open}
          className="bg-[#e67e22] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#d35400] hover:scale-105 transition-all max-md:px-4 max-md:py-2 max-md:text-sm"
        >
          💬 Связаться с продавцом
        </button>
      </div>
    </header>
  );
}
