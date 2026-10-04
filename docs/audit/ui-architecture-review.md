# UI Architecture Review

## 1. Escopo e método

Esta revisão cobre a arquitetura atual de `src/app`, `src/components` e `src/features`, com foco em composição, responsabilidades, props, fronteiras de domínio, separação Desktop/Mobile, hooks, barrels, duplicações e candidatos a código morto.

Foram usados como contexto o `README.md`, `AGENTS.md`, a documentação em `docs/figma/`, os documentos existentes em `docs/audit/` e `ARCHITECTURE.md`. A análise de uso foi feita pelos consumidores encontrados no código-fonte em `src/`.

Esta revisão é somente estrutural. Nenhuma recomendação abaixo foi executada e nenhuma decisão altera o contrato visual, o comportamento, as rotas ou a responsividade atuais.

## 2. Resumo executivo

### Pontos fortes

- As páginas estão agrupadas por domínio em `src/features`: autenticação, catálogo, carrinho, checkout, pedidos e conta.
- A camada de dados permanece fora dos componentes de UI: as páginas usam APIs de feature, TanStack Query e o cliente HTTP existente.
- `Modal`, `Filters`, `Header` e `Footer` já expressam composição por partes em vez de acumular dezenas de props em um único componente.
- A separação de shell Desktop/Mobile é explícita em `DesktopLayout` e `MobileLayout`, sem tentar transformar diferenças estruturais reais em apenas flags CSS.
- Os consumidores importam componentes compartilhados pelo barrel `@/components`, mantendo uma superfície pública consistente.

### Principais oportunidades

- `Layout` concentra shell, política de navegação, regra de exibição da TabBar, conexão realtime, estado de conexão e estado visual especial das rotas de autenticação.
- `NftCard` mistura apresentação de NFT, variação Desktop/Mobile, promoção, favoritos e ação de compra em uma API de 17 props.
- Alguns componentes publicados pelo barrel não têm consumidor atual em `src/`, o que aumenta a superfície pública sem benefício imediato.
- Alguns componentes localizados em `ui` são específicos do marketplace, como `Footer`, `AccountSidebar`, `NftCard` e `NftReceiptArtwork`.
- Há duplicação legítima de markup para Desktop/Mobile em Home, detalhe de NFT e card de NFT; ela deve ser tratada como diferença estrutural, não eliminada artificialmente.

## 3. Arquitetura global atual

O fluxo principal é:

```text
src/app/render.tsx
  QueryClientProvider
    RouterProvider
      root route -> Layout
        DesktopLayout ou MobileLayout
          Outlet -> página de feature
```

Responsabilidades atuais:

| Área | Responsabilidade observada | Avaliação |
| --- | --- | --- |
| `src/app/render.tsx` | Inicialização React, Query Client e Router | Coesa; manter |
| `src/app/router.tsx` | Árvore de rotas, guarda autenticada e carregamento de páginas | Coesa o suficiente; manter |
| `src/app/layout.tsx` | Shell, header/footer, TabBar, política por rota, conexão catalog e status realtime, fundo da autenticação | Responsabilidade excessiva; refatoração estrutural recomendada |
| `src/features/*/*-page` | Consulta/mutação de dados e composição da tela de domínio | Correto para o escopo atual, embora algumas páginas estejam extensas |
| `src/components/ui` | Primitivas e blocos compartilhados | Mistura primitivos genéricos com componentes de domínio |
| `src/components/layout` | Shell e estrutura de layout | Fronteira adequada; pode absorver componentes atualmente específicos do shell |
| `src/lib/realtime` | Conexões Socket.IO e callbacks de estado de conexão | Correto; os consumidores não simulam eventos por setters |

O risco arquitetural mais relevante não está na hierarquia de features, mas no acoplamento crescente do `Layout` a todos os detalhes do shell e na API excessivamente variante de alguns componentes compartilhados.

## 4. Inventário de componentes

