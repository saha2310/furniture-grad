'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'artwood_favorites';

const FavoritesContext = createContext<{
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  removeStale: (staleIds: string[]) => void;
} | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // приватный режим браузера / localStorage недоступен — просто без избранного
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids, loaded]);

  const toggle = (id: string) => {
    setIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const isFavorite = (id: string) => ids.includes(id);

  // Убирает из избранного id товаров, которых больше не существует (удалены
  // или сняты с публикации админом) — иначе счётчик "♥ Избранное N" в шапке
  // навсегда зависает на старом числе, хотя сама страница избранного пустая.
  const removeStale = (staleIds: string[]) => {
    if (staleIds.length === 0) return;
    setIds(prev => prev.filter(id => !staleIds.includes(id)));
  };

  return (
    <FavoritesContext.Provider value={{ ids, isFavorite, toggle, removeStale }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites должен использоваться внутри FavoritesProvider');
  return ctx;
}
