import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabaseClient";
import { calculateShippingOptions } from "../../lib/shipping";
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
  const { cartItems, cartCount, cartTotal, session } = useCart();

  const [addresses, setAddresses]       = useState([]);
  const [loadingAddr, setLoadingAddr]   = useState(true);
  const [addressError, setAddressError] = useState("");
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [shipping, setShipping]         = useState(1); // id da opção de frete

  const selectedAddress = addresses.find((address) => address.id === selectedAddr);
  const shippingOptions = calculateShippingOptions(selectedAddress?.cep, cartTotal);
  const shippingOption = shippingOptions.find((o) => o.id === shipping);
  const shippingPrice  = shippingOption?.price ?? 0;
  const finalTotal     = cartTotal + shippingPrice;

  // ── Carrega endereços do Supabase ──────────────────────────
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!session?.user?.id) {
        setAddresses([]);
        setLoadingAddr(false);
        return;
      }
      setLoadingAddr(true);
      setAddressError("");
      const { data, error } = await supabase
        .from("enderecos")
        .select("*")
        .eq("usuario_id", session.user.id)
        .order("padrao", { ascending: false })
        .order("apelido", { ascending: true });

      if (error) {
        setAddresses([]);
        setAddressError("Não foi possível carregar seus endereços. Tente novamente.");
      } else if (data) {
        setAddresses(data);
        // Pré-seleciona o endereço padrão ou o primeiro
        const def = data.find((a) => a.padrao) || data[0];
        if (def) setSelectedAddr(def.id);
      }
      setLoadingAddr(false);
    };
    fetchAddresses();
  }, [session]);

  const handleContinue = () => {
    navigate("/checkout/payment", {
      state: {
        shippingPrice,
        shippingLabel:   shippingOption?.label,
        addressId:       selectedAddr,
        addressSnapshot: selectedAddress || null,
      },
    });
  };

  return (
    <CheckoutLayout>
      <CheckoutSteps currentStep={2} />

      <PageContainer>
        <MainCol>
          <DeliveryContainer>
            <Title>Entrega e Frete</Title>

            {/* ── Endereços ──────────────────────────────────── */}
            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  Endereço de Entrega
                </h2>
                <button onClick={() => navigate("/address")}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                  Novo Endereço
                </button>
              </SectionHeader>

              {loadingAddr ? (
                <p style={{ padding: "16px", color: "var(--secondary)", fontSize: 14 }}>
                  Carregando endereços...
                </p>
              ) : addressError ? (
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ color: "var(--secondary)", fontSize: 14, marginBottom: 12 }}>{addressError}</p>
                  <button onClick={() => window.location.reload()}>Tentar novamente</button>
                </div>
              ) : addresses.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ color: "var(--secondary)", fontSize: 14, marginBottom: 12 }}>
                    Você não tem nenhum endereço cadastrado.
                  </p>
                  <button
                    onClick={() => navigate("/address")}
                    style={{
                      background: "var(--primary)", color: "#fff",
                      border: "none", padding: "10px 20px",
                      borderRadius: "var(--radius-sm)", cursor: "pointer",
                      fontWeight: 600, fontSize: 14,
                    }}
                  >
                    + Adicionar Endereço
                  </button>
                </div>
              ) : (
                <GridOptions>
                  {addresses.map((addr) => (
                    <OptionLabel key={addr.id}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddr === addr.id}
                        onChange={() => setSelectedAddr(addr.id)}
                      />
                      <OptionCard $active={selectedAddr === addr.id}>
                        <RadioHeader>
                          <RadioTitle>
                            <RadioCircle $active={selectedAddr === addr.id} />
                            {addr.apelido || "Endereço"}
                          </RadioTitle>
                          {addr.padrao && <Badge>Padrão</Badge>}
                        </RadioHeader>
                        <AddressText>
                          {addr.logradouro}, {addr.numero}
                          {addr.complemento && ` — ${addr.complemento}`}<br />
                          {addr.bairro}, {addr.cidade} — {addr.estado}<br />
                          CEP: {addr.cep}
                        </AddressText>
                        <EditLink onClick={(event) => { event.preventDefault(); event.stopPropagation(); navigate(`/profile/addresses/${addr.id}/edit`); }}>Editar</EditLink>
                      </OptionCard>
                    </OptionLabel>
                  ))}
                </GridOptions>
              )}
            </SectionCard>

            {/* ── Opções de frete ─────────────────────────────── */}
            <SectionCard>
              <SectionHeader>
                <h2>
                  <span className="material-symbols-outlined text-secondary">local_shipping</span>
                  Opções de Entrega
                </h2>
              </SectionHeader>

              <ListOptions>
                {!selectedAddress && (
                  <p style={{ margin: 0, color: "var(--secondary)", fontSize: 14 }}>
                    Selecione um endereço para calcular o frete pelo CEP.
                  </p>
                )}
                {shippingOptions.map((opt) => (
                  <OptionLabel key={opt.id}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === opt.id}
                      onChange={() => setShipping(opt.id)}
                      disabled={!selectedAddress}
                    />
                    <OptionCard $active={shipping === opt.id} style={{ padding: "16px" }}>
                      <OptionRow>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <RadioCircle $active={shipping === opt.id} />
                          <div>
                            <RadioTitle style={{ marginBottom: 0 }}>{opt.label}</RadioTitle>
                            <OptionDesc>{opt.desc}</OptionDesc>
                          </div>
                        </div>
                        <OptionPrice>{fmt(opt.price)}</OptionPrice>
                      </OptionRow>
                    </OptionCard>
                  </OptionLabel>
                ))}
              </ListOptions>
            </SectionCard>

            <ActionRow>
              <SecondaryBtn onClick={() => navigate("/checkout/review")}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                Voltar para Identificação
              </SecondaryBtn>
              <PrimaryButton
                style={{ width: "auto", padding: "12px 32px" }}
                onClick={handleContinue}
                disabled={!selectedAddr}
              >
                Ir para Pagamento
                <span className="material-symbols-outlined icon">arrow_forward</span>
              </PrimaryButton>
            </ActionRow>
          </DeliveryContainer>
        </MainCol>

        {/* ── Sidebar resumo ──────────────────────────────────── */}
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
                <span>Frete</span>
                <span className="val">{fmt(shippingPrice)}</span>
              </SummaryRow>

              <SummaryTotal>
                <span className="label">Total</span>
                <div style={{ textAlign: "right" }}>
                  <span className="val" style={{ display: "block" }}>{fmt(finalTotal)}</span>
                  <span style={{ fontSize: 12, color: "var(--secondary)" }}>
                    em até 6x de {fmt(finalTotal / 6)} s/ juros
                  </span>
                </div>
              </SummaryTotal>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }} className="mobile-only-actions">
                <PrimaryButton onClick={handleContinue} disabled={!selectedAddr}>
                  Ir para Pagamento
                  <span className="material-symbols-outlined icon">arrow_forward</span>
                </PrimaryButton>
                <SecondaryBtn style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/checkout/review")}>
                  Voltar
                </SecondaryBtn>
              </div>

              <SecurityInfo style={{ background: "var(--surface-container-low)", padding: 12, borderRadius: 4, border: "1px solid var(--surface-variant)", alignItems: "flex-start" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>security</span>
                <span style={{ fontSize: 12, textAlign: "left" }}>Ambiente 100% seguro. Seus dados de entrega são criptografados.</span>
              </SecurityInfo>

            </SummaryContent>
          </SummaryBox>
        </SidebarCol>
      </PageContainer>
    </CheckoutLayout>
  );
};

export default CheckoutDelivery;
