# Plano de recuperação

Data: 04/10/2026. Branch: `feat/marketplace-complete` (HEAD `180edaf`). Base: `readme.md` (requisitos) e `AGENTS.md` (regras). Nenhum código foi alterado para produzir este documento.

Verificações executadas nesta análise:

| Comando               | Resultado                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`   | Passou                                                                                                                          |
| `npm run lint`        | Passou (0 warnings)                                                                                                             |
| `npx playwright test` | **21 falharam**, 165 passaram, 3 pulados (189 casos, 8 min). 8 falhas são de regressão visual e 13 são funcionais (ver seção 3) |

---

## 1. O que está bom e deve ser mantido

- **Config (Vite, TS, ESLint, `.env.demo`, `vercel.json`)**: TS strict sem `any`, lint zerado, build demo com MSW e rewrite SPA prontos; só mover o CSS e ajustar aliases quando a estrutura mudar.
- **Axios (`src/lib/http.ts`)**: instância única com `baseURL`, timeout e `parseHttpError`/`isAxiosTimeout` tipados pelo contrato de erro; todas as chamadas REST passam por ela.
- **Contratos/tipos (`src/contracts/index.ts`)**: schemas Zod para NFT, catálogo, sessão, carrinho, cotação, pedido, carteira, perfil e eventos, com ETH como string decimal validada; manter, só eliminar as interfaces duplicadas dos schemas (`CartItem`, `Quote`, `Order`, `Wallet`).
- **ETH (`src/lib/eth.ts`)**: `toWei`/`fromWei` com `bigint`, sem float; manter como função pura.
- **MSW (`src/mocks/handlers.ts`, `db.ts`, `scenarios.ts`)**: handlers REST cobrem todos os recursos da seção 5, com 401/403/404/409/422/503, idempotência por `Idempotency-Key`, persistência em `localStorage`, reset e 18 cenários selecionáveis.
- **Fixtures (`src/mocks/fixtures.ts`)**: 2 usuários com senha em hash+salt, 33 NFTs em 3 categorias/2 redes para filtros e paginação, carrinho padrão determinístico.
- **Socket.IO (`src/mocks/socket.ts` + `socket.io-client`)**: `@mswjs/socket.io-binding` real, `nft.updated`/`order.updated` com `eventId`/`resourceId`/`version`, assinatura de pedido por usuário; bootstrap carrega o app só depois do MSW interceptar o WebSocket (`src/main.tsx`).
- **Playwright (`playwright.config.ts`, `tests/e2e/`)**: 63 testes × 3 viewports (390/768/1440), reset de mock por teste, trace em falha, relatório HTML, cobertura de quase todos os 12 fluxos da seção 9.
- **Lighthouse (`scripts/lighthouse.mjs`)**: script versionado com 3 medições por página/perfil e medianas; manter e reexecutar só no final.

## 2. O que deve ser refeito e por quê

| Área             | Arquivos                                                                                                    | Por quê                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout           | `src/app/layout.tsx`, `src/components/layout/desktop-layout`, `mobile-layout`, `use-layout-mode`            | Alterna desktop/mobile por JS (`matchMedia`) em vez de um layout responsivo; `DesktopLayout` recebe `footer` por props (proibido); `max-w-[62.5vw]` limita o conteúdo a 900px em 1440 (Figma: ~1200px); `<main>` desktop sem `id="main"`, então o link "Pular para o conteúdo" não funciona no desktop; lista de rotas que escondem a tab bar fica no App.                                                                                                                                                                        |
| Header           | `components/layout/header/*`, `desktop-layout/header`, `marketplace-header`                                 | Três pontos de entrada para um header só; usa composition pattern (proibido em Header); importa `@/features/cart/api` de dentro de `components` (shared → feature); mostra sempre "Entrar", sem estado de sessão/logout; mobile não tem header.                                                                                                                                                                                                                                                                                   |
| Footer           | `components/layout/footer/*`, `marketplace-footer`                                                          | Composition pattern em Footer (proibido); wrapper `MarketplaceFooter` só existe para montar as partes; estilizado por classes do `styles.css`.                                                                                                                                                                                                                                                                                                                                                                                    |
| Componentes base | `components/ui/*` (modal, sheet, select, radio, checkbox, toast, input, stepper, tab-bar, wallet-selector…) | Só `Button` usa `cva`; nenhum usa Radix/shadcn de fato (só `@radix-ui/react-slot`), foco de diálogo implementado à mão; 24 dos componentes dependem de classes do `styles.css`; `components.json` aponta para `src/styles.css`, que não existe. Refazer a partir do shadcn/ui (Dialog, Sheet, Select, RadioGroup, Checkbox, Toast/Sonner exige aprovação) com tokens.                                                                                                                                                             |
| Páginas          | `features/*/…-page`, `catalog/home`, `nft-detail`                                                           | Todas estilizadas por classes próprias; mutations, cotação, `localStorage` e listeners de socket dentro dos componentes (ex.: `cart-page/index.tsx` 128 linhas, `checkout-page/index.tsx` 188 linhas); catálogo e cards renderizam versões desktop e mobile ao mesmo tempo no DOM (`home-page/index.tsx:109-110`, `cart-page/index.tsx:92-93` com dois `<h1>`); visitante não vê totais no carrinho (cotação só autenticado). A lógica pode ser reaproveitada movendo-a para hooks; o JSX/estilo deve ser refeito contra o Figma. |

## 3. Checklist dos eliminatórios (seção 11)

| Eliminatório                                        | Situação         | Evidência                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uso efetivo da stack obrigatória                    | **Parcial**      | React, TS, TanStack Router (rotas, `validateSearch`, guard em `app/router.tsx`), Query, Axios, socket.io-client, MSW, Playwright e Lighthouse em uso. **Tailwind** é usado de forma secundária: 4.377 linhas de CSS próprio com ~395 classes fazem o grosso do estilo. **shadcn/ui** não é usado de fato (sem primitives Radix, componentes escritos à mão).                                                                                                                                                                                                                                                                                   |
| Fluxos principais não apenas visuais                | **Atendido**     | Login/cadastro/logout, catálogo com filtros na URL, carrinho, cupom, cotação, checkout e pedido chamam MSW via Axios (`features/*/api`); cobertos por `phase5`, `phase6-auth`, `phase7-*`, `phase9-purchase`, `phase13-e2e-complete`.                                                                                                                                                                                                                                                                                                                                                                                                          |
| Compra confirmada só com resposta da simulação      | **Atendido**     | `order-page` só mostra recibo com `status === "confirmed"` vindo de `GET /orders/:id`; confirmação é decidida no handler (`scheduleOrderConfirmation`, `handlers.ts:147`). Ressalva: a página também faz polling a cada 500 ms enquanto pendente (`order-page/index.tsx:36`), o que mascara falha do socket.                                                                                                                                                                                                                                                                                                                                   |
| Sem exposição de dados entre usuários               | **Parcial**      | Servidor isola por `userId` e responde 403 (`handlers.ts:98`, teste `phase7-resilience` 403). Cliente depende de `queryClient.clear()` no login/logout: query keys de `cart`, `favorites`, `profile`, `wallets` não incluem o usuário (`lib/query.ts:9-12`), e cupom e chave de idempotência ficam em `localStorage` sem escopo de usuário (`checkout-page/index.tsx:19-20`). Teste `phase6-auth` "favoritos não vazam ao trocar de usuário" cobre só favoritos.                                                                                                                                                                               |
| Eventos não simulados diretamente na UI             | **Atendido**     | Eventos saem do handler MSW por `broadcastNft`/`broadcastOrder` e chegam via `io()` (`lib/realtime.ts`); nenhum setter chamado diretamente por teste. Ressalva: são abertas até 3 conexões socket simultâneas (layout, carrinho/checkout, pedido).                                                                                                                                                                                                                                                                                                                                                                                             |
| Testes E2E executáveis                              | **Parcial**      | `npm run test:e2e` builda e roda 189 casos (63 × 3 viewports), mas hoje **21 falham**. Funcionais (13): skip link no desktop (`foundation:57`, confirma o `<main>` sem `id`), rollback e carrinho vazio (`phase11:24`, `:42`), skeleton do detalhe no tablet (`phase11:17`), cupom (`phase9:17`, `phase13:31`), detalhe/limite de quantidade (`phase8:11`, desktop e mobile), evento antigo no recibo (`phase13:180`, nos 3 viewports), carrinho de visitante e compra completa no mobile (`phase13:62`, `:72`). Visuais (8): 7 de `visual-regression` e 1 de `phase14`. Baselines visuais só existem para `win32`, então quebram em CI Linux. |
| Deploy (P0 do `AGENTS.md`, obrigatório na seção 12) | **Não atendido** | `vercel.json` pronto, mas sem URL pública (`README.md`, seção 13).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## 4. CSS customizado

| Item                                               | Situação                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arquivos `.css`                                    | 1: `src/css/styles.css`, 4.377 linhas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Classes próprias                                   | ~395 seletores (`.cart-*`, `.checkout-*`, `.account-*`, `.auth-*`, `.home-*`, `.layout-main`, `.container-content`, `.header-cart*`, `.mobile-layout`, `.skeleton`, `.bg-gradient-*`, 76 classes `.text-*-bold` de tipografia…), com 25 blocos `@media` próprios usando breakpoints que não coincidem com o tema (639/640/1023 px). Usadas em 59 dos ~110 arquivos `.tsx`.                                                                                                                                                      |
| `@apply`                                           | Nenhum.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `style={{}}`                                       | Nenhum.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Valores arbitrários repetidos (em `px`, não `rem`) | `min-h-[48px]` ×4, `w-[48px]` ×3, `w-[40px]` ×3, `min-h-[40px]` ×3, `h-[50px]` ×3, `h-[470px]` ×2; raios arbitrários `rounded-[4/6/8/15/16/20px]` mesmo existindo tokens; `max-w-[62.5vw]`, `max-w-[90vw]`, `z-[60]`, `z-[100]`.                                                                                                                                                                                                                                                                                                |
| Tokens do Figma no tema                            | **Parcial.** `@theme` (linhas 3-225) tem 25 cores, 16 tamanhos de texto, pesos, line-heights, 32 raios, 6 sombras, 9 gradientes, espaçamentos e breakpoints, mas: todos em `px` (regra pede `rem`); raios duplicados (`--radius-4` e `--radius-sm`, `--radius-40` e `--radius-pill`); espaçamentos `--space-*` paralelos ao `--spacing` do Tailwind; **a fonte Roboto Mono não é carregada** (sem `@font-face` nem link em `index.html`, nenhum arquivo de fonte em `public/`), então a tipografia cai na monospace do sistema. |

## 5. Duplicações e acoplamentos mais graves

1. **Header triplicado**: `components/layout/header/` (composition Root/Navigation/Actions), `components/layout/desktop-layout/header/index.tsx` (header real) e `components/layout/marketplace-header/index.tsx` (só re-exporta o anterior com outro nome).
2. **`DesktopLayout` com props**: `desktop-layout/index.tsx:5-8` recebe `footer: ReactNode`; o App injeta `<MarketplaceFooter />` (`app/layout.tsx:55`). `MobileLayout` recebe `tabBar` da mesma forma.
3. **Lógica no App**: `app/layout.tsx` decide quais rotas escondem a tab bar (lista de paths, linhas 23-33), detecta rota de auth para montar `AuthMarketplaceBackground` (importado de feature) e abre a conexão Socket.IO do catálogo (`connectCatalog`, linha 36).
4. **`shared` importando `features`**: `components/layout/desktop-layout/header/index.tsx:4` importa `@/features/cart/api`.
5. **Features sem API pública**: nenhuma feature tem `index.ts`; imports profundos entre features (`checkout-page` → `@/features/cart/api`, `@/features/account/api`; `cart-page` → `@/features/catalog/api`; `auth-marketplace-background` → `@/features/catalog/home/home-hero`; `nft-detail-root` → `@/features/favorites/api`). `session` é usada por quase todas e deveria estar em `shared`.
6. **Desktop e mobile no DOM ao mesmo tempo**: `HomeCatalogDesktop` + `HomeCatalogMobile` (`home-page/index.tsx:109-110`), `NftCard.Desktop`/`NftCard.Mobile`, título do carrinho duplicado (`cart-page/index.tsx:92-93`).
7. **Realtime triplicado**: `lib/realtime.ts` tem `connectCatalog`, `connectNftUpdates` e `connectOrder`, cada um com seu `io()`, seu mapa de versões e cópia da mesma lógica de dedupe; carrinho/checkout chamam `connectNftUpdates` no componente.
8. **Query keys fora do arquivo único**: `['cart-quote', …]` em `cart-page/index.tsx:69`, `['checkout-quote', …]` em `checkout-page/index.tsx:58`, `['nfts']` literal em `lib/realtime.ts:11`; nenhuma key privada inclui usuário.
9. **Contratos duplicados**: interfaces manuais repetem os schemas Zod (`contracts/index.ts:38-42`), e `mocks/db.ts:34-93` redeclara os mesmos schemas em vez de reutilizar os exportados.
10. **Estrutura fora do `AGENTS.md`**: não existem `src/routes`, `src/shared`, `src/realtime`; páginas são declaradas inline em `app/router.tsx`. `figma/nos.md` citado no `AGENTS.md` não existe.

## 6. Plano em fases (por prioridade)

Regra geral: um commit por fase, com typecheck + lint + E2E verdes antes de pedir aprovação do commit. Nenhum teste é removido ou enfraquecido; testes visuais têm baselines regeneradas só na fase 4, depois da conferência numérica.

### Fase 0 — P0: segurança e eliminatórios (sem mexer em visual)

0. Corrigir as 13 falhas E2E funcionais listadas na seção 3, sem alterar as asserções (as 8 visuais ficam para a fase 4).
1. Query keys por feature com `userId` em tudo que é privado; quotes em keys nomeadas; remover keys literais.
2. Escopar cupom e chave de idempotência no `localStorage` por usuário e limpar no logout/troca.
3. Unificar o realtime em `src/realtime/`: um único socket, dedupe por versão compartilhado, assinaturas por recurso com cleanup; limpar no logout.
4. Order page: confirmação por `order.updated`; REST só para reconciliar ao (re)conectar e ao recarregar, sem polling contínuo.
5. Deploy na Vercel com mocks ativos e testar refresh em rota profunda.

**Pronto quando**: as 13 falhas funcionais passam nos 3 viewports; teste E2E novo mostra que carrinho/cupom/pedido de Ana não aparecem para Bruno após troca de usuário; teste de pedido pendente passa com o socket como único caminho de confirmação; DevTools mostra 1 conexão WebSocket; URL pública abre `/nfts/nft-1` e `/checkout` diretamente; suíte E2E verde.

### Fase 1 — Estrutura e base de estilo

1. Criar `src/shared` (Axios, query client, contratos, `eth`, `cn`, sessão, componentes) e `src/routes` (rotas finas); `index.ts` público por feature; `mocks` importado só pelo bootstrap.
2. Contratos: tipos derivados de `z.infer`; `mocks/db.ts` reutiliza os schemas.
3. Tema: tokens do Figma em `rem`, sem duplicatas; carregar Roboto Mono local com `@font-face`; breakpoints únicos.
4. Componentes base com shadcn/ui (Button, Input, Label, Dialog, Sheet, Select, RadioGroup, Checkbox, Skeleton, Badge), estilizados só com utilitários e `cva`. Pacotes Radix entram como parte do shadcn; qualquer outra lib (ex.: Sonner) pede aprovação.

**Pronto quando**: nenhum import `shared → features` nem import profundo entre features (verificado por grep/regra de lint); `styles.css` contém só import, `@theme`, `@font-face`, reset, `@keyframes` e `prefers-reduced-motion`; fonte carregada (`document.fonts.check('16px "Roboto Mono"')` verdadeiro); E2E verde.

### Fase 2 — Layout, Header, Footer

1. Um `Layout` que importa `Header`, `Footer` e `TabBar` diretamente, responsivo por classes (`md:`/`lg:`), sem `useLayoutMode`; regra de exibição da tab bar via `staticData` da rota, não lista de paths no App.
2. `Header` único, simples (sem composition), com estado de sessão (Entrar / avatar + sair) e contador do carrinho vindo por hook de `shared`.
3. `Footer` único, simples.
4. Conexão realtime iniciada no bootstrap/provider, não no Layout.

**Pronto quando**: em 1440 o container mede ~1200px (`getBoundingClientRect`) e header/footer batem com o Figma em ±2px; em 390 a tab bar e o header batem com o frame mobile; só uma versão de cada parte no DOM; skip link foca `#main` nos 3 viewports.

### Fase 3 — P1: fluxos completos sobre a nova base

Refazer páginas na ordem do fluxo de compra, extraindo lógica para hooks/`lib` puros: catálogo (um grid responsivo, filtros em drawer no mobile com hook compartilhado) → detalhe (edições, quantidade, favoritos) → carrinho (resumo para visitante, cupom inválido/expirado distintos) → checkout (revisão antes do envio, revalidação) → recibo → login/cadastro.

**Pronto quando**: componentes de página sem `useMutation`/`localStorage`/socket direto; nenhum caminho com desktop e mobile no DOM ao mesmo tempo; os 12 fluxos da seção 9 têm teste E2E passando nos 3 viewports, incluindo cenários faltantes (cupom expirado separado de inválido, edição esgotada durante a compra).

### Fase 4 — P2: fidelidade ao Figma (início, detalhe, carrinho, pagamento)

Para cada tela: contexto do nó via MCP + imagem em `figma/`, assets reais, medição em 1440 e 390 com `getBoundingClientRect`/`getComputedStyle`, correção e registro de desvios em `ARCHITECTURE.md`.

**Pronto quando**: diferenças medidas ≤ 2px em posição/tamanho dos blocos principais e tipografia/cores idênticas ao Figma, com tabela de medidas no doc; `snapshotPathTemplate` sem `{platform}` e `maxDiffPixelRatio` pequeno; baselines regeneradas, versionadas e passando localmente; limitação entre sistemas documentada no README.

### Fase 5 — P3: perfil, carteiras, acessibilidade, Lighthouse, documentação

Perfil/avatar/senha e carteiras contra os frames desktop; revisão de teclado/foco/ARIA live; Lighthouse final (3 medições, mediana); `README.md` e `ARCHITECTURE.md` atualizados (contratos, sessão, cache, reconciliação REST × Socket.IO, desvios).

**Pronto quando**: medianas ≥ 90/95/95/90 em início e detalhe, mobile e desktop, ou justificativa registrada; relatórios HTML/JSON entregues; README reproduz setup, cenários, reset e fluxos de falha a partir de checkout limpo.

---

**Decisões (04/10/2026)**

- **Toast**: aprovado instalar o Sonner. O readme exige shadcn/ui e deixa bibliotecas complementares livres, e o Sonner é o toast do próprio shadcn. Entra na Fase 1.
- **Baselines visuais (Fase 4)**: tirar `{platform}` do `snapshotPathTemplate` do Playwright, para o nome da baseline não depender do sistema, e usar `maxDiffPixelRatio` com tolerância pequena. Assim o checkout limpo de quem avalia encontra as baselines em qualquer sistema. Limitação a documentar no README: a renderização de fonte muda entre sistemas, então a comparação não é exata fora do Windows.
- **Ordem**: a Fase 0 é feita antes da reestruturação de pastas.

Não rode a suíte inteira o tempo todo. São 8 minutos por execução. Durante o desenvolvimento, rode só o spec afetado e só um projeto (npx playwright test tests/e2e/phase9 --project=desktop), e a suíte completa no fim de cada fase.

Fase 1 com shadcn de verdade pode comer o dia. Eu limitaria a refazer com shadcn só o que exige acessibilidade difícil à mão (Dialog, Sheet, Select, Sonner), e manter os componentes simples (Input, Badge, Skeleton) refeitos só com utilitários Tailwind.

Reorganizar pastas inteiras (shared, routes) é custo puro. Como Layout, Header e páginas serão reescritos de qualquer jeito, mova arquivos só quando você for tocá-los, em vez de uma fase só de git mv. Os imports shared → features e entre features você corrige nas fases em que reescrever aquela parte.

O "1 shell still running" no fim da saída é um processo ainda ativo, provavelmente servidor de preview ou Playwright. Encerre antes de seguir, ou ele segura a porta e os testes podem falhar de forma estranha.
