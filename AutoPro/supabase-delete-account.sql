-- AutoPro: execute no SQL Editor do Supabase para habilitar a exclusão de conta.
-- O usuário só pode excluir a própria conta. Pedidos já realizados são preservados,
-- mas os dados de vendedor e os vínculos de produtos são removidos.
begin;

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  account_id uuid := auth.uid();
begin
  if account_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  -- Remove anúncios primeiro para permitir a exclusão do perfil de vendedor.
  -- Referências em carrinhos e itens de pedidos seguem as regras ON DELETE já definidas.
  delete from public.products where seller_id = account_id;
  delete from storage.objects
    where bucket_id = 'product-images'
      and (storage.foldername(name))[1] = account_id::text;
  delete from auth.users where id = account_id;
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
notify pgrst, 'reload schema';
commit;
