import React, {Fragment} from "react";
import { Container, Img, Description, Itens } from "./style";

const Card = ({titulo, mes, imagem, aulas}) => {
    return (
        <Container>
            <Img>
            <img src={imagem} alt=""/>
            
            </Img>
            <Description>
               <h4> {titulo}</h4>
           
            <Itens>
                <span>{mes}</span>
                <span> {aulas} </span>
            </Itens>
            </Description>

        </Container>

    )
    
}


export default Card;