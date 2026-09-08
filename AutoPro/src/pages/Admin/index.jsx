import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertTriangle, FiBell, FiBox, FiChevronLeft, FiChevronRight,
  FiClock, FiFilter, FiGrid, FiMenu, FiPackage, FiPlus, FiRefreshCw,
  FiSearch, FiSettings, FiShoppingBag, FiTrendingUp, FiTruck, FiX,
  FiEdit2, FiTrash2, FiCheck, FiImage,
} from 'react-icons/fi';
import { supabase } from '../../lib/supabaseClient';
import * as S from './style';

/* ── Formatadores ── */
const money = (value) =>
  Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmt_date = (iso) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

const STATUS_LABELS = {
  pending:   'Pendente',
  paid:      'Pago',
  shipped:   'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

/* ── Hook: verificação de admin ── */
function useAdminGuard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null); // null = loading

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return; }
      const { data } = await supabase
        .from('usuarios')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      if (!data?.is_admin) {
        navigate('/');
      } else {
        setIsAdmin(true);
      }
    });
  }, [navigate]);

  return isAdmin;
}

/* ════════════════════════════════════════════════════════════ */
/*  Admin — componente principal                               */
/* ════════════════════════════════════════════════════════════ */
export default function Admin() {
  const isAdmin = useAdminGuard();

  const [view, setView]       = useState('overview');
  const [query, setQuery]     = useState('');
  const [page, setPage]       = useState(1);
  const [modal, setModal]     = useState(false);
  const [editProduct, setEditProduct] = useState(null); // produto em edição
  const [toast, setToast]     = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // ── dados Supabase
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [stats, setStats]       = useState({ todayRevenue: 0, pendingOrders: 0, totalUsers: 0 });
  const [loadingData, setLoadingData] = useState(true);

  const notify = (msg) => { setToast(msg); window.setTimeout(() => setToast(''), 2800); };

  const navTo = (nextView) => { setView(nextView); setQuery(''); setPage(1); setMenuOpen(false); };

  /* ── Fetch de dados ── */
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    const [prodRes, ordRes, userRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase
        .from('orders')
        .select(`
          id, user_id, status, total, shipping_cost, discount,
          payment_method, created_at,
          usuarios ( nome, email )
        `)
        .order('created_at', { ascending: false }),
      supabase.from('usuarios').select('id', { count: 'exact', head: true }),
    ]);

    if (!prodRes.error) setProducts(prodRes.data || []);
    if (!ordRes.error)  setOrders(ordRes.data || []);

    // Estatísticas
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = (ordRes.data || []).filter(
      (o) => o.created_at.startsWith(today) && o.status !== 'cancelled'
    );
    const todayRevenue   = todayOrders.reduce((s, o) => s + Number(o.total), 0);
    const pendingOrders  = (ordRes.data || []).filter((o) => o.status === 'pending').length;
    const totalUsers     = userRes.count || 0;
    setStats({ todayRevenue, pendingOrders, totalUsers });

    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, fetchData]);

  /* ── Filtros ── */
  const filteredProducts = useMemo(() =>
    products.filter((p) =>
      `${p.titulo} ${p.categoria}`.toLowerCase().includes(query.toLowerCase())
    ), [products, query]);

  const filteredOrders = useMemo(() =>
    orders.filter((o) => {
      const label = STATUS_LABELS[o.status] || o.status;
      return `${o.id} ${o.usuarios?.nome || ''} ${o.usuarios?.email || ''} ${label}`
        .toLowerCase().includes(query.toLowerCase());
    }), [orders, query]);

  /* ── Delete produto ── */
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Excluir este produto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { notify('Erro ao excluir produto.'); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify('Produto excluído.');
  };

  /* ── Atualizar status de pedido ── */
  const handleOrderStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) { notify('Erro ao atualizar status.'); return; }
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    notify('Status atualizado!');
  };

  /* ── Loading / guard ── */
  if (isAdmin === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        Verificando permissões...
      </div>
    );
  }

  return (
    <S.Shell>
      <S.MobileMenu aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><FiMenu /></S.MobileMenu>
      {menuOpen && <S.Scrim aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <S.Sidebar $open={menuOpen}>
        <S.CloseMenu aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><FiX /></S.CloseMenu>
        <S.Brand>
          <span>AP</span>
          <div><strong>AutoPro</strong><small>Painel Administrativo</small></div>
        </S.Brand>
        <S.PrimaryButton onClick={() => { setEditProduct(null); setModal(true); }}>
          <FiPlus /> Novo produto
        </S.PrimaryButton>
        <S.Nav aria-label="Navegação administrativa">
          <button className={view === 'overview' ? 'active' : ''} onClick={() => navTo('overview')}>
            <FiGrid /> Visão geral
          </button>
          <button className={view === 'products' ? 'active' : ''} onClick={() => navTo('products')}>
            <FiPackage /> Produtos
          </button>
          <button className={view === 'orders' ? 'active' : ''} onClick={() => navTo('orders')}>
            <FiShoppingBag /> Pedidos
          </button>
        </S.Nav>
        <S.Settings><FiSettings /> Configurações</S.Settings>
      </S.Sidebar>

      <S.Main>
        <S.Topbar>
          <b>AutoPro Admin</b>
          <S.GlobalSearch>
            <FiSearch />
            <input
              aria-label="Busca global"
              placeholder="Buscar peças, pedidos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </S.GlobalSearch>
          <S.Notification aria-label="Notificações" onClick={() => notify('Sem novas notificações')}>
            <FiBell /><i />
          </S.Notification>
          <S.Profile><span>AP</span><small>Admin</small></S.Profile>
        </S.Topbar>

        {loadingData && view !== 'overview' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#888', fontFamily: 'Inter, sans-serif' }}>
            Carregando dados...
          </div>
        ) : (
          <>
            {view === 'overview' && (
              <Overview
                stats={stats}
                orders={orders.slice(0, 5)}
                products={products.filter((p) => (p.estoque ?? 0) < 10)}
                onProducts={() => navTo('products')}
                onOrders={() => navTo('orders')}
                onRefresh={() => { fetchData(); notify('Dados atualizados!'); }}
                loading={loadingData}
              />
            )}
            {view === 'products' && (
              <Products
                query={query}
                setQuery={setQuery}
                items={filteredProducts}
                page={page}
                setPage={setPage}
                onAdd={() => { setEditProduct(null); setModal(true); }}
                onEdit={(p) => { setEditProduct(p); setModal(true); }}
                onDelete={handleDeleteProduct}
              />
            )}
            {view === 'orders' && (
              <Orders
                query={query}
                setQuery={setQuery}
                items={filteredOrders}
                onStatusChange={handleOrderStatus}
                onFilter={() => notify('Use a busca para filtrar pedidos')}
              />
            )}
          </>
        )}
      </S.Main>

      {modal && (
        <ProductModal
          product={editProduct}
          onClose={() => setModal(false)}
          onSave={async (formData) => {
            let error;
            if (formData.id) {
              ({ error } = await supabase
                .from('products')
                .update({
                  categoria: formData.categoria,
                  titulo:    formData.titulo,
                  valor:     Number(formData.valor),
                  estoque:   Number(formData.estoque),
                  imagem:    formData.imagem || null,
                  status:    formData.status,
                })
                .eq('id', formData.id));
            } else {
              ({ error } = await supabase.from('products').insert({
                categoria: formData.categoria,
                titulo:    formData.titulo,
                valor:     Number(formData.valor),
                estoque:   Number(formData.estoque),
                imagem:    formData.imagem || null,
                status:    formData.status || 'Em estoque',
              }));
            }
            if (error) {
              notify('Erro ao salvar produto: ' + error.message);
              return;
            }
            setModal(false);
            notify(formData.id ? 'Produto atualizado!' : 'Produto adicionado!');
            fetchData();
          }}
        />
      )}

      {toast && <S.Toast role="status">{toast}</S.Toast>}
    </S.Shell>
  );
}

