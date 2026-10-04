# Composition Review

## 1. Escopo e premissas

Esta é uma auditoria somente de composição React. Foram analisados componentes, páginas de feature, props booleanas, responsabilidades, composição por `children`, compound components e variantes Desktop/Mobile.

Foram lidos integralmente:

- `AGENTS.md`;
- `README.md`;
- `docs/audit/ui-architecture-review.md`;
- `docs/audit/react-review.md`.

O arquivo `docs/audit/refactor-plan.md` solicitado não existe no workspace. O diretório `docs/audit` contém `architecture.md`, `gaps.md`, `README.md`, `react-review.md`, `requirements.md`, `stack.md` e `ui-architecture-review.md`.

R-01 a R-05 foram considerados concluídos. Nenhum código, JSX, CSS, token, asset, rota, comportamento ou requisito foi alterado nesta etapa.

A skill `composition-patterns` foi solicitada, mas não está disponível neste ambiente. A análise foi feita com base nas regras de composition pattern do `AGENTS.md` e nos padrões já usados pelo projeto.

## 2. Critério de decisão

- **Manter como está:** a responsabilidade é coesa e a API atual não cria combinações inválidas relevantes.
- **Extrair subcomponente:** há uma parte nomeável, com responsabilidade própria, mas sem necessidade de uma API compound pública.
- **Utilizar composition pattern:** há partes independentes, ordenáveis pelo consumidor, com estado/contexto compartilhado ou uma API de slots real.
- **Tornar responsivo:** a mesma responsabilidade deve responder a viewport sem criar uma segunda hierarquia.
- **Manter versões separadas:** Desktop e Mobile têm hierarquia, interação ou conteúdo estruturalmente diferentes.

Composition Pattern não deve ser usado apenas para dividir um arquivo grande. Uma página que coordena dados e regras de negócio continua sendo uma página; suas partes internas podem ser componentes privados sem virar `Page.Root` ou uma API genérica.

## 3. Achados

### CP-01 — `CheckoutPage` é monolítico, mas não deve virar compound público

- **Arquivos:** `src/features/checkout/checkout-page/index.tsx:28-149`, `src/features/checkout/api/index.ts`.
- **Achado:** a página reúne sessão, carrinho, carteiras, cotação, realtime, idempotência, validação e renderização de formulário/resumo.
- **Evidência:** o mesmo componente mantém estados de formulário, controla a mutation de pedido, revalida a cotação e renderiza dados do colecionador, carteiras, métodos de pagamento e resumo.
- **Classificação:** extrair subcomponentes; manter como página de feature. Não utilizar compound pattern público.
- **Prioridade:** P1.
- **Risco:** médio; separar markup sem preservar a sequência de revalidação e submissão pode alterar o fluxo.
- **Recomendação:** quando houver nova manutenção, extrair partes privadas como `CheckoutCustomerFields`, `CheckoutWalletList` e `CheckoutSummary`, deixando a página como orquestradora. A lógica pode ser concentrada em um controlador específico de checkout, sem criar `Form.Root` genérico ou API com dezenas de props.
- **Necessidade:** não é obrigatória agora. É uma extração recomendada antes de ampliar o fluxo.

### CP-02 — `CartPage` combina domínio, cache otimista e três áreas visuais

- **Arquivo:** `src/features/cart/cart-page/index.tsx:19-145`.
- **Achado:** a página controla mutations de quantidade, remoção e cupom, cotação, Socket.IO, resumo, linhas e recomendações.
- **Evidência:** estado e callbacks de cache aparecem antes de um único retorno que contém carrinho vazio, tabela, resumo e recomendações.
- **Classificação:** extrair subcomponentes; manter como página de feature. Não utilizar compound pattern público.
- **Prioridade:** P1.
- **Risco:** médio; a composição precisa preservar rollback, invalidação e mensagens de erro no mesmo fluxo.
- **Recomendação:** separar `CartLine`, `CartSummary` e `CartRelated` como partes privadas quando uma alteração exigir manutenção nessas áreas. O estado de domínio deve continuar na página ou em um controlador específico do carrinho.
- **Necessidade:** não é obrigatória agora. A extração só deve ocorrer quando reduzir custo real de manutenção.

### CP-03 — `HomePage` precisa de fronteiras internas, não de um compound `Home`

- **Arquivo:** `src/features/catalog/home/home-page/index.tsx:47-177`.
- **Achado:** a página administra URL, debounce, filtros, query, paginação, Sheet, catálogo Desktop/Mobile, promoções e blog.
- **Evidência:** search params e callbacks de navegação vivem no mesmo módulo que duas árvores de catálogo e seções editoriais.
- **Classificação:** extrair subcomponentes; manter versões Desktop/Mobile separadas onde a hierarquia diverge.
- **Prioridade:** P2.
- **Risco:** médio; a Home tem ordem visual e `key`s dependentes da composição atual.
- **Recomendação:** extrair seções privadas como `HomeCatalogDesktop`, `HomeCatalogMobile`, `HomePromos` e `HomeBlog` apenas quando houver mudança independente. Manter a decisão de URL/query próxima da página. Não criar `Home.Root`, `Home.Toolbar`, `Home.Content` como API pública sem consumidores externos.
- **Necessidade:** pode permanecer como está no estado atual.

