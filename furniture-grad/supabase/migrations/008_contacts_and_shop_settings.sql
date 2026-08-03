-- Произвольные способы связи с продавцом (сколько угодно, любые подписи).
-- Заменяет старые фиксированные поля seller_phone/seller_email/seller_telegram/seller_whatsapp
-- из таблицы settings — их можно больше не использовать (см. actions/contacts.ts).
create table contacts (
  id uuid primary key default gen_random_uuid(),
  label text not null,        -- например "Телефон", "Instagram", "Viber"
  value text not null,        -- то, что видит покупатель, например "+7 900 000-00-00"
  href text,                  -- необязательная ссылка (tel:, mailto:, https://...); если пусто — просто текст
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table contacts enable row level security;

create policy "public read contacts" on contacts for select to anon using (true);
create policy "public insert contacts" on contacts for insert to anon with check (true);
create policy "public update contacts" on contacts for update to anon using (true) with check (true);
create policy "public delete contacts" on contacts for delete to anon using (true);

-- Новые ключи настроек магазина (название и фон главного баннера)
insert into settings (key, value) values
  ('shop_name', 'АртВуд'),
  ('hero_image', '')
on conflict (key) do nothing;
