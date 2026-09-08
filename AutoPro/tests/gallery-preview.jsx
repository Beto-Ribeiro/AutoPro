// Fixture local de UI; não entra no build e não cria anúncios no banco.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ProductGallery from '../src/components/ProductGallery';
import PhotoPicker from '../src/components/PhotoPicker';

function Preview() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  return <main style={{ maxWidth: 1000, margin: '20px auto', padding: 16, fontFamily: 'Arial' }}>
    <ProductGallery images={['/src/assets/hero.png', '/src/assets/Escola.png']} title="Validação local da galeria" username="teste_local" category="Teste"><p>Fixture de verificação. Não é um anúncio.</p></ProductGallery>
    <h2>Validação local do seletor de fotos</h2>
    <PhotoPicker photos={photos} onChange={setPhotos} onError={setError} />{error && <p role="alert">{error}</p>}
  </main>;
}
createRoot(document.getElementById('root')).render(<Preview />);