### CP-04 — `OrderPage` tem estados de tela distintos, mas ainda pode permanecer linear

- **Arquivo:** `src/features/orders/order-page/index.tsx:16-204`.
- **Achado:** o componente possui estados de carregamento, erro, pendente, recusado e confirmado, além da montagem do recibo.
- **Evidência:** quatro retornos condicionais precedem a árvore confirmada e o estado confirmado possui cabeçalho, metadados, linhas, totais e footer.
- **Classificação:** extrair subcomponentes se o recibo evoluir; não utilizar compound pattern público.
- **Prioridade:** P2.
- **Risco:** baixo a médio; os estados formam uma máquina de estados simples e explícita hoje.
- **Recomendação:** se o recibo ganhar ações ou seções novas, extrair `OrderPendingState`, `OrderDeclinedState` e `OrderConfirmation` como componentes privados. Manter a seleção do estado na página e não criar um `Order.Root` configurável.
- **Necessidade:** pode permanecer como está agora.

### CP-05 — `NftDetailRoot` já é um compound adequado

- **Arquivos:** `src/features/catalog/nft-detail/index.tsx:1-13` e `src/features/catalog/nft-detail/nft-detail-root/index.tsx:16-65`.
- **Achado:** `NftDetail.Root`, `Gallery`, `Summary`, `Description` e `Related` possuem fronteiras claras, e o root coordena apenas dados compartilhados do detalhe, favoritos e estados das recomendações.
- **Classificação:** utilizar composition pattern; manter como está.
- **Prioridade:** nenhuma.
- **Risco:** baixo no desenho atual.
- **Recomendação:** preservar o compound existente. Não fundir as partes em um componente monolítico e não adicionar partes apenas para uniformizar a API.
- **Necessidade:** nenhuma mudança necessária.

### CP-06 — `Modal` já usa contexto e composição real

- **Arquivos:** `src/components/ui/modal/index.tsx`, `src/components/ui/modal/modal-root/index.tsx`, `src/components/ui/modal/modal-context/index.ts`, `src/components/ui/modal/modal-title/index.tsx` e partes irmãs.
- **Achado:** `Modal.Root` fornece portal, foco, escape e contexto de título/descrição; as partes controlam a composição sem props de conteúdo fixo.
- **Classificação:** utilizar composition pattern; manter como está.
- **Prioridade:** nenhuma.
- **Risco:** baixo; alterações no contexto poderiam afetar acessibilidade.
- **Recomendação:** preservar `Modal.Root`, `Header`, `Title`, `Close`, `Body`, `Description` e `Footer`. Não substituir por um modal configurado com `title`, `description` e `confirmLabel`.
- **Necessidade:** nenhuma mudança de composição necessária.

### CP-07 — `Filters` já tem o nível correto de composição

- **Arquivos:** `src/components/ui/filters/index.tsx:1-7`, `src/components/ui/filters/filters-root/index.tsx:5-11` e `src/components/ui/filters/filters-group/index.tsx:3-16`.
- **Achado:** `Filters.Root` fornece estrutura e `Filters.Group` fornece agrupamento sem conhecer a regra do catálogo.
- **Classificação:** utilizar composition pattern; manter como está.
- **Prioridade:** nenhuma.
- **Risco:** baixo.
- **Recomendação:** manter `children` como extensão e continuar deixando seleção, URL e callbacks em `HomeFilters`. Não criar grupos específicos para cada tipo de filtro dentro do componente compartilhado.
- **Necessidade:** nenhuma mudança necessária.

### CP-08 — `Header` e `Footer` devem permanecer compostos por partes concretas

- **Arquivos:** `src/components/layout/header/index.tsx`, `src/components/layout/header/header-root/index.tsx`, `src/components/layout/header/header-navigation/index.tsx`, `src/components/layout/header/header-actions/index.tsx`, `src/components/layout/footer/index.tsx` e rows do footer.
- **Achado:** `Header.Root`, `Header.Navigation` e `Header.Actions` permitem que o shell controle logo, navegação e ações. `Footer.Root` e os quatro rows preservados em R-05 representam a composição real do marketplace.
- **Classificação:** utilizar composition pattern; manter como está.
- **Prioridade:** nenhuma.
- **Risco:** baixo.
- **Recomendação:** não transformar os rows em uma API genérica de slots/CMS. Não reintroduzir `Footer.Column` ou `Footer.Bottom`. A composição concreta é mais honesta para o conteúdo fixo atual.
- **Necessidade:** nenhuma mudança necessária.

