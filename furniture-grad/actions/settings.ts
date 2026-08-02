'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadImageIfPresent } from '@/lib/storage';

const KEYS = ['shop_name', 'hero_image'] as const;
const DEFAULTS: Record<string, string> = { shop_name: 'АртВуд', hero_image: '' };

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;

    const map: Record<string, string> = { ...DEFAULTS };
    for (const row of data || []) map[row.key] = row.value || '';
    return map;
  } catch (err) {
    // Не даём одной проблемной таблице (например, не применённой миграции)
    // положить абсолютно весь сайт — просто используем значения по умолчанию.
    console.error('getSettings failed, falling back to defaults:', err);
    return { ...DEFAULTS };
  }
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const heroImageUrl = await uploadImageIfPresent(formData, 'hero_image_file');
  if (heroImageUrl) {
    const { error } = await supabase.from('settings').upsert({ key: 'hero_image', value: heroImageUrl });
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
