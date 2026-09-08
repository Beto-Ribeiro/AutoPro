export const CATEGORIES = ['Transmissão', 'Motor', 'Suspensão', 'Acessórios', 'Freios', 'Óleo'];

export function productPayload(form, sellerId) {
  const valor = Number(form.valor);
  const estoque = Number(form.estoque);
  if (!Number.isFinite(valor) || valor <= 0 || valor >= 100000000) throw new Error('Informe um preço válido maior que zero.');
  if (!Number.isInteger(estoque) || estoque < 0 || estoque > 2147483647) throw new Error('Informe um estoque inteiro válido.');
  if (form.titulo.trim().length < 3 || form.titulo.trim().length > 120) throw new Error('O título deve ter entre 3 e 120 caracteres.');
  if (form.descricao.trim().length < 10 || form.descricao.trim().length > 5000) throw new Error('A descrição deve ter entre 10 e 5000 caracteres.');
  if (!CATEGORIES.includes(form.categoria)) throw new Error('Selecione uma categoria.');
  if (!['Novo', 'Usado', 'Recondicionado'].includes(form.condicao)) throw new Error('Selecione a condição.');
  const imagem = form.imagem.trim();
  if (imagem && (!URL.canParse(imagem) || new URL(imagem).protocol !== 'https:')) throw new Error('Use um endereço HTTPS válido para a foto.');
  return { seller_id: sellerId, titulo: form.titulo.trim(), descricao: form.descricao.trim(), categoria: form.categoria,
    valor: Math.round(valor * 100) / 100, estoque, imagem: imagem || null, marca: form.marca.trim(),
    compatibilidade: form.compatibilidade.trim(), condicao: form.condicao, ativo: form.ativo,
    status: estoque > 0 ? 'Em estoque' : 'Esgotado' };
}
