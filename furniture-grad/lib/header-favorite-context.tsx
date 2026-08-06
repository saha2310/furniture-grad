'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HeaderFavoriteContextValue {
  productId: string | null;
  setProductId: (id: string | null) => void;
}

const HeaderFavoriteContext = createContext<HeaderFavoriteContextValue | null>(null);

export function HeaderFavoriteProvider({ children }: { children: ReactNode }) {
  const [productId, setProductId] = useState<string | null>(null);
  return (
    <HeaderFavoriteContext.Provider value={{ productId, setProductId }}>
      {children}
    </HeaderFavoriteContext.Provider>
  );
}

export function useHeaderFavorite() {
  const ctx = useContext(HeaderFavoriteContext);
  if (!ctx) throw new Error('useHeaderFavorite must be used within HeaderFavoriteProvider');
  return ctx;
}
