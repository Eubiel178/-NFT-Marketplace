# Auditoria Estrutural e Plano de Refatoração

## Escopo

Esta auditoria considera o código atual em `src/`, os contratos em `docs/CONTRACTS.md`, a arquitetura registrada em `ARCHITECTURE.md`, os documentos de Figma e os testes E2E existentes. O objetivo é registrar riscos estruturais e propostas de baixo risco sem alterar o comportamento funcional, a composição visual, os tokens, os breakpoints, os assets ou o conteúdo das telas.

Nenhum gap funcional foi corrigido nesta etapa. Os itens abaixo são propostas para uma etapa posterior e devem ser executados em incrementos pequenos, sempre com typecheck, lint, testes E2E e comparação visual em `1440px` e `390px`.

## Critério Desktop/Mobile

| Classificação | Significado |
| --- | --- |
| A | Desktop e Mobile podem compartilhar lógica, contrato e markup sem alterar a composição visual documentada. |
| B | Desktop e Mobile podem compartilhar estado, dados ou subcomponentes, mas devem manter composições ou variantes visuais distintas. |
| C | Desktop e Mobile representam composições, conteúdo ou regras diferentes; não unificar a apresentação. Extrair somente domínio, dados ou utilitários comprovadamente comuns. |

## Resumo de Prioridades

| Prioridade | Itens | Objetivo |
| --- | --- | --- |
| P1 | ARQ-01, ARQ-03, ARQ-04, STATE-01, STATE-02, COUP-01 | Reduzir concentração de responsabilidade e acoplamento em fluxos críticos. |
| P2 | ARQ-02, ARQ-05, ARQ-06, STATE-03, UI-01, API-01 | Melhorar testabilidade e reduzir duplicação sem tocar na composição visual. |
| P3 | UI-02, CSS-01, DOC-01, DEAD-01 | Melhorias de manutenção e higiene estrutural após estabilização dos fluxos. |

## Achados

### ARQ-01: Layout raiz concentra shell, navegação, realtime e conteúdo de autenticação

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/app/layout.tsx:17-147` |
| Problema | `Layout` controla conexão Socket.IO, detecção Desktop/Mobile, navegação, regras de exibição da Tab Bar, headers/footers inteiros, status de conexão e o `HomePage` usado como fundo nas rotas de autenticação. |
| Princípio/padrão | Separação entre shell de aplicação, configuração de navegação e integração de infraestrutura. Um componente de composição não deveria ser também o dono de vários efeitos e decisões de rota. |
| Impacto | Alto acoplamento; qualquer mudança no realtime ou nas regras de shell exige tocar o mesmo arquivo; aumenta o custo de testar rotas isoladamente. O `HomePage` completo também é montado como fundo inerte em login/register. |
| Proposta | Extrair, em sequência, `useCatalogRealtimeStatus`, configuração de navegação/rotas e `AuthMarketplaceBackground`. Manter `DesktopLayout`, `MobileLayout`, ordem de elementos e classes atuais. Não substituir o fundo por uma nova aparência. |
| Risco visual | Médio. A ordem de composição e os breakpoints são sensíveis; o risco fica baixo se a extração for puramente estrutural e acompanhada de screenshots. |
| Esforço | M |
| Prioridade | P1 |
| Desktop/Mobile | B: compartilhar estado e configuração, mantendo `desktopHeader`, `desktopFooter` e `MobileLayout` como composições distintas. |
| Arquivos afetados | `src/app/layout.tsx`; novos módulos de shell/realtime se a proposta for aprovada. |

### ARQ-02: HomePage mistura estado de URL, consulta, filtros e apresentação

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/catalog/home/home-page/index.tsx:47-177` |
| Problema | A página lê/escreve search params, controla debounce, consulta catálogo, calcula paginação, controla drawer, trata loading/error e renderiza toda a home. |
| Princípio/padrão | Controller/view e co-localização de estado de servidor separada da apresentação. |
| Impacto | Difícil testar filtros e estados de rede sem montar a página inteira; aumenta a chance de regressão ao alterar a busca ou o drawer. |
| Proposta | Extrair um controller pequeno para search params, filtros e `catalogOptions`; deixar a página como composição da view existente. Preservar o contrato de URL e os mesmos componentes/classes. |
| Risco visual | Baixo se nenhuma regra de renderização for reordenada. |
| Esforço | M |
| Prioridade | P2 |
| Desktop/Mobile | A para a lógica; B para a apresentação, pois o drawer mobile e a barra de filtros não devem ser forçados à mesma composição. |
| Arquivos afetados | `src/features/catalog/home/home-page/index.tsx`; `src/features/catalog/api`; eventual novo controller de catálogo. |