### CP-09 — `NftCard` deve manter versões Desktop/Mobile separadas

- **Arquivos:** `src/features/catalog/home/nft-card/index.tsx`, `src/features/catalog/home/nft-card/nft-card-desktop/index.tsx`, `src/features/catalog/home/nft-card/nft-card-mobile/index.tsx` e `src/features/catalog/home/home-product-card/index.tsx`.
- **Achado:** R-02 já separou as árvores de apresentação e `HomeProductCard` decide qual versão usar. As diferenças de espaçamento, proporção e composição são estruturais.
- **Classificação:** manter versões separadas. Não tornar responsivo por uma única árvore cheia de condicionais.
- **Prioridade:** nenhuma para nova mudança de composição.
- **Risco:** médio somente se as versões forem novamente unificadas.
- **Recomendação:** preservar `NftCard.Desktop`, `NftCard.Mobile` e o wrapper da feature. Se surgir uma parte realmente compartilhada, extrair somente a parte, não um card universal com novas flags.
- **Necessidade:** nenhuma mudança necessária.

### CP-10 — `HomeHero` deve manter árvores Desktop/Mobile distintas

- **Arquivo:** `src/features/catalog/home/home-hero/index.tsx:11-45`.
- **Achado:** o componente renderiza duas sections com copy, assets, CTA, imagem e controles diferentes.
- **Classificação:** manter versões separadas.
- **Prioridade:** P2 apenas se a manutenção do hero crescer.
- **Risco:** médio; unificar as árvores pode modificar proporções e acessibilidade visual do Figma.
- **Recomendação:** manter as sections no mesmo componente enquanto compartilham apenas o dado `artwork`. Se cada versão começar a receber regras próprias, extrair `HomeHeroDesktop` e `HomeHeroMobile` como componentes irmãos privados. Não usar flags para ocultar uma hierarquia dentro da outra.
- **Necessidade:** não é necessária agora.

### CP-11 — `NftDetailSummary` deve preservar a buy bar Mobile separada

- **Arquivo:** `src/features/catalog/nft-detail/nft-detail-summary/index.tsx:21-89`.
- **Achado:** o componente repete quantidade e ações em regiões Desktop e Mobile, mas a posição e o propósito da buy bar são diferentes.
- **Classificação:** manter versões/partes responsivas separadas.
- **Prioridade:** P3.
- **Risco:** médio; uma extração apressada pode sincronizar incorretamente quantidade, indisponibilidade ou loading da mutation.
- **Recomendação:** manter o estado no summary e preservar as duas regiões. Extrair apenas um controle interno de quantidade se a mesma interação aparecer em outra tela ou se a manutenção da regra realmente se repetir.
- **Necessidade:** pode permanecer como está.

### CP-12 — `AccountShell` já usa composição por `children` adequadamente

- **Arquivos:** `src/features/account/account-shell/index.tsx:23-28` e `src/features/account/account-sidebar/index.tsx:7-25`.
- **Achado:** `AccountShell` controla session/logout/sidebar, enquanto o conteúdo da página entra por `children`. `AccountSidebar` recebe navegação e logout como extensões, sem dezenas de props de menu.
- **Classificação:** utilizar composition pattern simples com `children`; manter como está.
- **Prioridade:** nenhuma.
- **Risco:** baixo.
- **Recomendação:** preservar a fronteira. Não transformar `AccountShell` em compound global nem mover regras de perfil/carteiras para o sidebar.
- **Necessidade:** nenhuma mudança necessária.

### CP-13 — `WalletFields` já é uma extração local suficiente

- **Arquivo:** `src/features/account/wallets-page/index.tsx:13-39` e `src/features/account/wallets-page/index.tsx:41-92`.
- **Achado:** os campos comuns de carteira foram extraídos para `WalletFields`, enquanto a página mantém o estado separado de carteira principal e secundária.
- **Classificação:** manter como está; não utilizar compound pattern.
- **Prioridade:** nenhuma.
- **Risco:** baixo.
- **Recomendação:** preservar a duplicação de estado entre principal e secundária, pois os fluxos de edição e visibilidade são diferentes. Só extrair um modelo de campo se as regras divergirem ou se novos consumidores aparecerem.
- **Necessidade:** nenhuma mudança necessária.

### CP-14 — `AuthPage` deve permanecer uma página compartilhada por modo

