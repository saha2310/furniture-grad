'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { widgetSchema } from '@/lib/validations';
import { uploadImageIfPresent } from '@/lib/storage';

export async function getWidgets() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('widgets').select('*').eq('is_visible', true).order('sort_order');
  if (error) throw error;
  return data || [];
}

// Для админки — включая скрытые виджеты (см. аналогичный комментарий в
// actions/categories.ts / getAllCategoriesForAdmin).
export async function getAllWidgetsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('widgets').select('*').order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function getWidgetById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('widgets').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createWidget(formData: FormData) {
  const supabase = await createClient();
  const imageUrl = await uploadImageIfPresent(formData);
  const raw = Object.fromEntries(formData);
  const category_ids = formData.getAll('category_ids') as string[];
  const parsed = widgetSchema.parse({
    ...raw,
    image: imageUrl ?? '',
    category_ids,
    is_visible: raw.is_visible === 'on',
  });
  const { error } = await supabase.from('widgets').insert(parsed);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/widgets');
}

export async function updateWidget(id: string, formData: FormData) {
  const supabase = await createClient();
  const removeImageFlag = formData.get('image_file_remove') === 'on';
  const imageUrl = removeImageFlag ? '' : await uploadImageIfPresent(formData);
  const raw = Object.fromEntries(formData);
  const category_ids = formData.getAll('category_ids') as string[];
  const parsed = widgetSchema.parse({
    ...raw,
    image: removeImageFlag ? '' : imageUrl ?? (raw.current_image as string) ?? '',
    category_ids,
    is_visible: raw.is_visible === 'on',
  });
  const { error } = await supabase.from('widgets').update(parsed).eq('id', id);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/widgets');
}

export async function toggleWidgetVisible(id: string, nextVisible: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from('widgets').update({ is_visible: nextVisible }).eq('id', id);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/widgets');
}

export async function deleteWidget(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('widgets').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/widgets');
}
