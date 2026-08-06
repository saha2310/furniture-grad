'use client';
import { useEffect } from 'react';
import { useHeaderFavorite } from '@/lib/header-favorite-context';

export function RegisterHeaderFavorite({ productId }: { productId: string }) {
  const { setProductId } = useHeaderFavorite();

  useEffect(() => {
    setProductId(productId);
    return () => setProductId(null);
  }, [productId, setProductId]);

  return null;
}
