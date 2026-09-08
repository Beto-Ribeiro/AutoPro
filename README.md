# **Documento de Especificação de Requisitos e Arquitetura de Software (SRS)**

**Projeto:** E-commerce de Autopeças (AutoPro)  
**Versão:** 1.1.0  
**Status:** Em Desenvolvimento  
**Data:** 12 de Agosto de 2026

## **Informações de Identificação**
* **Autor:** Humberto Araujo Ribeiro Neto  
* **Equipe de Desenvolvimento:** Humberto Araujo Ribeiro Neto, Mauro Celestino Alves Junior, Thierry Monteiro Assis Santos  
* **Instituição:** FATEC Taubaté — Análise e Desenvolvimento de Sistemas (1º Ano)  
* **Prazo de Execução:** 1 Mês (4 Semanas)

---

## **1. Visão Geral do Sistema**

O sistema consiste em uma plataforma de comércio eletrônico voltada ao setor de autopeças. 
* **Objetivo:** Vender produtos pela internet com segurança e rapidez, validando a viabilidade técnica e comercial com uma infraestrutura escalável e de baixo custo.
* **Público-alvo:** Clientes finais (compradores donos de veículos ou mecânicos) e administradores da loja (gestores de estoque e vendas).
* **Escopo principal:** Catálogo de produtos digitais, carrinho de compras, processamento de pagamentos e painel administrativo restrito.

O ecossistema é composto por duas interfaces principais integradas a um núcleo de serviços em nuvem: a **Loja Virtual (B2C)** e o **Painel Administrativo (B2B)**.

---

## **2. Arquitetura e Stack Tecnológica**

A solução adota uma arquitetura de *Single Page Application (SPA)* conectada a uma plataforma *Backend as a Service (BaaS)*, seguindo a separação de responsabilidades.

* **Frontend (Interface do Usuário):** O que o cliente vê no navegador. Construído com **React (Vite)** e **Tailwind CSS**. Gerenciamento de estado global (como sessões e carrinho) feito nativamente com a **React Context API**.
* **Backend (Regras de Negócio):** O "cérebro" do sistema. Utiliza o **Supabase** (que roda Node.js/PostgREST nos bastidores) para gerenciar autenticação via JWT, regras de acesso (RLS) e *Storage* de imagens.
* **Banco de Dados:** Onde ficam salvas as informações. Utiliza **PostgreSQL** hospedado em nuvem (via Supabase).
* **Hospedagem & Infraestrutura:** **Vercel** para deploy contínuo do frontend.
* **Integrações Externas (Previstas/Simuladas no MVP):** 
  * *Gateway de Pagamento:* Mercado Pago / Stripe (fluxo simulado na versão inicial).
  * *Serviço de Frete:* API dos Correios / Melhor Envio (valor fixado no MVP para testes).

---

## **3. Requisitos do Sistema**

### **3.1. Requisitos Funcionais (RF - O que o sistema faz)**
| ID | Descrição do Requisito | Prioridade |
| :--- | :--- | :--- |
| **RF01** | O usuário deve conseguir criar uma conta e fazer login (Clientes e Administradores). | Alta |
| **RF02** | O sistema deve permitir buscar produtos por nome ou por categoria (ex: Motor, Suspensão). | Alta |
| **RF03** | O cliente deve conseguir adicionar itens ao carrinho, atualizar quantidades e finalizar a compra. | Alta |
| **RF04** | O administrador deve conseguir cadastrar, atualizar, remover produtos e alterar preços (CRUD). | Alta |
| **RF05** | O sistema deve calcular automaticamente o valor total da compra em tempo real no carrinho. | Alta |
| **RF06** | O administrador deve conseguir visualizar e alterar os status dos pedidos recebidos. | Média |

### **3.2. Requisitos Não Funcionais (RNF - Como o sistema se comporta)**
| ID | Descrição do Requisito |
| :--- | :--- |
| **RNF01** | **Desempenho:** O site deve carregar as páginas e vitrines em menos de 3 segundos, utilizando a otimização de build do Vite. |
| **RNF02** | **Disponibilidade:** O sistema deve ficar no ar 99,9% do tempo, garantido pelos SLAs da Vercel e do Supabase. |
| **RNF03** | **Escalabilidade:** O estado global da aplicação (como o carrinho de compras) deve ser gerenciado de forma eficiente e centralizada através da Context API do React. |
| **RNF04** | **Segurança & Privacidade:** Os dados sensíveis e de pagamento devem ser criptografados e o sistema deve seguir diretrizes da **LGPD** e princípios básicos do **PCI-DSS**. |
| **RNF05** | **Usabilidade:** A interface deve ser *Mobile-First*, totalmente responsiva em qualquer tela via Tailwind CSS. |

