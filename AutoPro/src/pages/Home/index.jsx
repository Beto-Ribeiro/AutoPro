import React, { Fragment } from "react";
import { Header, Wrapper, Button } from "./style";
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

            <Header>
                <h2> Destaques</h2>
            </Header>
            <Wrapper>
                <Card
                    imagem="https://http2.mlstatic.com/D_NQ_NP_706943-MLA104536688561_012026-O.webp"
                    categoria="FREIOS"
                    titulo="Pastilha de Freio Cerâmica"
                    status="Compatibilidade Verificada"
                    valor="R$120,00"
                >
                    
                    <Button>Adicionar ao Carrinho</Button>
                </Card>
                 <Card
                    imagem="https://http2.mlstatic.com/D_NQ_NP_685320-MLA105673053734_012026-O.webp"
                    categoria="MOTOR"
                    titulo="Óleo Sintético 10w40 1L"
                    status="Em Estoque"
                    valor="R$45,00"
                >
                    
                    <Button>Adicionar ao Carrinho</Button>
                </Card>
                 <Card
                    imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVShvcAjpUkj7EcKz6mqDBpOIEHeDaufnfPaPouQknys4cmDlOjOQhuiE&s=10"
                    categoria="SUSPENÇÃO"
                    titulo="Amortecedor Dianteiro"
                    status="Compatibilidade Verificada"
                    valor="R$350,00"
                >
                    
                    <Button>Adicionar ao Carrinho</Button>
                </Card>
                 <Card
                    imagem="https://http2.mlstatic.com/D_NQ_NP_769742-MLB108480129408_032026-O.webp"
                    categoria="MOTOR"
                    titulo="Filtro de Ar Esportivo"
                    status="Últimas unidades"
                    valor="R$85,00"
                >
                   
                    <Button>Adicionar ao Carrinho</Button>
                </Card>
                 <Card
                    imagem="https://americanas.vtexassets.com/arquivos/ids/25843661-768-auto/7502384237_1_xlarge.webp?v=638755501577630000&quality=9"
                    categoria="Pneus"
                    titulo="Pneu Aro 14 - 2 Unidades"
                    status="Compatibilidade Verificada"
                    valor="R$120,00"
                >
                   
                    <Button>Adicionar ao Carrinho</Button>
                </Card>
            </Wrapper>
        </Fragment>
    );
};

export default Home;