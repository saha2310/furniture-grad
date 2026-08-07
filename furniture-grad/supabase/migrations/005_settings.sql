create table settings (
  key text primary key,
  value text not null default ''
);

alter table settings enable row level security;

create policy "public read settings" on settings for select to anon using (true);
create policy "public insert settings" on settings for insert to anon with check (true);
create policy "public update settings" on settings for update to anon using (true) with check (true);

insert into settings (key, value) values
  ('seller_name', 'МебельГрад'),
  ('seller_phone', ''),
  ('seller_email', ''),
  ('seller_telegram', ''),
  ('seller_whatsapp', '')
on conflict (key) do nothing;