### ARQ-03: CartPage concentra mutações otimistas, cotação, persistência, realtime e markup

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/cart/cart-page/index.tsx:19-145` |
| Problema | O componente possui query do carrinho, query de sessão, recomendações, duas mutações otimistas, cupom em `localStorage`, cotação, conexão realtime, navegação de autenticação, estados de erro e a renderização Desktop/Mobile completa. |
| Princípio/padrão | Separar server state, workflow/controller e view; efeitos de infraestrutura não devem ficar intercalados ao markup do fluxo. |
| Impacto | Alto risco de regressão em rollback, cotação e invalidação; testes de regras de negócio ficam dependentes do layout; a página conhece diretamente um componente específico da home. |
| Proposta | Extrair o controller de carrinho/cotação e as ações de persistência para módulos da feature. Manter as duas mutações e o fluxo de quote, sem alterar suas transições. Extrair a recomendação como composição de catálogo, não como dependência de `HomeProductCard`. |
| Risco visual | Médio. A página possui classes específicas para a tabela desktop e a adaptação mobile; não mover elementos entre as regiões. |
| Esforço | L |
| Prioridade | P1 |
| Desktop/Mobile | B: lógica compartilhável; tabela desktop, header mobile e resumo responsivo permanecem visualmente distintos. |
| Arquivos afetados | `src/features/cart/cart-page/index.tsx`; `src/features/cart/api`; `src/features/catalog/home/home-product-card/index.tsx`; módulo de persistência de cupom. |

### ARQ-04: CheckoutPage é simultaneamente formulário, cotador e orquestrador de pedido

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/checkout/checkout-page/index.tsx:27-143` |
| Problema | A página controla sessão, carrinho, carteiras, formulário, cotação, idempotência, eventos NFT, comparação de quotes, criação/recuperação do pedido, tratamento Axios e todo o markup do checkout. |
| Princípio/padrão | Workflow explícito para operações críticas; UI deve consumir estado e ações tipadas, sem conhecer detalhes de recuperação de timeout e classificação de erros. |
| Impacto | Alta complexidade cognitiva no fluxo de maior risco; difícil cobrir transições de quote stale, timeout e reconciliação sem renderizar o checkout inteiro. |
| Proposta | Extrair um controller de checkout e um módulo de submissão/recovery do pedido. Manter a revalidação antes do POST, a chave de idempotência e a navegação para recibo. O formulário visual deve continuar sendo a mesma composição. |
| Risco visual | Médio. O layout possui grid e ordem de leitura diferentes por viewport; extrair lógica sem alterar a árvore renderizada. |
| Esforço | L |
| Prioridade | P1 |
| Desktop/Mobile | B: compartilhar workflow e dados; manter formulário, resumo e ordem responsiva conforme o Figma. |
| Arquivos afetados | `src/features/checkout/checkout-page/index.tsx`; `src/features/checkout/api`; `src/features/cart/api`; `src/features/account/api`; utilitário de erro/idempotência. |