| Componente | Arquivo | Uso atual | Categoria | Decisão |
| --- | --- | --- | --- | --- |
| `Button` | `src/components/ui/button/index.tsx` | Ações, links via `asChild`, loading e variantes visuais | Primitivo | KEEP |
| `Input` | `src/components/ui/input/index.tsx` | Auth, carrinho, checkout, conta e carteiras | Primitivo de formulário | KEEP |
| `PasswordInput` | `src/components/ui/input/password-input/index.tsx` | Auth e perfil | Primitivo de formulário especializado | KEEP |
| `Label` | `src/components/ui/label/index.tsx` | Exportado, sem consumidor encontrado em `src/` | Primitivo | REMOVE ou manter fora do barrel até haver consumidor |
| `Image` | `src/components/ui/image/index.tsx` | Imagens de todas as features | Primitivo | KEEP |
| `Skeleton` | `src/components/ui/skeleton/index.tsx` | Loading de app, catálogo, carrinho, checkout e pedido | Primitivo | KEEP |
| `Badge` | `src/components/ui/badge/index.tsx` | Home e cards de NFT | Primitivo visual | KEEP |
| `NftCard` | `src/components/ui/card/index.tsx` | Exclusivamente por `HomeProductCard` | Bloco de domínio | REFACTOR |
| `Modal` | `src/components/ui/modal/*` | Zoom da galeria de NFT | Composto com estado/contexto | KEEP |
| `Sheet` | `src/components/ui/sheet/index.tsx` | Filtros mobile da Home | Overlay interativo | KEEP |
| `Select` | `src/components/ui/select/index.tsx` | Checkout e carteiras | Campo composto | KEEP |
| `Checkbox` | `src/components/ui/checkbox/index.tsx` | Carteiras | Campo de formulário | KEEP |
| `Radio` / `RadioGroup` | `src/components/ui/radio/index.tsx` | Sem consumidor encontrado em `src/` | Campo de formulário | REMOVE ou manter fora do barrel até haver consumidor |
| `Avatar` | `src/components/ui/avatar/index.tsx` | Sem consumidor encontrado; perfil implementa avatar localmente | Bloco de domínio | REMOVE ou mover para feature quando usado |
| `Stepper` | `src/components/ui/stepper/index.tsx` | Quantidade no carrinho | Campo de domínio reutilizável | KEEP |
| `Pagination` | `src/components/ui/pagination/index.tsx` | Catálogo Home | Controle de navegação | KEEP |
| `CarouselDots` | `src/components/ui/carousel-dots/index.tsx` | Relacionados do detalhe de NFT | Controle visual | KEEP |
| `TabBar` | `src/components/ui/tab-bar/index.tsx` | Shell mobile | Navegação de layout | REFACTOR de localização, não de comportamento |
| `Footer` | `src/components/ui/footer/*` | Shell Desktop | Bloco de layout/marketing | REFACTOR de localização |
| `Filters` | `src/components/ui/filters/*` | `HomeFilters` | Composto estrutural | KEEP |
| `WalletSelector` | `src/components/ui/wallet-selector/*` | Sem consumidor encontrado em `src/` | Bloco de checkout | REMOVE ou deferir |
| `ToastProvider` / `useToast` | `src/components/ui/toast/*` | Exportados, sem provider montado nem consumidor encontrado | Infraestrutura de feedback | REMOVE ou deferir |
| `SocialButton` | `src/components/ui/social-button/index.tsx` | Auth | Bloco de auth | KEEP |
| `MobileSocialBlock` | `src/components/ui/mobile-social-block/index.tsx` | Auth | Bloco de auth | KEEP |
| `AccountSidebar` | `src/components/ui/account-sidebar/index.tsx` | `AccountShell` | Bloco de conta | REFACTOR de localização |
| `NftReceiptArtwork` | `src/components/ui/nft-receipt-artwork/index.tsx` | Sem consumidor encontrado em `src/` | Bloco de pedido | REMOVE ou deferir |
| `Container` | `src/components/layout/container/index.tsx` | Exportado; consumidor direto não encontrado no código revisado | Layout | REMOVE do barrel se não houver uso externo |
| `Sidebar` | `src/components/layout/sidebar/index.tsx` | Exportado; consumidor direto não encontrado em `src/` | Layout | REMOVE do barrel se não houver uso externo |
| `Header` | `src/components/layout/header/*` | Shell Desktop | Composto de layout | KEEP |
| `DesktopLayout` | `src/components/layout/desktop-layout/index.tsx` | Shell Desktop | Layout | KEEP |
| `MobileLayout` | `src/components/layout/mobile-layout/index.tsx` | Shell Mobile | Layout | KEEP |