/* ── Subcomponentes ── */

function Heading({ eyebrow, title, description, children }) {
  return (
    <S.Heading>
      <div>
        <S.Eyebrow>{eyebrow}</S.Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </S.Heading>
  );
}

function Stat({ title, value, detail, badge, icon }) {
  return (
    <S.Stat>
      <header><span>{title}</span><b>{badge}</b></header>
      <div className="icon">{icon}</div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </S.Stat>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <S.SearchBox>
      <FiSearch />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </S.SearchBox>
  );
}

/* ── Overview ── */
function Overview({ stats, orders, products: lowStock, onProducts, onOrders, onRefresh, loading }) {
  return (
    <S.Page>
      <Heading
        eyebrow="PAINEL OPERACIONAL"
        title="Visão geral"
        description="Resumo das operações e status do estoque."
      >
        <S.Date>
          <span>Data atual</span>
          <strong>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
        </S.Date>
      </Heading>

      <S.Stats>
        <Stat
          title="Vendas do dia"
          value={money(stats.todayRevenue)}
          detail="Pedidos confirmados hoje"
          badge="Hoje"
          icon={<FiTrendingUp />}
        />
        <Stat
          title="Pedidos pendentes"
          value={String(stats.pendingOrders)}
          detail="Aguardando processamento"
          badge={stats.pendingOrders > 0 ? 'Atenção' : 'OK'}
          icon={<FiClock />}
        />
        <Stat
          title="Estoque baixo"
          value={String(lowStock.length)}
          detail="Produtos com menos de 10 unidades"
          badge={lowStock.length > 0 ? 'Alertas' : 'OK'}
          icon={<FiAlertTriangle />}
        />
      </S.Stats>

      <S.OverviewGrid>
        <S.Panel>
          <S.PanelTitle>
            <h2>Últimos pedidos</h2>
            <button onClick={onOrders}>Ver tudo</button>
          </S.PanelTitle>
          {loading ? (
            <p style={{ padding: 16, color: '#888', fontSize: 14 }}>Carregando...</p>
          ) : orders.length === 0 ? (
            <p style={{ padding: 16, color: '#888', fontSize: 14 }}>Nenhum pedido ainda.</p>
          ) : (
            orders.map((o) => (
              <Activity
                key={o.id}
                icon={<FiShoppingBag />}
                title={`Pedido de ${o.usuarios?.nome || 'Cliente'} — ${money(o.total)}`}
                detail={`${o.usuarios?.email || ''} · ${STATUS_LABELS[o.status] || o.status}`}
                time={fmt_date(o.created_at)}
                warning={o.status === 'pending'}
              />
            ))
          )}
        </S.Panel>

        <S.System>
          <h2>Status do sistema</h2>
          <p><i className="green" />Supabase Database <span>Online</span></p>
          <p><i className="green" />Auth Service <span>Online</span></p>
          <p><i className="green" />Storage API <span>Online</span></p>
          <button onClick={onRefresh}><FiRefreshCw /> Atualizar dados</button>
        </S.System>
      </S.OverviewGrid>
    </S.Page>
  );
}

