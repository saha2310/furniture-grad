create table colors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  hex text not null default '#cccccc',
  created_at timestamptz not null default now()
);

alter table colors enable row level security;

create policy "public read colors" on colors for select to anon using (true);
create policy "public insert colors" on colors for insert to anon with check (true);
create policy "public delete colors" on colors for delete to anon using (true);

-- немного цветов для старта, чтобы список не был пустым
insert into colors (name, hex) values
  ('Белый', '#ffffff'),
  ('Чёрный', '#1a1a1a'),
  ('Серый', '#9e9e9e'),
  ('Бежевый', '#e8dcc8'),
  ('Коричневый', '#6b4423'),
  ('Дуб', '#c19a6b')
on conflict do nothing;
