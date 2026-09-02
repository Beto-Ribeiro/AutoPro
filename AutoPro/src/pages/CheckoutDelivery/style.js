import styled, { css } from "styled-components";

export const DeliveryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--stack-lg);
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: var(--on-surface);

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

export const SectionCard = styled.section`
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-variant);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: var(--stack-md);
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--on-surface);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  button {
    background: transparent;
    border: none;
    color: var(--primary);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const GridOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const ListOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionLabel = styled.label`
  cursor: pointer;
  position: relative;
  display: block;
  height: 100%;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

export const OptionCard = styled.div`
  border: 1px solid ${({ $active }) => $active ? 'var(--on-surface)' : 'var(--surface-variant)'};
  background-color: ${({ $active }) => $active ? 'var(--surface-container-low)' : 'var(--surface-container-lowest)'};
  padding: 16px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${({ $active }) => $active ? 'var(--on-surface)' : 'var(--secondary)'};
  }
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const RadioHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const RadioTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--on-surface);
`;

export const RadioCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${({ $active }) => $active ? 'var(--on-surface)' : 'var(--secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--on-surface);
    transform: scale(${({ $active }) => $active ? '1' : '0'});
    transition: transform 0.2s;
  }
`;

export const Badge = styled.span`
  background-color: var(--surface-variant);
  color: var(--on-surface);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const AddressText = styled.address`
  font-size: 14px;
  color: var(--secondary);
  font-style: normal;
  line-height: 1.5;
  flex-grow: 1;
`;

export const EditLink = styled.button`
  margin-top: 12px;
  font-size: 12px;
  color: var(--secondary);
  text-align: left;
  background: transparent;
  border: none;
  text-decoration: underline;
  width: fit-content;

  &:hover {
    color: var(--on-surface);
  }
`;

export const OptionDesc = styled.span`
  font-size: 14px;
  color: var(--secondary);
  display: block;
`;

export const OptionPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--on-surface);
`;

export const ActionRow = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
`;

export const SecondaryBtn = styled.button`
  padding: 12px 24px;
  border: 1px solid var(--on-surface);
  color: var(--on-surface);
  background-color: transparent;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--surface-container-low);
  }
`;

export const SmallItemThumbnail = styled.div`
  width: 48px;
  height: 48px;
  background-color: var(--surface-container);
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-variant);
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
`;