function Activity({ icon, title, detail, time, warning }) {
  return (
    <S.Activity>
      <span className={warning ? 'warning' : ''}>{icon}</span>
      <div><strong>{title}</strong><p>{detail}</p></div>
      <time>{time}</time>
    </S.Activity>
  );
}

/* ── Products view ── */
function Products({ query, setQuery, items, page, setPage, onAdd, onEdit, onDelete }) {
  const PER_PAGE = 8;
  const pageItems = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <S.Page>
      <Heading
        eyebrow="CATÁLOGO"
        title="Gerenciamento de produtos"
        description="Visualize, adicione ou edite o inventário de autopeças."
      >
        <S.Actions>
          <SearchBox value={query} onChange={setQuery} placeholder="Buscar produtos..." />
          <S.PrimaryButton onClick={onAdd}><FiPlus /> Novo produto</S.PrimaryButton>
        </S.Actions>
      </Heading>

      <S.DataPanel>
        <S.ProductHead>
          <span>Produto</span>
          <span>Categoria</span>
          <span>Preço</span>
          <span>Estoque</span>
          <span>Ações</span>
        </S.ProductHead>

        {pageItems.map((product) => (
          <S.ProductRow key={product.id}>
            <span className="product">
              {product.imagem
                ? <img src={product.imagem} alt={product.titulo} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />
                : <i style={{ marginRight: 8 }}>📦</i>
              }
              <strong>{product.titulo}</strong>
            </span>
            <span><em>{product.categoria}</em></span>
            <b>{money(product.valor)}</b>
            <span className="stock">
              <i className={
                product.estoque === 0 ? 'red' :
                product.estoque < 10 ? 'orange' : 'green'
              } />
              {product.estoque ?? 0}
            </span>
            <span style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => onEdit(product)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: 4 }}
                title="Editar"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}
                title="Excluir"
              >
                <FiTrash2 size={16} />
              </button>
            </span>
          </S.ProductRow>
        ))}

        {items.length === 0 && (
          <S.Empty>
            {query ? `Nenhum produto encontrado para "${query}".` : 'Nenhum produto cadastrado ainda.'}
          </S.Empty>
        )}

        <S.Pagination>
          <span>
            Mostrando {items.length ? (page - 1) * PER_PAGE + 1 : 0}–{Math.min(page * PER_PAGE, items.length)} de {items.length} produtos
          </span>
          <div>
            <button aria-label="Página anterior" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}>
              <FiChevronLeft />
            </button>
            <button aria-label="Próxima página" disabled={page * PER_PAGE >= items.length} onClick={() => setPage(page + 1)}>
              <FiChevronRight />
            </button>
          </div>
        </S.Pagination>
      </S.DataPanel>
    </S.Page>
  );
}

