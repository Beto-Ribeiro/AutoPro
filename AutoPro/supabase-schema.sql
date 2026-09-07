-- ============================================================
-- AutoPro — Schema completo do Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- ============================================================

-- ─── 1. Tabela: products ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria  text NOT NULL,
  titulo     text NOT NULL,
  status     text DEFAULT 'Em estoque',
  valor      numeric NOT NULL,
  imagem     text,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver produtos
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- Só admins inserem/editam (ajuste o email/role conforme necessário)
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (auth.role() = 'authenticated');


-- ─── 2. Tabela: usuarios ────────────────────────────────────
-- Espelho público de auth.users com dados extras do cadastro
CREATE TABLE IF NOT EXISTS public.usuarios (
  id         uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nome       text,
  email      text,
  telefone   text,
  cpf        text,   -- documento CPF ou CNPJ
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.usuarios FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
  ON public.usuarios FOR INSERT
  WITH CHECK (true);


-- ─── 3. Trigger: popula usuarios ao criar conta ─────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome, email, telefone, cpf)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'nome',
    NEW.email,
    NEW.raw_user_meta_data ->> 'telefone',
    NEW.raw_user_meta_data ->> 'documento'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ─── 4. Tabela: enderecos ───────────────────────────────────
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

CREATE POLICY "Users can manage their own addresses"
  ON public.enderecos FOR ALL
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);


-- ─── 5. Tabela: cart_items ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id  uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
  quantidade  integer NOT NULL DEFAULT 1 CHECK (quantidade > 0),
  created_at  timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 6. Tabela: orders ──────────────────────────────────────
-- Recria ou altera a tabela existente para incluir todos os campos
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

-- Adiciona colunas novas caso a tabela já exista (ignora erro se já existir)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost    numeric DEFAULT 0 NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount         numeric DEFAULT 0 NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method   text    DEFAULT 'card' NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address_snapshot jsonb;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);


-- ─── 7. Tabela: order_items ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    uuid REFERENCES public.orders ON DELETE CASCADE NOT NULL,
  product_id  uuid REFERENCES public.products ON DELETE SET NULL,
  titulo      text NOT NULL,
  valor       numeric NOT NULL,
  quantidade  integer NOT NULL DEFAULT 1,
  subtotal    numeric GENERATED ALWAYS AS (valor * quantidade) STORED,
  created_at  timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
