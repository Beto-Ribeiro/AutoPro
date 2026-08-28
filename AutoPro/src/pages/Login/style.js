import styled, { keyframes } from 'styled-components';

/* ── Animations ── */
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Root layout: fills viewport exactly ── */
export const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

/* ── Left panel ── */
export const HeroPanel = styled.div`
  flex: 1;
  position: relative;
  background-image: url('/engine-bg.png');
  background-size: cover;
  background-position: center;
  animation: ${fadeIn} 0.6s ease-out;
  overflow: hidden;

  /* gradient overlay — darker at bottom so text reads well */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      160deg,
      rgba(0, 0, 0, 0.40) 0%,
      rgba(0, 0, 0, 0.72) 100%
    );
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeroContent = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 48px;
  left: 48px;
  right: 48px;
  animation: ${slideUp} 0.7s ease-out 0.1s both;
`;

export const HeroLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;

  span {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.03em;
  }
`;

export const HeroLogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: var(--primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 17px;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(1.9rem, 3.2vw, 2.75rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.12;
  letter-spacing: -0.03em;
  margin: 0 0 14px;
`;

export const HeroDescription = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.65;
  max-width: 380px;
  margin: 0;
`;

/* ── Right panel ── */
export const FormPanel = styled.div`
  width: 440px;
  min-width: 440px;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 52px;
  overflow-y: auto;
  animation: ${slideUp} 0.6s ease-out both;

  @media (max-width: 900px) {
    width: 400px;
    min-width: 400px;
    padding: 0 36px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    padding: 0 28px;
  }
`;

/* ── Logo ── */
export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 36px;
`;

export const LogoIcon = styled.div`
  width: 34px;
  height: 34px;
  background: var(--primary);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
`;

export const LogoText = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.04em;
`;

/* ── Form header ── */
export const FormTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--secondary);
  margin: 0 0 4px;
  letter-spacing: -0.03em;
`;

export const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--tertiary);
  margin: 0 0 28px;
  line-height: 1.5;
`;

/* ── Fields ── */
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg.input-icon {
    position: absolute;
    left: 13px;
    color: #94a3b8;
    font-size: 15px;
    pointer-events: none;
    transition: color 0.15s;
  }

  &:focus-within svg.input-icon {
    color: var(--primary);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 11px 13px 11px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  color: var(--secondary);
  outline: none;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: #9ca3af;
    font-size: 0.875rem;
  }

  &:focus {
    border-color: var(--primary);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.08);
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
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

/* ── Password row ── */
export const PasswordRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ForgotLink = styled.button`
  background: none;
  border: none;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  padding: 0;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.15s;

  &:hover { opacity: 0.7; }
`;

/* ── Submit button ── */
export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s, transform 0.1s;

  &:hover:not(:disabled) {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  svg { font-size: 15px; }
`;

/* ── Divider ── */
export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  color: #9ca3af;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

/* ── Alt buttons ── */
export const AltButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AltButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: var(--secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  transition: background 0.15s, border-color 0.15s;

  svg { font-size: 16px; color: var(--tertiary); }

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

/* ── Footer ── */
export const FormFooter = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--tertiary);

  a {
    color: var(--secondary);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    &:hover { color: var(--primary); text-decoration: underline; }
  }
`;

/* ── Alert ── */
export const AlertMessage = styled.div`
  padding: 10px 14px;
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
  line-height: 1.4;

  &.error  { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
  &.success{ background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
`;
