import { supabase } from './supabaseClient';
import { IMAGE_TYPES, validateImageFiles } from './imageValidation';

export const PRODUCT_BUCKET = 'product-images';

export async function uploadProductPhotos(photos, userId) {
  validateImageFiles(photos.filter(p => p.file).map(p => p.file), photos.filter(p => !p.file).length);
  const uploaded = [];
  try {
    const result = [];
    for (const photo of photos) {
      if (!photo.file) { result.push(photo); continue; }
      const path = `${userId}/${crypto.randomUUID()}.${IMAGE_TYPES[photo.file.type]}`;
      const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, photo.file, { contentType: photo.file.type, upsert: false });
      if (error) throw error;
      uploaded.push(path);
      const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
      result.push({ id: photo.id, url: data.publicUrl });
    }
    return result;
  } catch (error) {
    // Só os arquivos desta tentativa incompleta, antes de salvar qualquer anúncio.
    if (uploaded.length) await supabase.storage.from(PRODUCT_BUCKET).remove(uploaded);
    throw error;
  }
}
