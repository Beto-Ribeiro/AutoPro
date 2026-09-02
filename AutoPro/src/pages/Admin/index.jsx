import { useMemo, useState } from 'react';
import {
  FiAlertTriangle, FiBell, FiBox, FiChevronLeft, FiChevronRight,
  FiClock, FiFilter, FiGrid, FiMenu, FiPackage, FiPlus, FiRefreshCw,
  FiSearch, FiSettings, FiShoppingBag, FiTrendingUp, FiTruck, FiX,
} from 'react-icons/fi';
import * as S from './style';

const products = [
  { id: 1, name: 'Pastilha de Freio Cerâmica HD', category: 'Freios', price: 245, stock: 120, tone: 'green', glyph: '▰' },
  { id: 2, name: 'Óleo Sintético 10W40 5L', category: 'Motor', price: 189.9, stock: 15, tone: 'orange', glyph: '▥' },
  { id: 3, name: 'Amortecedor Gás Pro-Series', category: 'Suspensão', price: 850, stock: 0, tone: 'red', glyph: '↕' },
  { id: 4, name: 'Filtro de Ar Premium', category: 'Motor', price: 89.9, stock: 48, tone: 'green', glyph: '▦' },
  { id: 5, name: 'Kit Correia Dentada', category: 'Motor', price: 379, stock: 22, tone: 'green', glyph: '◉' },
];

const orders = [
  { id: '#PED-2024-001', initials: 'OC', client: 'Oficina Central Ltda.', email: 'joao@oficinacentral.com.br', date: '24 Out, 14:30', value: 1245.5, status: 'Pendente' },
  { id: '#PED-2024-002', initials: 'MP', client: 'Mecânica de Precisão', email: 'contato@mecanicaprecisao.com.br', date: '24 Out, 10:15', value: 890, status: 'Enviado' },
  { id: '#PED-2024-003', initials: 'AS', client: 'Auto Silva S.A.', email: 'compras@autosilva.com.br', date: '23 Out, 16:45', value: 3450.75, status: 'Concluído' },
];

const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Admin() {
  const [view, setView] = useState('overview');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [query]);
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
        <S.PrimaryButton onClick={() => setModal(true)}><FiPlus /> Novo produto</S.PrimaryButton>
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
        {view === 'overview' && <Overview onProducts={() => navigate('products')} onRefresh={() => notify('Dados atualizados agora')} />}
        {view === 'products' && <Products query={query} setQuery={setQuery} items={filteredProducts} page={page} setPage={setPage} onAdd={() => setModal(true)} />}
        {view === 'orders' && <Orders query={query} setQuery={setQuery} items={filteredOrders} onFilter={() => notify('Filtros prontos para uso')} />}
      </S.Main>
      {modal && <ProductModal onClose={() => setModal(false)} onSave={() => { setModal(false); notify('Produto adicionado com sucesso'); }} />}
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

function Overview({ onProducts, onRefresh }) {
  return <S.Page>
    <Heading eyebrow="PAINEL OPERACIONAL" title="Visão geral" description="Resumo das operações diárias e status do armazém."><S.Date><span>Data atual</span><strong>15 de Outubro, 2024</strong></S.Date></Heading>
    <S.Stats><Stat title="Vendas do dia" value="R$ 24.500" detail="142 transações concluídas" badge="+12%" icon={<FiTrendingUp />} /><Stat title="Pedidos pendentes" value="38" detail="Aguardando separação no galpão B" badge="Urgente" icon={<FiClock />} /><Stat title="Estoque baixo" value="15" detail="SKUs abaixo do limite mínimo" badge="Alertas" icon={<FiAlertTriangle />} /></S.Stats>
    <S.OverviewGrid>
      <S.Panel><S.PanelTitle><h2>Atividade recente</h2><button onClick={onProducts}>Ver tudo</button></S.PanelTitle><Activity icon={<FiTruck />} title="Lote recebido: Pastilhas de Freio (BRK-992)" detail="Fornecedor: Industrial AutoParts SA · 500 unidades" time="Há 10 min" /><Activity icon={<FiBox />} title="Pedido #4029 despachado" detail="Transportadora Rápida · Destino: São Paulo, SP" time="Há 45 min" /><Activity icon={<FiAlertTriangle />} title="Alerta de estoque: Filtro de Óleo 10W" detail="Quantidade atual: 12 (mínimo: 20)" time="Há 2 horas" warning /></S.Panel>
      <S.System><h2>Status do sistema</h2><p><i className="green" />Sincronização de ERP <span>Online</span></p><p><i className="green" />API de logística <span>Online</span></p><p><i className="yellow" />Gateway de pagamento <span>Lento</span></p><button onClick={onRefresh}><FiRefreshCw /> Atualizar dados</button></S.System>
    </S.OverviewGrid>
  </S.Page>;
}

