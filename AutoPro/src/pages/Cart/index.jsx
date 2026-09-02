import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  PageWrapper, CartSection, CartCard, CartItem,
  ItemImage, ItemInfo, ItemControls, ItemPrice,
  QtyControl, RemoveBtn,
  SummaryAside, SummaryCard, SummaryRow, ShippingRow, CepInput,
  TotalRow, CheckoutBtn, PaymentIcons,
} from "./style";

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const SHIPPING = 45.0;

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal, loading, updateQty, removeFromCart, session } = useCart();
  const [cep, setCep] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const handleQty = async (id, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(id);
    await updateQty(id, newQty);
    setUpdatingId(null);
  };

  const handleRemove = async (id) => {
    setUpdatingId(id);
    await removeFromCart(id);
    setUpdatingId(null);
  };

  const total = cartTotal + SHIPPING;

  return (
    <PageWrapper>
      {/* ── Cart Items ── */}
      <CartSection>
        <h1>Carrinho de Compras</h1>

        <CartCard>
          {loading ? (
            <p style={{ color: "var(--secondary)", textAlign: "center", padding: "32px 0" }}>
              Carregando carrinho...
            </p>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, color: "var(--outline-variant)" }}>
                shopping_cart
              </span>
              <p style={{ color: "var(--secondary)", fontSize: "1rem" }}>
                Seu carrinho está vazio.
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
              >
                Ver Produtos
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const p = item.product;
              const isUpdating = updatingId === item.id;
              return (
                <CartItem key={item.id} style={{ opacity: isUpdating ? 0.6 : 1, transition: "opacity 0.2s" }}>
                  <ItemImage>
                    <img src={p?.imagem} alt={p?.titulo} loading="lazy" />
                  </ItemImage>

                  <ItemInfo>
                    <span className="item-category">{p?.categoria}</span>
                    <span className="item-title">{p?.titulo}</span>
                    <span className="item-stock">
                      <span className="dot" />
                      {p?.status || "Em estoque"}
                    </span>
                  </ItemInfo>

                  <ItemControls>
                    <ItemPrice>{fmt(p?.valor ?? 0)}</ItemPrice>

                    <QtyControl>
                      <button
                        aria-label="Diminuir quantidade"
                        onClick={() => handleQty(item.id, item.quantidade - 1)}
                        disabled={isUpdating || item.quantidade <= 1}
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <span className="qty">{item.quantidade}</span>
                      <button
                        aria-label="Aumentar quantidade"
                        onClick={() => handleQty(item.id, item.quantidade + 1)}
                        disabled={isUpdating}
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </QtyControl>

                    <RemoveBtn
                      onClick={() => handleRemove(item.id)}
                      disabled={isUpdating}
                    >
                      <span className="material-symbols-outlined">delete</span>
                      Remover
                    </RemoveBtn>
                  </ItemControls>
                </CartItem>
              );
            })
          )}
        </CartCard>
      </CartSection>

      {/* ── Order Summary ── */}
      <SummaryAside>
        <SummaryCard>
          <h2>Resumo do Pedido</h2>

          <SummaryRow>
            <span>
              Subtotal ({cartCount} {cartCount === 1 ? "item" : "itens"})
            </span>
            <span>{fmt(cartTotal)}</span>
          </SummaryRow>

          <ShippingRow>
            <SummaryRow>
              <span>Frete Estimado</span>
              <span>{fmt(SHIPPING)}</span>
            </SummaryRow>
            <CepInput>
              <input
                type="text"
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
              />
              <button type="button">Calcular</button>
            </CepInput>
          </ShippingRow>

          <TotalRow>
            <span>Total</span>
            <span>{fmt(total)}</span>
          </TotalRow>

          <CheckoutBtn
            disabled={cartItems.length === 0}
            onClick={() => {
              if (!session) {
                navigate("/login");
              } else {
                navigate("/checkout/review");
              }
            }}
          >
            <span className="material-symbols-outlined">lock</span>
            {session ? "Finalizar Compra" : "Entrar para Finalizar"}
          </CheckoutBtn>

          {!session && (
            <p style={{ fontSize: "0.75rem", color: "var(--secondary)", textAlign: "center", marginTop: -8 }}>
              Você está como convidado.{" "}
              <span
                style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}
                onClick={() => navigate("/login")}
              >
                Entrar
              </span>{" "}
              para salvar seu carrinho.
            </p>
          )}

          <PaymentIcons>
            <span className="material-symbols-outlined">credit_card</span>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="material-symbols-outlined">qr_code_2</span>
          </PaymentIcons>
        </SummaryCard>
      </SummaryAside>
    </PageWrapper>
  );
};

export default Cart;
