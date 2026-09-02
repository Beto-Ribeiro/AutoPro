import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutLayout from "../../components/CheckoutLayout";
import CheckoutSteps from "../../components/CheckoutSteps";
import {
  PageContainer,
  MainCol,
  SidebarCol,
  SummaryBox,
  SummaryContent,
  SummaryRow,
  SummaryTotal,
  PrimaryButton,
  SecurityInfo,
} from "../CheckoutReview/style";
import {
  DeliveryContainer,
  Title,
  SectionCard,
  SectionHeader,
  GridOptions,
  ListOptions,
  OptionLabel,
  OptionCard,
  OptionRow,
  RadioHeader,
  RadioTitle,
  RadioCircle,
  Badge,
  AddressText,
  EditLink,
  OptionDesc,
  OptionPrice,
  ActionRow,
  SecondaryBtn,
  SmallItemThumbnail,
} from "./style";

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CheckoutDelivery = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal } = useCart();
  const [address, setAddress] = useState(1);
  const [shipping, setShipping] = useState(1); // 1 = Sedex, 2 = PAC

  const shippingPrice = shipping === 1 ? 45.90 : 22.50;
  const finalTotal = cartTotal + shippingPrice;

  return (
    <CheckoutLayout>
      <CheckoutSteps currentStep={2} />

      <PageContainer>
        <MainCol>
          <DeliveryContainer>
            <Title>Entrega e Frete</Title>

            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  Endereço de Entrega
                </h2>
                <button>
                  <span className="material-symbols-outlined" style={{fontSize: 18}}>add</span>
                  Novo Endereço
                </button>
              </SectionHeader>
              
              <GridOptions>
                <OptionLabel>
                  <input type="radio" name="address" checked={address === 1} onChange={() => setAddress(1)} />
                  <OptionCard $active={address === 1}>
                    <RadioHeader>
                      <RadioTitle>
                        <RadioCircle $active={address === 1} />
                        Oficina Principal
                      </RadioTitle>
                      <Badge>Padrão</Badge>
                    </RadioHeader>
                    <AddressText>
                      Av. das Indústrias, 1500<br/>
                      Galpão 4<br/>
                      São Paulo - SP, 01234-567
                    </AddressText>
                    <EditLink>Editar</EditLink>
                  </OptionCard>
                </OptionLabel>

                <OptionLabel>
                  <input type="radio" name="address" checked={address === 2} onChange={() => setAddress(2)} />
                  <OptionCard $active={address === 2}>
                    <RadioHeader>
                      <RadioTitle>
                        <RadioCircle $active={address === 2} />
                        Residência
                      </RadioTitle>
                    </RadioHeader>
                    <AddressText>
                      Rua das Flores, 123<br/>
                      Apto 45<br/>
                      Campinas - SP, 13010-000
                    </AddressText>
                    <EditLink>Editar</EditLink>
                  </OptionCard>
                </OptionLabel>
              </GridOptions>
            </SectionCard>

            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined text-secondary">local_shipping</span>
                  Opções de Entrega
                </h2>
              </SectionHeader>
              
              <ListOptions>
                <OptionLabel>
                  <input type="radio" name="shipping" checked={shipping === 1} onChange={() => setShipping(1)} />
                  <OptionCard $active={shipping === 1} style={{ padding: '16px' }}>
                    <OptionRow>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <RadioCircle $active={shipping === 1} />
                        <div>
                          <RadioTitle style={{ marginBottom: 0 }}>Expressa (Sedex)</RadioTitle>
                          <OptionDesc>Receba em até 2 dias úteis</OptionDesc>
                        </div>
                      </div>
                      <OptionPrice>{fmt(45.90)}</OptionPrice>
                    </OptionRow>
                  </OptionCard>
                </OptionLabel>

                <OptionLabel>
                  <input type="radio" name="shipping" checked={shipping === 2} onChange={() => setShipping(2)} />
                  <OptionCard $active={shipping === 2} style={{ padding: '16px' }}>
                    <OptionRow>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <RadioCircle $active={shipping === 2} />
                        <div>
                          <RadioTitle style={{ marginBottom: 0 }}>Econômica (PAC)</RadioTitle>
                          <OptionDesc>Receba em até 7 dias úteis</OptionDesc>
                        </div>
                      </div>
                      <OptionPrice>{fmt(22.50)}</OptionPrice>
                    </OptionRow>
                  </OptionCard>
                </OptionLabel>
              </ListOptions>
            </SectionCard>

            <ActionRow>
              <SecondaryBtn onClick={() => navigate('/checkout/review')}>
                <span className="material-symbols-outlined" style={{fontSize: 20}}>arrow_back</span>
                Voltar para Identificação
              </SecondaryBtn>
              <PrimaryButton style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/checkout/payment')}>
                Ir para Pagamento
                <span className="material-symbols-outlined icon">arrow_forward</span>
              </PrimaryButton>
            </ActionRow>
          </DeliveryContainer>
        </MainCol>

        <SidebarCol>
          <SummaryBox style={{ top: 96 }}>
            <SectionHeader style={{ paddingBottom: 16 }}>
              <h2>Resumo do Pedido</h2>
            </SectionHeader>
            <SummaryContent style={{ paddingTop: 8 }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--surface-variant)', paddingBottom: 16, marginBottom: 8 }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <SmallItemThumbnail style={{ backgroundImage: `url('${item.product?.imagem}')` }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 14, color: 'var(--on-surface)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.product?.titulo}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--secondary)' }}>Qtd: {item.quantidade}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>
                      {fmt(item.product?.valor * item.quantidade)}
                    </span>
                  </div>
                ))}
              </div>

              <SummaryRow>
                <span>Subtotal ({cartCount} itens)</span>
                <span className="val">{fmt(cartTotal)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Frete</span>
                <span className="val">{fmt(shippingPrice)}</span>
              </SummaryRow>
              
              <SummaryTotal>
                <span className="label">Total</span>
                <div style={{ textAlign: 'right' }}>
                  <span className="val" style={{ display: 'block' }}>{fmt(finalTotal)}</span>
                  <span style={{ fontSize: 12, color: 'var(--secondary)' }}>
                    em até 6x de {fmt(finalTotal / 6)} s/ juros
                  </span>
                </div>
              </SummaryTotal>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }} className="mobile-only-actions">
                <PrimaryButton onClick={() => navigate('/checkout/payment')}>
                  Ir para Pagamento
                  <span className="material-symbols-outlined icon">arrow_forward</span>
                </PrimaryButton>
                <SecondaryBtn style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/checkout/review')}>
                  Voltar
                </SecondaryBtn>
              </div>

              <SecurityInfo style={{ background: 'var(--surface-container-low)', padding: 12, borderRadius: 4, border: '1px solid var(--surface-variant)', alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>security</span>
                <span style={{ fontSize: 12, textAlign: 'left' }}>Ambiente 100% seguro. Seus dados de entrega são criptografados.</span>
              </SecurityInfo>

            </SummaryContent>
          </SummaryBox>
        </SidebarCol>
      </PageContainer>
    </CheckoutLayout>
  );
};

export default CheckoutDelivery;
