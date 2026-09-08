-- AutoPro: execute este arquivo uma vez no SQL Editor do Supabase.
-- Cria uma compra atômica: valida o estoque, baixa as unidades e registra o pedido.

create or replace function public.create_order_and_decrement_stock(
  p_shipping_cost numeric,
  p_payment_method text,
  p_address_snapshot jsonb,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_item jsonb;
  v_product record;
  v_product_id uuid;
  v_quantity integer;
  v_subtotal numeric := 0;
  v_discount numeric := 0;
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'O carrinho está vazio';
  end if;
  if p_payment_method not in ('card', 'pix') then
    raise exception 'Forma de pagamento inválida';
  end if;

  -- FOR UPDATE impede duas compras simultâneas de consumirem a mesma última unidade.
  for v_item in select value from jsonb_array_elements(p_items) loop
    v_product_id := (v_item ->> 'product_id')::uuid;
    v_quantity := (v_item ->> 'quantidade')::integer;
    if v_quantity is null or v_quantity < 1 then
      raise exception 'Quantidade inválida';
    end if;

    select id, seller_id, titulo, valor, estoque into v_product
    from products
    where id = v_product_id and ativo = true and seller_id is not null
    for update;

    if not found or v_product.estoque < v_quantity then
      raise exception 'Estoque insuficiente para um dos produtos';
    end if;
    if v_product.seller_id = v_user_id then
      raise exception 'Você não pode comprar seu próprio produto';
    end if;

    update products
    set estoque = estoque - v_quantity,
        status = case when estoque - v_quantity = 0 then 'Esgotado' else 'Em estoque' end
    where id = v_product_id;

    v_subtotal := v_subtotal + (v_product.valor * v_quantity);
  end loop;

  if p_payment_method = 'pix' then
    v_discount := round((v_subtotal + coalesce(p_shipping_cost, 0)) * 0.05, 2);
  end if;

  insert into orders (user_id, status, total, shipping_cost, discount, payment_method, address_snapshot)
  values (
    v_user_id, 'paid', v_subtotal + coalesce(p_shipping_cost, 0) - v_discount,
    coalesce(p_shipping_cost, 0), v_discount, p_payment_method, p_address_snapshot
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_product_id := (v_item ->> 'product_id')::uuid;
    v_quantity := (v_item ->> 'quantidade')::integer;
    select titulo, valor into v_product from products where id = v_product_id;
    insert into order_items (order_id, product_id, titulo, valor, quantidade)
    values (v_order_id, v_product_id, v_product.titulo, v_product.valor, v_quantity);
  end loop;

  return v_order_id;
end;
$$;

grant execute on function public.create_order_and_decrement_stock(numeric, text, jsonb, jsonb) to authenticated;
