import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';

const BUCKET = 'images';

// Если в formData есть файл под указанным именем — загружает его в Supabase
// Storage и возвращает публичную ссылку. Если файла нет (поле пустое) — null,
// это значит "изображение не менялось / не выбрано".
export async function uploadImageIfPresent(
  formData: FormData,
  fieldName = 'image_file'
): Promise<string | null> {
  const file = formData.get(fieldName);
  if (!(file instanceof File) || file.size === 0) return null;

  const supabase = await createClient();
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