### ARQ-05: Páginas de conta concentram formulários, transformação de dados e efeitos de persistência

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/account/profile-page/index.tsx:13-59`; `src/features/account/wallets-page/index.tsx:45-97` |
| Problema | Perfil e carteiras mantêm estado de formulário, validação, conversão de resposta, tratamento de erro Axios, mutações, invalidação e markup no mesmo módulo. `WalletsPage` ainda repete a composição de campos entre carteira principal e secundária. |
| Princípio/padrão | Form state separado de server state; campos reutilizados por composição, sem criar um formulário monolítico com dezenas de props. |
| Impacto | Alterações nos contratos de perfil/carteira podem afetar diretamente a composição; validações são difíceis de testar fora do browser. |
| Proposta | Extrair validadores/serializadores e controllers das mutações. Para carteiras, manter `WalletFields` como bloco compartilhado e extrair apenas estado/ações de cada formulário, sem unificar as seções visualmente distintas. |
| Risco visual | Baixo a médio. Os dois blocos de carteira têm regras de exibição próprias e devem continuar separados. |
| Esforço | M |
| Prioridade | P2 |
| Desktop/Mobile | B: compartilhar validação, estado e campos; preservar shell de conta e adaptações de formulário por viewport. |
| Arquivos afetados | `src/features/account/profile-page/index.tsx`; `src/features/account/wallets-page/index.tsx`; `src/features/account/api`; novos validadores/serializadores da feature. |

### ARQ-06: NftDetailRoot mistura favorito autenticado com composição do detalhe

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/catalog/nft-detail/nft-detail-root/index.tsx:24-63` |
| Problema | O root do detalhe consulta sessão e favoritos, executa mutação otimista, faz redirect de login e também compõe galeria, resumo, descrição, loading e recomendações. |
| Princípio/padrão | Estado de recurso e ações de domínio separados da composição visual; o root composto deve receber ações/estado já preparados quando isso reduzir acoplamento. |
| Impacto | O detalhe fica difícil de testar com estados de favorito, erro e sessão; a composição visual conhece indiretamente a política de autenticação. |
| Proposta | Extrair `useNftFavorite` ou controller equivalente, mantendo a mesma atualização otimista, redirect e invalidação. Não unificar `NftDetailGallery`, `NftDetailSummary` ou a buy bar mobile com a apresentação desktop. |
| Risco visual | Baixo, desde que o contrato atual de `favorite`, `favoritePending` e handlers seja preservado. |
| Esforço | S |
| Prioridade | P2 |
| Desktop/Mobile | B: ação de favorito compartilhável; galeria/resumo/buy bar permanecem variantes visuais. |
| Arquivos afetados | `src/features/catalog/nft-detail/nft-detail-root/index.tsx`; novo hook/controller de favorito. |

