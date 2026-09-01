import React from "react";
import { BannerSection, BannerImage, BannerOverlay, BannerContent, BannerCta } from "./style";

const Banner = () => {
  return (
    <BannerSection>
      <BannerImage />
      <BannerOverlay>
        <BannerContent>
          <h1>Ofertas de Alta Performance</h1>
          <p>Encontre as melhores peças para o seu veículo com descontos imperdíveis.</p>
          <BannerCta>Ver Ofertas</BannerCta>
        </BannerContent>
      </BannerOverlay>
    </BannerSection>
  );
};

export default Banner;