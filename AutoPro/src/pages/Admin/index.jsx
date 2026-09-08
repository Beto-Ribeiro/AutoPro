import { useNavigate } from 'react-router-dom';
import { listProducts, productError } from '../../lib/products';
import { useEffect, useMemo, useState } from 'react';
import {
  FiBell, FiChevronLeft, FiChevronRight,
  FiClock, FiFilter, FiGrid, FiMenu, FiPackage, FiPlus,
  FiSearch, FiSettings, FiShoppingBag, FiTrendingUp, FiX,
} from 'react-icons/fi';
import * as S from './style';

const orders = [
  { id: '#PED-2024-001', initials: 'OC', client: 'Oficina Central Ltda.', email: 'joao@oficinacentral.com.br', date: '24 Out, 14:30', value: 1245.5, status: 'Pendente' },
  { id: '#PED-2024-002', initials: 'MP', client: 'Mecânica de Precisão', email: 'contato@mecanicaprecisao.com.br', date: '24 Out, 10:15', value: 890, status: 'Enviado' },
  { id: '#PED-2024-003', initials: 'AS', client: 'Auto Silva S.A.', email: 'compras@autosilva.com.br', date: '23 Out, 16:45', value: 3450.75, status: 'Concluído' },
];

const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Admin() {
  const goTo = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    listProducts().then(items => { if (active) setProducts(items.map(p => ({ ...p, name: p.titulo, category: p.categoria, price: Number(p.valor), stock: p.estoque, tone: p.estoque > 0 ? 'green' : 'red', glyph: '▦' }))); })
      .catch(err => { if (active) setError(productError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const [view, setView] = useState('overview');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [query, products]);
  const filteredOrders = useMemo(() => orders.filter((order) =>
    `${order.id} ${order.client} ${order.status}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const navigate = (nextView) => { setView(nextView); setQuery(''); setPage(1); setMenuOpen(false); };
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };

  return (
    <S.Shell>
      <S.MobileMenu aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><FiMenu /></S.MobileMenu>
      {menuOpen && <S.Scrim aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
      <S.Sidebar $open={menuOpen}>
        <S.CloseMenu aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><FiX /></S.CloseMenu>
        <S.Brand><span>AP</span><div><strong>AutoPro</strong><small>Gestão de autopeças</small></div></S.Brand>
        <S.PrimaryButton onClick={() => goTo('/profile#meus-produtos')}><FiPlus /> Novo produto</S.PrimaryButton>
        <S.Nav aria-label="Navegação administrativa">
          <button className={view === 'overview' ? 'active' : ''} onClick={() => navigate('overview')}><FiGrid /> Visão geral</button>
          <button className={view === 'products' ? 'active' : ''} onClick={() => navigate('products')}><FiPackage /> Produtos</button>
          <button className={view === 'orders' ? 'active' : ''} onClick={() => navigate('orders')}><FiShoppingBag /> Pedidos</button>
        </S.Nav>
        <S.Settings><FiSettings /> Configurações</S.Settings>
      </S.Sidebar>

      <S.Main>
        <S.Topbar>
          <b>AutoPro</b>
          <S.GlobalSearch><FiSearch /><input aria-label="Busca global" placeholder="Buscar peças, pedidos..." value={query} onChange={(event) => setQuery(event.target.value)} /></S.GlobalSearch>
          <S.Notification aria-label="Notificações" onClick={() => notify('Você não tem novas notificações')}><FiBell /><i /></S.Notification>
          <S.Profile><span>AM</span><small>André Martins</small></S.Profile>
        </S.Topbar>
        {loading && <S.Empty>Carregando catálogo...</S.Empty>}
        {error && <S.Empty role="alert">{error}</S.Empty>}
        {view === 'overview' && <S.Page><Heading eyebrow="CATÁLOGO" title="Produtos à venda" description={`${products.length} anúncios cadastrados por vendedores.`} /><S.PrimaryButton onClick={() => navigate('products')}>Ver produtos</S.PrimaryButton></S.Page>}
        {view === 'products' && <Products query={query} setQuery={setQuery} items={filteredProducts} page={page} setPage={setPage} onAdd={() => goTo('/profile#meus-produtos')} />}
        {view === 'orders' && <Orders query={query} setQuery={setQuery} items={filteredOrders} onFilter={() => notify('Filtros prontos para uso')} />}
      </S.Main>
      {toast && <S.Toast role="status">{toast}</S.Toast>}
    </S.Shell>
  );
}

function Heading({ eyebrow, title, description, children }) {
  return <S.Heading><div><S.Eyebrow>{eyebrow}</S.Eyebrow><h1>{title}</h1><p>{description}</p></div>{children}</S.Heading>;
}

function Stat({ title, value, detail, badge, icon }) {
  return <S.Stat><header><span>{title}</span><b>{badge}</b></header><div className="icon">{icon}</div><strong>{value}</strong><p>{detail}</p></S.Stat>;
}

function SearchBox({ value, onChange, placeholder }) {
  return <S.SearchBox><FiSearch /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></S.SearchBox>;
}

function Products({ query, setQuery, items, page, setPage, onAdd }) {
  const goTo = useNavigate();
  return <S.Page><Heading eyebrow="CATÁLOGO" title="Gerenciamento de produtos" description="Visualize, adicione ou edite o inventário de autopeças."><S.Actions><SearchBox value={query} onChange={setQuery} placeholder="Buscar produtos..." /><S.PrimaryButton onClick={onAdd}><FiPlus /> Novo produto</S.PrimaryButton></S.Actions></Heading><S.DataPanel><S.ProductHead><span>Produto</span><span>Categoria</span><span>Preço</span><span>Estoque</span></S.ProductHead>{items.slice((page - 1) * 3, page * 3).map((product) => <S.ProductRow key={product.id} onClick={() => goTo(`/products/${product.id}`)}><span className="product"><i>{product.glyph}</i><strong>{product.name}<small style={{ display: 'block' }}>@{product.seller?.username}</small></strong></span><span><em>{product.category}</em></span><b>{money(product.price)}</b><span className="stock"><i className={product.tone} />{product.stock}</span></S.ProductRow>)}{items.length === 0 && <S.Empty>Nenhum produto encontrado para “{query}”.</S.Empty>}<S.Pagination><span>Mostrando {items.length ? (page - 1) * 3 + 1 : 0}–{Math.min(page * 3, items.length)} de {items.length} produtos</span><div><button aria-label="Página anterior" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}><FiChevronLeft /></button><button aria-label="Próxima página" disabled={page * 3 >= items.length} onClick={() => setPage(page + 1)}><FiChevronRight /></button></div></S.Pagination></S.DataPanel></S.Page>;
}

function Orders({ query, setQuery, items, onFilter }) {
  return <S.Page><Heading eyebrow="LOGÍSTICA" title="Gestão de pedidos" description="Acompanhe e gerencie os pedidos recentes do armazém."><S.Actions><SearchBox value={query} onChange={setQuery} placeholder="Procurar pedido..." /><S.Filter aria-label="Filtrar pedidos" onClick={onFilter}><FiFilter /></S.Filter></S.Actions></Heading><S.Stats className="order-stats"><Stat title="Total de pedidos" value="1.248" detail="+12% esta semana" badge="Mês atual" icon={<FiShoppingBag />} /><Stat title="Pendentes" value="42" detail="Aguardando processamento" badge="Atenção" icon={<FiClock />} /><Stat title="Valor total (mês)" value="R$ 245 mil" detail="+8% vs. mês anterior" badge="Faturamento" icon={<FiTrendingUp />} /></S.Stats><S.DataPanel><S.PanelTitle><h2>Pedidos recentes</h2><button>Ver todos</button></S.PanelTitle><S.OrderHead><span>ID do pedido</span><span>Cliente</span><span>Data</span><span>Valor total</span><span>Status</span></S.OrderHead>{items.map((order) => <S.OrderRow key={order.id}><strong>{order.id}</strong><span className="client"><i>{order.initials}</i><span><b>{order.client}</b><small>{order.email}</small></span></span><time>{order.date}</time><b>{money(order.value)}</b><span><em className={order.status.toLowerCase().replace('í', 'i')}>• {order.status}</em></span></S.OrderRow>)}{items.length === 0 && <S.Empty>Nenhum pedido encontrado.</S.Empty>}</S.DataPanel></S.Page>;
}
