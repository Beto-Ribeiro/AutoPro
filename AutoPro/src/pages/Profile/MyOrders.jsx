import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../lib/supabaseClient';
import { money } from '../../lib/products';
import ProductImage from '../../components/ProductImage';
import { SectionCard, SectionHeader } from './style';

const Orders = styled.div`
  display: grid; gap: 16px; min-width: 0;
  .tabs { display: flex; gap: 8px; flex-wrap: wrap; }
  .tabs button { padding: 10px 16px; border: 1px solid #b70011; background: white; color: #b70011; border-radius: 6px; cursor: pointer; }
  .tabs button[aria-pressed=true] { background: #b70011; color: white; }
  article { padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; display: grid; gap: 16px; }
  .heading, .totals { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .item { display: flex; gap: 12px; align-items: center; padding: 12px 0; border-top: 1px solid #eee; }
  .image { width: 64px; height: 64px; flex-shrink: 0; background: #f2f4f6; }
  img { width: 100%; height: 100%; object-fit: cover; }
  p { margin: 4px 0; line-height: 1.5; overflow-wrap: anywhere; }
  summary { cursor: pointer; font-weight: 600; }
  .status { font-weight: 600; color: #565e74; }
`;
const statusLabels = { pending: 'Pendente', paid: 'Pago', processing: 'Em processamento', shipped: 'Enviado', delivered: 'Entregue', completed: 'Concluído', cancelled: 'Cancelado', canceled: 'Cancelado', refunded: 'Reembolsado' };
const paymentLabels = { card: 'Cartão', pix: 'PIX' };
const date = value => new Date(value).toLocaleString('pt-BR');

export default function MyOrders({ userId }) {
  const [tab, setTab] = useState('purchases');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const selectTab = next => {
    if (next === tab) return;
    setLoading(true); setItems([]); setTab(next);
  };
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError('');
      try {
        // Paginação interna evita omitir pedidos após o limite padrão da API.
        const all = [];
        for (let start = 0; ; start += 100) {
          const query = tab === 'purchases'
            ? supabase.from('orders').select('*, items:order_items(*)').eq('user_id', userId).order('created_at', { ascending: false }).order('id')
            : supabase.rpc('my_sales');
          const { data, error } = await query.range(start, start + 99);
          if (error) throw error;
          all.push(...(data || []));
          if (!active) return;
          if (!data || data.length < 100) break;
        }
        if (active) setItems(all);
      } catch { if (active) setError('Não foi possível carregar seus pedidos. Tente novamente.'); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [userId, tab, reload]);
  return <SectionCard><SectionHeader><h2>Meus pedidos</h2></SectionHeader><Orders>
    <div className="tabs" role="group" aria-label="Tipo de pedido"><button aria-pressed={tab === 'purchases'} onClick={() => selectTab('purchases')}>Minhas compras</button><button aria-pressed={tab === 'sales'} onClick={() => selectTab('sales')}>Minhas vendas</button></div>
    {loading ? <p role="status">Carregando pedidos...</p> : error ? <p role="alert">{error} <button onClick={() => setReload(v => v + 1)}>Tentar novamente</button></p> : <>
      {!items.length && <p>{tab === 'purchases' ? 'Você ainda não fez nenhum pedido.' : 'Seus produtos ainda não receberam pedidos.'}</p>}
      {tab === 'purchases' ? items.map(order => <article key={order.id}>
        <div className="heading"><div><strong>Pedido #{order.id.slice(0, 8)}</strong><p>{date(order.created_at)}</p></div><span className="status">{statusLabels[order.status] || order.status}</span></div>
        <p>Pagamento: {paymentLabels[order.payment_method] || order.payment_method || 'Não informado'}</p>
        {order.items?.map(item => <div className="item" key={item.id}><div className="image"><ProductImage src={item.imagem} alt={item.titulo} /></div><div>
          {item.product_id ? <Link to={`/products/${item.product_id}`}>{item.titulo}</Link> : <strong>{item.titulo}</strong>}
          {item.seller_username && <p>Vendido por @{item.seller_username}</p>}<p>{item.quantidade} × {money(item.valor)} = {money(item.valor * item.quantidade)}</p>
        </div></div>)}
        {!order.items?.length && <p>Não há itens detalhados disponíveis para este pedido.</p>}
        <div className="totals"><span>Frete: {money(order.shipping_cost || 0)}</span><span>Desconto: {money(order.discount || 0)}</span><strong>Total: {money(order.total)}</strong></div>
        {order.address_snapshot && <details><summary>Endereço de entrega</summary><p>{order.address_snapshot.logradouro}, {order.address_snapshot.numero} {order.address_snapshot.complemento}<br />{order.address_snapshot.bairro}, {order.address_snapshot.cidade} — {order.address_snapshot.estado}<br />CEP: {order.address_snapshot.cep}</p></details>}
      </article>) : items.map(item => <article key={item.id}>
        <div className="heading"><div><strong>Venda · Pedido #{item.order_id.slice(0, 8)}</strong><p>{date(item.created_at)}</p></div><span className="status">{statusLabels[item.status] || item.status}</span></div>
        <div className="item"><div className="image"><ProductImage src={item.imagem} alt={item.titulo} /></div><div><strong>{item.titulo}</strong><p>{item.quantidade} × {money(item.valor)}</p></div></div>
        <div className="totals"><span>Pagamento: {paymentLabels[item.payment_method] || item.payment_method || 'Não informado'}</span><strong>Subtotal da venda: {money(item.valor * item.quantidade)}</strong></div>
      </article>)}
    </>}
  </Orders></SectionCard>;
}
