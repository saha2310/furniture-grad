-- Бакет для загруженных изображений товаров/категорий/виджетов.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "public read images objects"
on storage.objects for select
to anon
using (bucket_id = 'images');

create policy "public upload images objects"
on storage.objects for insert
to anon
with check (bucket_id = 'images');

create policy "public update images objects"
on storage.objects for update
to anon
using (bucket_id = 'images');

create policy "public delete images objects"
on storage.objects for delete
to anon
using (bucket_id = 'images');
