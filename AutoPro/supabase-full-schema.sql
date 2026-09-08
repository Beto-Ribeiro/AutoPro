-- ============================================================
-- AutoPro — Schema COMPLETO e CORRIGIDO do Supabase
-- Execute ESTE arquivo no SQL Editor do seu projeto Supabase
-- (substitui supabase-schema.sql e supabase-orders.sql)
-- ============================================================

-- ─── 0. Extensões ────────────────────────────────────────────
-- Necessário para gen_random_uuid() (já ativo na maioria dos projetos Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─── 1. Tabela: products ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria  text NOT NULL,
  titulo     text NOT NULL,
  status     text DEFAULT 'Em estoque',
  valor      numeric NOT NULL,
  imagem     text,
  estoque    integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Adiciona coluna estoque se não existir (safe for re-run)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS estoque integer DEFAULT 0;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa (inclusive não logada) pode ver produtos
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- Apenas admins podem criar/editar/deletar produtos
-- (checagem feita via join com usuarios.is_admin)
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
        AND usuarios.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
        AND usuarios.is_admin = true
    )
  );


-- ─── 2. Tabela: usuarios ─────────────────────────────────────
-- Espelho público de auth.users com dados extras do cadastro
CREATE TABLE IF NOT EXISTS public.usuarios (
  id         uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nome       text,
  email      text,
  telefone   text,
  cpf        text,        -- CPF ou CNPJ formatado
  is_admin   boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Adiciona coluna is_admin se a tabela já existia
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Usuário vê apenas o próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.usuarios;
CREATE POLICY "Users can view own profile"
  ON public.usuarios FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

-- Usuário atualiza apenas o próprio perfil (não pode mudar is_admin)
DROP POLICY IF EXISTS "Users can update own profile" ON public.usuarios;
CREATE POLICY "Users can update own profile"
  ON public.usuarios FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- INSERT é feito pelo trigger (SECURITY DEFINER) — anon/authenticated precisam de permissão
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.usuarios;
CREATE POLICY "Service role can insert profiles"
  ON public.usuarios FOR INSERT
  WITH CHECK (true);

-- Admin pode ver todos os perfis
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.usuarios;
CREATE POLICY "Admins can view all profiles"
  ON public.usuarios FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u2
      WHERE u2.id = auth.uid()
        AND u2.is_admin = true
    )
  );


-- ─── 3. Trigger: popula usuarios ao criar conta ──────────────
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
    NEW.raw_user_meta_data ->> 'nome',
    NEW.email,
    NEW.raw_user_meta_data ->> 'telefone',
    NEW.raw_user_meta_data ->> 'documento',
    false   -- novos usuários nunca são admin por padrão
  )
  ON CONFLICT (id) DO UPDATE
    SET
      nome     = COALESCE(EXCLUDED.nome, usuarios.nome),
      email    = COALESCE(EXCLUDED.email, usuarios.email),
      telefone = COALESCE(EXCLUDED.telefone, usuarios.telefone),
      cpf      = COALESCE(EXCLUDED.cpf, usuarios.cpf);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ─── 4. Tabela: enderecos ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enderecos (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id   uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  apelido      text,
  cep          text,
  logradouro   text,
  numero       text,
  complemento  text,
  bairro       text,
  cidade       text,
  estado       text,   -- sigla UF (ex: SP)
  padrao       boolean DEFAULT false,
  created_at   timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.enderecos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.enderecos;
CREATE POLICY "Users can manage their own addresses"
  ON public.enderecos FOR ALL
  TO authenticated
  USING ((select auth.uid()) = usuario_id)
  WITH CHECK ((select auth.uid()) = usuario_id);


-- ─── 5. Tabela: cart_items ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id  uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
  quantidade  integer NOT NULL DEFAULT 1 CHECK (quantidade > 0),
  created_at  timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own cart" ON public.cart_items;
CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);


-- ─── 6. Tabela: orders ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES auth.users ON DELETE SET NULL NOT NULL,
  status           text DEFAULT 'pending' NOT NULL,
  total            numeric NOT NULL,
  shipping_cost    numeric DEFAULT 0 NOT NULL,
  discount         numeric DEFAULT 0 NOT NULL,
  payment_method   text DEFAULT 'card' NOT NULL,  -- 'card' | 'pix'
  address_snapshot jsonb,   -- snapshot do endereço no momento da compra
  created_at       timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Adiciona colunas novas caso a tabela já exista
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost    numeric DEFAULT 0 NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount         numeric DEFAULT 0 NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method   text    DEFAULT 'card' NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address_snapshot jsonb;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Admin pode ver todos os pedidos
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
        AND usuarios.is_admin = true
    )
  );

-- Admin pode atualizar status de pedidos
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
        AND usuarios.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
        AND usuarios.is_admin = true
    )
  );


-- ─── 7. Tabela: order_items ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    uuid REFERENCES public.orders ON DELETE CASCADE NOT NULL,
  product_id  uuid REFERENCES public.products ON DELETE SET NULL,
  titulo      text NOT NULL,
  valor       numeric NOT NULL,
  quantidade  integer NOT NULL DEFAULT 1,
  subtotal    numeric GENERATED ALWAYS AS (valor * quantidade) STORED,
  imagem      text,
  created_at  timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Adiciona coluna imagem se não existir
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS imagem text;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- SELECT: usuário vê seus próprios itens de pedido
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
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

-- INSERT: usuário insere itens apenas nos seus próprios pedidos
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
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

-- Admin pode ver todos os itens
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
        AND usuarios.is_admin = true
    )
  );


-- ─── 8. Índices de performance ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id     ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id         ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status          ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_enderecos_usuario_id   ON public.enderecos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_products_categoria     ON public.products(categoria);


-- ─── INSTRUÇÕES FINAIS ────────────────────────────────────────
-- Para tornar um usuário admin, execute no SQL Editor:
--
--   UPDATE public.usuarios
--   SET is_admin = true
--   WHERE email = 'seu-email-admin@exemplo.com';
--
-- ─────────────────────────────────────────────────────────────
