'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useContactModal } from '@/lib/contact-modal-context';
import { useFavorites } from '@/lib/favorites-context';

export function Header({ shopName }: { shopName: string }) {
  const { open } = useContactModal();
  const { ids } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);

  const favoritesLink = (
    <Link
      href="/favorites"
      aria-label="Избранное"
      className="relative flex items-center justify-center w-11 h-11 max-md:w-9 max-md:h-9 rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-white/50 transition-colors shrink-0"
    >
      <span className="text-xl max-md:text-lg leading-none">♥</span>
      {ids.length > 0 && (
        <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-[#e67e22] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          {ids.length}
        </span>
      )}
    </Link>
  );

  return (
    <header className="bg-gradient-to-r from-[#2c3e50] to-[#1a252f] text-white sticky top-0 z-[100] shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div className="px-10 py-5 flex justify-between items-center max-md:px-4 max-md:py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Меню"
            aria-expanded={menuOpen}
            className="hidden max-md:flex w-9 h-9 items-center justify-center text-2xl leading-none shrink-0"
          >
            {menuOpen ? '×' : '☰'}
          </button>
          <Link href="/" className="text-[28px] font-bold tracking-wide max-md:text-xl">{shopName}</Link>
        </div>

        <nav className="flex gap-6 items-center max-md:hidden">
          <Link href="/" className="hover:text-[#e67e22] transition-colors">Главная</Link>
          <Link href="/catalog" className="hover:text-[#e67e22] transition-colors">Каталог</Link>
        </nav>

        {/* Правая группа: кнопка "Связаться" + иконка избранного на самом краю */}
        <div className="flex items-center gap-3">
          <button
            onClick={open}
            className="bg-[#e67e22] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#d35400] hover:scale-105 transition-all max-md:px-3 max-md:py-2 max-md:text-sm whitespace-nowrap"
          >
            💬 <span className="max-md:hidden">Связаться с продавцом</span>
            <span className="hidden max-md:inline">Связаться</span>
          </button>
          {favoritesLink}
        </div>
      </div>

      {/* Мобильное меню — раскрывается по гамбургеру, т.к. на узком экране
          обычная навигация не помещается и была полностью скрыта. */}
      {menuOpen && (
        <nav className="hidden max-md:flex flex-col bg-[#1a252f] px-4 pb-4 gap-1">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 hover:text-[#e67e22]">
            Главная
          </Link>
          <Link href="/catalog" onClick={() => setMenuOpen(false)} className="py-3 hover:text-[#e67e22]">
            Каталог
          </Link>
        </nav>
      )}
    </header>
  );
}
