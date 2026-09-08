-- Executar após supabase-marketplace.sql. Reaplicável e transacional.
begin;
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_images_insert_own on storage.objects;
create policy product_images_insert_own on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists product_images_select_own on storage.objects;
create policy product_images_select_own on storage.objects for select to authenticated
using (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists product_images_delete_own on storage.objects;
create policy product_images_delete_own on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

alter table public.products add column if not exists imagens text[] not null default '{}';
update public.products set imagens = array[imagem] where cardinality(imagens) = 0 and nullif(imagem, '') is not null;
alter table public.products drop constraint if exists products_images_limit;
alter table public.products add constraint products_images_limit check (cardinality(imagens) <= 8);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status text not null default 'pending', total numeric not null,
  created_at timestamptz not null default now()
);
alter table public.orders add column if not exists shipping_cost numeric not null default 0;
alter table public.orders add column if not exists discount numeric not null default 0;
alter table public.orders add column if not exists payment_method text not null default 'card';
alter table public.orders add column if not exists address_snapshot jsonb;
alter table public.orders enable row level security;
grant select, insert on public.orders to authenticated;
drop policy if exists marketplace_orders_select on public.orders;
create policy marketplace_orders_select on public.orders for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists marketplace_orders_insert on public.orders;
create policy marketplace_orders_insert on public.orders for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists marketplace_orders_owner_guard on public.orders;
create policy marketplace_orders_owner_guard on public.orders as restrictive for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  titulo text not null, valor numeric not null,
  quantidade integer not null default 1 check (quantidade > 0),
  subtotal numeric generated always as (valor * quantidade) stored,
  created_at timestamptz not null default now()
);
alter table public.order_items enable row level security;
grant select, insert on public.order_items to authenticated;
drop policy if exists marketplace_order_items_select on public.order_items;
create policy marketplace_order_items_select on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
drop policy if exists marketplace_order_items_insert on public.order_items;
create policy marketplace_order_items_insert on public.order_items for insert to authenticated with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
drop policy if exists marketplace_order_items_owner_guard on public.order_items;
create policy marketplace_order_items_owner_guard on public.order_items as restrictive for all to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))) with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));

alter table public.order_items add column if not exists seller_id uuid references auth.users(id) on delete set null;
alter table public.order_items add column if not exists seller_username text;
alter table public.order_items add column if not exists imagem text;
create index if not exists order_items_seller_idx on public.order_items(seller_id);
update public.order_items i set seller_id = p.seller_id, seller_username = s.username, imagem = p.imagem
from public.products p join public.seller_profiles s on s.id = p.seller_id
where i.product_id = p.id and i.seller_id is null;

-- Snapshot definido pelo banco, não pelo comprador; preserva vendedor/foto no histórico.
create or replace function public.snapshot_order_item_seller() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  select p.seller_id, s.username, p.imagem into new.seller_id, new.seller_username, new.imagem
  from public.products p left join public.seller_profiles s on s.id = p.seller_id where p.id = new.product_id;
  return new;
end;
$$;
drop trigger if exists order_item_seller_snapshot on public.order_items;
create trigger order_item_seller_snapshot before insert on public.order_items
for each row execute function public.snapshot_order_item_seller();
revoke all on function public.snapshot_order_item_seller() from public, anon, authenticated;

-- Não abre acesso ao pedido completo: o vendedor recebe somente os próprios itens,
-- sem endereço, dados de pagamento privados ou itens de outros vendedores.
create or replace function public.my_sales() returns table (
  id uuid, order_id uuid, product_id uuid, titulo text, valor numeric,
  quantidade integer, imagem text, created_at timestamptz, status text, payment_method text
) language sql stable security definer set search_path = '' as $$
  select i.id, i.order_id, i.product_id, i.titulo, i.valor, i.quantidade, i.imagem,
    o.created_at, o.status, o.payment_method
  from public.order_items i join public.orders o on o.id = i.order_id
  where i.seller_id = (select auth.uid()) order by o.created_at desc, i.id;
$$;
revoke all on function public.my_sales() from public, anon;
grant execute on function public.my_sales() to authenticated;
notify pgrst, 'reload schema';
commit;
