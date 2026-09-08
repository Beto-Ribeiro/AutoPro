import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { money, productError } from '../../lib/products';
import ProductImage from '../ProductImage';
import { Container, Img, Description, Itens, Category, Title, Status, Price, AddButton } from './style';

export default function Card({ product }) {
  const { addToCart, isInCart } = useCart();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inCart = isInCart(product.id);
  const available = product.ativo && product.estoque > 0;
  async function add() {
    setSaving(true); setError('');
    try { await addToCart(product); } catch (err) { setError(productError(err)); }
    finally { setSaving(false); }
  }
  return <Container>
    <Link to={`/products/${product.id}`} aria-label={`Ver detalhes de ${product.titulo}`}><Img><ProductImage src={product.imagem} alt={product.titulo} /></Img></Link>
    <Description><Itens>
      <Category>{product.categoria}</Category>
      <Link to={`/products/${product.id}`}><Title>{product.titulo}</Title></Link>
      <small>Vendido por @{product.seller?.username}</small>
      <Status $available={available}>{available ? `${product.condicao} · Em estoque` : 'Esgotado'}</Status>
      <Price>{money(product.valor)}</Price>
    </Itens>
    {error && <p role="alert">{error}</p>}
    <AddButton onClick={add} $inCart={inCart} disabled={inCart || !available || saving}>{saving ? 'Adicionando...' : inCart ? 'No carrinho' : !available ? 'Indisponível' : 'Adicionar ao carrinho'}</AddButton>
    </Description>
  </Container>;
}
