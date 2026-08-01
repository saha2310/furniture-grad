-- Разрешаем создание/изменение/удаление из админ-панели.
-- Важно: в проекте пока нет авторизации в /admin, поэтому эти политики
-- разрешают запись всем, у кого есть anon-ключ (то есть всем посетителям сайта).
-- Если понадобится закрыть админку логином, эти политики нужно будет
-- заменить на проверку auth.uid() и роли пользователя.

create policy "public insert products" on products for insert to anon with check (true);
create policy "public update products" on products for update to anon using (true) with check (true);
create policy "public delete products" on products for delete to anon using (true);

create policy "public insert categories" on categories for insert to anon with check (true);
create policy "public update categories" on categories for update to anon using (true) with check (true);
create policy "public delete categories" on categories for delete to anon using (true);

create policy "public insert widgets" on widgets for insert to anon with check (true);
create policy "public update widgets" on widgets for update to anon using (true) with check (true);
create policy "public delete widgets" on widgets for delete to anon using (true);
