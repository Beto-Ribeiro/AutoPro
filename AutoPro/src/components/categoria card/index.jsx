import React, {Fragment} from "react";
import {Container, Img, Description} from "./style";


const Categoriacard = ({imagem, titulo}) => {

    return(
        
        <Container>
            <Img>
            <img src={imagem} alt=""/>
            
            </Img>
            <Description>
                <p> {titulo} </p>
            </Description>

        </Container>

    )



}

export default Categoriacard