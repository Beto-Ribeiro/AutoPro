# **Documento de Especificação de Requisitos e Arquitetura de Software (SRS)**

**Projeto:** E-commerce de Autopeças (MVP)  
**Versão:** 1.0.0  
**Status:** Em Desenvolvimento  
**Data:** 12 de Agosto de 2026

# **Informações de Identificação**

* Autor: Humberto Araujo Ribeiro Neto  
* Equipe de Desenvolvimento: Humberto Araujo Ribeiro Neto, Mauro Celestino Alves Junior, Thierry Monteiro Assis Santos  
* Instituição: FATEC Taubaté — Análise e Desenvolvimento de Sistemas (1º Ano)  
* Prazo de Execução: 1 Mês (4 Semanas)

# **1\. Visão Geral do Sistema**

O sistema consiste em uma plataforma de comércio eletrônico voltada ao setor de autopeças, desenvolvida como um Produto Mínimo Viável (MVP). O ecossistema é composto por duas interfaces principais integradas a um núcleo de serviços em nuvem:

1. Loja Virtual (B2C): Interface pública voltada ao consumidor final, permitindo a navegação, busca e aquisição de componentes automotivos.  
2. Painel Administrativo (B2B): Interface restrita para gestores, permitindo o controle de estoque, gerenciamento de catálogo e monitoramento de pedidos.

O objetivo principal é validar a viabilidade técnica e comercial da venda digital de autopeças com uma infraestrutura escalável e de baixo custo operacional.

# **2\. Arquitetura e Stack Tecnológica**

A solução adota uma arquitetura moderna de Single Page Application (SPA) conectada a uma plataforma Backend as a Service (BaaS), garantindo agilidade no desenvolvimento e segurança nativa.

## **2.1. Tecnologias Utilizadas**

* **Frontend:** React (Vite) para renderização eficiente e Tailwind CSS para design responsivo e utilitário.  
* **Gerenciamento de Estado:** Zustand, utilizado para o controle do carrinho de compras e sessões de usuário de forma leve.  
* **Roteamento:** React Router DOM para navegação entre páginas.  
* **Backend & Persistência:** Supabase, provendo banco de dados PostgreSQL, sistema de autenticação via JWT e armazenamento de imagens (Storage).  
* **Hospedagem & CI/CD:** Vercel, com integração contínua diretamente do repositório GitHub.

## **2.2. Padrões Arquiteturais**

* **Componentização:** Interface baseada em componentes reutilizáveis.  
* **Fluxo Unidirecional:** Gestão de dados previsível para facilitar a depuração.  
* **Row Level Security (RLS):** Segurança aplicada diretamente na camada do banco de dados para garantir que clientes acessem apenas seus dados e administradores tenham permissões elevadas.

# **3\. Requisitos do Sistema**

## **3.1. Requisitos Funcionais (RF)**

| ID | Descrição do Requisito | Prioridade |
| :---- | :---- | :---- |
| RF01 | Cadastro e autenticação de usuários (Clientes e Administradores). | Alta |
| RF02 | Vitrine de produtos organizada por categorias (ex: Motor, Suspensão). | Alta |
| RF03 | Sistema de busca de peças por nome ou descrição. | Média |
| RF04 | Gestão de carrinho (Adicionar, remover e atualizar quantidades). | Alta |
| RF05 | Cálculo automático do valor total da compra em tempo real. | Alta |
| RF06 | Checkout de pedidos com geração de número de acompanhamento. | Alta |
| RF07 | CRUD de produtos exclusivo para perfil administrador. | Alta |
| RF08 | Visualização e alteração de status de pedidos pelo administrador. | Média |

## **3.2. Requisitos Não Funcionais (RNF)**

* **RNF01 (Desempenho):** O frontend deve ser construído utilizando Vite para garantir tempos de carregamento rápidos e builds otimizadas.  
* **RNF02 (Usabilidade):** A interface deve ser totalmente responsiva (Mobile-First), adaptando-se a diferentes tamanhos de tela através de Tailwind CSS.  
* **RNF03 (Escalabilidade):** O estado global da aplicação deve ser desacoplado dos componentes via Zustand.  
* **RNF04 (Confiabilidade):** Persistência de dados garantida pelo PostgreSQL (Supabase) com backup automático.  
* **RNF05 (Segurança):** Autenticação robusta baseada em JSON Web Tokens (JWT) fornecida pelo Supabase Auth.

## **3.3. Requisitos Inversos (Fora de Escopo)**

Para garantir a entrega do MVP no prazo de 4 semanas, os seguintes itens **não** fazem parte do escopo atual:

* Processamento real de pagamentos via gateway (será utilizado fluxo simulado).  
* Cálculo de frete dinâmico via API dos Correios (será utilizado valor fixo).  
* Módulo de chat ou suporte ao vivo.

# **4\. Regras de Negócio (RN)**

1. **Bloqueio de Estoque:** O sistema não deve permitir a inclusão de itens no carrinho ou a finalização da compra caso a quantidade solicitada seja superior ao saldo em estoque.  
2. **Imutabilidade de Preços:** O preço de venda de um produto deve ser "congelado" no momento da criação do pedido, garantindo que alterações posteriores no catálogo não afetem pedidos já finalizados.  
3. **Controle de Acesso:** A distinção entre Cliente e Administrador deve ser rigorosa, utilizando as políticas de RLS do banco de dados para impedir acesso não autorizado a rotas administrativas.  
4. **Abatimento Automático:** No ato da confirmação do checkout, o sistema deve subtrair automaticamente a quantidade comprada do saldo de estoque disponível.

# **5\. Histórias de Usuário (User Stories)**

## **5.1. Perfil: Cliente**

* "Como cliente, quero navegar por categorias para encontrar a peça certa para meu veículo rapidamente."  
* "Como cliente, quero ver o subtotal do meu carrinho atualizado instantaneamente ao mudar quantidades."  
* "Como cliente, quero acessar meu perfil para verificar o status dos meus pedidos anteriores."

## **5.2. Perfil: Administrador**

* "Como administrador, quero cadastrar e excluir produtos para manter o catálogo sempre atualizado."  
* "Como administrador, quero visualizar todos os pedidos realizados no dia para organizar a logística de entrega."

# **6\. Planejamento de Execução**

## **6.1. Divisão por Épicos**

1. **Gestão de Identidade:** Fluxos de Auth e níveis de acesso.  
2. **Vitrine Digital:** Catálogo, busca e filtros.  
3. **Jornada de Compra:** Carrinho, cálculo de total e checkout.  
4. **Painel Administrativo:** Gestão de inventário e pedidos.

## **6.2. Cronograma de 4 Semanas**

* **Semana 1:** Configuração do ambiente (React/Vite/Tailwind/Supabase) e modelagem do banco de dados.  
* **Semana 2:** Desenvolvimento da Vitrine e sistema de autenticação (Auth).  
* **Semana 3:** Implementação do estado global (Zustand), lógica de carrinho e checkout simulado.  
* **Semana 4:** Construção do Painel Administrativo, testes de RLS e deploy na Vercel.

---

**Aprovação:**

[Humberto Ribeiro](mailto:humbertoribeironeto93@gmail.com)  
**Coordenador de Projeto**

Date  
**Data da Assinatura**
