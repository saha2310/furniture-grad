-- Артикул и наличие товара для страницы товара (Product Page).
-- sku — произвольный текст, вводится вручную в админке, необязателен
-- (у уже существующих товаров будет NULL, и это нормально — на витрине
-- строка "Артикул" просто не показывается, если он не задан).
-- in_stock — простой флаг "в наличии / нет в наличии" (по умолчанию true,
-- чтобы все существующие товары остались доступными для заказа).

alter table products add column if not exists sku text;
alter table products add column if not exists in_stock boolean not null default true;
