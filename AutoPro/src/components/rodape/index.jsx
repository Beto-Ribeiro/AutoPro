import React from "react";
import { FooterWrapper, FooterInner, BrandBlock, LinksBlock, CopyrightBlock } from "./style";

const Rodape = () => {
  return (
    <FooterWrapper>
      <FooterInner>
        <BrandBlock>
          <h4>AutoPro</h4>
          <p>Soluções industriais e peças de alta performance para o setor automotivo.</p>
        </BrandBlock>

        <LinksBlock>
          <a href="#">Contato</a>
          <a href="#">Política de Entrega</a>
          <a href="#">Trocas e Devoluções</a>
          <a href="#">Privacidade</a>
        </LinksBlock>

        <CopyrightBlock>
          <p>© 2024 AutoPro Industrial Parts. Todos os direitos reservados.</p>
        </CopyrightBlock>
      </FooterInner>
    </FooterWrapper>
  );
};

export default Rodape;