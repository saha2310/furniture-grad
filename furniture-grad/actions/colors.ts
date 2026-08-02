'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { colorSchema } from '@/lib/validations';

export async function getColors() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('colors').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function createColor(formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = colorSchema.parse(raw);
  const { error } = await supabase.from('colors').insert(parsed);
  if (error) throw error;
  revalidatePath('/admin/colors');
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function deleteColor(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('colors').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/colors');
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}
