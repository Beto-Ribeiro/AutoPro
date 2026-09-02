import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutLayout from "../../components/CheckoutLayout";
import CheckoutSteps from "../../components/CheckoutSteps";
import {
  PageContainer,
  MainCol,
  SidebarCol,
  SectionCard,
  SectionHeader,
  CartItemList,
  CartItemRow,
  ItemImage,
  ItemDetails,
  ItemHeaderRow,
  ItemCategory,
  ItemTitle,
  ItemDesc,
  ItemPrice,
  ItemActions,
  QtyControl,
  RemoveButton,
  SummaryBox,
  SummaryContent,
  SummaryRow,
  SummaryTotal,
  PrimaryButton,
  SecurityInfo,
} from "./style";

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CheckoutReview = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal, updateQty, removeFromCart, loading } = useCart();

  const handleQty = (id, current, delta) => {
    const next = current + delta;
    if (next > 0) {
      updateQty(id, next);
    }
  };

  return (
    <CheckoutLayout>
      <CheckoutSteps currentStep={1} />

      <PageContainer>
        <MainCol>
          <SectionCard>
            <SectionHeader>
              <h2>Seu Carrinho ({cartCount} {cartCount === 1 ? 'item' : 'itens'})</h2>
            </SectionHeader>
            <CartItemList>
              {loading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--secondary)' }}>
                  Carregando...
                </div>
              ) : cartItems.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--secondary)' }}>
                  Seu carrinho está vazio.
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItemRow key={item.id}>
                    <ItemImage>
                      <img src={item.product?.imagem} alt={item.product?.titulo} />
                    </ItemImage>
                    <ItemDetails>
                      <ItemHeaderRow>
                        <div>
                          <ItemCategory>{item.product?.categoria}</ItemCategory>
                          <ItemTitle>{item.product?.titulo}</ItemTitle>
                          <ItemDesc>Em estoque</ItemDesc>
                        </div>
                        <ItemPrice>{fmt(item.product?.valor || 0)}</ItemPrice>
                      </ItemHeaderRow>
                      <ItemActions>
                        <QtyControl>
                          <button onClick={() => handleQty(item.id, item.quantidade, -1)}>
                            <span className="material-symbols-outlined">remove</span>
                          </button>
                          <span>{item.quantidade}</span>
                          <button onClick={() => handleQty(item.id, item.quantidade, 1)}>
                            <span className="material-symbols-outlined">add</span>
                          </button>
                        </QtyControl>
                        <RemoveButton onClick={() => removeFromCart(item.id)}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                          Remover
                        </RemoveButton>
                      </ItemActions>
                    </ItemDetails>
                  </CartItemRow>
                ))
              )}
            </CartItemList>
          </SectionCard>
        </MainCol>

        <SidebarCol>
          <SummaryBox>
            <SectionHeader>
              <h2>Resumo do Pedido</h2>
            </SectionHeader>
            <SummaryContent>
              <SummaryRow>
                <span>Subtotal ({cartCount} itens)</span>
                <span className="val">{fmt(cartTotal)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Descontos</span>
                <span className="discount">- {fmt(0)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Frete Estimado</span>
                <span className="val">Calculado depois</span>
              </SummaryRow>
              
              <SummaryTotal>
                <span className="label">Total Estimado</span>
                <span className="val">{fmt(cartTotal)}</span>
              </SummaryTotal>

              <PrimaryButton 
                onClick={() => navigate('/checkout/delivery')}
                disabled={cartItems.length === 0}
              >
                Continuar para Entrega
                <span className="material-symbols-outlined icon">arrow_forward</span>
              </PrimaryButton>

              <SecurityInfo>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock</span>
                <span>Ambiente 100% seguro. Suas informações estão protegidas.</span>
              </SecurityInfo>
            </SummaryContent>
          </SummaryBox>
        </SidebarCol>
      </PageContainer>
    </CheckoutLayout>
  );
};

export default CheckoutReview;
