import React, {Fragment}from "react";
import { Container, InfoBlock, ContactBlock} from "./style";

const Rodape = () => {
    return(
        <Container>
  <InfoBlock>
    <h4>AutoPro</h4>
    <span>Soluções industriais e 
        peças de alta performance<br/> para o setor automotivo.
        </span>
  </InfoBlock>
  <InfoBlock>
    <span>Nossos Contatos</span>
    
  </InfoBlock>
  <InfoBlock>
    <span>Privacy</span>
    
  </InfoBlock>
  <ContactBlock>
   
    <span>© 2026 AutoPro. Todos os direitos reservados.</span>
  </ContactBlock>
</Container>


    )
}
export default Rodape;