### COUP-01: Dependências diretas entre features atravessam fronteiras de domínio

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/cart/cart-page/index.tsx:9-11`; `src/features/checkout/checkout-page/index.tsx:10-12`; `src/features/catalog/nft-detail/nft-detail-summary/index.tsx`; `src/features/account/account-shell/index.tsx:6-7` |
| Problema | Carrinho importa API e componente de catálogo; checkout importa carrinho, conta e sessão; detalhe importa API de carrinho; conta importa auth/session diretamente. |
| Princípio/padrão | Dependências entre features devem passar por casos de uso/contratos estáveis ou pela composição de rota, evitando que uma feature conheça a implementação visual ou de API de outra. |
| Impacto | Mudanças em catálogo ou conta propagam para fluxos de compra; a direção das dependências fica difícil de deduzir; componentes de uma feature deixam de ser reutilizáveis fora do contexto original. |
| Proposta | Mapear primeiro os casos de uso compartilhados. Criar fachadas finas ou módulos de workflow em nível de aplicação para operações como `addToCart`, `getCheckoutWallets` e recomendações. Não criar um barrel global que esconda as dependências nem mover APIs sem validar contratos. |
| Risco visual | Baixo para a extração de contratos; médio se a composição de recomendações ou ações for alterada. |
| Esforço | L |
| Prioridade | P1 |
| Desktop/Mobile | A: o acoplamento é de domínio e independe da viewport; a apresentação não deve ser unificada como parte da correção. |
| Arquivos afetados | Features `catalog`, `cart`, `checkout`, `account`, `auth` e `session`; novos módulos de aplicação somente após definição dos contratos. |

### COUP-02: Componente de recomendação da Home é usado pelo Carrinho

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/cart/cart-page/index.tsx:10,138`; `src/features/catalog/home/home-product-card/index.tsx:7-32` |
| Problema | A área de recomendações do carrinho usa `HomeProductCard`, que possui props `mobile`, `rare` e `promo` específicas da Home. |
| Princípio/padrão | Componentes de feature não devem ser tratados como primitives compartilhadas quando carregam semântica e variantes de uma tela específica. |
| Impacto | Ajustes na Home podem mudar o Carrinho; a API do card expõe decisões que não pertencem a qualquer recomendação de NFT. |
| Proposta | Extrair uma composição visual de produto realmente compartilhada ou criar uma variante de recomendação no domínio de catálogo. Preservar o markup, classes e comportamento atuais de cada tela. |
| Risco visual | Médio, porque o card define dimensões e responsividade. |
| Esforço | M |
| Prioridade | P2 |
| Desktop/Mobile | B: compartilhar dados e primitives de imagem/preço; manter as variantes visuais da Home e do Carrinho. |
| Arquivos afetados | `src/features/cart/cart-page/index.tsx`; `src/features/catalog/home/home-product-card/index.tsx`; `src/components/ui/card/index.tsx`. |

### STATE-01: Chaves do TanStack Query são definidas em locais diferentes

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/cart/cart-page/index.tsx:70`; `src/features/checkout/checkout-page/index.tsx:32,56-57`; `src/features/account/wallets-page/index.tsx:47`; `src/lib/query.ts` |
| Problema | Algumas consultas usam `keys` centralizadas e outras criam arrays inline como `['cart-quote', ...]`, `['checkout-quote', ...]` e `['wallets']`. |
| Princípio/padrão | Uma única fonte de verdade para query keys e opções, evitando cache paralelo e invalidação parcial. |
| Impacto | Facilita criar duas entradas para o mesmo recurso; invalidações e prefetch ficam frágeis; mudanças de parâmetros exigem procurar strings espalhadas. |
| Proposta | Centralizar apenas as chaves que representam o mesmo recurso e manter chaves de workflow distintas quando necessário. Usar factories tipadas para preservar exatamente os parâmetros atuais. |
| Risco visual | Baixo; altera somente cache e organização interna, mas exige validar loading e refetch. |
| Esforço | S |
| Prioridade | P1 |
| Desktop/Mobile | A: comportamento de cache é independente do layout. |
| Arquivos afetados | `src/lib/query.ts`; APIs/features de carrinho, checkout e conta. |

### STATE-02: Persistência em localStorage está espalhada por páginas de fluxo

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/cart/cart-page/index.tsx:17,25-26,67,121`; `src/features/checkout/checkout-page/index.tsx:17-18,40,47-53,94` |
| Problema | Cupom e chave de idempotência são lidos, escritos e removidos diretamente nos componentes de página. |
| Princípio/padrão | Encapsular estado persistido em adaptadores pequenos e nomeados; regras de ciclo de vida do pedido devem ficar próximas do caso de uso, não do markup. |
| Impacto | A mesma chave pode ser tratada de modo diferente entre Carrinho e Checkout; testes precisam conhecer strings de storage; risco de alterar recuperação de timeout acidentalmente. |
| Proposta | Criar adaptadores tipados para cupom e idempotência, sem mudar chaves, momento de gravação, remoção ou semântica. Cobrir refresh, timeout e sucesso com os testes E2E existentes. |
| Risco visual | Baixo; risco funcional alto se o ciclo de vida for alterado. |
| Esforço | S |
| Prioridade | P1 |
| Desktop/Mobile | A: persistência é comum aos dois viewports. |
| Arquivos afetados | `src/features/cart/cart-page/index.tsx`; `src/features/checkout/checkout-page/index.tsx`; novo adaptador de storage. |

