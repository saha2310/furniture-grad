'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { contactSchema } from '@/lib/validations';

function isNextInternalSignal(err: unknown): boolean {
  const digest = err && typeof err === 'object' && 'digest' in err ? (err as { digest?: unknown }).digest : undefined;
  return typeof digest === 'string' && (
    digest === 'DYNAMIC_SERVER_USAGE' ||
    digest.startsWith('NEXT_REDIRECT') ||
    digest === 'NEXT_NOT_FOUND'
  );
}

export async function getContacts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('contacts').select('*').order('sort_order');
    if (error) throw error;
    return data || [];
  } catch (err) {
    if (isNextInternalSignal(err)) throw err;
    console.error('getContacts failed, falling back to empty list:', err);
    return [];
  }
}

export async function createContact(formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = contactSchema.parse(raw);
  const { error } = await supabase.from('contacts').insert({
    ...parsed,
    href: parsed.href || null,
  });
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/settings');
}

export async function deleteContact(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/settings');
}
