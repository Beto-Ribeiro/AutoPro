import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border-radius: 8px; 
  border: 1px solid #e0e0e0;
  width: 100%;
  border: 1px solid var(--primary);
  max-width: 280px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    cursor: pointer;
    transform: translateY(-2px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const Img = styled.div`
  width: 100%;
  height: 230px;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const Description = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
`;

export const Itens = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Category = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
  color: gray;
  letter-spacing: 0.5px;
`;

export const Title = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
`;

export const Status = styled.span`
  font-size: 0.75rem;
  color: #666666;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;

  &::before {
    content: "●";
    color: #4caf50;
    font-size: 0.7rem;
  }
`;

export const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: #000000;
  margin-top: 6px;
`;