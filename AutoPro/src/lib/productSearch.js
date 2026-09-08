export function normalizeSearch(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}

export function searchProducts(products, query, category = '') {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return products.filter(product => {
    if (category && normalizeSearch(product.categoria) !== normalizeSearch(category)) return false;
    const text = normalizeSearch([product.titulo, product.categoria, product.marca, product.descricao, product.compatibilidade, product.seller?.username].filter(Boolean).join(' '));
    return terms.every(term => text.includes(term));
  });
}
