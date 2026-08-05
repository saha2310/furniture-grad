-- Счётчик генераций нейросети по дням — нужен, чтобы ограничить дневной
-- лимит запросов к Gemini API (защита от случайных лишних трат).
-- Serverless-функции на Vercel не делят память между вызовами, поэтому
-- считать в переменной в коде нельзя — считаем в базе.

create table if not exists ai_usage (
  day date primary key default current_date,
  count integer not null default 0
);

alter table ai_usage enable row level security;

-- Публичное чтение (нужно, чтобы UI мог показать "осталось N генераций сегодня").
-- Запись пока тоже открыта — как и у остальных таблиц в проекте, до того как
-- будет добавлена авторизация в админку (см. TODO в actions/products.ts).
create policy "ai_usage_select" on ai_usage for select using (true);
create policy "ai_usage_insert" on ai_usage for insert with check (true);
create policy "ai_usage_update" on ai_usage for update using (true);
