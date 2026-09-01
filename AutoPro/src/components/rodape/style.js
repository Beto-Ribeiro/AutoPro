import styled from "styled-components";

export const FooterWrapper = styled.footer`
  background-color: var(--surface-container-highest);
  border-top: 1px solid var(--outline-variant);
  width: 100%;
  margin-top: auto;
`;

export const FooterInner = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gutter);
  padding: var(--stack-lg) var(--margin-desktop);
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr 1fr;
  }

  @media (max-width: 768px) {
    padding: var(--stack-lg) var(--margin-mobile);
  }
`;

export const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--stack-md);

  h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--on-surface);
  }

  p {
    font-size: 0.875rem;
    color: var(--secondary);
    line-height: 1.5;
  }
`;

export const LinksBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--gutter);
  align-items: flex-start;

  @media (min-width: 768px) {
    justify-content: center;
  }

  a {
    font-size: 0.875rem;
    color: var(--secondary);
    opacity: 0.8;
    transition: opacity 0.15s, color 0.15s;

    &:hover {
      color: var(--on-surface);
      opacity: 1;
    }
  }
`;

export const CopyrightBlock = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }

  p {
    font-size: 0.875rem;
    color: var(--secondary);
  }
`;