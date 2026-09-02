import styled, { keyframes } from 'styled-components';

/* ── Animation ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Page wrapper: dark background, dot pattern ── */
export const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #f7f9fb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;

  /* Subtle dot grid pattern */
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(#e0e3e5 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
    z-index: 0;
  }
`;

/* ── Card ── */
export const Card = styled.main`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border: 1px solid #e0e3e5;
  border-radius: 12px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.35);
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${fadeUp} 0.45s ease-out both;

  @media (max-width: 520px) {
    padding: 28px 20px;
  }
`;

/* ── Brand header ── */
export const BrandHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  margin-bottom: 24px;
`;

export const BrandIcon = styled.div`
  width: 52px;
  height: 52px;
  background: #f2f4f6;
  border: 1px solid #e0e3e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);

  svg {
    font-size: 26px;
    color: var(--primary);
  }
`;

export const BrandName = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.03em;
  margin: 0;
`;

export const PageTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--secondary);
  margin: 4px 0 0;
`;

export const PageSubtitle = styled.p`
  font-size: 0.8125rem;
  color: #565e74;
  margin: 4px 0 0;
  line-height: 1.5;
`;

/* ── Form ── */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--secondary);
  letter-spacing: 0.02em;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg.field-icon {
    position: absolute;
    left: 12px;
    font-size: 18px;
    color: #565e74;
    pointer-events: none;
    transition: color 0.15s;
  }

  &:focus-within svg.field-icon {
    color: var(--primary);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  background: #ffffff;
  border: 1px solid #e6bdb8;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  color: var(--secondary);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: #9ca3af;
    font-size: 0.875rem;
  }

  &:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
  }
`;

export const PasswordWrapper = styled(InputWrapper)``;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 15px;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
  &:hover { color: var(--secondary); }
`;

/* ── Terms ── */
export const TermsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 6px;

  input[type='checkbox'] {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    accent-color: var(--primary);
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #e6bdb8;
  }

  label {
    font-size: 0.8125rem;
    color: #565e74;
    line-height: 1.5;
    cursor: pointer;

    a {
      color: var(--primary);
      font-weight: 500;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }
  }
`;

/* ── Submit ── */
export const SubmitButton = styled.button`
  width: 100%;
  padding: 13px;
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.04em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 6px;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);

  svg { font-size: 16px; }

  &:hover:not(:disabled) {
    background: #9a0010;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(183, 0, 17, 0.35);
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ── Divider footer ── */
export const FooterDivider = styled.div`
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e0e3e5;
  text-align: center;
  font-size: 0.8125rem;
  color: #565e74;

  a {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--secondary);
    text-decoration: none;
    margin-left: 4px;
    cursor: pointer;
    transition: color 0.15s;
    &:hover { color: var(--primary); }
  }
`;

/* ── Alert ── */
export const AlertMessage = styled.div`
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 7px;
  line-height: 1.4;

  &.error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
  &.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
`;
