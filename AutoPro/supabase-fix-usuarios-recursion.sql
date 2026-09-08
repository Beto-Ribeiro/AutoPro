-- A política de usuarios não pode consultar usuarios sob as mesmas regras RLS.
-- A função verifica apenas o flag da conta atual, preservando a regra existente.
begin;
create schema if not exists autopro_security;
revoke all on schema autopro_security from public;
grant usage on schema autopro_security to anon, authenticated;
create or replace function autopro_security.can_read_all_profiles()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.usuarios u
    where u.id = (select auth.uid()) and u.is_admin = true
  );
$$;
revoke all on function autopro_security.can_read_all_profiles() from public;
grant execute on function autopro_security.can_read_all_profiles() to anon, authenticated;
alter policy "Admins can view all profiles" on public.usuarios
using ((select autopro_security.can_read_all_profiles()));
notify pgrst, 'reload schema';
commit;
