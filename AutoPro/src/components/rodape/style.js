import styled from "styled-components";

export const Container = styled.div`
  background-color: #cfcccc;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: black;

  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
  }

  span {
    font-size: 0.95rem;
    color: #555555;
  }
`;

export const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: black;
  text-align: right;

  span {
    font-size: 0.95rem;
    color: #555555;
  }
`;