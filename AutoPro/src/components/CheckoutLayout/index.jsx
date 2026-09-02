import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutWrapper,
  Header,
  HeaderContent,
  Logo,
  SecurityBadge,
  MainContent,
  Footer,
  FooterContent,
  FooterLinks,
} from "./style";

const CheckoutLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header>
        <HeaderContent>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo>
              <span className="material-symbols-outlined fill">build_circle</span>
              AutoPro
            </Logo>
          </Link>
          <SecurityBadge>
            <span className="material-symbols-outlined">lock</span>
            <span className="hidden-mobile">Checkout Seguro</span>
          </SecurityBadge>
        </HeaderContent>
      </Header>

      <MainContent>{children}</MainContent>

      <Footer>
        <FooterContent>
          <div>© 2024 AutoPro Industrial Parts. Todos os direitos reservados.</div>
          <FooterLinks>
            <span>Suporte Técnico</span>
            <span>Política de Privacidade</span>
          </FooterLinks>
        </FooterContent>
      </Footer>
    </LayoutWrapper>
  );
};

export default CheckoutLayout;
