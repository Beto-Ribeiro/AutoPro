import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gutter);

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

export const MainCol = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);

  @media (min-width: 1024px) {
    width: 66.666%;
  }
`;

export const SidebarCol = styled.div`
  width: 100%;

  @media (min-width: 1024px) {
    width: 33.333%;
  }
`;

export const SectionCard = styled.section`
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  padding: var(--stack-md);
  border-bottom: 1px solid var(--outline-variant);
  background-color: var(--surface-container-low);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--on-surface);
  }
`;

export const CartItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CartItemRow = styled.div`
  padding: var(--stack-md);
  display: flex;
  flex-direction: column;
  gap: var(--stack-md);
  border-bottom: 1px solid var(--outline-variant);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--surface-container-low);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export const ItemImage = styled.div`
  width: 100%;
  height: 128px;
  flex-shrink: 0;
  background-color: var(--surface-container);
  border-radius: var(--radius-sm);
  border: 1px solid var(--outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
  }

  @media (min-width: 640px) {
    width: 128px;
  }
`;

export const ItemDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const ItemCategory = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--secondary);
  text-transform: uppercase;
  background-color: var(--surface-container);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  display: inline-block;
  margin-bottom: 4px;
`;

export const ItemTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--on-surface);
`;

export const ItemDesc = styled.p`
  font-size: 14px;
  color: var(--secondary);
  margin-top: 4px;
`;

export const ItemPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--on-surface);
  text-align: right;
`;

export const ItemActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
`;

export const QtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-sm);
  background-color: var(--surface-container-lowest);

  button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary);
    background: transparent;
    border: none;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      color: var(--primary);
      background-color: var(--surface-container-low);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    width: 48px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid var(--outline-variant);
    border-right: 1px solid var(--outline-variant);
    font-size: 16px;
  }
`;

export const RemoveButton = styled.button`
  color: var(--error);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  background: transparent;
  border: none;
  transition: all 0.2s;

  &:hover {
    text-decoration: underline;
  }
`;

export const SummaryBox = styled.div`
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 96px;
`;

export const SummaryContent = styled.div`
  padding: var(--stack-md);
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 16px;
  color: var(--secondary);
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .val {
    color: var(--on-surface);
    font-weight: 500;
  }
  .discount {
    color: var(--primary);
    font-weight: 500;
  }
`;

export const SummaryTotal = styled.div`
  border-top: 1px solid var(--outline-variant);
  padding-top: 16px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .label {
    font-size: 14px;
    font-weight: 600;
    color: var(--on-surface);
  }
  .val {
    font-size: 24px;
    font-weight: 700;
    color: var(--on-surface);
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  background-color: var(--primary);
  color: var(--on-primary);
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  border-radius: var(--radius-sm);
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: var(--primary-fixed-dim);
    box-shadow: var(--shadow-md);
    
    .icon {
      transform: translateX(4px);
    }
  }

  .icon {
    transition: transform 0.2s;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--secondary);
`;
