const RU_TO_EN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

// Делает "Диван Модерн" -> "divan-modern". Больше не нужно вводить slug руками.
export function slugify(input: string): string {
  let result = '';
  for (const ch of input.toLowerCase()) {
    result += RU_TO_EN[ch] ?? ch;
  }
  return result
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'item';
}

// Короткий случайный хвост, чтобы не ловить конфликт уникальности slug
// без лишнего запроса к базе (диван -> divan-a1b2c3).
export function slugifyUnique(input: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slugify(input)}-${suffix}`;
}
