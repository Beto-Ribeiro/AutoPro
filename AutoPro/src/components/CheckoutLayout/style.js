import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background);
  color: var(--on-background);
`;

export const Header = styled.header`
  background-color: var(--surface-container-lowest);
  border-bottom: 1px solid var(--outline-variant);
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  padding: 0 var(--margin-mobile);

  @media (min-width: 768px) {
    padding: 0 var(--margin-desktop);
  }
`;

export const HeaderContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.01em;
`;

export const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--secondary);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  span:first-child {
    font-size: 18px;
  }
`;

export const MainContent = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--stack-lg) var(--margin-mobile);

  @media (min-width: 768px) {
    padding: var(--stack-lg) var(--margin-desktop);
  }
`;

export const Footer = styled.footer`
  background-color: var(--surface-container-highest);
  border-top: 1px solid var(--outline-variant);
  padding: var(--stack-lg) var(--margin-mobile);
  width: 100%;
  margin-top: auto;

  @media (min-width: 768px) {
    padding: var(--stack-lg) var(--margin-desktop);
  }
`;

export const FooterContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
  color: var(--secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 16px;

  span {
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: var(--on-surface);
    }
  }
`;
