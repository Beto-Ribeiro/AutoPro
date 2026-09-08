-- ============================================================
-- AutoPro — Script de MIGRAÇÃO MÍNIMA
-- NÃO apaga nenhuma tabela existente.
-- Apenas adiciona colunas e políticas RLS que faltam.
-- Execute no SQL Editor do Supabase Dashboard.
-- ============================================================


-- ─── 1. Tabela usuarios — adicionar colunas que faltam ───────

-- Adiciona email (o app precisa exibir o email no perfil)
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS email text;

-- Preenche o email buscando de auth.users para registros existentes
UPDATE public.usuarios u
SET email = au.email
FROM auth.users au
WHERE au.id = u.id
  AND u.email IS NULL;

-- Adiciona is_admin para controle de acesso ao painel admin
-- (usa a coluna 'papel' que você já tem como fallback)
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Se você já tem usuários com papel = 'admin', promove eles automaticamente:
-- (só executa se o tipo papel_usuario tiver o valor 'admin')
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'papel_usuario' AND e.enumlabel = 'admin'
  ) THEN
    UPDATE public.usuarios
    SET is_admin = true
    WHERE papel::text = 'admin' AND is_admin = false;
  END IF;
END $$;


-- ─── 2. Trigger: popula usuarios ao criar conta ──────────────
-- Corrigido para incluir email e is_admin

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome, email, telefone, cpf, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', ''),
    NEW.email,
    NEW.raw_user_meta_data ->> 'telefone',
    NEW.raw_user_meta_data ->> 'documento',
    false
  )
  ON CONFLICT (id) DO UPDATE
    SET
      nome     = COALESCE(EXCLUDED.nome,     public.usuarios.nome),
      email    = COALESCE(EXCLUDED.email,    public.usuarios.email),
      telefone = COALESCE(EXCLUDED.telefone, public.usuarios.telefone),
      cpf      = COALESCE(EXCLUDED.cpf,      public.usuarios.cpf);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ─── 3. RLS em usuarios ──────────────────────────────────────

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile"    ON public.usuarios;
DROP POLICY IF EXISTS "Users can update own profile"  ON public.usuarios;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.usuarios;
DROP POLICY IF EXISTS "Admins can view all profiles"  ON public.usuarios;

CREATE POLICY "Users can view own profile"
  ON public.usuarios FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.usuarios FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- INSERT feito pelo trigger (SECURITY DEFINER)
CREATE POLICY "Service role can insert profiles"
  ON public.usuarios FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all profiles"
  ON public.usuarios FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u2
      WHERE u2.id = (select auth.uid()) AND u2.is_admin = true
    )
  );


-- ─── 4. RLS em products ──────────────────────────────────────

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products"        ON public.products;

CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = (select auth.uid()) AND usuarios.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = (select auth.uid()) AND usuarios.is_admin = true
    )
  );


-- ─── 5. RLS em enderecos ─────────────────────────────────────
-- Sua tabela enderecos referencia public.usuarios(id),
-- que por sua vez referencia auth.users(id) — funciona igual.

ALTER TABLE public.enderecos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.enderecos;

CREATE POLICY "Users can manage their own addresses"
  ON public.enderecos FOR ALL
  TO authenticated
  USING ((select auth.uid()) = usuario_id)
  WITH CHECK ((select auth.uid()) = usuario_id);


-- ─── 6. RLS em cart_items ────────────────────────────────────

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own cart" ON public.cart_items;

CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);


-- ─── 7. RLS em orders ───────────────────────────────────────

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders"   ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders"        ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders"          ON public.orders;

CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = (select auth.uid()) AND usuarios.is_admin = true
    )
  );

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = (select auth.uid()) AND usuarios.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = (select auth.uid()) AND usuarios.is_admin = true
    )
  );


-- ─── 8. RLS em order_items ───────────────────────────────────

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own order items"   ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items"        ON public.order_items;

CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = (select auth.uid()) AND usuarios.is_admin = true
    )
  );


-- ─── 9. Coluna imagem em order_items (se não existir) ────────
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS imagem text;


-- ─── 10. Índices de performance ──────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id    ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id        ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id  ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_enderecos_usuario_id  ON public.enderecos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_products_categoria    ON public.products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_ativo        ON public.products(ativo);


-- ─── FINALIZADO ───────────────────────────────────────────────
-- Para tornar um usuário admin, execute:
--
--   UPDATE public.usuarios
--   SET is_admin = true
--   WHERE email = 'seu-email@exemplo.com';
--
-- ─────────────────────────────────────────────────────────────