Os itens classificados como candidatos a remoção devem ser confirmados contra consumidores fora de `src/` antes de qualquer exclusão. A classificação significa “sem consumidor encontrado no código revisado”, não prova de que o símbolo não é usado por integração externa.

## 5. Hierarquia e composição

### Composições corretas

| Composição | Decisão | Justificativa |
| --- | --- | --- |
| `Header.Root` + `Header.Navigation` + `Header.Actions` | KEEP | O shell precisa controlar ordem, logo, navegação e ações sem uma API com props específicas de marketplace. |
| `Modal.Root` + `Header` + `Title` + `Close` + `Body` + `Footer` | KEEP | Há estado compartilhado, acessibilidade e composição real no zoom da galeria. |
| `Filters.Root` + `Filters.Group` | KEEP | Os grupos são extensões naturais do filtro e são usados por `HomeFilters`. |
| `NftDetail.Root` + `Gallery` + `Summary` + `Description` + `Related` | KEEP | É composição da própria feature, com fronteiras claras entre dados e apresentação. |
| `Footer.Root` + rows | REFACTOR | A composição é legível, mas os rows têm conteúdo fixo e existem partes exportadas sem consumidor. A decisão deve reduzir a superfície pública, não criar uma abstração genérica de footer. |
| `WalletSelector.Root` + `WalletCard` + `Methods` + `Method` | REMOVE ou DEFERIR | A composição não participa do fluxo atual; checkout usa markup próprio. |

### Componentes que não precisam de compound pattern

- `Button`, `Input`, `Badge`, `Image`, `Skeleton`, `Stepper`, `Pagination`, `SocialButton` e `AccountSidebar` são suficientemente coesos como componentes simples.
- `HomeHero`, `HomeProductCard`, `HomeFeatured`, `HomePromoCard`, `HomeBlogCard` e `HomeFilters` pertencem à feature Home e não precisam virar compounds genéricos.
- Não há justificativa para um `Page` compound global: as páginas têm regras de dados e estados de erro diferentes.

### Fronteiras artificiais

- `FooterColumn` e `FooterBottom` são partes genéricas que não participam da composição atual; parecem antecipar uma API diferente do footer real.
- `WalletSelector` representa uma API de checkout que não é a API efetivamente usada por `CheckoutPage`.
- `Container` e `Sidebar` são wrappers mínimos sem consumidor atual confirmado, portanto não demonstram uma abstração necessária no estado atual.

## 6. Responsabilidades e coesão

### Alta coesão

- `ModalRoot` concentra portal, foco, escape, overlay e contexto de título/descrição; a responsabilidade é única apesar da implementação interna rica.
- `Select` concentra o comportamento de um campo customizado, incluindo teclado, listbox, erro e helper text.
- `HomeFilters` combina estado local temporário de preço com callbacks de domínio explícitos; a responsabilidade permanece no filtro da Home.
- `NftDetailGallery` mantém estado de imagem selecionada e zoom, sem fazer mutações de dados.

### Coesão insuficiente

#### `src/app/layout.tsx`

Responsabilidades atuais: escolher Desktop/Mobile, montar header e footer, conectar o catálogo realtime, decidir quando esconder a TabBar, desenhar fundo de autenticação e mostrar status de conexão.

Problema: mudanças de navegação, shell, realtime ou autenticação exigem editar o mesmo módulo. O componente raiz conhece detalhes de cada rota.

Recomendação: `REFACTOR`, prioridade P1, impacto visual baixo se feito apenas como extração estrutural. Extrair componentes de shell concretos, como `MarketplaceHeader`, `MarketplaceFooter` e `RealtimeConnectionStatus`, mantendo `Layout` como orquestrador. A política de TabBar pode permanecer local inicialmente; só deve virar hook/tabela se ganhar novas regras.

#### `src/components/ui/card/index.tsx`

Responsabilidades atuais: card visual, dois trees completos Desktop/Mobile, badge raro, favorito, promoção, ação de compra, teclado e navegação indireta.

Problema: `isMobile`, `isPromo`, `showAction`, `showRareBadge`, `onClick`, `onFavorite` e `favorite` formam uma matriz de estados difícil de validar e permitem combinações que não são usadas.

