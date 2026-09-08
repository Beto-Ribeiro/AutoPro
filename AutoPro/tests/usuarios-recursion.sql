-- Somente leituras, executadas com os papéis reais da aplicação.
begin;
do $$
declare regular_id uuid; admin_id uuid;
begin
  select id into regular_id from public.usuarios where coalesce(is_admin,false)=false and papel is distinct from 'admin' limit 1;
  select id into admin_id from public.usuarios where is_admin=true limit 1;
  perform set_config('request.jwt.claim.sub',coalesce(regular_id,gen_random_uuid())::text,true);
  set local role authenticated;
  if autopro_security.can_read_all_profiles() then raise exception 'Conta comum recebeu acesso administrativo'; end if;
  if exists(select 1 from public.usuarios where id is distinct from regular_id) then raise exception 'Perfil privado visível a outra conta'; end if;
  perform count(*) from public.products p left join public.seller_profiles s on s.id=p.seller_id;
  perform count(*) from public.cart_items;
  perform count(*) from public.enderecos;
  perform count(*) from public.orders;
  perform count(*) from public.order_items;
  if admin_id is not null then
    perform set_config('request.jwt.claim.sub',admin_id::text,true);
    if not autopro_security.can_read_all_profiles() then raise exception 'Permissão do administrador não foi preservada'; end if;
    perform count(*) from public.usuarios;
  end if;
  perform set_config('request.jwt.claim.sub','',true);
  set local role anon;
  if autopro_security.can_read_all_profiles() then raise exception 'Visitante recebeu acesso administrativo'; end if;
  perform count(*) from public.products;
  reset role;
end;
$$;
rollback;
select 'PASS: consultas sem recursão; permissões de usuário, administrador e visitante preservadas.' as resultado;