### STATE-03: Realtime é conectado e filtrado separadamente em múltiplas páginas

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/app/layout.tsx:18-22`; `src/features/cart/cart-page/index.tsx:81-85`; `src/features/checkout/checkout-page/index.tsx:67-73`; `src/lib/realtime.ts` |
| Problema | Layout, carrinho e checkout possuem lifecycle/status local para conexões e eventos, com filtros e mensagens diferentes. |
| Princípio/padrão | Transporte centralizado e adaptadores de evento por recurso; componentes devem reagir a um contrato de invalidação/estado, não conhecer detalhes de conexão. |
| Impacto | Mais de um consumidor pode criar listeners para o mesmo transporte; reconciliação e feedback de indisponibilidade podem divergir. |
| Proposta | Preservar `socket.io-client` e extrair hooks/adapters por recurso que retornem somente evento validado, status e cleanup. Não substituir eventos por setters/cache direto; manter a reconciliação REST atual. |
| Risco visual | Baixo a médio, pois mensagens de status fazem parte da tela e devem continuar nos mesmos pontos. |
| Esforço | M |
| Prioridade | P2 |
| Desktop/Mobile | B: contrato de evento compartilhado; apresentação do status continua específica por tela e viewport. |
| Arquivos afetados | `src/lib/realtime.ts`; `src/app/layout.tsx`; páginas de carrinho e checkout. |

### UI-01: NftCard possui uma matriz grande de flags e dois branches visuais completos

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/components/ui/card/index.tsx:7-220`; `src/features/catalog/home/home-product-card/index.tsx:7-29` |
| Problema | `NftCard` recebe muitas flags (`hasDiscount`, `showRareBadge`, `isPromo`, `isMobile`, `showAction`, favorito e callbacks) e possui branches desktop/mobile quase independentes. |
| Princípio/padrão | APIs de componentes devem refletir variantes explícitas; composição interna reduz combinações inválidas e prop drilling. |
| Impacto | Combinações não usadas continuam disponíveis; mudanças em uma variante podem afetar outra; semântica de interação e markup ficam difíceis de manter. |
| Proposta | Em etapa posterior, separar dados/metadata compartilhados das composições `Desktop` e `Mobile`, ou introduzir variantes internas explícitas. Não remover `isMobile` nem substituir os branches por um layout único sem equivalência visual comprovada. |
| Risco visual | Alto se houver unificação; médio se apenas houver extração mecânica dos subcomponentes. |
| Esforço | M |
| Prioridade | P2 |
| Desktop/Mobile | C: os branches têm dimensões, estilos, imagem e hierarquia visual diferentes; compartilhar somente dados e primitives comprovados. |
| Arquivos afetados | `src/components/ui/card/index.tsx`; `src/features/catalog/home/home-product-card/index.tsx`; consumidores de `NftCard`. |

