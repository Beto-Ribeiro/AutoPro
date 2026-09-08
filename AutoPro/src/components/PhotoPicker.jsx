import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { validateImageFiles } from '../lib/imageValidation';
import ProductImage from './ProductImage';

const Grid = styled.div`
  display: flex; flex-wrap: wrap; gap: 12px;
  figure { width: 140px; margin: 0; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; display: grid; gap: 8px; }
  .preview { width: 100%; height: 100px; overflow: hidden; background: #f2f4f6; }
  img { width: 100%; height: 100%; object-fit: cover; }
  button { padding: 6px !important; font-size: 12px !important; }
`;

function Preview({ photo, index }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!photo.file) return;
    const preview = URL.createObjectURL(photo.file);
    setUrl(preview);
    return () => URL.revokeObjectURL(preview);
  }, [photo.file]);
  return <ProductImage src={photo.url || url} alt={`Foto ${index + 1}`} />;
}

export default function PhotoPicker({ photos, onChange, onError }) {
  return <div>
    <label>Fotos da peça
      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => {
        const files = Array.from(event.target.files || []);
        try {
          validateImageFiles(files, photos.length);
          onChange([...photos, ...files.map(file => ({ id: crypto.randomUUID(), file }))]);
          onError('');
        } catch (error) { onError(error.message); }
        event.target.value = '';
      }} aria-describedby="photos-help" />
    </label>
    <p id="photos-help">De 1 a 8 fotos, até 5 MB cada. JPG, PNG, WebP ou AVIF. A primeira foto é a capa.</p>
    <Grid>{photos.map((photo, index) => <figure key={photo.id}>
      <div className="preview"><Preview photo={photo} index={index} /></div>
      <figcaption>{index === 0 ? 'Capa' : `Foto ${index + 1}`}</figcaption>
      {index > 0 && <button type="button" onClick={() => onChange([photo, ...photos.filter(p => p.id !== photo.id)])}>Usar como capa</button>}
      <button type="button" aria-label={`Remover foto ${index + 1}`} onClick={() => onChange(photos.filter(p => p.id !== photo.id))}>Remover</button>
    </figure>)}</Grid>
  </div>;
}