Recomendação: `REFACTOR`, prioridade P1, impacto visual baixo se a API pública de `HomeProductCard` for preservada. Separar apresentação Desktop/Mobile e manter a decisão de contexto em `HomeProductCard`; não criar um card universal configurado por muitas flags.

#### `src/components/ui/footer/*`

Responsabilidades atuais: conteúdo específico de marketplace, links específicos de rota, newsletter e ícones sociais.

Problema: a pasta `ui` sugere reutilização genérica, mas o conteúdo é de shell/marketing do produto.

Recomendação: `REFACTOR`, prioridade P2, impacto visual baixo. Mover conceitualmente para `components/layout` ou para uma área de marketing quando houver essa fronteira, removendo partes não usadas. Não transformar o conteúdo em uma API genérica de CMS.

## 7. Props e contratos

### API saudável

- `HomeFiltersProps` recebe dados e callbacks de domínio claramente nomeados; não recebe um objeto de estado opaco.
- `NftDetailRootProps` separa `nft`, dados relacionados e estados de carregamento/erro; a API é explícita para o estado atual.
- `DesktopLayoutProps` e `MobileLayoutProps` recebem `children` e o chrome correspondente, sem dezenas de props de estilo.
- `InputProps` e `SelectProps` oferecem labels, erros, helper text e atributos nativos; o contrato é apropriado para formulários.

### APIs sobrecarregadas

- `NftCardProps` tem 17 props e mistura dados de domínio com decisão de viewport e ações opcionais.
- `SheetProps` concentra posicionamento, tamanho, drag handle, close button, comportamento de escape e overlay. A API ainda é justificável porque todos os campos pertencem ao comportamento do overlay, mas não deve receber regras de negócio.
- `AvatarProps` mistura apresentação, edição, upload e remoção. Como não há consumidor atual, a primeira decisão deve ser não ampliar o contrato.
- `AccountSidebarProps` contém `userName`, título padrão e `logout`, o que o torna específico de conta, não um aside genérico.

### Props que devem continuar explícitas

- Não substituir `relatedLoading`, `relatedError` e `onRetryRelated` por um objeto genérico de “async state” apenas para reduzir linhas; esses estados têm comportamento visual próprio.
- Não esconder `mobile`, `rare` e `promo` dentro de um objeto de tema no `HomeProductCard`; se a divisão de apresentação for feita, essas decisões devem virar componentes/variações semânticas.

## 8. Desktop/Mobile

### Classificação

| Área | Classificação | Evidência | Decisão |
| --- | --- | --- | --- |
| `DesktopLayout` / `MobileLayout` | A | Shells têm chrome e navegação estruturalmente diferentes | KEEP como componentes separados |
| `HomeHero` | A | O arquivo renderiza dois sections com hierarquia, copy, assets e controles diferentes | REFACTOR em partes Desktop/Mobile se a manutenção continuar crescendo |
| `HomePage` | A | Há grids, toolbar, filtros, promoções e markup de produto diferentes em Desktop/Mobile | KEEP a diferença estrutural; considerar extração de subcomponentes da Home |
| `NftCard` | A | Há dois trees completos, com espaçamento, imagem, metadados e ação diferentes | REFACTOR; não reduzir a um único tree cheio de condicionais |
| `NftDetailSummary` | A | Desktop usa ações na área principal e Mobile tem buy bar própria | KEEP a diferença; extrair buy bar somente se houver reutilização |
| `CartPage` | B | A maior parte do conteúdo é compartilhada e o CSS ajusta tabela, cabeçalho e totais | KEEP como página única |
| `CheckoutPage` | B | Formulário e resumo compartilham modelo; a responsividade é principalmente estrutural via CSS | KEEP como página única |
| `AuthPage` | B | Login/registro compartilham fluxo e markup com campos condicionais | KEEP como página única |
| `TabBar` | A | É chrome exclusivamente mobile | KEEP isolado no shell mobile |
| `Footer` | B | O footer é montado no DesktopLayout e não há versão mobile equivalente no shell atual | Não criar duplicata mobile sem requisito visual |

O princípio aplicado é: separar quando a hierarquia ou a interação muda de forma real; manter um componente quando o mesmo conteúdo pode responder por CSS sem uma árvore alternativa. A existência de dois frames Figma, por si só, não foi tratada como motivo para duplicar tudo.

