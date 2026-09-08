# React + Vite

## Venda de produtos

No banco existente, execute `supabase-marketplace.sql` no SQL Editor do Supabase.
Em uma instalação nova, execute primeiro `supabase-schema.sql` e depois a migração.
Depois execute `supabase-product-images-orders.sql` para criar o bucket público
`product-images`, as regras de upload por vendedor e a estrutura de pedidos.
O arquivo `tests/marketplace-rls.sql` valida as permissões em uma transação revertida.

No AutoPro, acesse **Perfil → Meus produtos**, salve seu username público e cadastre
o anúncio. É possível editar preço, estoque e visibilidade, enviar até 8 fotos
(JPG, PNG, WebP ou AVIF; 5 MB por arquivo) e escolher a capa. Home, busca, categorias, administração e detalhes usam o mesmo catálogo.
Somente o vendedor pode alterar seu anúncio; dados privados do perfil não são públicos.
Produtos antigos sem vendedor ficam fora do catálogo e do carrinho, sem apagar pedidos.

O menu do perfil permanece em informações pessoais, endereços, produtos e pedidos.
**Meus pedidos** separa compras e vendas. As vendas retornam somente os próprios itens,
sem expor dados privados do comprador ou itens de outros vendedores. O histórico
usa o status registrado no banco; esta mudança não integra um gateway de pagamento.
Fotos substituídas são mantidas no bucket para preservar imagens do histórico.

Verificação: `node --test tests/*.test.js`, `npm run build` e o SQL transacional
`tests/images-orders-rls.sql`. A página `tests/gallery-preview.html` serve para
validar carrossel e seletor localmente e não faz parte do build de produção.
Referência: [Supabase Storage](https://supabase.com/docs/guides/storage/uploads/standard-uploads).

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
