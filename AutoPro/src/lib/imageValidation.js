export const MAX_IMAGES = 8;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

export function validateImageFiles(files, existingCount = 0) {
  if (files.length + existingCount > MAX_IMAGES) throw new Error(`Cada anúncio pode ter até ${MAX_IMAGES} fotos.`);
  for (const file of files) {
    if (!Object.hasOwn(IMAGE_TYPES, file.type)) throw new Error('Selecione fotos JPG, PNG, WebP ou AVIF.');
    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error('Cada foto deve ter até 5 MB e não pode estar vazia.');
  }
}

export function productImages(product) {
  const urls = Array.isArray(product?.imagens) && product.imagens.length ? product.imagens : [product?.imagem];
  return [...new Set(urls.filter(url => typeof url === 'string' && url.startsWith('https://')))];
}
