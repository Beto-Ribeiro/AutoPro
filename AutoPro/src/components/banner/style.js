import styled from "styled-components";

export const Container = styled.div`
  padding: 60px 80px;
  height: 480px;
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: url(https://img.magnific.com/fotos-gratis/tema-de-reparacao-e-manutencao-de-automoveis-motor-de-capo-aberto-de-carro-em-servico-automatico_627829-3968.jpg);
  display: flex;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  margin-left:20px;
  margin-right:15px;
  margin-top:10px;
  margin-bottom:20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
    z-index: 1;
  }
`;

export const Text = styled.div`
  width: 45%;
  position: relative;
  z-index: 2;

  h2 {
    color: #ffffff;
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  p {
    color: #e5e5e5;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    margin-bottom: 40px;
  }

  span {
    background-color: #c90014;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #a00010;
    }
  }
`;