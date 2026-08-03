-- Заменяем свободный текст "цвет" на ссылку на справочник colors
alter table products add column if not exists color_id uuid references colors(id) on delete set null;
alter table products drop column if exists color;

-- Размер и материал товара
alter table products add column if not exists size text;
alter table products add column if not exists material text;

-- Доп. фотографии товара (галерея, помимо основного image)
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image text not null,
  sort_order int not null default 0
);

alter table product_images enable row level security;

create policy "public read product_images" on product_images for select to anon using (true);
create policy "public insert product_images" on product_images for insert to anon with check (true);
create policy "public delete product_images" on product_images for delete to anon using (true);
