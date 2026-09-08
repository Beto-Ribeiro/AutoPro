import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImageFiles, productImages, MAX_IMAGE_BYTES } from '../src/lib/imageValidation.js';

test('permite várias fotos válidas e respeita fotos já cadastradas', () => {
  assert.doesNotThrow(() => validateImageFiles([{ type: 'image/png', size: 500 }, { type: 'image/jpeg', size: 2000 }], 6));
  assert.throws(() => validateImageFiles([{ type: 'image/png', size: 500 }], 8));
});
test('rejeita arquivos vazios, grandes e formatos incompatíveis', () => {
  for (const file of [{ type: 'image/png', size: 0 }, { type: 'image/png', size: MAX_IMAGE_BYTES + 1 }, { type: 'image/svg+xml', size: 50 }, { type: 'text/html', size: 50 }]) {
    assert.throws(() => validateImageFiles([file]));
  }
});
test('galeria preserva capa, ordem e compatibilidade com anúncios antigos', () => {
  assert.deepEqual(productImages({ imagem: 'https://example.com/old.jpg' }), ['https://example.com/old.jpg']);
  assert.deepEqual(productImages({ imagens: ['https://example.com/b.jpg', 'https://example.com/a.jpg', 'https://example.com/b.jpg'] }), ['https://example.com/b.jpg', 'https://example.com/a.jpg']);
  assert.deepEqual(productImages({ imagens: ['javascript:alert(1)', null] }), []);
});
