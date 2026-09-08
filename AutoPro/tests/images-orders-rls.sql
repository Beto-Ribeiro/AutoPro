-- Validação transacional: não deixa pedidos, anúncios ou arquivos de teste.
begin;
do $$
declare
  seller uuid; buyer uuid; outsider uuid := gen_random_uuid();
  product uuid; purchase uuid; line uuid; filename text;
begin
  select id into seller from auth.users order by created_at limit 1;
  select id into buyer from auth.users where id <> seller order by created_at limit 1;
  buyer := coalesce(buyer, seller);
  if seller is null then raise exception 'Necessária uma conta para validar'; end if;
  if not exists (select 1 from storage.buckets where id='product-images' and public and file_size_limit=5242880) then raise exception 'Bucket incorreto'; end if;
  perform set_config('request.jwt.claim.sub',seller::text,true);
  set local role authenticated;
  insert into public.seller_profiles(id,username) values(seller,'qa_'||left(replace(gen_random_uuid()::text,'-',''),20)) on conflict(id) do nothing;
  insert into public.products(seller_id,titulo,categoria,valor,descricao,imagem,imagens)
  values(seller,'Teste de fotos','Motor',120,'Anúncio temporário transacional.','https://example.com/1.png',array['https://example.com/1.png','https://example.com/2.png']) returning id into product;
  filename := seller::text || '/' || gen_random_uuid()::text || '.png';
  insert into storage.objects(bucket_id,name) values('product-images',filename);
  begin
    insert into storage.objects(bucket_id,name) values('product-images',outsider::text||'/proibido.png');
    raise exception 'Upload na pasta de outro usuário foi permitido';
  exception when insufficient_privilege then null;
  end;
  perform set_config('request.jwt.claim.sub',buyer::text,true);
  insert into public.orders(user_id,total,payment_method) values(buyer,240,'pix') returning id into purchase;
  insert into public.order_items(order_id,product_id,titulo,valor,quantidade,seller_id)
  values(purchase,product,'Teste de fotos',120,2,outsider) returning id into line;
  if not exists (select 1 from public.order_items where id=line and seller_id=seller and seller_username is not null and imagem='https://example.com/1.png') then raise exception 'Snapshot do vendedor incorreto'; end if;
  perform set_config('request.jwt.claim.sub',seller::text,true);
  if not exists(select 1 from public.my_sales() where id=line and quantidade=2 and valor=120) then raise exception 'Venda não encontrada'; end if;
  perform set_config('request.jwt.claim.sub',outsider::text,true);
  if exists(select 1 from public.my_sales() where id=line) then raise exception 'Venda exposta a outro usuário'; end if;
  if exists(select 1 from public.orders where id=purchase) then raise exception 'Pedido exposto a outro usuário'; end if;
  if exists(select 1 from public.order_items where id=line) then raise exception 'Itens expostos a outro usuário'; end if;
  if exists(select 1 from storage.objects where bucket_id='product-images' and name=filename) then raise exception 'Metadados de foto expostos a outro usuário'; end if;
  reset role;
end;
$$;
rollback;
select 'PASS: bucket, pasta por vendedor, múltiplas fotos, compra, snapshot e privacidade de vendas. Testes revertidos.' as resultado;
