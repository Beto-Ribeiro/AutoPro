import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  width: 100%;

  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--surface-variant);
    transform: translateY(-2px);
  }
`;

export const Img = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: var(--surface-container-low);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  ${Container}:hover & img {
    transform: scale(1.03);
  }
`;

export const Description = styled.div`
  padding: var(--stack-md);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: var(--stack-sm);
`;

export const Itens = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--stack-sm);
  flex-grow: 1;
`;

export const Category = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--secondary);
  background-color: var(--surface-container-low);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  width: fit-content;
`;

export const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.4;
  margin: 0;
  flex-grow: 1;
`;

export const Status = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ $available }) =>
      $available === false ? "#9ca3af" : "#22c55e"};
    flex-shrink: 0;
  }
`;

export const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--on-background);
  margin-top: var(--stack-md);
  display: block;
`;

export const AddButton = styled.button`
  width: 100%;
  background-color: ${({ $inCart }) =>
    $inCart ? "var(--surface-container-low)" : "var(--surface-container-lowest)"};
  border: 1px solid ${({ $inCart }) =>
    $inCart ? "var(--outline-variant)" : "var(--on-surface)"};
  color: ${({ $inCart }) =>
    $inCart ? "var(--secondary)" : "var(--on-surface)"};
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 10px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  margin-top: var(--stack-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: ${({ $inCart }) => ($inCart ? "default" : "pointer")};

  &:hover:not(:disabled) {
    background-color: var(--surface-container-low);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;