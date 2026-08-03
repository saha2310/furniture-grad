'use client';
import { useFavorites } from '@/lib/favorites-context';

export function FavoriteButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={active ? 'Убрать из избранного' : 'Добавить в избранное'}
      aria-pressed={active}
      className={`flex items-center justify-center rounded-full shadow transition-all ${
        active ? 'bg-[#e67e22] text-white' : 'bg-white/90 text-[#2c3e50] hover:text-[#e67e22]'
      } ${className}`}
    >
      <span className="text-lg leading-none">{active ? '♥' : '♡'}</span>
    </button>
  );
}
