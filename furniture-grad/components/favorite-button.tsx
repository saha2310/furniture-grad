'use client';
import { useFavorites } from '@/lib/favorites-context';
import { cn } from '@/lib/utils';

export function FavoriteButton({
  productId,
  className = '',
  translucent = false,
}: {
  productId: string;
  className?: string;
  /** Полупрозрачный фон в неактивном состоянии — для кнопки поверх фото товара */
  translucent?: boolean;
}) {
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
      className={cn(
        'flex items-center justify-center rounded-full shadow transition-all',
        active
          ? 'bg-[#e67e22] text-white'
          : translucent
            ? 'bg-white/30 backdrop-blur-sm text-white hover:bg-white/50'
            : 'bg-white/90 text-[#2c3e50] hover:text-[#e67e22]',
        className
      )}
    >
      <span className="text-xl font-bold leading-none [text-shadow:0_0_1px_currentColor]">{active ? '♥' : '♡'}</span>
    </button>
  );
}
