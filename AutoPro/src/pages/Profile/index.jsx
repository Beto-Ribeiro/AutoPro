import React, { useState, useEffect } from 'react';
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

const Profile = () => {
  const navigate = useNavigate();
  
  // States
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      // Pega a sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      setSession(session);

      // Pega o perfil na tabela 'usuarios'
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (!userError && userData) {
        setProfile(userData);
      }

      // Pega os endereços na tabela 'enderecos'
      const { data: addressData, error: addressError } = await supabase
        .from('enderecos')
        .select('*')
        .eq('usuario_id', session.user.id);
        
      if (!addressError && addressData) {
        setAddresses(addressData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#191c1e' }}>Carregando perfil...</div>;
  }

  // Fallbacks if profile is empty
  const displayName = profile?.nome || session?.user?.user_metadata?.nome || 'Usuário';
  const displayEmail = session?.user?.email || '';
  const displayPhone = profile?.telefone || '';
  const displayCpf = profile?.cpf || '';

  return (
    <ProfileContainer>
      {/* TopNavBar */}
      <TopNav>
        <NavLeft>
          <Logo onClick={() => navigate('/')}>AutoPro</Logo>
          <NavLinks>
            <a href="#">Brakes</a>
            <a href="#">Engine</a>
            <a href="#">Suspension</a>
            <a href="#">Oil</a>
          </NavLinks>
        </NavLeft>
        <NavRight>
          <button className="cart-btn">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button className="profile-btn">
            Profile
          </button>
        </NavRight>
      </TopNav>

      <MainArea>
        {/* Sidebar Navigation (Desktop) */}
        <Sidebar>
          <UserCard>
            <div className="avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="info">
              <h3>{displayName}</h3>
              <p>{displayEmail}</p>
            </div>
          </UserCard>
          
          <SidebarLink $active>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            Personal Info
          </SidebarLink>
          
          <SidebarLink>
            <span className="material-symbols-outlined">location_on</span>
            Saved Addresses
          </SidebarLink>
          
          <SidebarLink>
            <span className="material-symbols-outlined">receipt_long</span>
            Order History
          </SidebarLink>
          
          <SidebarLink className="logout" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Logout
          </SidebarLink>
        </Sidebar>

        {/* Main Content Area */}
        <ContentArea>
          <PageTitle>Configurações de Perfil</PageTitle>
          
          {/* Personal Info Card */}
          <SectionCard>
            <SectionHeader>
              <h2>
                <span className="material-symbols-outlined">badge</span>
                Informações Pessoais
              </h2>
              <button className="edit-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span> Editar
              </button>
            </SectionHeader>
            
            <GridContainer>
              <InputGroup>
                <label>Nome Completo</label>
                <input disabled type="text" value={displayName} />
              </InputGroup>
              <InputGroup>
                <label>E-mail</label>
                <input disabled type="email" value={displayEmail} />
              </InputGroup>
              <InputGroup>
                <label>Telefone</label>
                <input disabled type="tel" value={displayPhone} />
              </InputGroup>
              <InputGroup>
                <label>CPF/CNPJ</label>
                <input disabled type="text" value={displayCpf} />
              </InputGroup>
            </GridContainer>
          </SectionCard>

          {/* Addresses Section */}
          <SectionCard>
            <SectionHeader>
              <h2>
                <span className="material-symbols-outlined">local_shipping</span>
                Endereços Salvos
              </h2>
              <button className="add-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Adicionar
              </button>
            </SectionHeader>
            
            <GridContainer>
              {addresses.length === 0 ? (
                <EmptyState>
                  Você não tem nenhum endereço cadastrado.
                </EmptyState>
              ) : (
                addresses.map(end => (
                  <AddressBox key={end.id}>
                    <div className="actions">
                      <button><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span></button>
                      <button className="delete"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span></button>
                    </div>
                    {end.padrao && (
                      <span className="badge">Padrão</span>
                    )}
                    <h4>{end.apelido || displayName}</h4>
                    <p>
                      {end.logradouro}, {end.numero} {end.complemento && ` - ${end.complemento}`}<br/>
                      {end.bairro}, {end.cidade} - {end.estado}<br/>
                      CEP: {end.cep}
                    </p>
                  </AddressBox>
                ))
              )}
            </GridContainer>
          </SectionCard>
        </ContentArea>
      </MainArea>

      {/* Footer */}
      <Footer>
        <FooterBrand>
          <span>AutoPro</span>
          <p>© 2024 AutoPro Industrial Parts. All rights reserved.</p>
        </FooterBrand>
        <FooterLinks>
          <a href="#">Contact Us</a>
          <a href="#">Shipping Policy</a>
          <a href="#">Returns</a>
          <a href="#">Privacy</a>
        </FooterLinks>
      </Footer>
    </ProfileContainer>
  );
};

export default Profile;
