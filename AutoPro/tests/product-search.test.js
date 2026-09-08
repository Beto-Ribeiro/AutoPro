import test from 'node:test';
import assert from 'node:assert/strict';
import { searchProducts } from '../src/lib/productSearch.js';

const products = [
  { id: 1, titulo: 'Motor UNO 2015', categoria: 'Motor', marca: 'Fiat', compatibilidade: 'Uno 1.0', descricao: 'Peça revisada', seller: { username: 'oficina' } },
  { id: 2, titulo: 'Kit de suspensão', categoria: 'Suspensão', marca: 'Teste', descricao: 'Amortecedores traseiros' },
];
test('busca sem acentos, sem distinguir maiúsculas e com termos em qualquer ordem', () => {
  assert.deepEqual(searchProducts(products, '  SUSPENSAO  ').map(p => p.id), [2]);
  assert.deepEqual(searchProducts(products, '2015 fiat').map(p => p.id), [1]);
});
test('busca descrição, compatibilidade e vendedor; sem resultados quando não corresponde', () => {
  for (const term of ['revisada', '1.0', 'oficina']) assert.equal(searchProducts(products, term)[0].id, 1);
  assert.deepEqual(searchProducts(products, 'freio'), []);
});
test('combina a categoria e restaura o catálogo ao limpar', () => {
  assert.deepEqual(searchProducts(products, 'fiat', 'Suspensão'), []);
  assert.equal(searchProducts(products, '', 'suspensao')[0].id, 2);
  assert.deepEqual(searchProducts(products, ' '), products);
});
