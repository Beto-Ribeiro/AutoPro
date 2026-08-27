import React, { Fragment } from "react";
import { Container, Img, Description, Itens, Category, Price, Title, Status } from "./style";

const Card = ({ imagem, categoria, titulo, status, valor, children }) => {
    return (
        <Container>
  <Img>
    <img src={imagem} alt={titulo} />
  </Img>

  <Description>
    <Itens>
      <Category>{categoria}</Category>
      <Title>{titulo}</Title>
      <Status>{status}</Status>
      <Price>{valor}</Price>
    </Itens>
    {children}
  </Description>
</Container>
    )

}


export default Card;