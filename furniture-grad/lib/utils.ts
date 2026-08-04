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