## 9. Hooks e estado

### Hooks existentes

- `useLayoutMode` é uma boa fronteira: encapsula `matchMedia`, subscription e snapshot SSR usando `useSyncExternalStore`.
- `useSearch`, `useNavigate` e TanStack Query permanecem próximos das páginas que possuem a regra de negócio correspondente.
- Os efeitos realtime ficam nos consumidores que conhecem a consequência do evento: catálogo no shell, NFT no carrinho/checkout e pedido no order page.
- Não foi encontrada uma camada de hooks de UI excessiva ou uma abstração genérica que esconda regras do produto.

### Oportunidades

- Extrair a política de chrome da rota de `Layout` apenas quando ela tiver mais variações; hoje é uma lista curta, mas já está acoplada ao root shell.
- Não extrair mutations de páginas automaticamente. Carrinho, checkout e detalhe de NFT possuem regras específicas de optimistic update, cotação, idempotência e autenticação; transformá-las em hooks genéricos agora reduziria legibilidade.
- A função `SelectLike` no perfil é uma duplicação local de um select visual. Ela deve ser avaliada como decisão de feature: se o perfil precisar do mesmo contrato de erro/estilo de `Select`, pode adotar `Select`; não é necessário criar outro componente compartilhado.

## 10. Barrels e fronteiras de importação

`src/components/index.ts` é uma superfície pública extensa, mas os consumidores seguem a convenção de importar vários componentes do mesmo barrel em um único import.

### Pontos positivos

- O barrel evita caminhos profundos para os consumidores de features.
- O barrel de layout mantém `Header`, `DesktopLayout`, `MobileLayout` e `useLayoutMode` juntos.
- Componentes internos usam caminhos relativos quando a dependência é interna, como `Stepper` importando `Button` diretamente.

### Oportunidades

- Remover do barrel símbolos sem consumidores confirmados, principalmente `WalletSelector`, `ToastProvider`/`useToast`, `Radio`, `Avatar`, `NftReceiptArtwork`, `Sidebar`, `Container`, `Label` e `Footer.Column`/`Footer.Bottom`.
- Considerar um barrel separado para `layout` e outro para `ui` somente se a superfície crescer; no estado atual, a separação física já existe e uma nova camada não é necessária.
- Evitar exportar componentes de domínio como se fossem primitivos. `NftCard`, `AccountSidebar` e `NftReceiptArtwork` poderiam ser movidos para fronteiras de feature/layout quando houver alteração estrutural real.

## 11. Duplicações encontradas

### Duplicação legítima

- Home Desktop/Mobile: os layouts têm hierarquia, quantidade de itens e interação diferentes.
- Card de NFT Desktop/Mobile: a composição visual e a ação opcional realmente diferem.
- Buy bar mobile do detalhe de NFT: é uma affordance específica de viewport.
- Estados de loading de Home, detalhe, carrinho, checkout e pedido: cada tela preserva um esqueleto correspondente à sua geometria.

### Duplicação que merece avaliação

- `NftDetailSummary` repete os controles de quantidade em duas regiões. A repetição existe por causa da posição Desktop/Mobile, mas pode ser reduzida por uma parte interna reutilizável se isso não dificultar a fidelidade visual.
- `CheckoutPage` e `WalletsPage` repetem campos de rede/carteira, porém representam fluxos diferentes e têm dados/validações diferentes. Não criar um formulário global sem evidência de contrato comum.
- `FooterLinksRow` e `FooterFeatureRow` contêm conteúdo fixo, enquanto `FooterColumn` oferece uma abstração não utilizada. A inconsistência deve ser resolvida removendo a abstração não usada ou adotando-a de forma deliberada, não mantendo as duas APIs.

## 12. Código morto ou sem consumidor encontrado

Os seguintes símbolos não possuem consumidor encontrado em `src/` durante a revisão:

- `WalletSelector` e todas as suas partes.
- `ToastProvider`, `useToast` e o contexto de toast.
- `Sidebar`.
- `Container`.
- `Avatar`.
- `Radio` e `RadioGroup`.
- `NftReceiptArtwork`.
- `Label`.
- `Footer.Column`.
- `Footer.Bottom`.