/* ── Orders view ── */
function Orders({ query, setQuery, items, onStatusChange, onFilter }) {
  const total    = items.length;
  const pending  = items.filter((o) => o.status === 'pending').length;
  const revenue  = items.reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <S.Page>
      <Heading
        eyebrow="LOGÍSTICA"
        title="Gestão de pedidos"
        description="Acompanhe e gerencie os pedidos recentes."
      >
        <S.Actions>
          <SearchBox value={query} onChange={setQuery} placeholder="Procurar pedido..." />
          <S.Filter aria-label="Filtrar pedidos" onClick={onFilter}><FiFilter /></S.Filter>
        </S.Actions>
      </Heading>

      <S.Stats className="order-stats">
        <Stat title="Total de pedidos" value={String(total)} detail="Todos os pedidos"        badge="Total"     icon={<FiShoppingBag />} />
        <Stat title="Pendentes"        value={String(pending)} detail="Aguardando processamento" badge={pending > 0 ? 'Atenção' : 'OK'} icon={<FiClock />} />
        <Stat title="Valor total"      value={money(revenue)} detail="Soma de todos os pedidos" badge="Faturamento" icon={<FiTrendingUp />} />
      </S.Stats>

      <S.DataPanel>
        <S.PanelTitle><h2>Pedidos</h2></S.PanelTitle>
        <S.OrderHead>
          <span>ID</span>
          <span>Cliente</span>
          <span>Data</span>
          <span>Total</span>
          <span>Pagamento</span>
          <span>Status</span>
        </S.OrderHead>

        {items.map((order) => (
          <S.OrderRow key={order.id}>
            <strong style={{ fontSize: 12, fontFamily: 'monospace' }}>
              {order.id.slice(0, 8).toUpperCase()}
            </strong>
            <span className="client">
              <i>{(order.usuarios?.nome || 'U').charAt(0).toUpperCase()}</i>
              <span>
                <b>{order.usuarios?.nome || 'Cliente'}</b>
                <small>{order.usuarios?.email || ''}</small>
              </span>
            </span>
            <time>{fmt_date(order.created_at)}</time>
            <b>{money(order.total)}</b>
            <span style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
              {order.payment_method === 'pix' ? '⚡ PIX' : '💳 Cartão'}
            </span>
            <span>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
                style={{
                  fontSize: 12, padding: '4px 8px', borderRadius: 6,
                  border: '1px solid #e2e8f0', background: '#f8fafc',
                  cursor: 'pointer', fontWeight: 600,
                  color: order.status === 'paid' || order.status === 'delivered' ? '#16a34a' :
                         order.status === 'pending' ? '#d97706' :
                         order.status === 'cancelled' ? '#dc2626' : '#3b82f6',
                }}
              >
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </span>
          </S.OrderRow>
        ))}

        {items.length === 0 && (
          <S.Empty>{query ? `Nenhum pedido encontrado para "${query}".` : 'Nenhum pedido ainda.'}</S.Empty>
        )}
      </S.DataPanel>
    </S.Page>
  );
}

/* ── Product Modal ── */
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    id:        product?.id       || '',
    titulo:    product?.titulo   || '',
    categoria: product?.categoria || 'Freios',
    valor:     product?.valor    || '',
    estoque:   product?.estoque  ?? '',
    imagem:    product?.imagem   || '',
    status:    product?.status   || 'Em estoque',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.titulo || !form.categoria || !form.valor) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <S.ModalBackdrop onMouseDown={onClose}>
      <S.Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose} aria-label="Fechar"><FiX /></button>
        <S.Eyebrow>{form.id ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}</S.Eyebrow>
        <h2 id="product-modal-title">{form.id ? 'Editar produto' : 'Adicionar produto'}</h2>
        <p>Preencha os dados da peça no catálogo da AutoPro.</p>

        <label>
          Nome do produto *
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ex: Pastilha de Freio Cerâmica"
            autoFocus
          />
        </label>

        <div>
          <label>
            Categoria *
            <select name="categoria" value={form.categoria} onChange={handleChange}>
              <option>Freios</option>
              <option>Motor</option>
              <option>Suspensão</option>
              <option>Transmissão</option>
              <option>Acessórios</option>
              <option>Elétrica</option>
              <option>Filtros</option>
            </select>
          </label>
          <label>
            Preço (R$) *
            <input
              type="number"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </label>
        </div>

        <div>
          <label>
            Estoque inicial
            <input
              type="number"
              name="estoque"
              value={form.estoque}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Em estoque</option>
              <option>Sob encomenda</option>
              <option>Fora de estoque</option>
            </select>
          </label>
        </div>

        <label>
          URL da imagem
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              name="imagem"
              value={form.imagem}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
              style={{ flex: 1 }}
            />
            {form.imagem && (
              <img
                src={form.imagem}
                alt="preview"
                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #e2e8f0' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
        </label>

        <footer>
          <button onClick={onClose} disabled={saving}>Cancelar</button>
          <S.PrimaryButton onClick={handleSave} disabled={saving || !form.titulo || !form.valor}>
            {saving ? 'Salvando...' : <><FiCheck /> Salvar produto</>}
          </S.PrimaryButton>
        </footer>
      </S.Modal>
    </S.ModalBackdrop>
  );
}