function Activity({ icon, title, detail, time, warning }) {
  return <S.Activity><span className={warning ? 'warning' : ''}>{icon}</span><div><strong>{title}</strong><p>{detail}</p></div><time>{time}</time></S.Activity>;
}

function SearchBox({ value, onChange, placeholder }) {
  return <S.SearchBox><FiSearch /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></S.SearchBox>;
}

function Products({ query, setQuery, items, page, setPage, onAdd }) {
  return <S.Page><Heading eyebrow="CATÁLOGO" title="Gerenciamento de produtos" description="Visualize, adicione ou edite o inventário de autopeças."><S.Actions><SearchBox value={query} onChange={setQuery} placeholder="Buscar produtos..." /><S.PrimaryButton onClick={onAdd}><FiPlus /> Novo produto</S.PrimaryButton></S.Actions></Heading><S.DataPanel><S.ProductHead><span>Produto</span><span>Categoria</span><span>Preço</span><span>Estoque</span></S.ProductHead>{items.slice((page - 1) * 3, page * 3).map((product) => <S.ProductRow key={product.id} onClick={onAdd}><span className="product"><i>{product.glyph}</i><strong>{product.name}</strong></span><span><em>{product.category}</em></span><b>{money(product.price)}</b><span className="stock"><i className={product.tone} />{product.stock}</span></S.ProductRow>)}{items.length === 0 && <S.Empty>Nenhum produto encontrado para “{query}”.</S.Empty>}<S.Pagination><span>Mostrando {items.length ? (page - 1) * 3 + 1 : 0}–{Math.min(page * 3, items.length)} de {items.length} produtos</span><div><button aria-label="Página anterior" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}><FiChevronLeft /></button><button aria-label="Próxima página" disabled={page * 3 >= items.length} onClick={() => setPage(page + 1)}><FiChevronRight /></button></div></S.Pagination></S.DataPanel></S.Page>;
}

function Orders({ query, setQuery, items, onFilter }) {
  return <S.Page><Heading eyebrow="LOGÍSTICA" title="Gestão de pedidos" description="Acompanhe e gerencie os pedidos recentes do armazém."><S.Actions><SearchBox value={query} onChange={setQuery} placeholder="Procurar pedido..." /><S.Filter aria-label="Filtrar pedidos" onClick={onFilter}><FiFilter /></S.Filter></S.Actions></Heading><S.Stats className="order-stats"><Stat title="Total de pedidos" value="1.248" detail="+12% esta semana" badge="Mês atual" icon={<FiShoppingBag />} /><Stat title="Pendentes" value="42" detail="Aguardando processamento" badge="Atenção" icon={<FiClock />} /><Stat title="Valor total (mês)" value="R$ 245 mil" detail="+8% vs. mês anterior" badge="Faturamento" icon={<FiTrendingUp />} /></S.Stats><S.DataPanel><S.PanelTitle><h2>Pedidos recentes</h2><button>Ver todos</button></S.PanelTitle><S.OrderHead><span>ID do pedido</span><span>Cliente</span><span>Data</span><span>Valor total</span><span>Status</span></S.OrderHead>{items.map((order) => <S.OrderRow key={order.id}><strong>{order.id}</strong><span className="client"><i>{order.initials}</i><span><b>{order.client}</b><small>{order.email}</small></span></span><time>{order.date}</time><b>{money(order.value)}</b><span><em className={order.status.toLowerCase().replace('í', 'i')}>• {order.status}</em></span></S.OrderRow>)}{items.length === 0 && <S.Empty>Nenhum pedido encontrado.</S.Empty>}</S.DataPanel></S.Page>;
}

function ProductModal({ onClose, onSave }) {
  return <S.ModalBackdrop onMouseDown={onClose}><S.Modal role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={onClose} aria-label="Fechar"><FiX /></button><S.Eyebrow>NOVO ITEM</S.Eyebrow><h2 id="product-modal-title">Adicionar produto</h2><p>Cadastre uma nova peça no catálogo da AutoPro.</p><label>Nome do produto<input defaultValue="Kit de embreagem" autoFocus /></label><div><label>Categoria<select defaultValue="Transmissão"><option>Freios</option><option>Motor</option><option>Suspensão</option><option>Transmissão</option></select></label><label>Preço (R$)<input type="number" defaultValue="1299" /></label></div><label>Estoque inicial<input type="number" defaultValue="24" /></label><footer><button onClick={onClose}>Cancelar</button><S.PrimaryButton onClick={onSave}>Salvar produto</S.PrimaryButton></footer></S.Modal></S.ModalBackdrop>;
}
