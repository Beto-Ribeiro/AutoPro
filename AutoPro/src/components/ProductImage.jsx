import { useState } from 'react';

export default function ProductImage({ src, alt }) {
  const [failedSrc, setFailedSrc] = useState(null);
  return src && failedSrc !== src
    ? <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} />
    : <span role="img" aria-label={`${alt}: sem foto`} style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 16, color: 'var(--secondary)' }}>Sem foto</span>;
}
