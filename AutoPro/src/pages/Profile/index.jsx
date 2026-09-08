import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  ProfileContainer,
  TopNav,
  NavLeft,
  Logo,
  NavLinks,
  NavRight,
  MainArea,
  Sidebar,
  UserCard,
  SidebarLink,
  ContentArea,
  PageTitle,
  SectionCard,
  SectionHeader,
  GridContainer,
  InputGroup,
  EmptyState,
  AddressBox,
  Footer,
  FooterBrand,
  FooterLinks
} from './style';

/* ── helpers ── */
const fmt = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmt_date = (iso) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const STATUS_COLOR = {
  pending:   { bg: '#fef3c7', color: '#92400e', label: 'Pendente' },
  paid:      { bg: '#d1fae5', color: '#065f46', label: 'Pago' },
  shipped:   { bg: '#dbeafe', color: '#1e40af', label: 'Enviado' },
  delivered: { bg: '#d1fae5', color: '#065f46', label: 'Entregue' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelado' },
};

const TABS = ['perfil', 'enderecos', 'pedidos'];

/* ════════════════════════════════════════════════════════════ */
const Profile = () => {
  const navigate = useNavigate();

  const [session,   setSession]   = useState(null);
  const [profile,   setProfile]   = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('perfil');

  // Edição de perfil
  const [editing, setEditing]   = useState(false);
  const [editForm, setEditForm] = useState({ nome: '', telefone: '', cpf: '' });
  const [saving, setSaving]     = useState(false);
  const [alert,  setAlert]      = useState({ type: '', message: '' });

  /* ── Fetch de todos os dados do usuário ── */
  const fetchAll = useCallback(async (userId) => {
    const [profileRes, addrRes, ordersRes] = await Promise.all([
      supabase.from('usuarios').select('*').eq('id', userId).single(),
      supabase.from('enderecos').select('*').eq('usuario_id', userId).order('padrao', { ascending: false }).order('created_at', { ascending: true }),
      supabase
        .from('orders')
        .select(`
          id, status, total, shipping_cost, discount,
          payment_method, created_at, address_snapshot,
          order_items ( id, titulo, valor, quantidade, subtotal, imagem )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ]);

    if (!profileRes.error && profileRes.data) setProfile(profileRes.data);
    if (!addrRes.error && addrRes.data)      setAddresses(addrRes.data);
    if (!ordersRes.error && ordersRes.data)  setOrders(ordersRes.data);
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      setSession(session);
      await fetchAll(session.user.id);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate, fetchAll]);

  /* ── Logout ── */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  /* ── Edição de perfil ── */
  const startEdit = () => {
    setEditForm({
      nome:     profile?.nome     || '',
      telefone: profile?.telefone || '',
      cpf:      profile?.cpf      || '',
    });
    setEditing(true);
    setAlert({ type: '', message: '' });
  };

  const cancelEdit = () => setEditing(false);

  const saveProfile = async () => {
    setSaving(true);
    setAlert({ type: '', message: '' });
    const { error } = await supabase
      .from('usuarios')
      .update({
        nome:     editForm.nome,
        telefone: editForm.telefone,
        cpf:      editForm.cpf,
      })
      .eq('id', session.user.id);

    if (error) {
      setAlert({ type: 'error', message: 'Erro ao salvar. Tente novamente.' });
    } else {
      setProfile((prev) => ({ ...prev, ...editForm }));
      setEditing(false);
      setAlert({ type: 'success', message: 'Perfil atualizado com sucesso!' });
      setTimeout(() => setAlert({ type: '', message: '' }), 3000);
    }
    setSaving(false);
  };

  /* ── Deletar endereço ── */
  const deleteAddress = async (id) => {
    if (!window.confirm('Remover este endereço?')) return;
    const { error } = await supabase.from('enderecos').delete().eq('id', id);
    if (!error) setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  /* ── Definir endereço padrão ── */
  const setDefaultAddress = async (id) => {
    // Remove padrão de todos primeiro
    await supabase.from('enderecos').update({ padrao: false }).eq('usuario_id', session.user.id);
    await supabase.from('enderecos').update({ padrao: true }).eq('id', id);
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, padrao: a.id === id }))
    );
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: '#191c1e', fontFamily: 'Inter, sans-serif',
      }}>
        Carregando perfil...
      </div>
    );
  }

  const displayName  = profile?.nome     || session?.user?.user_metadata?.nome || 'Usuário';
  const displayEmail = session?.user?.email || '';
  const displayPhone = profile?.telefone  || '';
  const displayCpf   = profile?.cpf       || '';

  return (
    <ProfileContainer>
      {/* ── TopNav ── */}
      <TopNav>
        <NavLeft>
          <Logo onClick={() => navigate('/')}>AutoPro</Logo>
          <NavLinks>
            <a onClick={() => navigate('/')}>Loja</a>
            <a onClick={() => navigate('/cart')}>Carrinho</a>
          </NavLinks>
        </NavLeft>
        <NavRight>
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button className="profile-btn">Perfil</button>
        </NavRight>
      </TopNav>

      <MainArea>
        {/* ── Sidebar ── */}
        <Sidebar>
          <UserCard>
            <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
            <div className="info">
              <h3>{displayName}</h3>
              <p>{displayEmail}</p>
            </div>
          </UserCard>

          <SidebarLink $active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            Informações Pessoais
          </SidebarLink>

          <SidebarLink $active={activeTab === 'enderecos'} onClick={() => setActiveTab('enderecos')}>
            <span className="material-symbols-outlined">location_on</span>
            Endereços Salvos
            {addresses.length > 0 && (
              <span style={{
                marginLeft: 'auto', background: 'var(--primary)', color: '#fff',
                borderRadius: '50%', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>{addresses.length}</span>
            )}
          </SidebarLink>

          <SidebarLink $active={activeTab === 'pedidos'} onClick={() => setActiveTab('pedidos')}>
            <span className="material-symbols-outlined">receipt_long</span>
            Histórico de Pedidos
            {orders.length > 0 && (
              <span style={{
                marginLeft: 'auto', background: 'var(--primary)', color: '#fff',
                borderRadius: '50%', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>{orders.length}</span>
            )}
          </SidebarLink>

          <SidebarLink className="logout" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Sair da conta
          </SidebarLink>
        </Sidebar>

        {/* ── Conteúdo ── */}
        <ContentArea>
          <PageTitle>
            {activeTab === 'perfil'    && 'Informações Pessoais'}
            {activeTab === 'enderecos' && 'Endereços Salvos'}
            {activeTab === 'pedidos'   && 'Histórico de Pedidos'}
          </PageTitle>

          {/* ── Alert global ── */}
          {alert.message && (
            <div style={{
              padding: '12px 16px', borderRadius: 8, fontSize: '0.875rem',
              fontWeight: 500, marginBottom: 16,
              background: alert.type === 'success' ? '#d1fae5' : '#fee2e2',
              color:      alert.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${alert.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            }}>
              {alert.message}
            </div>
          )}

          {/* ════ Tab: Perfil ════ */}
          {activeTab === 'perfil' && (
            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined">badge</span>
                  Dados da Conta
                </h2>
                {!editing ? (
                  <button className="edit-btn" onClick={startEdit}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                    Editar
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="edit-btn" onClick={cancelEdit} style={{ background: '#f1f5f9', color: '#64748b' }}>
                      Cancelar
                    </button>
                    <button
                      className="edit-btn"
                      onClick={saveProfile}
                      disabled={saving}
                      style={{ background: 'var(--primary)', color: '#fff' }}
                    >
                      {saving ? 'Salvando...' : '✓ Salvar'}
                    </button>
                  </div>
                )}
              </SectionHeader>

              <GridContainer>
                <InputGroup>
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    value={editing ? editForm.nome : displayName}
                    disabled={!editing}
                    onChange={(e) => setEditForm((p) => ({ ...p, nome: e.target.value }))}
                  />
                </InputGroup>

                <InputGroup>
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={displayEmail}
                    disabled
                    title="O e-mail não pode ser alterado aqui."
                  />
                </InputGroup>

                <InputGroup>
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={editing ? editForm.telefone : displayPhone}
                    disabled={!editing}
                    placeholder="(00) 00000-0000"
                    onChange={(e) => setEditForm((p) => ({ ...p, telefone: e.target.value }))}
                  />
                </InputGroup>

                <InputGroup>
                  <label>CPF / CNPJ</label>
                  <input
                    type="text"
                    value={editing ? editForm.cpf : displayCpf}
                    disabled={!editing}
                    placeholder="000.000.000-00"
                    onChange={(e) => setEditForm((p) => ({ ...p, cpf: e.target.value }))}
                  />
                </InputGroup>
              </GridContainer>
            </SectionCard>
          )}

          {/* ════ Tab: Endereços ════ */}
          {activeTab === 'enderecos' && (
            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined">local_shipping</span>
                  Endereços de Entrega
                </h2>
                <button className="add-btn" onClick={() => navigate('/address')}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                  Novo endereço
                </button>
              </SectionHeader>

              <GridContainer>
                {addresses.length === 0 ? (
                  <EmptyState>
                    <p>Você não tem endereços cadastrados.</p>
                    <button
                      onClick={() => navigate('/address')}
                      style={{
                        marginTop: 12, background: 'var(--primary)', color: '#fff',
                        border: 'none', padding: '10px 20px', borderRadius: 8,
                        cursor: 'pointer', fontWeight: 600, fontSize: 14,
                      }}
                    >
                      + Adicionar Endereço
                    </button>
                  </EmptyState>
                ) : (
                  addresses.map((end) => (
                    <AddressBox key={end.id}>
                      <div className="actions">
                        {!end.padrao && (
                          <button
                            title="Definir como padrão"
                            onClick={() => setDefaultAddress(end.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#6b7280' }}>star</span>
                          </button>
                        )}
                        <button
                          title="Excluir endereço"
                          className="delete"
                          onClick={() => deleteAddress(end.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ef4444' }}>delete</span>
                        </button>
                      </div>
                      {end.padrao && <span className="badge">⭐ Padrão</span>}
                      <h4>{end.apelido || 'Endereço'}</h4>
                      <p>
                        {end.logradouro}, {end.numero}
                        {end.complemento && ` — ${end.complemento}`}<br />
                        {end.bairro}, {end.cidade} - {end.estado}<br />
                        CEP: {end.cep}
                      </p>
                    </AddressBox>
                  ))
                )}
              </GridContainer>
            </SectionCard>
          )}

          {/* ════ Tab: Pedidos ════ */}
          {activeTab === 'pedidos' && (
            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined">receipt_long</span>
                  Meus Pedidos
                </h2>
              </SectionHeader>

              {orders.length === 0 ? (
                <EmptyState>
                  <p>Você ainda não fez nenhum pedido.</p>
                  <button
                    onClick={() => navigate('/')}
                    style={{
                      marginTop: 12, background: 'var(--primary)', color: '#fff',
                      border: 'none', padding: '10px 20px', borderRadius: 8,
                      cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    }}
                  >
                    Ir para a Loja
                  </button>
                </EmptyState>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {orders.map((order) => {
                    const st = STATUS_COLOR[order.status] || { bg: '#f1f5f9', color: '#475569', label: order.status };
                    const addr = order.address_snapshot;
                    return (
                      <div
                        key={order.id}
                        style={{
                          border: '1px solid var(--outline-variant, #e2e8f0)',
                          borderRadius: 12, overflow: 'hidden',
                        }}
                      >
                        {/* ── Cabeçalho do pedido ── */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 16px',
                          background: 'var(--surface-container-low, #f8fafc)',
                          borderBottom: '1px solid var(--outline-variant, #e2e8f0)',
                          flexWrap: 'wrap', gap: 8,
                        }}>
                          <div>
                            <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>
                              Pedido #{order.id.slice(0, 8).toUpperCase()} · {fmt_date(order.created_at)}
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                              {order.payment_method === 'pix' ? '⚡ PIX' : '💳 Cartão'}
                              {' · '}Total: {fmt(order.total)}
                            </span>
                          </div>
                          <span style={{
                            fontSize: 12, fontWeight: 700, padding: '4px 10px',
                            borderRadius: 20, background: st.bg, color: st.color,
                          }}>
                            {st.label}
                          </span>
                        </div>

                        {/* ── Itens ── */}
                        <div style={{ padding: '12px 16px' }}>
                          {(order.order_items || []).map((item) => (
                            <div
                              key={item.id}
                              style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '8px 0',
                                borderBottom: '1px solid #f1f5f9',
                                gap: 8,
                              }}
                            >
                              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                {item.imagem && (
                                  <img
                                    src={item.imagem}
                                    alt={item.titulo}
                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                )}
                                <div>
                                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{item.titulo}</p>
                                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                                    Qtd: {item.quantidade} × {fmt(item.valor)}
                                  </p>
                                </div>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                                {fmt(item.subtotal || item.valor * item.quantidade)}
                              </span>
                            </div>
                          ))}

                          {/* ── Resumo de valores ── */}
                          <div style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>
                            {order.shipping_cost > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Frete</span>
                                <span>{fmt(order.shipping_cost)}</span>
                              </div>
                            )}
                            {order.discount > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                                <span>Desconto PIX</span>
                                <span>- {fmt(order.discount)}</span>
                              </div>
                            )}
                          </div>

                          {/* ── Endereço de entrega ── */}
                          {addr && (
                            <div style={{
                              marginTop: 12, padding: '10px 12px',
                              background: '#f8fafc', borderRadius: 8,
                              fontSize: 12, color: '#475569', lineHeight: 1.6,
                            }}>
                              <strong style={{ color: '#1e293b' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>location_on</span>
                                Entrega em:
                              </strong><br />
                              {addr.apelido && <>{addr.apelido} — </>}
                              {addr.logradouro}, {addr.numero}
                              {addr.complemento && `, ${addr.complemento}`} —{' '}
                              {addr.bairro}, {addr.cidade}/{addr.estado} — CEP {addr.cep}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          )}

        </ContentArea>
      </MainArea>

      {/* ── Footer ── */}
      <Footer>
        <FooterBrand>
          <span>AutoPro</span>
          <p>© 2025 AutoPro Industrial Parts. Todos os direitos reservados.</p>
        </FooterBrand>
        <FooterLinks>
          <a href="#">Contato</a>
          <a href="#">Política de Entrega</a>
          <a href="#">Trocas e Devoluções</a>
          <a href="#">Privacidade</a>
        </FooterLinks>
      </Footer>
    </ProfileContainer>
  );
};

export default Profile;
