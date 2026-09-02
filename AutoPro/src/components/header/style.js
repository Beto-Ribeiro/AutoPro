import styled from "styled-components";

export const HeaderWrapper = styled.header`
  background-color: var(--surface-container-lowest);
  border-bottom: 1px solid var(--outline-variant);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--margin-desktop);
  width: 100%;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 50;

  @media (max-width: 768px) {
    padding: 0 var(--margin-mobile);
  }
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--stack-lg);
`;

export const Logo = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.01em;
  cursor: pointer;
`;

export const Nav = styled.nav`
  display: flex;
  gap: var(--gutter);
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    font-size: 1rem;
    font-weight: 400;
    color: var(--secondary);
    transition: color 0.15s;

    &:hover {
      color: var(--primary-container);
    }
  }
`;

export const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gutter);
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  padding: 6px 16px;
  gap: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: var(--on-surface);
    box-shadow: 0 0 0 1px var(--on-surface);
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: var(--on-surface);
    width: 240px;

    &::placeholder {
      color: var(--secondary);
    }
  }

  .material-symbols-outlined {
    color: var(--secondary);
    font-size: 20px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LoginBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--primary);
  transition: color 0.15s, transform 0.1s;

  &:hover  { color: var(--primary-container); }
  &:active { transform: scale(0.95); }
`;

export const CartBtn = styled.button`
  background: none;
  border: none;
  color: var(--secondary);
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.15s, transform 0.1s;

  &:hover  { color: var(--primary-container); }
  &:active { transform: scale(0.95); }

  &.active {
    color: var(--primary);
    border-bottom: 2px solid var(--primary);
    padding-bottom: 2px;
  }

  .material-symbols-outlined {
    font-size: 24px;
  }
`;