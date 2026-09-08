import { useState } from 'react';
import styled from 'styled-components';
import ProductImage from './ProductImage';

const Layout = styled.div`
  display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 40px; margin-top: 24px;
  .gallery { min-width: 0; }
  .photo { aspect-ratio: 1; background: #f2f4f6; border-radius: 12px; overflow: hidden; }
  .photo img { width: 100%; height: 100%; object-fit: contain; }
  .gallery-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; }
  .gallery-controls button { padding: 10px 16px; background: #b70011; color: white; border: 0; border-radius: 6px; cursor: pointer; }
  .thumbnails { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
  .thumbnails button { width: 72px; height: 72px; padding: 3px; border: 2px solid #d1d5db; background: #f2f4f6; border-radius: 8px; overflow: hidden; cursor: pointer; }
  .thumbnails button[aria-pressed=true] { border-color: #b70011; box-shadow: 0 0 0 2px #fee2e2; }
  .thumbnails img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
  @media(max-width: 700px) { grid-template-columns: 1fr; gap: 24px; }
`;

export default function ProductGallery({ images, title, username, category, children }) {
  const [selected, setSelected] = useState(null);
  const active = Math.max(0, images.indexOf(selected));
  const move = delta => setSelected(images[(active + delta + images.length) % images.length]);
  return <Layout>
    <div className="gallery" role="region" aria-label="Fotos do produto" aria-roledescription="carrossel" tabIndex={images.length > 1 ? 0 : undefined} onKeyDown={event => {
      if (images.length > 1 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
    }}>
      <div className="photo"><ProductImage src={images[active]} alt={`${title} — foto ${active + 1}`} /></div>
      {images.length > 1 && <div className="gallery-controls"><button aria-label="Foto anterior" onClick={() => move(-1)}>←</button><span aria-live="polite">Foto {active + 1} de {images.length}</span><button aria-label="Próxima foto" onClick={() => move(1)}>→</button></div>}
    </div>
    <section><small>{category}</small><h1>{title}</h1><p>Vendido por <strong>@{username}</strong></p>
      {images.length > 0 && <div className="thumbnails" role="group" aria-label="Selecionar foto">{images.map((url, index) => <button key={url} aria-label={`Ver foto ${index + 1}`} aria-pressed={active === index} onClick={() => setSelected(url)}><ProductImage src={url} alt={`Miniatura ${index + 1}`} /></button>)}</div>}
      {children}
    </section>
  </Layout>;
}
