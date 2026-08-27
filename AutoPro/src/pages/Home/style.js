import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 25px 30px;
`

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 25px 30px;
`
export const Button = styled.button`
  width: 100%;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 4px;
  padding: 10px 0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary);
    color: var(--white);
    border: none;
  }

`