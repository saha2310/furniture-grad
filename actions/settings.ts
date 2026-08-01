'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const KEYS = ['seller_name', 'seller_phone', 'seller_email', 'seller_telegram', 'seller_whatsapp'] as const;

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;

    const map: Record<string, string> = {};
    for (const row of data || []) map[row.key] = row.value || '';
    return map;
  } catch (err) {
    // Не даём одной проблемной таблице (например, не применённой миграции)
    // положить абсолютно весь сайт — просто скрываем контакты продавца.
    console.error('getSettings failed, falling back to empty contacts:', err);
    return {};
  }
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  for (const key of KEYS) {
    const value = String(formData.get(key) ?? '');
    const { error } = await supabase.from('settings').upsert({ key, value });
    if (error) throw error;
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
}
