'use server';

import { createClient } from '@/lib/supabase/server';
import { getTemplateById } from '@/lib/ai-templates';

// Дневной лимит вызовов — защита от лишних трат, пока в админку не добавлена
// авторизация. Меняется одной цифрой. У PhotoRoom своя система кредитов —
// это дополнительная подстраховка на нашей стороне, а не замена ей.
const DAILY_LIMIT = 20;

export interface AiImageResult {
  ok: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

async function checkAndIncrementDailyLimit(): Promise<{ allowed: boolean }> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: row } = await supabase.from('ai_usage').select('count').eq('day', today).maybeSingle();
  const current = row?.count ?? 0;

  if (current >= DAILY_LIMIT) return { allowed: false };

  await supabase.from('ai_usage').upsert({ day: today, count: current + 1 }, { onConflict: 'day' });
  return { allowed: true };
}

/**
 * Отправляет фото товара в PhotoRoom (Remove Background API) с параметрами
 * выбранного шаблона, возвращает обработанное изображение как base64 или
 * понятную ошибку.
 *
 * ВАЖНО: PHOTOROOM_API_KEY читается только здесь, на сервере — эта функция
 * никогда не выполняется в браузере ('use server').
 */
export async function processProductImage(formData: FormData): Promise<AiImageResult> {
  const apiKey = process.env.PHOTOROOM_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'На сервере не настроен PHOTOROOM_API_KEY — добавьте его в переменные окружения.' };
  }

  const file = formData.get('image') as File | null;
  const templateId = formData.get('templateId') as string | null;

  if (!file || file.size === 0) {
    return { ok: false, error: 'Фото не найдено — попробуйте выбрать его заново.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: 'Файл больше 10 МБ — уменьшите фото и попробуйте снова.' };
  }

  const template = templateId ? getTemplateById(templateId) : undefined;
  if (!template) {
    return { ok: false, error: 'Шаблон не выбран.' };
  }

  const limit = await checkAndIncrementDailyLimit();
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Достигнут дневной лимит обработок (${DAILY_LIMIT}/день). Попробуйте завтра или увеличьте лимит в настройках.`,
    };
  }

  try {
    const apiForm = new FormData();
    apiForm.set('image_file', file);
    apiForm.set('format', template.params.format);
    apiForm.set('crop', String(template.params.crop));
    if (template.params.bgColor) apiForm.set('bg_color', template.params.bgColor);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
      signal: controller.signal,
      body: apiForm,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return { ok: false, error: 'PhotoRoom: превышен лимит запросов или закончились кредиты (429).' };
      }
      if (status === 401 || status === 403) {
        return { ok: false, error: 'PhotoRoom: ключ недействителен или нет доступа (проверьте PHOTOROOM_API_KEY).' };
      }
      const body = await response.text().catch(() => '');
      if (status === 400) {
        return { ok: false, error: `PhotoRoom: не удалось обработать это фото. Ответ сервера: ${body.slice(0, 300) || 'нет текста ошибки'}` };
      }
      return { ok: false, error: `PhotoRoom вернул ошибку ${status}: ${body.slice(0, 200)}` };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = template.params.format === 'png' ? 'image/png' : 'image/jpeg';

    return { ok: true, imageBase64: base64, mimeType };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { ok: false, error: 'Превышено время ожидания ответа от PhotoRoom (30 сек). Попробуйте ещё раз.' };
    }
    return { ok: false, error: `Не удалось связаться с PhotoRoom: ${err?.message || 'неизвестная ошибка'}.` };
  }
}
