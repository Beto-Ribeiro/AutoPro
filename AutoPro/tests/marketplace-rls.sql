-- Executar no SQL Editor após a migração. Todos os dados de teste são revertidos.
begin;
do $$
declare
  owner_id uuid;
  product_id uuid;
  affected integer;
  outsider_id uuid := gen_random_uuid();
begin
  select id into owner_id from auth.users order by created_at limit 1;
  if owner_id is null then raise exception 'Necessária uma conta existente para testar'; end if;
  perform set_config('request.jwt.claim.sub', owner_id::text, true);
  set local role authenticated;
  insert into public.seller_profiles(id, username)
    values (owner_id, 'qa_' || left(replace(gen_random_uuid()::text, '-', ''), 20))
    on conflict (id) do nothing;
  insert into public.products(seller_id, titulo, categoria, valor, descricao, estoque)
    values (owner_id, 'Teste transacional', 'Motor', 123.45, 'Descrição de validação temporária.', 2)
    returning id into product_id;
  if not exists (select 1 from public.products p join public.seller_profiles s on s.id = p.seller_id where p.id = product_id and s.username is not null) then
    raise exception 'Falha na associação ao vendedor';
  end if;
  update public.products set valor = 150 where id = product_id;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Vendedor não conseguiu editar'; end if;
  perform set_config('request.jwt.claim.sub', outsider_id::text, true);
  update public.products set valor = 1 where id = product_id;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Outro usuário conseguiu editar'; end if;
  begin
    insert into public.products(seller_id, titulo, categoria, valor, descricao)
      values (owner_id, 'Anúncio indevido', 'Motor', 10, 'Tentativa de usar outro vendedor.');
    raise exception 'Outro usuário conseguiu falsificar vendedor';
  exception when insufficient_privilege then null;
  end;
  set local role anon;
  perform set_config('request.jwt.claim.sub', '', true);
  if not exists (select 1 from public.products where id = product_id) then raise exception 'Anúncio público não visível'; end if;
  if exists (select 1 from public.products where seller_id is null) then raise exception 'Produtos antigos ainda visíveis'; end if;
  begin
    insert into public.seller_profiles(id, username) values (outsider_id, 'qa_visitante');
    raise exception 'Visitante conseguiu cadastrar vendedor';
  exception when insufficient_privilege then null;
  end;
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', owner_id::text, true);
  update public.products set ativo = false where id = product_id;
  if not exists (select 1 from public.products where id = product_id) then raise exception 'Vendedor não vê próprio anúncio oculto'; end if;
  set local role anon;
  perform set_config('request.jwt.claim.sub', '', true);
  if exists (select 1 from public.products where id = product_id) then raise exception 'Anúncio oculto está público'; end if;
  reset role;
end;
$$;
rollback;
select 'PASS: cadastro, edição, vendedor, leitura pública, isolamento e anúncios ocultos; dados de teste revertidos.' as resultado;