---

## **4. Modelagem de Dados Básica**

A estrutura principal do banco de dados relacional foi desenhada em torno das seguintes entidades:

* **Usuário:** `ID` (PK), `nome`, `e-mail`, `senha` (hash criptografado via Auth), `endereço`, `papel_usuario` (admin/cliente).
* **Produto:** `ID` (PK), `nome`, `descrição`, `preço`, `quantidade em estoque`, `categoria_id`.
* **Pedido:** `ID` (PK), `data`, `status` (pendente, pago, enviado), `valor total`, `ID do usuário` (FK).
* **Item do Pedido:** `ID` (PK), `ID do pedido` (FK), `ID do produto` (FK), `quantidade`, `preço unitário` (salvo no momento da compra para garantir imutabilidade).

---

## **5. Diagramas Essenciais**

### **5.1. Diagrama de Casos de Uso**
Mostra as permissões e interações entre os clientes finais e os administradores.

```mermaid
flowchart LR
    %% Atores
    C(( Cliente))
    A(( Admin))

    %% Sistema
    subgraph E-commerce de Autopeças
        direction TB
        UC1([Cadastrar e Autenticar])
        UC2([Navegar por Categorias])
        UC3([Buscar Peças])
        UC4([Gerenciar Carrinho])
        UC5([Realizar Checkout])
        UC6([Acessar Histórico])
        UC7([Gerenciar Produtos])
        UC8([Gerenciar Pedidos])
    end

    %% Relacionamentos do Cliente
    C --- UC1
    C --- UC2
    C --- UC3
    C --- UC4
    C --- UC5
    C --- UC6

    %% Relacionamentos do Admin
    A --- UC1
    A --- UC7
    A --- UC8
```

### **5.2. Diagrama Entidade-Relacionamento (DER)**

Exibe como as tabelas essenciais do banco de dados se relacionam.

```mermaid
erDiagram
    %% Tabela Externa (Referência)
    AUTH_USERS ||--o| USUARIOS : "1:1 (id)"
    AUTH_USERS ||--o| SELLER_PROFILES : "1:1 (id)"
    AUTH_USERS ||--o{ CART_ITEMS : "1:N (user_id)"
    AUTH_USERS ||--o{ ORDERS : "1:N (user_id)"
    AUTH_USERS ||--o{ ORDER_ITEMS : "1:N (seller_id)"

    %% -----------------
    %% NÚCLEO PORTUGUÊS
    %% -----------------
    USUARIOS ||--o{ ENDERECOS : "1:N (usuario_id)"
    USUARIOS ||--o{ PEDIDOS : "1:N (usuario_id)"
    
    ENDERECOS ||--o{ PEDIDOS : "1:N (endereco_id)"
    
    CATEGORIAS ||--o{ PRODUTOS : "1:N (categoria_id)"
    
    PRODUTOS ||--o{ PRODUTO_IMAGENS : "1:N (produto_id)"
    PRODUTOS ||--o{ ITENS_PEDIDO : "1:N (produto_id)"
    PRODUTOS ||--o{ MOVIMENTACAO_ESTOQUE : "1:N (produto_id)"
    
    CUPONS_DESCONTO ||--o{ PEDIDOS : "1:N (cupom_id)"
    
    PEDIDOS ||--o{ ITENS_PEDIDO : "1:N (pedido_id)"
    PEDIDOS ||--o{ PAGAMENTOS : "1:N (pedido_id)"
    PEDIDOS ||--o{ HISTORICO_STATUS_PEDIDO : "1:N (pedido_id)"
    PEDIDOS ||--o{ MOVIMENTACAO_ESTOQUE : "1:N (pedido_id)"

    %% -----------------
    %% NÚCLEO INGLÊS
    %% -----------------
    SELLER_PROFILES ||--o{ PRODUCTS : "1:N (seller_id)"
    
    PRODUCTS ||--o{ CART_ITEMS : "1:N (product_id)"
    PRODUCTS ||--o{ ORDER_ITEMS : "1:N (product_id)"
    
    ORDERS ||--o{ ORDER_ITEMS : "1:N (order_id)"

    %% Entidades e Atributos Principais
    USUARIOS {
        uuid id PK
        varchar nome
        varchar cpf UK
        boolean is_admin
    }
    ENDERECOS {
        uuid id PK
        uuid usuario_id FK
        varchar cep
        varchar logradouro
    }
    CATEGORIAS {
        uuid id PK
        varchar nome UK
    }
    PRODUTOS {
        uuid id PK
        uuid categoria_id FK
        varchar nome
        numeric preco
        integer estoque
    }
    PRODUTO_IMAGENS {
        uuid id PK
        uuid produto_id FK
        text url
    }
    CUPONS_DESCONTO {
        uuid id PK
        varchar codigo UK
        numeric valor
    }
    PEDIDOS {
        uuid id PK
        uuid usuario_id FK
        uuid endereco_id FK
        uuid cupom_id FK
        numeric total
        status_pedido status
    }
    ITENS_PEDIDO {
        uuid id PK
        uuid pedido_id FK
        uuid produto_id FK
        numeric preco_unitario
        integer quantidade
    }
    PAGAMENTOS {
        uuid id PK
        uuid pedido_id FK
        status_pagamento status_pagamento
        numeric valor
    }
    HISTORICO_STATUS_PEDIDO {
        uuid id PK
        uuid pedido_id FK
        status status
    }
    MOVIMENTACAO_ESTOQUE {
        uuid id PK
        uuid produto_id FK
        uuid pedido_id FK
        integer quantidade
    }
    PRODUCTS {
        uuid id PK
        uuid seller_id FK
        text categoria
        numeric valor
        integer estoque
    }
    CART_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        integer quantidade
    }
    SELLER_PROFILES {
        uuid id PK
        text username UK
    }
    ORDERS {
        uuid id PK
        uuid user_id FK
        text status
        numeric total
    }
    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        uuid seller_id FK
        integer quantidade
        numeric subtotal
    }

```

