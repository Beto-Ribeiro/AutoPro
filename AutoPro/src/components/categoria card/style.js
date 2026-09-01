import styled from "styled-components";

export const Container = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--stack-lg);
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-md);
  border: 1px solid var(--outline-variant);
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  text-decoration: none;
  gap: var(--stack-sm);

  &:hover {
    box-shadow: var(--shadow-sm);
    .cat-icon { color: var(--primary); }
    .cat-label { color: var(--on-surface); }
  }
`;

export const CatIcon = styled.span`
  font-size: 2.25rem !important;
  color: var(--secondary);
  transition: color 0.2s;
  display: block;
`;

export const CatLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--on-surface);
  text-align: center;
  transition: color 0.2s;
`;