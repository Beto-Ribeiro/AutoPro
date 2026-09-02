import React from "react";
import { Container, CatIcon, CatLabel } from "./style";

const Categoriacard = ({ icon, titulo, href = "#" }) => {
  return (
    <Container href={href}>
      <CatIcon className="material-symbols-outlined cat-icon">{icon}</CatIcon>
      <CatLabel className="cat-label">{titulo}</CatLabel>
    </Container>
  );
};

export default Categoriacard;