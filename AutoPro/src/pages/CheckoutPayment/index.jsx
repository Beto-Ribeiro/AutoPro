import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabaseClient";
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
  Title,
  SectionCard,
  SectionHeader,
  ActionRow,
  SecondaryBtn,
  SmallItemThumbnail,
  RadioTitle,
  RadioCircle,
} from "../CheckoutDelivery/style";
import {
  PaymentContainer,
  PaymentOptionCard,
  PaymentHeader,
  PaymentBody,
  InputGroup,
  InputRow,
  PixBox,
  SuccessOverlay,
  SuccessModal
} from "./style";

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const createDemoPixQr = (amount) => {
  const size = 29;
  const seed = `AUTOPRO-DEMO-${amount.toFixed(2)}`;
  let state = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0) || 1;
  const next = () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state % 2;
  };
  const finder = (row, col, top, left) => {
    const y = row - top;
    const x = col - left;
    return y >= 0 && y < 7 && x >= 0 && x < 7 && (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4));
  };
  const cells = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const isFinder = finder(row, col, 0, 0) || finder(row, col, 0, size - 7) || finder(row, col, size - 7, 0);
      if (isFinder || next()) cells.push(<rect key={`${row}-${col}`} x={col} y={row} width="1" height="1" fill="#111827" />);
    }
  }
  return <svg viewBox={`0 0 ${size} ${size}`} width="152" height="152" role="img" aria-label="QR Code PIX de demonstração">{cells}</svg>;
};

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location  = useLocation();

  // Dados passados pela tela de Delivery via router state
  const {
    shippingPrice:    shippingFromDelivery = 0,
    shippingLabel:    shippingLabelFromDelivery = "Não calculado",
    addressSnapshot:  addressFromDelivery = null,
  } = location.state || {};

  const { cartItems, cartCount, cartTotal, clearCart, session } = useCart();
  const [method, setMethod]         = useState(null); // 1 = Cartão, 2 = PIX
  const [card, setCard]             = useState({ number: "", holder: "", expiry: "", cvv: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");

  const shippingPrice = shippingFromDelivery;
  const baseTotal     = cartTotal + shippingPrice;
  const pixDiscount   = method === 2 ? baseTotal * 0.05 : 0;
  const finalTotal    = baseTotal - pixDiscount;
  const pixQrCode = useMemo(() => createDemoPixQr(finalTotal), [finalTotal]);
  const cardComplete = Object.values(card).every((value) => value.trim());
  const paymentComplete = method === 2 || (method === 1 && cardComplete);

  const handleSubmit = async () => {
    if (!session) {
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) return;
    if (!paymentComplete) {
      setErrorMsg(method === 1
        ? "Preencha todos os dados do cartão para finalizar a compra."
        : "Selecione uma forma de pagamento para finalizar a compra.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.rpc('create_order_and_decrement_stock', {
        p_shipping_cost: shippingPrice,
        p_payment_method: method === 1 ? 'card' : 'pix',
        p_address_snapshot: addressFromDelivery,
        p_items: cartItems.map((item) => ({
          product_id: item.product?.id,
          quantidade: item.quantidade,
        })),
      });
      if (error) {
        const insufficientStock = /estoque insuficiente/i.test(error.message || '');
        setErrorMsg(insufficientStock
          ? 'Um produto do carrinho acabou de esgotar. Atualize o carrinho e tente novamente.'
          : 'Erro ao processar pedido. Tente novamente.');
        return;
      }

      await clearCart();
      setShowSuccess(true);

    } catch (err) {
      console.error("Erro inesperado:", err);
      setErrorMsg("Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutLayout>
      <CheckoutSteps currentStep={3} />

      <PageContainer>
        <MainCol>
          <PaymentContainer>
            <Title>Forma de Pagamento</Title>

            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined text-secondary">credit_card</span>
                  Como você quer pagar?
                </h2>
              </SectionHeader>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Cartão de Crédito */}
                <PaymentOptionCard $active={method === 1}>
                  <PaymentHeader $active={method === 1} onClick={() => setMethod(1)}>
                    <RadioCircle $active={method === 1} />
                    <RadioTitle style={{ marginBottom: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>credit_score</span>
                      Cartão de Crédito
                    </RadioTitle>
                  </PaymentHeader>

                  {method === 1 && (
                    <PaymentBody>
                      <InputGroup>
                        <label>Número do Cartão</label>
                        <input type="text" placeholder="0000 0000 0000 0000" value={card.number} onChange={(event) => setCard({ ...card, number: event.target.value })} />
                      </InputGroup>
                      <InputGroup>
                        <label>Nome do Titular</label>
                        <input type="text" placeholder="Como impresso no cartão" value={card.holder} onChange={(event) => setCard({ ...card, holder: event.target.value })} />
                      </InputGroup>
                      <InputRow>
                        <InputGroup>
                          <label>Validade</label>
                          <input type="text" placeholder="MM/AA" value={card.expiry} onChange={(event) => setCard({ ...card, expiry: event.target.value })} />
                        </InputGroup>
                        <InputGroup>
                          <label>CVV</label>
                          <input type="text" placeholder="123" value={card.cvv} onChange={(event) => setCard({ ...card, cvv: event.target.value })} />
                        </InputGroup>
                      </InputRow>
                    </PaymentBody>
                  )}
                </PaymentOptionCard>

                {/* PIX */}
                <PaymentOptionCard $active={method === 2}>
                  <PaymentHeader $active={method === 2} onClick={() => setMethod(2)}>
                    <RadioCircle $active={method === 2} />
                    <RadioTitle style={{ marginBottom: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>qr_code_scanner</span>
                      PIX (5% de desconto)
                    </RadioTitle>
                  </PaymentHeader>

                  {method === 2 && (
                    <PaymentBody>
                      <PixBox>
                        <div className="qr-placeholder">{pixQrCode}</div>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--on-surface)" }}>QR Code PIX de demonstração</p>
                          <p>Escaneie o código fictício para simular o pagamento de {fmt(finalTotal)}.</p>
                        </div>
                      </PixBox>
                    </PaymentBody>
                  )}
                </PaymentOptionCard>

              </div>
            </SectionCard>

            {/* Endereço selecionado (resumo) */}
            {addressFromDelivery && (
              <SectionCard style={{ marginTop: 16 }}>
                <SectionHeader>
                  <h2>
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                    Entrega em
                  </h2>
                </SectionHeader>
                <div style={{ padding: "8px 0", fontSize: 14, color: "var(--secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--on-surface)" }}>{addressFromDelivery.apelido}</strong><br />
                  {addressFromDelivery.logradouro}, {addressFromDelivery.numero}
                  {addressFromDelivery.complemento && ` — ${addressFromDelivery.complemento}`}<br />
                  {addressFromDelivery.bairro}, {addressFromDelivery.cidade} — {addressFromDelivery.estado}<br />
                  CEP: {addressFromDelivery.cep} · {shippingLabelFromDelivery}
                </div>
              </SectionCard>
            )}

            {/* Mensagem de erro */}
            {errorMsg && (
              <div style={{
                marginTop: 16, padding: "12px 16px", borderRadius: 8,
                background: "#fee2e2", color: "#991b1b", fontSize: 14,
                border: "1px solid #fca5a5", fontWeight: 500,
              }}>
                {errorMsg}
              </div>
            )}

            <ActionRow>
              <SecondaryBtn onClick={() => navigate("/checkout/delivery")}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                Voltar para Entrega
              </SecondaryBtn>
            </ActionRow>
          </PaymentContainer>
        </MainCol>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <SidebarCol>
          <SummaryBox style={{ top: 96 }}>
            <SectionHeader style={{ paddingBottom: 16 }}>
              <h2>Resumo do Pedido</h2>
            </SectionHeader>
            <SummaryContent style={{ paddingTop: 8 }}>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, borderBottom: "1px solid var(--surface-variant)", paddingBottom: 16, marginBottom: 8 }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <SmallItemThumbnail style={{ backgroundImage: `url('${item.product?.imagem}')` }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: 14, color: "var(--on-surface)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {item.product?.titulo}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--secondary)" }}>Qtd: {item.quantidade}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--on-surface)" }}>
                      {fmt((item.product?.valor ?? 0) * item.quantidade)}
                    </span>
                  </div>
                ))}
              </div>

              <SummaryRow>
                <span>Subtotal ({cartCount} itens)</span>
                <span className="val">{fmt(cartTotal)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Frete ({shippingLabelFromDelivery || "Expressa"})</span>
                <span className="val">{fmt(shippingPrice)}</span>
              </SummaryRow>

              {method === 2 && (
                <SummaryRow style={{ marginTop: 4 }}>
                  <span style={{ color: "var(--tertiary)", fontWeight: 600 }}>Desconto PIX (5%)</span>
                  <span style={{ color: "var(--tertiary)", fontWeight: 600 }}>- {fmt(pixDiscount)}</span>
                </SummaryRow>
              )}

              <SummaryTotal>
                <span className="label">Total</span>
                <div style={{ textAlign: "right" }}>
                  <span className="val" style={{ display: "block" }}>{fmt(finalTotal)}</span>
                  {method === 1 && (
                    <span style={{ fontSize: 12, color: "var(--secondary)" }}>
                      em até 6x de {fmt(finalTotal / 6)} s/ juros
                    </span>
                  )}
                </div>
              </SummaryTotal>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <PrimaryButton
                  onClick={handleSubmit}
                  disabled={isSubmitting || cartItems.length === 0 || !paymentComplete}
                >
                  {isSubmitting ? "Processando..." : "Finalizar Compra"}
                  {!isSubmitting && <span className="material-symbols-outlined icon">check_circle</span>}
                </PrimaryButton>
              </div>

              <SecurityInfo style={{ background: "var(--surface-container-low)", padding: 12, borderRadius: 4, border: "1px solid var(--surface-variant)", alignItems: "flex-start" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>security</span>
                <span style={{ fontSize: 12, textAlign: "left" }}>Ambiente 100% seguro. Pagamento processado com criptografia avançada.</span>
              </SecurityInfo>

            </SummaryContent>
          </SummaryBox>
        </SidebarCol>
      </PageContainer>

      {showSuccess && (
        <SuccessOverlay>
          <SuccessModal>
            <div className="icon-wrapper">
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>done_all</span>
            </div>
            <h2>Pedido Realizado!</h2>
            <p>Obrigado por comprar na AutoPro. Seu pedido foi confirmado e está sendo processado.</p>
            <PrimaryButton style={{ marginTop: 16 }} onClick={() => navigate("/")}>
              Voltar para Loja
            </PrimaryButton>
          </SuccessModal>
        </SuccessOverlay>
      )}
    </CheckoutLayout>
  );
};

export default CheckoutPayment;
