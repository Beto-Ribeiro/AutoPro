import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../lib/supabaseClient';
import { PRODUCT_SELECT, money, productError } from '../../lib/products';
import { useCart } from '../../context/CartContext';
import ProductGallery from '../../components/ProductGallery';
import { productImages } from '../../lib/imageValidation';

const Page = styled.main`
  width: 100%; max-width: 1200px; margin: 0 auto; padding: 32px 24px; flex: 1;
  h1 { font-size: 32px; margin: 12px 0; overflow-wrap: anywhere; }
  .price { font-size: 30px; font-weight: 700; margin: 24px 0; }
  p { line-height: 1.7; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 12px; margin: 24px 0; }
  dt { font-weight: 600; } dd { margin: 0; overflow-wrap: anywhere; }
  .description { white-space: pre-wrap; overflow-wrap: anywhere; }
  button { padding: 14px 24px; background: #b70011; border: 0; border-radius: 6px; color: white; cursor: pointer; }
  button:disabled { opacity: .5; cursor: default; }
`;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);
  const { addToCart, isInCart, session } = useCart();
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setProduct(null); setError('');
      try {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return;
        const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', id).not('seller_id', 'is', null).maybeSingle();
        if (error) throw error;
        if (active) setProduct(data);
      } catch (err) { if (active) setError(productError(err)); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [id, reload]);
  const inCart = product && isInCart(product.id);
  const isOwnProduct = product?.seller_id === session?.user?.id;
  const images = productImages(product);
  return <Page>
    <Link to="/">← Voltar ao catálogo</Link>
    {loading ? <p role="status">Carregando produto...</p> : <>
      {error && <div role="alert"><p>{error}</p><button onClick={() => setReload(v => v + 1)}>Tentar novamente</button></div>}
      {!product && !error && <h1>Produto não encontrado ou anúncio indisponível.</h1>}
      {product && <ProductGallery key={product.id} images={images} title={product.titulo} username={product.seller?.username} category={product.categoria}>
          <p className="price">{money(product.valor)}</p>
          <dl><dt>Condição</dt><dd>{product.condicao}</dd><dt>Estoque</dt><dd>{product.estoque} unidades</dd>
            {product.marca && <><dt>Marca</dt><dd>{product.marca}</dd></>}
            {product.compatibilidade && <><dt>Compatibilidade</dt><dd>{product.compatibilidade}</dd></>}
          </dl>
          {!product.ativo && <p>Anúncio oculto do catálogo.</p>}
          {isOwnProduct ? <p>Este é um produto anunciado por você.</p> : <button disabled={!product.ativo || product.estoque < 1 || inCart || saving} onClick={async () => {
            setSaving(true); setError('');
            try { await addToCart(product); } catch (err) { setError(productError(err)); } finally { setSaving(false); }
          }}>{saving ? 'Adicionando...' : inCart ? 'No carrinho' : !product.ativo || product.estoque < 1 ? 'Indisponível' : 'Adicionar ao carrinho'}</button>}
          <h2 style={{ marginTop: 32 }}>Descrição</h2><p className="description">{product.descricao}</p>
      </ProductGallery>}
    </>}
  </Page>;
}
