import styled from "styled-components";

export const PageWrapper = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--stack-lg) var(--margin-mobile);
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);

  @media (min-width: 768px) {
    padding: var(--stack-lg) var(--margin-desktop);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--gutter);

  h2 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--on-surface);
  }

  a {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--primary);

    &:hover { text-decoration: underline; }
  }
`;

export const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gutter);

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gutter);

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Section = styled.section`
  padding: var(--stack-lg) 0;
`;