### UI-02: HomeHero mantém duas composições e também dois conteúdos de campanha

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/catalog/home/home-hero/index.tsx:11-45` |
| Problema | O componente renderiza uma seção desktop e uma seção mobile com assets, dimensões, hierarquia e textos diferentes. |
| Princípio/padrão | Não unificar layouts distintos somente porque representam a mesma seção; extrair apenas dados comuns quando isso não altera o conteúdo. |
| Impacto | A duplicação é visível, mas representa uma decisão do Figma; uma abstração agressiva pode remover diferenças de copy, asset ou proporção. |
| Proposta | Manter as duas árvores visuais. Se necessário, extrair apenas o vínculo do `artwork` e uma pequena função de URL/label. Não criar um componente responsivo único que tente reproduzir os dois frames por CSS. |
| Risco visual | Alto para unificação; baixo para extração de dados. |
| Esforço | S |
| Prioridade | P3 |
| Desktop/Mobile | C: textos, assets e composição são diferentes por viewport. |
| Arquivos afetados | `src/features/catalog/home/home-hero/index.tsx`. |

### CSS-01: Folha global monolítica com cascade sensível

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/styles.css:1-4379` |
| Problema | Tokens, reset, primitives, shell, todas as páginas e vários blocos responsivos convivem em uma única folha global. Há muitos breakpoints e regras de `display: none`, grids e variantes no mesmo arquivo. |
| Princípio/padrão | Organização por camadas/feature com dependências de cascade explícitas; reduzir superfície de alteração sem duplicar tokens. |
| Impacto | Difícil localizar a origem de uma regra; mover ou ordenar um bloco pode alterar telas não relacionadas; revisão visual fica mais cara. |
| Proposta | Somente após estabilizar os fluxos, separar por camadas preservando a ordem de importação e os seletores atuais. Não converter automaticamente tudo para classes novas ou alterar tokens/breakpoints. |
| Risco visual | Alto, por dependência de cascade e regras de viewport. |
| Esforço | XL |
| Prioridade | P3 |
| Desktop/Mobile | C: a separação física pode ser comum, mas as regras visuais Desktop/Mobile devem permanecer específicas e na mesma ordem efetiva. |
| Arquivos afetados | `src/styles.css`; entrada global de estilos; eventualmente arquivos de estilo por feature. |

