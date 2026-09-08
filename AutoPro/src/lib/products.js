import { supabase } from './supabaseClient';

export { CATEGORIES, productPayload } from './productValidation';
export const PRODUCT_SELECT = '*, seller:seller_profiles!products_seller_id_fkey(username)';
export const money = value => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function productError(error) {
  if (['PGRST200', 'PGRST204', 'PGRST205', '42703', '42P01'].includes(error?.code)) {
    return 'O catálogo está em configuração. Tente novamente mais tarde.';
  }
  if (error?.code === '23505') return 'Este username já está em uso. Escolha outro.';
  if (error?.code === '42501') return 'Você não tem permissão para salvar este anúncio. Entre novamente na sua conta.';
  if (/fetch|network/i.test(error?.message || '')) return 'Não foi possível conectar. Verifique sua conexão e tente novamente.';
  return error?.message || 'Não foi possível concluir a operação. Tente novamente.';
}

export async function listProducts(sellerId) {
  let query = supabase.from('products').select(PRODUCT_SELECT).not('seller_id', 'is', null);
  query = sellerId ? query.eq('seller_id', sellerId) : query.eq('ativo', true);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