Recomendação geral: `REMOVE` do barrel e das fontes quando a ausência de consumidores externos estiver confirmada, ou `DEFER` fora da superfície pública se esses componentes forem mantidos como protótipos de uma próxima etapa. Não há justificativa para criar adaptadores ou consumidores artificiais apenas para preservar os exports.

## 13. Recomendações de simplificação e refatoração

### R-01 — Reduzir responsabilidades do root `Layout`

- **Arquivo alvo:** `src/app/layout.tsx`
- **Responsabilidade atual:** shell Desktop/Mobile, header, footer, TabBar, auth background, conexão catalog realtime e status de conexão.
- **Problema:** módulo raiz conhece detalhes de rota, markup de marketing e feedback de realtime.
- **Sugestão:** extrair componentes concretos de shell e manter `Layout` apenas como orquestrador de modo, outlet e chrome.
- **Benefício:** menor custo de manutenção e menor risco de regressão ao alterar uma área do shell.
- **Risco:** baixo, desde que sejam apenas extrações sem alteração de classes, ordem ou regras.
- **Prioridade:** P1.
- **Impacto visual:** baixo; nenhum impacto esperado se os mesmos nós e classes forem preservados.
- **Justificativa:** `Layout` é o principal ponto de acoplamento transversal identificado.

### R-02 — Separar a árvore Desktop/Mobile de `NftCard`

- **Arquivo alvo:** `src/components/ui/card/index.tsx`
- **Responsabilidade atual:** apresentação de card, variações de viewport, promoção, favoritos e ação.
- **Problema:** matriz de props grande e dois trees completos no mesmo componente.
- **Sugestão:** manter uma API de feature em `HomeProductCard` e dividir a apresentação interna em partes Desktop/Mobile, sem criar um “card universal” com mais flags.
- **Benefício:** contratos menores, leitura mais direta e menor chance de combinações inválidas.
- **Risco:** médio; diferenças de espaçamento e interação podem ser alteradas inadvertidamente.
- **Prioridade:** P1.
- **Impacto visual:** médio se implementado sem screenshots de 390 e 1440.
- **Justificativa:** o componente é o caso mais claro de árvore estruturalmente distinta escondida por `isMobile`.

### R-03 — Reclassificar blocos de domínio que estão em `ui`

- **Arquivos alvo:** `src/components/ui/card`, `src/components/ui/footer`, `src/components/ui/account-sidebar`, `src/components/ui/nft-receipt-artwork`.
- **Responsabilidade atual:** componentes específicos do marketplace publicados como UI genérica.
- **Problema:** consumidores podem assumir reutilização e contratos que não existem.
- **Sugestão:** mover somente quando houver alteração estrutural futura, preservando os exports durante a migração necessária; priorizar `Footer` para `layout` e `AccountSidebar` para `features/account`.
- **Benefício:** fronteiras de domínio mais honestas.
- **Risco:** médio por alteração de imports.
- **Prioridade:** P2.
- **Impacto visual:** nenhum esperado; é mudança de localização/import.
- **Justificativa:** os componentes carregam copy, rotas e semântica de produto diretamente.

### R-04 — Remover exports sem consumidor confirmado

- **Arquivos alvo:** `src/components/index.ts`, `src/components/ui/footer/index.tsx` e árvores de `WalletSelector`, toast, avatar, radio, receipt, sidebar, container e label.
- **Responsabilidade atual:** manter uma superfície pública maior que o uso efetivo.
- **Problema:** dificulta descobrir quais componentes são suportados e mantém abstrações não exercitadas.
- **Sugestão:** confirmar consumidores fora de `src/`; depois remover ou manter fora do barrel os símbolos sem uso.
- **Benefício:** barrel menor e menor custo de manutenção.
- **Risco:** médio se houver consumidor externo não pesquisado.
- **Prioridade:** P2.
- **Impacto visual:** nenhum.
- **Justificativa:** há evidência direta de ausência de consumidores no código revisado.

### R-05 — Resolver a API inconsistente do Footer

