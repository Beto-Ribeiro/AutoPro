import styled from "styled-components";

export const BannerSection = styled.section`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--surface-container-highest);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--outline-variant);

  @media (min-width: 768px) {
    height: 500px;
  }
`;

export const BannerImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA66M1R2FuaGjKqCFiPzEayXTEiz9WyvCZsJPsnQQSJH9mRkRcTUoOfQDyyS-7X_Ploml7lD1PEjRJUSvVT2Qjp3_b2wHyBnmFmdPdArbvjLpxgN9x-khqMkwVCFq3bpLuzhbvw75E05eRua4Levk0ssJJyxYa-LGXW-Ezww5qrS7w-KoO8y4FgPDpOaDnjJUqTCa3k0jkBLY3DFfg5e70Rt7Z5r3a_RmO5n9nKFJ-IYDOqNprTZNM');
  background-size: cover;
  background-position: center;
`;

export const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(92,64,60,0.90) 0%, transparent 70%);
  display: flex;
  align-items: center;
  padding: var(--gutter);

  @media (min-width: 768px) {
    padding: var(--margin-desktop);
  }
`;

export const BannerContent = styled.div`
  max-width: 560px;
  color: #ffffff;

  h1 {
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: var(--stack-md);
  }

  p {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--surface-container-low);
    margin-bottom: var(--stack-lg);
  }
`;

export const BannerCta = styled.button`
  background-color: var(--primary);
  color: var(--on-primary);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s, transform 0.1s;

  &:hover  { background-color: var(--primary-container); }
  &:active { transform: scale(0.97); }
`;