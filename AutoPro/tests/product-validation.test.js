import test from 'node:test';
import assert from 'node:assert/strict';
import { productPayload } from '../src/lib/productValidation.js';

const valid = { titulo: 'Peça de teste', descricao: 'Descrição suficiente para um anúncio.', categoria: 'Motor',
  condicao: 'Novo', valor: '123.45', estoque: '2', imagem: '', marca: '', compatibilidade: '', ativo: true };

test('aceita preço em reais e foto opcional sem inventar dados', () => {
  const result = productPayload(valid, 'seller-id');
  assert.equal(result.valor, 123.45);
  assert.equal(result.imagem, null);
  assert.equal(result.seller_id, 'seller-id');
});

test('recusa preços inválidos e estoque fracionário ou negativo', () => {
  for (const valor of ['0', '-1', 'NaN', 'Infinity', '100000000']) {
    assert.throws(() => productPayload({ ...valid, valor }, 'seller-id'));
  }
  for (const estoque of ['-1', '1.5', 'Infinity', '2147483648']) {
    assert.throws(() => productPayload({ ...valid, estoque }, 'seller-id'));
  }
});

test('recusa links inseguros para a foto', () => {
  for (const imagem of ['javascript:alert(1)', 'http://example.com/image.png', 'data:image/png;base64,test', 'uma foto']) {
    assert.throws(() => productPayload({ ...valid, imagem }, 'seller-id'));
  }
});

test('recusa campos obrigatórios vazios e categorias desconhecidas', () => {
  for (const change of [{ titulo: '   ' }, { descricao: '   ' }, { categoria: 'Qualquer' }, { condicao: 'Outra' }]) {
    assert.throws(() => productPayload({ ...valid, ...change }, 'seller-id'));
  }
});

test('estoque zero mantém o anúncio esgotado', () => {
  assert.equal(productPayload({ ...valid, estoque: '0' }, 'seller-id').status, 'Esgotado');
});
