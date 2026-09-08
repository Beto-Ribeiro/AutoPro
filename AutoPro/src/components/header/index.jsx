import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  HeaderWrapper,
  LeftGroup,
  Logo,
  Nav,
  RightGroup,
  SearchBar,
  LoginBtn,
  CartBtn,
} from "./style";

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const location = useLocation();
  const { cartCount, session } = useCart();
  const isCartPage = location.pathname === "/cart";

  return (
    <HeaderWrapper>
      <LeftGroup>
        <Logo onClick={() => navigate("/")}>AutoPro</Logo>
        <Nav>
          <Link to="/?categoria=Freios">Freios</Link>
          <Link to="/?categoria=Motor">Motor</Link>
          <Link to="/?categoria=Suspensão">Suspensão</Link>
          <Link to="/?categoria=Óleo">Óleo</Link>
        </Nav>
      </LeftGroup>

      <RightGroup>
        <SearchBar as="form" onSubmit={event => { event.preventDefault(); navigate(`/?q=${encodeURIComponent(search.trim())}#destaques`); }}>
          <input type="search" aria-label="Buscar peças" placeholder="Buscar peças..." value={search} onChange={event => setSearch(event.target.value)} />
          <button type="submit" aria-label="Pesquisar" style={{ background: 'none', border: 0, display: 'flex' }}><span className="material-symbols-outlined">search</span></button>
        </SearchBar>

        {session ? (
          <LoginBtn onClick={() => navigate("/profile")}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              account_circle
            </span>
            Perfil
          </LoginBtn>
        ) : (
          <LoginBtn onClick={() => navigate("/login")}>Login</LoginBtn>
        )}

        <CartBtn
          className={isCartPage ? "active" : ""}
          onClick={() => navigate("/cart")}
          aria-label={`Carrinho${cartCount > 0 ? ` (${cartCount} itens)` : ""}`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: isCartPage ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            shopping_cart
          </span>

          {/* Badge de contagem */}
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 700,
                borderRadius: "9999px",
                minWidth: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                lineHeight: 1,
              }}
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </CartBtn>
      </RightGroup>
    </HeaderWrapper>
  );
};

export default Header;
