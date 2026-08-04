'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadImageIfPresent } from '@/lib/storage';

const KEYS = ['shop_name', 'hero_image'] as const;
const DEFAULTS: Record<string, string> = { shop_name: 'АртВуд', hero_image: '' };

function isNextInternalSignal(err: unknown): boolean {
  const digest = err && typeof err === 'object' && 'digest' in err ? (err as { digest?: unknown }).digest : undefined;
  return typeof digest === 'string' && (
    digest === 'DYNAMIC_SERVER_USAGE' ||
    digest.startsWith('NEXT_REDIRECT') ||
    digest === 'NEXT_NOT_FOUND'
  );
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;

    const map: Record<string, string> = { ...DEFAULTS };
    for (const row of data || []) map[row.key] = row.value || '';
    return map;
  } catch (err) {
    if (isNextInternalSignal(err)) throw err;
    // Не даём одной проблемной таблице (например, не применённой миграции)
    // положить абсолютно весь сайт — просто используем значения по умолчанию.
    console.error('getSettings failed, falling back to defaults:', err);
    return { ...DEFAULTS };
  }
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const removeHero = formData.get('hero_image_file_remove') === 'on';
  const heroImageUrl = removeHero ? '' : await uploadImageIfPresent(formData, 'hero_image_file');
  if (removeHero || heroImageUrl) {
    const { error } = await supabase.from('settings').upsert({ key: 'hero_image', value: heroImageUrl || '' });
    if (error) throw error;
  }

  const shopName = String(formData.get('shop_name') ?? '').trim();
  if (shopName) {
    const { error } = await supabase.from('settings').upsert({ key: 'shop_name', value: shopName });
    if (error) throw error;
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
}