### API-01: Componentes classificam erros Axios e fazem parte da política de recuperação

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/features/checkout/checkout-page/index.tsx:5,87-101,131`; `src/features/account/profile-page/index.tsx:4,31-35`; `src/features/account/wallets-page/index.tsx:22-28` |
| Problema | As páginas conhecem `axios.isAxiosError`, status HTTP, nomes de erro e detalhes de payload para decidir mensagens e recuperação. |
| Princípio/padrão | API/feature deve expor erros de domínio tipados; a UI deve escolher apresentação, não interpretar repetidamente o transporte. |
| Impacto | Regras de erro ficam duplicadas; qualquer mudança no envelope REST exige tocar componentes; recuperação de timeout e quote stale fica misturada à apresentação. |
| Proposta | Centralizar parsing/classificação em utilitários da feature ou no cliente de API, retornando tipos como sessão expirada, quote stale, validação e timeout. Preservar as mensagens e ações atuais. |
| Risco visual | Baixo; risco funcional médio durante a migração das condições. |
| Esforço | M |
| Prioridade | P2 |
| Desktop/Mobile | A: o contrato de erro é independente da viewport. |
| Arquivos afetados | APIs de checkout/account; `src/contracts`; páginas que exibem os erros. |

### DEAD-01: Exports compostos sem consumidor identificado no código da aplicação

| Campo | Avaliação |
| --- | --- |
| Arquivo | `src/components/index.ts:1-30`; `src/components/ui/footer/index.tsx:8-15`; `src/components/ui/wallet-selector/index.tsx:1-11` |
| Problema | A busca de consumidores encontrou `Footer.Bottom` somente na própria definição do barrel e nenhum consumidor de `WalletSelector` no código de `src`. Esses exports podem ser preparação futura ou código morto. |
| Princípio/padrão | Barrels devem expor uma superfície intencional; código sem consumidor aumenta área de manutenção e pode mascarar componentes não finalizados. |
| Impacto | Não é possível distinguir API pública intencional de código abandonado apenas pelo barrel; remoção prematura pode quebrar uso externo não representado no repositório. |
| Proposta | Confirmar se há consumidores externos. Se não houver, remover ou mover os exports em alteração isolada, sem tocar componentes usados. Antes disso, adicionar busca/checagem automatizada de exports não referenciados. |
| Risco visual | Baixo se nenhum consumidor externo existir; risco de build desconhecido fora do repositório. |
| Esforço | S |
| Prioridade | P3 |
| Desktop/Mobile | A: é uma questão de superfície de módulos, sem efeito de viewport. |
| Arquivos afetados | `src/components/index.ts`; `src/components/ui/footer/index.tsx`; `src/components/ui/wallet-selector/index.tsx`. |

### DOC-01: Documentação de arquitetura não acompanha completamente o estado atual

| Campo | Avaliação |
| --- | --- |
| Arquivo | `ARCHITECTURE.md:3,7-14,44-50`; `docs/CONTRACTS.md:5,31-51` |
| Problema | Os documentos ainda usam linguagem de “estrutura inicial” embora o código atual contenha fluxos implementados de carrinho, checkout, perfil, carteiras, pedidos e realtime. Isso pode confundir a leitura da auditoria e a priorização. |
| Princípio/padrão | Documentação operacional deve refletir o contrato e o estado real do sistema, separando implementado, parcial e não validado. |
| Impacto | Risco de repetir trabalho já entregue ou assumir garantias não verificadas; novos refactors podem partir de premissas históricas. |
| Proposta | Em etapa separada, atualizar somente status e rastreabilidade, sem reescrever requisitos nem alterar contratos. Registrar claramente o que está implementado, o que é gap funcional e o que ainda não foi validado em deploy. |
| Risco visual | Nenhum direto; risco de processo e interpretação. |
| Esforço | S |
| Prioridade | P3 |
| Desktop/Mobile | A: documentação de estado não depende da composição visual. |
| Arquivos afetados | `ARCHITECTURE.md`; `docs/CONTRACTS.md`; eventualmente checklist de entrega. |

## Ordem Recomendada de Execução

| Etapa | Escopo | Critério de segurança |
| --- | --- | --- |
| 1 | Centralizar query keys, storage adapters e parsing de erros. | Nenhuma alteração no DOM; typecheck, lint e E2E de carrinho/checkout/conta passam. |
| 2 | Extrair controllers de Cart, Checkout e Home. | Mesmas URLs, eventos, mutations, mensagens e estados; screenshots desktop/mobile sem diferença relevante. |
| 3 | Isolar integrações realtime por recurso e reduzir dependências diretas entre features. | Socket.IO continua sendo a única origem de eventos; reconciliação REST e cleanup permanecem. |
| 4 | Extrair estado de favorito e separar a dependência de recomendação do componente da Home. | Detalhe, carrinho e recomendações preservam markup, ordem e estados de loading/error. |
| 5 | Avaliar `NftCard`, `HomeHero`, CSS global e exports não usados. | Só prosseguir com comparação visual e confirmação de que diferenças Desktop/Mobile são intencionais. |
| 6 | Atualizar documentação de estado. | Não alterar requisitos nem registrar como validado o que não foi testado. |

## Itens Não Recomendados

| Evitar | Motivo |
| --- | --- |
| Unificar markup Desktop/Mobile de `HomeHero`, `NftCard`, detalhe, carrinho ou checkout apenas por compartilharem conteúdo. | Os frames têm hierarquia, conteúdo, assets e proporções diferentes. |
| Substituir eventos Socket.IO por setters, callbacks artificiais ou atualização direta de cache. | Contraria o contrato de realtime e remove a cobertura de transporte real. |
| Mover todas as APIs para um barrel global. | Esconde dependências e aumenta o acoplamento em vez de reduzi-lo. |
| Converter strings ETH para `number` durante a refatoração. | Viola o contrato de precisão; cálculos devem continuar em strings decimais/wei/BigInt. |
| Alterar breakpoints, tokens, classes ou assets como parte de uma refatoração estrutural. | Não faz parte do objetivo e cria regressões visuais difíceis de isolar. |

## Verificação Necessária

Após qualquer etapa de implementação, executar:

```text
npm run typecheck
npm run lint
```

Também devem ser executados os testes E2E relevantes, incluindo os cenários de cotação stale, idempotência, timeout, reconexão Socket.IO, persistência do carrinho/cupom e atualização de carteira. A auditoria atual não afirma equivalência visual: essa confirmação exige screenshots reais em `1440px` e `390px` comparados aos frames correspondentes.