### **5.3. Diagrama de Sequência (Fluxo de Compra)**

Mostra o passo a passo da jornada do cliente, do clique em "Comprar" até a finalização do pedido.

```mermaid
sequenceDiagram
    autonumber
    
    actor C as  Cliente
    participant F as  Frontend (React/Zustand)
    participant B as  Backend (Supabase)
    participant P as  Pagamento (Simulado)

    %% Seleção e Carrinho
    C->>F: Escolhe produto e adiciona ao carrinho
    F-->>F: Atualiza estado global (Zustand)
    C->>F: Clica em "Concluir Compra"
    
    %% Revisão dos Itens
    F->>C: Exibe tela de revisão do carrinho (Itens e Subtotal)
    
    alt Itens incorretos
        C->>F: Volta para o carrinho
        F-->>C: Exibe edição do carrinho (quantidades/remover)
    else Itens corretos
        C->>F: Confirma itens e prossegue
    end

    %% Etapa de Endereço
    F->>B: Requisita endereços salvos do usuário
    B-->>F: Retorna lista de endereços
    
    alt Nenhum endereço salvo
        F->>C: Solicita cadastro de endereço
        C->>F: Preenche e salva novo endereço
        F->>B: Registra endereço no banco
        B-->>F: Confirmação de cadastro
    end
    
    C->>F: Seleciona endereço e método de entrega (Valor Fixo)

    %% Etapa de Pagamento e Validação
    C->>F: Escolhe o método de pagamento
    
    F->>B: Solicita validação de estoque e "congelamento" de preço
    alt Estoque Insuficiente
        B-->>F: Erro: Quantidade superior ao estoque
        F-->>C: Bloqueia compra e exibe aviso
    else Estoque Disponível
        B-->>F: Estoque validado e preços confirmados
    end

    %% Processamento e Finalização
    C->>F: Clica em "Pagar / Finalizar Pedido"
    F->>P: Envia dados para processamento
    P-->>F: Retorna Pagamento Aprovado (Fluxo Simulado)
    
    F->>B: Registra o pedido com status "Pago"
    Note over B: Abatimento automático<br/>do estoque disponível
    B-->>F: Pedido criado com sucesso (Gera Código de Rastreio)
    F-->>C: Exibe tela de "Pedido Finalizado" com detalhes da compra
```

---

## **6. Regras de Negócio (RN)**

1. **Bloqueio de Estoque:** O sistema não deve permitir a finalização da compra caso a quantidade solicitada seja superior ao saldo em estoque.
2. **Imutabilidade de Preços:** O preço do produto deve ser copiado para o `Item do Pedido` no ato da compra. Alterações futuras no catálogo não afetarão o histórico financeiro.
3. **Controle de Acesso:** A distinção entre Cliente e Administrador é aplicada diretamente no Banco de Dados (RLS) para evitar invasões via API.

---

## **7. Planejamento de Execução (4 Semanas)**

* **Semana 1:** Setup do ambiente (React/Vite/Tailwind) e modelagem do BD (Supabase).
* **Semana 2:** Desenvolvimento da Vitrine, Busca, Categorias e Autenticação.
* **Semana 3:** Implementação do estado global (Context API), Lógica de Carrinho e Checkout Simulado.
* **Semana 4:** Construção do Painel Administrativo (CRUD), testes de RLS, polimento e deploy na Vercel.

```

```
