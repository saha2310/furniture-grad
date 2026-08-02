'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/validations';
import { uploadImageIfPresent } from '@/lib/storage';
import { slugifyUnique } from '@/lib/slugify';

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function getCategoryById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const imageUrl = await uploadImageIfPresent(formData);
  const raw = Object.fromEntries(formData);
  const parsed = categorySchema.parse({
    ...raw,
    slug: slugifyUnique(String(raw.name || 'category')),
    image: imageUrl ?? '',
    is_active: raw.is_active === 'on',
  });
  const { error } = await supabase.from('categories').insert(parsed);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const removeImageFlag = formData.get('image_file_remove') === 'on';
  const imageUrl = removeImageFlag ? '' : await uploadImageIfPresent(formData);
  const raw = Object.fromEntries(formData);
  const parsed = categorySchema.parse({
    ...raw,
    slug: String(raw.current_slug || slugifyUnique(String(raw.name || 'category'))),
    image: removeImageFlag ? '' : imageUrl ?? (raw.current_image as string) ?? '',
    is_active: raw.is_active === 'on',
  });
  const { error } = await supabase.from('categories').update(parsed).eq('id', id);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/categories');
}
