import { useState, useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SellerProducts from '../../components/SellerProducts';
import { supabase } from '../../lib/supabaseClient';
import Address from '../Address';
import SavedAddresses from './SavedAddresses';
import MyOrders from './MyOrders';
import ChangePassword from './ChangePassword';
import { ProfileContainer, MainArea, Sidebar, UserCard, SidebarLink, ContentArea,
  PageTitle, SectionCard, SectionHeader, GridContainer, InputGroup } from './style';

export default function Profile({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    supabase.from('usuarios').select('nome, telefone, cpf').eq('id', user.id).maybeSingle()
      .then(({ data, error }) => { if (active) { setProfile(data); if (error) setError('Não foi possível carregar os dados adicionais do perfil.'); } });
    return () => { active = false; };
  }, [user.id]);
  const displayName = profile?.nome || user.user_metadata?.nome || 'Usuário';
  const entries = [
    ['personal', 'person', 'Informações pessoais'],
    ['security', 'lock', 'Senha e segurança'],
    ['addresses', 'location_on', 'Endereços salvos'],
    ['products', 'inventory_2', 'Meus produtos'],
    ['orders', 'receipt_long', 'Meus pedidos'],
  ];
  const selected = location.pathname.split('/')[2] || 'products';
  return <ProfileContainer><MainArea>
    <Sidebar aria-label="Menu do perfil">
      <UserCard><div className="avatar">{displayName.charAt(0).toUpperCase()}</div><div className="info"><h3>{displayName}</h3><p>{user.email}</p></div></UserCard>
      {entries.map(([path, icon, title]) => <SidebarLink as={Link} key={path} to={`/profile/${path}`} $active={selected === path} aria-current={selected === path ? 'page' : undefined}><span className="material-symbols-outlined">{icon}</span>{title}</SidebarLink>)}
      <SidebarLink className="logout" onClick={async () => {
        const { error } = await supabase.auth.signOut();
        if (error) { setError('Não foi possível sair. Tente novamente.'); return; }
        navigate('/login');
      }}><span className="material-symbols-outlined">logout</span>Sair</SidebarLink>
    </Sidebar>
    <ContentArea><PageTitle>Meu perfil</PageTitle>{error && <p role="alert">{error}</p>}
      <Routes>
        <Route index element={<Navigate to={location.hash === '#informacoes-pessoais' ? 'personal' : 'products'} replace />} />
        <Route path="products" element={<SellerProducts userId={user.id} />} />
        <Route path="addresses" element={<SavedAddresses userId={user.id} />} />
        <Route path="addresses/new" element={<Address embedded />} />
        <Route path="addresses/:addressId/edit" element={<Address embedded />} />
        <Route path="orders" element={<MyOrders userId={user.id} />} />
        <Route path="personal" element={<SectionCard><SectionHeader><h2>Informações pessoais</h2></SectionHeader><GridContainer>
          <InputGroup><label htmlFor="profile-name">Nome completo</label><input id="profile-name" disabled value={displayName} /></InputGroup>
          <InputGroup><label htmlFor="profile-email">E-mail</label><input id="profile-email" disabled value={user.email || ''} /></InputGroup>
          <InputGroup><label htmlFor="profile-phone">Telefone</label><input id="profile-phone" disabled value={profile?.telefone || user.user_metadata?.telefone || ''} /></InputGroup>
          <InputGroup><label htmlFor="profile-document">CPF/CNPJ</label><input id="profile-document" disabled value={profile?.cpf || user.user_metadata?.documento || ''} /></InputGroup>
        </GridContainer></SectionCard>} />
        <Route path="security" element={<ChangePassword />} />
        <Route path="*" element={<Navigate to="/profile/products" replace />} />
      </Routes>
    </ContentArea>
  </MainArea></ProfileContainer>;
}
