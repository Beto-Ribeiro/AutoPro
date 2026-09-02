import styled from "styled-components";

export const PageWrapper = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--stack-lg) var(--margin-mobile);
  display: flex;
  flex-direction: column;
  gap: var(--gutter);

  @media (min-width: 1024px) {
    flex-direction: row;
    padding: 48px var(--margin-desktop);
    align-items: flex-start;
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: var(--stack-lg) var(--margin-desktop);
  }
`;

/* ── Left – cart items ── */
export const CartSection = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);

  h1 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: var(--on-surface);
    letter-spacing: -0.01em;
  }
`;

export const CartCard = styled.div`
  background-color: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-md);
  padding: var(--stack-lg);
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);
  box-shadow: var(--shadow-sm);
`;

export const CartItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);
  padding-bottom: var(--stack-lg);
  border-bottom: 1px solid var(--outline-variant);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const ItemImage = styled.div`
  width: 100%;
  height: 128px;
  flex-shrink: 0;
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--outline-variant);

  @media (min-width: 480px) {
    width: 128px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const ItemInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--stack-sm);

  .item-category {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary);
  }

  .item-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--on-surface);
  }

  .item-stock {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: var(--secondary);
    margin-top: 4px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #22c55e;
      flex-shrink: 0;
    }
  }
`;

export const ItemControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--stack-md);

  @media (min-width: 480px) {
    flex-direction: column;
    align-items: flex-end;
    width: auto;
  }
`;

export const ItemPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--on-surface);
`;

export const QtyControl = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-sm);

  button {
    padding: 8px;
    background: none;
    border: none;
    color: var(--secondary);
    display: flex;
    align-items: center;
    transition: color 0.15s;
    font-size: 18px;

    &:hover { color: var(--primary); }

    .material-symbols-outlined { font-size: 18px; }
  }

  span.qty {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--on-surface);
    width: 32px;
    text-align: center;
    user-select: none;
  }
`;

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: var(--error);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s;

  &:hover { color: var(--on-error-container); }

  .material-symbols-outlined { font-size: 18px; }
`;

/* ── Right – summary ── */
export const SummaryAside = styled.aside`
  width: 100%;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    width: 384px;
  }
`;

export const SummaryCard = styled.div`
  background-color: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-md);
  padding: var(--stack-lg);
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 80px;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--on-surface);
    padding-bottom: var(--stack-md);
    border-bottom: 1px solid var(--outline-variant);
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: var(--on-surface);

  span:last-child {
    font-weight: 500;
  }
`;

export const ShippingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CepInput = styled.div`
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    background-color: var(--surface-container-low);
    border: 1px solid var(--outline-variant);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    font-size: 0.875rem;
    color: var(--on-surface);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &::placeholder { color: var(--secondary); }
    &:focus {
      border-color: var(--on-surface);
      box-shadow: 0 0 0 1px var(--on-surface);
    }
  }

  button {
    background-color: var(--surface);
    border: 1px solid var(--outline-variant);
    color: var(--on-surface);
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
    transition: background-color 0.15s;

    &:hover { background-color: var(--surface-container-high); }
  }
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--stack-md);
  border-top: 1px solid var(--outline-variant);

  span:first-child {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--on-surface);
  }

  span:last-child {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
  }
`;

export const CheckoutBtn = styled.button`
  width: 100%;
  background-color: var(--primary);
  color: var(--on-primary);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 16px;
  border: none;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: var(--shadow-sm);

  &:hover  { background-color: var(--primary-container); }
  &:active { transform: scale(0.99); }

  .material-symbols-outlined { font-size: 20px; }
`;

export const PaymentIcons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 8px;

  .material-symbols-outlined {
    font-size: 30px;
    color: var(--secondary);
    opacity: 0.5;
  }
`;
