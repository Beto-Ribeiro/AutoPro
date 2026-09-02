import styled from "styled-components";
import { OptionCard, RadioCircle } from "../CheckoutDelivery/style";

export const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);
`;

export const PaymentOptionCard = styled(OptionCard)`
  padding: 0;
  overflow: hidden;
`;

export const PaymentHeader = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? 'var(--surface-container-low)' : 'var(--surface-container-lowest)'};
`;

export const PaymentBody = styled.div`
  padding: 24px;
  border-top: 1px solid var(--surface-variant);
  background-color: var(--surface-container-lowest);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: var(--on-surface);
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--surface-variant);
    border-radius: var(--radius-sm);
    background-color: var(--surface-container-lowest);
    color: var(--on-surface);
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: var(--on-surface);
    }
  }
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const PixBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 24px;
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--secondary);

  p {
    font-size: 14px;
    color: var(--secondary);
  }

  .qr-placeholder {
    width: 150px;
    height: 150px;
    background-color: var(--surface-container-lowest);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--surface-variant);
  }
`;

export const SuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

export const SuccessModal = styled.div`
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  box-shadow: var(--shadow-md);

  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--tertiary-fixed);
    color: var(--on-tertiary-fixed);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--on-surface);
  }

  p {
    font-size: 14px;
    color: var(--secondary);
  }
`;
