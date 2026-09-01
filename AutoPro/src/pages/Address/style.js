import styled from "styled-components";

export const PageBg = styled.div`
  min-height: 100vh;
  background-color: var(--background);
  background-image: radial-gradient(var(--surface-container-highest) 1px, transparent 1px);
  background-size: 24px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--margin-mobile);
  position: relative;
  overflow-x: hidden;

  @media (min-width: 768px) {
    padding: var(--margin-desktop);
  }
`;

export const FormCard = styled.main`
  width: 100%;
  max-width: 560px;
  background-color: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--stack-lg);
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);
  position: relative;
  z-index: 10;

  @media (min-width: 768px) {
    padding: var(--margin-desktop);
  }
`;

export const FormHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--stack-sm);
  text-align: center;
  margin-bottom: var(--stack-sm);
`;

export const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  background-color: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: var(--shadow-sm);

  .material-symbols-outlined {
    font-size: 28px;
    color: var(--primary);
    font-variation-settings: 'FILL' 0;
  }
`;

export const BrandName = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.01em;
`;

export const FormTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--on-surface);
  margin-top: 4px;
`;

export const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--secondary);
  margin-top: 4px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--stack-md);
  width: 100%;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--stack-sm);
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--on-surface);
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .leading-icon {
    position: absolute;
    left: 12px;
    font-size: 20px;
    color: var(--secondary);
    pointer-events: none;
    font-variation-settings: 'FILL' 0;
  }
`;

export const Input = styled.input`
  width: 100%;
  background-color: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-sm);
  padding: 10px 12px 10px ${({ $hasIcon }) => ($hasIcon ? "40px" : "12px")};
  font-size: 1rem;
  color: var(--on-surface);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder { color: var(--secondary); opacity: 0.7; }

  &:focus {
    border-color: var(--on-surface);
    box-shadow: 0 0 0 2px rgba(25,28,30,0.15);
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--stack-md);

  @media (min-width: 480px) {
    grid-template-columns: ${({ $cols }) => $cols || "1fr 1fr"};
  }
`;

export const CepRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

export const BuscarBtn = styled.button`
  background-color: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  color: var(--on-surface);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  transition: background-color 0.15s;
  height: 42px;

  &:hover { background-color: var(--surface-variant); }
`;

export const SubmitBtn = styled.button`
  width: 100%;
  background-color: var(--primary);
  color: var(--on-primary);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 14px;
  border: none;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: var(--shadow-sm);
  margin-top: var(--stack-sm);

  &:hover  { background-color: var(--primary-container); }
  &:active { transform: scale(0.99); }

  .material-symbols-outlined { font-size: 20px; }
`;