- **Arquivos alvo:** `src/components/ui/footer/index.tsx` e rows do footer.
- **Responsabilidade atual:** exportar seis partes, embora o shell use apenas quatro (`Root`, `FeatureRow`, `ContactRow`, `LinksRow`).
- **Problema:** `Column` e `Bottom` sugerem uma composição genérica que não corresponde ao footer montado.
- **Sugestão:** escolher uma única direção: rows concretas para o shell atual ou composição por colunas/slots. Para este produto, manter rows concretas e retirar partes sem uso é a opção mais simples.
- **Benefício:** API alinhada ao uso real.
- **Risco:** baixo se não houver consumidor externo.
- **Prioridade:** P2.
- **Impacto visual:** nenhum esperado.
- **Justificativa:** a própria composição atual já demonstra qual API é efetivamente necessária.

### R-06 — Evitar criar abstrações para páginas

- **Arquivos alvo:** `src/features/catalog/home/home-page`, `src/features/cart/cart-page`, `src/features/checkout/checkout-page`, `src/features/orders/order-page`.
- **Responsabilidade atual:** cada página coordena queries, mutações, estados de loading/erro e markup específico.
- **Problema evitado:** uma abstração futura poderia tentar unificar páginas apenas porque todas têm loading, erro e conteúdo.
- **Sugestão:** manter as regras nas features; extrair somente subcomponentes quando uma parte tiver nome, contrato e consumidor claros.
- **Benefício:** preserva fronteiras de domínio e reduz acoplamento.
- **Risco:** baixo.
- **Prioridade:** P3, como regra de manutenção.
- **Impacto visual:** nenhum.
- **Justificativa:** os estados de carrinho, checkout e pedido têm contratos de negócio distintos.

## 14. Roadmap recomendado

| Ordem | Ação | Prioridade | Pré-condição |
| --- | --- | --- | --- |
| 1 | Extrair apenas o chrome concreto de `Layout` | P1 | Baseline visual atual disponível |
| 2 | Dividir a apresentação Desktop/Mobile de `NftCard` | P1 | Comparação Playwright em 390 e 1440 |
| 3 | Confirmar consumidores externos dos exports sem uso em `src/` | P2 | Busca em testes, scripts e integrações |
| 4 | Remover/deferir exports mortos e alinhar `Footer` | P2 | Confirmação do item anterior |
| 5 | Reclassificar componentes de domínio em `ui` somente quando houver mudança relacionada | P2 | Não fazer migração isolada sem benefício imediato |
| 6 | Reavaliar duplicações de quantidade no detalhe de NFT | P3 | Evidência de manutenção difícil ou nova tela consumidora |

Nenhum item exige mudança de contrato de API, REST, Socket.IO, Query Client ou regra de negócio.

## 15. Matriz de risco e impacto visual

| Recomendação | Risco técnico | Risco visual | Como validar |
| --- | --- | --- | --- |
| R-01 | Baixo | Baixo | Typecheck, lint, build e screenshots dos shells |
| R-02 | Médio | Médio | Playwright 390/1440 para Home e catálogo |
| R-03 | Médio | Nenhum esperado | Typecheck e busca de imports |
| R-04 | Médio por possível consumidor externo | Nenhum | Busca global, typecheck e testes |
| R-05 | Baixo | Nenhum esperado | Typecheck e render do shell Desktop |
| R-06 | Baixo | Nenhum | Revisão de PR e testes existentes |

As recomendações visuais não devem ser executadas sem comparar novamente as referências Figma e os screenshots oficiais. A revisão não propõe trocar tokens, classes, assets, copy, ordem de elementos ou breakpoints.

## 16. Conclusão e decisões

- A organização por feature deve ser preservada.
- `Header`, `Modal` e `Filters` demonstram composição apropriada e devem permanecer compostos.
- `DesktopLayout` e `MobileLayout` devem permanecer separados porque representam shells estruturalmente diferentes.
- `HomePage`, `HomeHero`, `NftCard` e o buy bar do detalhe de NFT contêm diferenças Desktop/Mobile reais; não devem ser “unificados” apenas para reduzir arquivos.
- O primeiro refactor estrutural recomendado é reduzir a responsabilidade de `src/app/layout.tsx`.
- O segundo é reduzir a matriz de props e as árvores duplicadas de `NftCard`.
- Os componentes sem consumidor atual devem ser removidos ou retirados da superfície pública somente após confirmar que não existem consumidores externos.
- Não há justificativa para criar mais providers, hooks genéricos ou page shells neste momento.
- Não foram executadas alterações de código, CSS, tokens, comportamento, rotas, dados, mocks ou realtime como parte desta revisão.