- **Arquivo:** `src/features/auth/auth-page/index.tsx:15-81`.
- **Achado:** login e registro compartilham navegação, mutation, erros e estrutura; as diferenças de campos são pequenas e semânticas.
- **Classificação:** manter como está; tornar responsivo por CSS e condicionais locais, sem versões separadas nem compound pattern.
- **Prioridade:** nenhuma.
- **Risco:** baixo.
- **Recomendação:** preservar `mode` como discriminador simples. Extrair somente um bloco de campos se os fluxos ganharem diferenças substanciais; não criar `Auth.Root`, `Auth.Login` e `Auth.Register` para os dois únicos modos atuais.
- **Necessidade:** nenhuma mudança necessária.

### CP-15 — `DesktopLayout` e `MobileLayout` devem permanecer separados

- **Arquivos:** `src/components/layout/desktop-layout/index.tsx:3-18` e `src/components/layout/mobile-layout/index.tsx:3-16`.
- **Achado:** os shells recebem chrome diferente e têm responsabilidades estruturais diferentes: header/footer no Desktop e TabBar opcional no Mobile.
- **Classificação:** manter versões separadas.
- **Prioridade:** nenhuma.
- **Risco:** alto se forem unificados por flags, pois a navegação e a hierarquia do shell são diferentes.
- **Recomendação:** preservar os dois componentes e manter `Layout` como orquestrador de modo. Não criar um `Layout` universal com dezenas de props condicionais.
- **Necessidade:** nenhuma mudança necessária.

### CP-16 — Primitivos simples não precisam de compound pattern

- **Arquivos:** `src/components/ui/button/index.tsx`, `input/index.tsx`, `input/password-input/index.tsx`, `badge/index.tsx`, `image/index.tsx`, `skeleton/index.tsx`, `stepper/index.tsx`, `pagination/index.tsx`, `checkbox/index.tsx` e `select/index.tsx`.
- **Achado:** esses componentes representam uma unidade visual/interativa coesa e não possuem partes externas que precisem compartilhar estado por composição.
- **Classificação:** manter como está.
- **Prioridade:** nenhuma.
- **Risco:** médio se forem divididos artificialmente; a API ficaria mais indireta sem benefício de composição.
- **Recomendação:** preservar APIs simples. A análise de tipos de `Button` e `Select` está registrada em `docs/audit/react-review.md`, mas não justifica criar compounds.
- **Necessidade:** nenhuma mudança de composição necessária.

## 4. Resumo por classificação

| Classificação | Componentes | Decisão |
| --- | --- | --- |
| Manter como está | `Modal`, `Filters`, `Header`, `Footer`, `NftDetail`, `AccountShell`, `WalletFields`, `AuthPage`, primitivos | Nenhuma alteração de composição |
| Extrair subcomponente | `CheckoutPage`, `CartPage`, `HomePage`, futuramente `OrderPage` | Somente quando houver manutenção independente real |
| Utilizar composition pattern | `Modal`, `Filters`, `Header`, `Footer`, `NftDetail` | Padrão já existente e adequado |
| Tornar responsivo | `AuthPage` e partes de layout que compartilham a mesma responsabilidade | Usar CSS/condicionais locais quando a hierarquia for a mesma |
| Manter versões separadas | `DesktopLayout`/`MobileLayout`, `NftCard`, `HomeHero`, buy bar do `NftDetailSummary` | Diferenças estruturais reais |

## 5. Componentes que não devem ser alterados nesta fase

- `src/components/ui/modal/*`: compound component correto, com contexto e foco.
- `src/components/ui/filters/*`: composição mínima e adequada por `children`.
- `src/components/layout/header/*`: shell composto por partes concretas.
- `src/components/layout/footer/*`: API já alinhada após R-05; não criar colunas ou slots genéricos.
- `src/features/catalog/nft-detail/index.tsx`: compound da feature com partes claras.
- `src/features/catalog/home/nft-card/*`: manter Desktop/Mobile separados após R-02.
- `src/components/layout/desktop-layout/index.tsx` e `mobile-layout/index.tsx`: shells estruturalmente diferentes.
- `src/features/catalog/home/home-hero/index.tsx`: não unificar as árvores Desktop/Mobile.
- `src/features/catalog/nft-detail/nft-detail-summary/index.tsx`: não eliminar a buy bar Mobile para reduzir duplicação.
- `src/components/ui/button`, `input`, `badge`, `image`, `skeleton`, `stepper`, `pagination` e `checkbox`: não dividir em compounds artificiais.

## 6. Conclusão

Os casos que realmente justificam extração são páginas de negócio grandes, especialmente checkout e carrinho. Mesmo nesses casos, a recomendação é extrair subcomponentes privados e preservar a página como orquestradora, não criar uma nova API compound pública.

O projeto já aplica Composition Pattern nos locais corretos. As árvores Desktop/Mobile devem continuar separadas quando a hierarquia ou a interação muda de forma real. Não há justificativa para uma abstração global de página, formulário, card ou layout apenas para reduzir linhas.

Nenhuma recomendação deste relatório foi implementada.
