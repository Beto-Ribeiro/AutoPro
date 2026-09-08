-- AutoPro: executar no SQL Editor depois de supabase-schema.sql.
-- Transacional e reaplicável. Anúncios antigos sem vendedor ficam ocultos;
-- nenhum produto/pedido existente é apagado.
begin;

create table if not exists public.seller_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
  created_at timestamptz not null default now()
);
alter table public.seller_profiles enable row level security;
grant select on public.seller_profiles to anon, authenticated;
grant insert, update on public.seller_profiles to authenticated;
drop policy if exists seller_public_read on public.seller_profiles;
create policy seller_public_read on public.seller_profiles for select using (true);
drop policy if exists seller_insert_self on public.seller_profiles;
create policy seller_insert_self on public.seller_profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists seller_update_self on public.seller_profiles;
create policy seller_update_self on public.seller_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

alter table public.products add column if not exists seller_id uuid references public.seller_profiles(id);
alter table public.products add column if not exists descricao text not null default '';
alter table public.products add column if not exists marca text not null default '';
alter table public.products add column if not exists compatibilidade text not null default '';
alter table public.products add column if not exists condicao text not null default 'Novo' check (condicao in ('Novo', 'Usado', 'Recondicionado'));
alter table public.products add column if not exists estoque integer not null default 1 check (estoque >= 0);
alter table public.products add column if not exists ativo boolean not null default true;
create index if not exists products_seller_idx on public.products(seller_id);
create index if not exists products_catalog_idx on public.products(created_at desc) where seller_id is not null and ativo;

-- A regra anterior permitia a qualquer usuário alterar qualquer produto.
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Products are viewable by everyone" on public.products;
drop policy if exists products_select_public on public.products;
alter table public.products enable row level security;
grant select on public.products to anon, authenticated;
grant insert, update on public.products to authenticated;
drop policy if exists marketplace_read on public.products;
create policy marketplace_read on public.products for select using (seller_id is not null and (ativo or seller_id = auth.uid()));
drop policy if exists marketplace_insert on public.products;
create policy marketplace_insert on public.products for insert to authenticated with check (seller_id = auth.uid());
drop policy if exists marketplace_update on public.products;
create policy marketplace_update on public.products for update to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());

-- Restritiva para manter isolamento mesmo se houver outras políticas permissivas.
drop policy if exists marketplace_owner_guard on public.products;
create policy marketplace_owner_guard on public.products as restrictive for all using (
  seller_id is not null and (ativo or seller_id = auth.uid())
) with check (
  seller_id = auth.uid() and valor > 0 and valor < 100000000
  and char_length(trim(titulo)) between 3 and 120
  and char_length(trim(descricao)) between 10 and 5000
  and char_length(marca) <= 100 and char_length(compatibilidade) <= 500
  and categoria in ('Transmissão', 'Motor', 'Suspensão', 'Acessórios', 'Freios', 'Óleo')
  and (imagem is null or imagem = '' or imagem ~ '^https://')
);
drop policy if exists marketplace_update_owner_guard on public.products;
create policy marketplace_update_owner_guard on public.products as restrictive for update to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
drop policy if exists marketplace_delete_owner_guard on public.products;
create policy marketplace_delete_owner_guard on public.products as restrictive for delete to authenticated using (seller_id = auth.uid());

notify pgrst, 'reload schema';
commit;
