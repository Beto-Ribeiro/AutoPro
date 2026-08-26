import React, { Fragment }from "react";
import {Header, Wrapper} from "./style";
import Card from "../../components/card";


const Home = () => {

    return (
        <Fragment>
            <Header>
                <h2> Lorem ipsum dolor sit amet </h2>
            </Header>
            <Wrapper>
                <Card
                    imagem="https://cdn-icons-png.flaticon.com/512/1830/1830989.png"
                    titulo= "Matemática"
                    mes="Agosto a Novembro"
                    aulas="20 aulas"
                
                />
                <Card
                    imagem="https://cdn-icons-png.flaticon.com/512/1994/1994339.png"
                    titulo= "Português"
                    mes="Agosto a Novembro"
                    aulas="20 aulas"
                
                 />
                  <Card
                    imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRPrVWT_dH4xTPao52QApjkEP3J5R25Wc9tSaChA3pHaIg4UlLjzBiZJ4&s=10"
                    titulo= "História"
                    mes="Agosto a Novembro"
                    aulas="10 aulas"
                
                 />
                  <Card
                    imagem="https://static.vecteezy.com/ti/vetor-gratis/p1/6637178-ciencia-elemento-fundo-colecao-de-colorido-elemento-ciencia-ilustracao-conjunto-de-biologia-elemento-icone-design-gratis-vetor.jpg"
                    titulo= "Ciências"
                    mes="Agosto a Novembro"
                    aulas="10 aulas"
                
                 />
                 
            </Wrapper>

        </Fragment>
    )
}
export default Home