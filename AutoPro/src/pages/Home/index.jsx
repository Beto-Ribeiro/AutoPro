import React, { Fragment }from "react";
import {Header, Wrapper} from "./style";
import Card from "../../components/card";
import Categoriacard from "../../components/categoria card";


const Home = () => {

    return (
        <Fragment>
            <Header>
                <h2> Categorias </h2>
            </Header>
            <Wrapper>
               
                 <Categoriacard
                    imagem="https://static.vecteezy.com/system/resources/thumbnails/077/944/322/small/close-up-of-a-car-s-mechanical-transmission-system-gears-intricately-designed-for-automotive-power-transfer-free-png.png"
                    titulo="Transmissão"
                 
                 />
                  <Categoriacard
                    imagem="https://contagemmotorpecas.com.br/wp-content/uploads/2019/02/Confira-os-principais-componentes-do-motor-de-um-carro.jpg"
                    titulo="Motor"
                 
                 
                 
                 />
                  <Categoriacard
                    imagem="https://static.kbb.com.br/Uploads/ResearchTools/News/1259/f09e7fbd-fa1f-4415-a69b-faadd4b32877_1365x1024.jpg"
                    titulo="Suspensão"
                 
                 
                 
                 />
                   <Categoriacard
                    imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbIptHLqN9MPt2w3vxmhWuzPjy3A8nn8nSjyP65w5Gfw&s=10"
                    titulo="Pneus"
                 
                 
                 
                 />
                   <Categoriacard
                    imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSodfIhPOttT2NfEIJB6uFO7YFSeW5fyV7slYQRxEpeed_HTAs1Mki-jHU&s=10"
                    titulo="Freios"
                 
                 
                 
                 />
             </Wrapper>

        </Fragment>
    )
}
export default Home