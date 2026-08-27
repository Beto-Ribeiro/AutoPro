import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 180px;
  height: 120px;
  margin-bottom: 12px;
  background-color: var(--white);
  border: 1px solid var(--primary);
  border-radius: 8px;

  &:hover {
    cursor: pointer;
    background-color: var(--gray);
  }
`;

export const Img = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  img {
    width: 70px;
    height: 60px;
    object-fit: contain;
  }
`;

export const Description = styled.div`
  padding: 12px;
  width: 100%;
  text-align: center;

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--secondary);
    font-weight: bold;
    font-size: 14px;
    margin: 0;
  }
`