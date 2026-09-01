import React from "react";
import { useCart } from "../../context/CartContext";
import { Container, Img, Description, Itens, Category, Title, Status, Price, AddButton } from "./style";

const Card = ({ id, imagem, categoria, titulo, status, valor, onAddToCart }) => {
  const { addToCart, isInCart } = useCart();
  const inCart = id ? isInCart(id) : false;
  const isUnavailable = status && status.toLowerCase().includes("últimas");

  const handleAdd = () => {
    if (onAddToCart) return onAddToCart();
    if (id) {
      addToCart({ id, imagem, categoria, titulo, status, valor });
    }
  };

  return (
    <Container>
      <Img>
        <img src={imagem} alt={titulo} loading="lazy" />
      </Img>
      <Description>
        <Itens>
          <Category>{categoria}</Category>
          <Title>{titulo}</Title>
          <Status $available={!isUnavailable}>{status}</Status>
          <Price>
            {typeof valor === "number"
              ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              : valor}
          </Price>
        </Itens>
        <AddButton onClick={handleAdd} $inCart={inCart} disabled={inCart}>
          {inCart ? (
            <>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              No Carrinho
            </>
          ) : (
            "Adicionar ao Carrinho"
          )}
        </AddButton>
      </Description>
    </Container>
  );
};

export default Card;