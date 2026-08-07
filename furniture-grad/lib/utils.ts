import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// next.config.ts разрешает next/image только для доменов *.supabase.co.
// Если в базе остался товар/категория/виджет со старой ссылкой на картинку
// (например, с Unsplash из более ранней версии проекта, когда изображения
// задавались URL-ом, а не загрузкой файла), next/image упадёт в рантайме с
// ошибкой "hostname is not configured". Проверяем это заранее и для таких
// ссылок используем обычный <img>, а не <Image>.
export function isOptimizableImageUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

// Процент скидки для бейджа "-25%" на странице товара. Возвращает null,
// если скидки нет или данные некорректны (старая цена не больше текущей).
export function getDiscountPercent(price: number, oldPrice: number | null | undefined): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

// Первое предложение текста — короткий тизер под заголовком товара,
// пока полное описание с буллетами уходит в отдельный блок ниже.
export function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?…](?=\s|$)/);
  return (match ? match[0] : text).trim();
}
