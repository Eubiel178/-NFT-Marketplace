# Auditoria dos requisitos eliminatórios (readme §3–§12)

Data: 04/10/2026. **Atualizado depois dos commits `4979c7b` (paginação mobile), `3da74bf` (401 global e retomada do checkout) e do spec `phase16-pagination-session`; linhas alteradas marcadas com ✔.** Branch `feat/marketplace-complete`, árvore limpa no início, 13 commits à frente do `origin` (nada publicado). Nenhum código foi alterado.

**Método.** Leitura do `readme.md`, `AGENTS.md`, `ARCHITECTURE.md`, `docs/progresso.md`, do código em `src/`, dos mocks e de `tests/e2e`. **Nenhum teste, build ou Lighthouse foi executado** (regra do `AGENTS.md`): onde a tabela diz "atende" para um teste, significa que o spec existe e cobre o ponto, não que passa hoje. Linhas citadas são do HEAD `4e0ee94`.

Legenda: **Atende**, **Parcial**, **Não atende**.

---

## 1. Uso efetivo da stack (§2, §11)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| React + TypeScript strict | Atende | `src/**`; busca por `any`/`as any` em `src` sem resultados | Typecheck/lint não reexecutados nesta auditoria |
| Tailwind CSS | Atende (com resíduo) | `src/css/styles.css` tem 369 linhas: `@import` + `@theme` (linhas 3–269, tokens), `@font-face` (271), reset/base (285–333), `@keyframes shimmer` (336), `prefers-reduced-motion` (345). Nenhum `@apply`, nenhum CSS Module, um único `style={{}}` (`components/ui/icon/index.tsx:16`, `maskImage` dinâmico). Sem concatenação de classes (grep) | `.home-products` (`styles.css:360`, dentro de `@media`) é **a única classe própria e está morta**: nenhum JSX usa `className="home-products"` (só o `id`). Falta apagar. Comentários de seção "HOME / NFT DETAIL" ficaram vazios no fim do arquivo |
| shadcn/ui | Parcial | `components.json` (new-york, alias `@/components`); `components/ui/{button,input,label,select,sheet,checkbox,radio,skeleton,avatar,badge}` com Radix (`radix-ui`), CVA, `cn()`, `sonner` | Só `Toaster` é montado (`app/render.tsx`); **não há nenhuma chamada `toast(`** em `src`. `Dialog` é um `Modal` próprio com Radix. Muitos componentes (`pagination`, `stepper`, `wallet-selector`…) são próprios, não shadcn. Defensável, mas o uso do shadcn é mais fino do que o enunciado sugere |
| TanStack Router | Atende | `app/router.tsx`: rotas `/`, `/nfts/$nftId`, `/cart`, `/login`, `/register`, `/checkout`, `/profile`, `/wallets`, `/orders/$orderId`; `validateSearch` com zod no catálogo (`router.tsx:42`) e no login (`authSearch`); guard `beforeLoad` do layout `authenticated` (`router.tsx:74-88`) distingue sessão expirada de visitante; `notFoundComponent` na raiz (`:29`); `defaultPreload: "intent"` | `notFoundComponent` é só `<h1>Página não encontrada</h1>`, sem link de volta nem o padrão visual do app. Não existe a pasta `src/routes` do AGENTS (rotas ficam em `app/router.tsx` com componentes inline) |
| TanStack Query | Atende | `lib/query.ts` (QueryClient, `keys`), hooks em `features/*/hooks` e `shared/api/*` (`queryOptions`), mutations com `onMutate/onError` | Ver §3 |
| Axios em todas as chamadas | Atende | `lib/http.ts` (`axios.create`, timeout 8 s, `withCredentials`); `grep` de `fetch(`/`XMLHttpRequest` fora de `src/mocks` sem resultados; todas as APIs passam por `http.*` | Não há interceptor Axios (nenhum tratamento global de 401): ver §2 |
| Socket.IO (socket.io-client) | Atende | `realtime/index.ts:11` `io(env.socketUrl, { transports: ['websocket'], autoConnect: false })`; eventos chegam por `socket.on`; nenhum setter/cache chamado direto pelo "evento" | O `README` de entrega ainda descreve só o básico (§6) |
| MSW | Atende | `mocks/browser.ts` (`setupWorker`), `mocks/handlers.ts`, `public/mockServiceWorker.js`, `main.tsx` só importa `./mocks/browser` no bootstrap | — |
| Playwright | Atende (exceto visual) | `playwright.config.ts`, 19 specs, 3 projetos | Ver §8 |
| Lighthouse | Parcial | `scripts/lighthouse.mjs`, `npm run audit:lighthouse`; relatórios em `reports/lighthouse/` | Os relatórios são da estrutura inicial (02/10) e `reports/` está no `.gitignore`. Ver §9 |

---

## 2. Telas e fluxos (§3)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| Início: destaques, catálogo, busca, filtros, ordenação, navegação ao NFT | Atende ✔ | `features/catalog/home/*`; `use-catalog-search`; facets vindos do MSW; spec `phase7-marketplace` (3, 27, 48), `foundation` (15); **paginação também em 390** (`home-catalog/index.tsx`, centralizada, mesmo padrão do desktop; desvio em `ARCHITECTURE.md`), `phase16:42` | — |
| URL como estado (busca, filtros, ordenação, página; refresh e histórico) | Atende | `catalogSearchSchema` (`contracts:18`), `router.tsx:42`; `phase7-marketplace:27` ("histórico restaura a página anterior"), `:3` | Ordenação não é exercitada em nenhum spec |
| Mudança de filtro reinicia a paginação | Atende | `phase7-marketplace:27`, `:16` (busca com debounce reinicia) | — |
| Consultas refletem parâmetros, vazio, falha, respostas fora de ordem | Parcial | `catalog/api:9` (params + `signal`); `keys.catalog(search)` inclui todos os parâmetros; `empty` (`phase7-marketplace:48`), `http-500`/`network-error` (`foundation:44`, `phase13:160`) | Não há spec de **resposta fora de ordem**: o cenário `variable-latency` existe no MSW e nunca é usado em teste. O descarte depende só de key por parâmetros + `signal` |
| Detalhe: galeria, edição, quantidade, favoritos, compra; acesso direto; inexistente; edição indisponível; limite | Atende | `features/catalog/nft-detail/*`; `foundation:4,11` (404), `phase8-details-profile:11`, `phase9-purchase:85` (edição esgotada `nft-4`) | — |
| Favoritos persistem para o usuário | Atende | `features/favorites`, `keys.favorites(userId)`; `phase8:38`, `phase6-auth:76` | — |
| Carrinho: add/alterar/remover com disponibilidade por NFT e edição | Atende | `use-cart-lines`, MSW soma edições (`handlers.ts:536-611`); `phase13:31`, `phase11:24-55` | — |
| Carrinho persiste após refresh e merge do visitante ao autenticar | Atende | `cartItems` na DB mock + `login` faz merge; `phase13:62`, `phase7-resilience:33` | — |
| Cupom aplicar/remover, inválido/expirado | Atende | `KURIO10`, `KURIO5` (`COUPON_EXPIRED`), outros `INVALID_COUPON`; `phase9:17,69` | — |
| Resumo (subtotal, desconto, taxa, total) coerente com a API | Atende | `POST /api/quote` (`handlers.ts:612`); `useCartQuote` | — |
| Carrinho reflete preço/disponibilidade recebidos ao vivo | Atende | `useCartLiveNotice`; `reconcileNfts` invalida carrinho e cotações; `phase9:31` | — |
| Pagamento: validação, revisão, carteira e rede, conexão/recusa/desconexão | Atende | `features/checkout/*`, `use-wallet-connection`, `review-dialog`; `wallet-rejected` no MSW | **O cenário `wallet-rejected` não é exercitado por nenhum spec** (recusa de carteira, §3 pagamento) |
| Revalidar preço/disponibilidade/cupom/taxas e exigir nova confirmação | Atende | `usePlaceOrder.openReview/revalidate` + `describeQuoteChange`; `phase9:39,58` | — |
| Impedir pedido duplicado (clique repetido, reenvio após timeout) | Atende | `sending` ref + chave de idempotência por usuário (`use-place-order:30-37,84`); MSW `handlers.ts:884+`; `phase13:106,128`, `phase7-resilience:64` | — |
| Pedido pendente/confirmado/recusado, recuperação após refresh/reconexão | Atende | `usePendingOrder`, `useOrder`, `/orders/by-key/:key`; `phase10-realtime:49`, `phase0-realtime:79` | — |
| Confirmação só para pedido confirmado | Atende | `order-page` mostra recibo só se `status==='confirmed'`; status vem do MSW (`handlers.ts:978-990`) | — |
| Itens preservados em falhas; só itens/quantidades comprados saem do carrinho | Atende | `removePurchasedItems` (`handlers.ts:229`); `phase7-resilience:47` | — |
| Recibo é snapshot | Atende | `snapshotItems` (`handlers.ts:214`); `phase13:72,169` | — |
| Login/cadastro/logout/sessão; retorno ao fluxo anterior | Atende | `use-auth-form`, `safeRedirect`; `phase6-auth:11,27,39,97` | — |
| Sessão recuperável após refresh | Atende | `/api/session` + DB mock em localStorage; `phase6-auth:39,128` | — |
| **Expiração de sessão durante a navegação e durante o checkout, preservando contexto** | **Atende ✔** | Interceptor Axios (`lib/http.ts`) avisa qualquer 401 (menos login/cadastro/logout); `app/session-expiry/index.ts` guarda o contexto do pagamento, cancela queries (menos a sessão), `resetPrivateRealtime`, `queryClient.clear()` e leva ao login com `redirect` e `expired=true` (`app/router.tsx` `goToLoginExpired`); o guard (`beforeLoad`) faz a mesma limpeza a cada navegação privada. Checkout: `features/checkout/lib/checkout-resume` + `checkout-page/index.tsx` restauram formulário e reabrem a revisão; mesma chave de idempotência. Testes sem recarga: `phase16:71` (navegação), `:86` (ação na página), `:103` (envio do pedido) | Ressalva: o contexto guardado de um usuário não é lido por outro e só é apagado no próximo logout do dono (documentado). Visitante com 401 não é tratado como expiração |
| Logout/troca de usuário limpam cache e subscriptions | Atende | `use-logout` (cancela, `resetPrivateRealtime`, `clearUserItems`, `queryClient.clear()`); mesmo padrão em `use-auth-form`; `phase0-isolation`, `phase0-realtime:50` | — |
| Validação de cadastro/perfil/senha/carteiras, incluindo erros da API | Atende | `contracts` (`profileInputSchema`, `walletInputSchema`…), `fields` em 422/409; `phase15-account`, `phase6-auth:97` | — |
| Alterações permanecem após refresh; senha com hash | Atende | DB mock persistida; hash SHA-256 com salt; `phase15:88` | — |
| Perfil, carteiras e confirmação funcionam em mobile | Atende | `ARCHITECTURE.md` (sem frame, adaptadas); specs rodam em `chromium-mobile` | — |
| Ações fora do escopo não aparentam sucesso | Atende | Google/Facebook/Esqueceu a senha → aviso `role="status"`; tab bar "Favoritos (indisponível)"; `phase6-auth:117` | Links "Atividade/Ofertas…" são texto, ok |

---

## 3. Estado, cache e integração (§4)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| Contratos tipados transporte → estado → UI | Atende | `src/contracts` (zod) e `parse` em todas as APIs | Duplicação interface + zod em alguns tipos (`Order`, `Wallet`), sem erro funcional |
| Estados de carregamento, vazio, erro, sucesso, atualização em segundo plano | Parcial | Skeletons, estados de erro com retry (`phase11`), vazio (`phase7`) | "Atualização em segundo plano" não tem indicação visível nem teste (nenhum `isFetching`/`placeholderData`; ao trocar de página o catálogo volta ao skeleton) |
| Invalidação coerente após mutations e eventos | Atende | `reconcileNfts` (`realtime:34-39`), `useOrder` invalida o carrinho ao confirmar, `useAvatar/useProfileForm` com `setQueryData`; wallets key compartilhada com o pagamento (`phase15:241`) | — |
| Cancelamento/descarte de respostas obsoletas | Parcial | `signal` do Query repassado ao Axios em todas as queries (`catalog/api:9`, `shared/api/*`); `cancelQueries` antes das mutations otimistas; keys por parâmetro | Nenhum teste de resposta fora de ordem (`variable-latency` sem uso). Comportamento por construção, não verificado |
| Isolamento por usuário e parâmetros | Atende | `lib/query.ts:8-24` (`cart/favorites/profile/wallets/orders/quote` com `userId`); catálogo/NFT públicos sem usuário; `phase0-isolation` (3 testes) | `keys.session` e queries públicas sem usuário, por desenho |
| Recuperação de falhas sem duplicar operações | Atende | Mutations sem retry (`query.ts:29`); idempotência no pedido | — |
| Rotas inexistentes e acesso direto a qualquer tela | Parcial | `notFoundComponent` (`router.tsx:29`), 404 de NFT e pedido, `vercel.json` com rewrite; `foundation:24` | 404 global sem navegação de volta; acesso direto em **produção** não verificado (sem deploy) |
| **Atualização otimista com rollback (≥1)** | **Atende** | Favoritos (`use-favorite`, `onMutate`/`onError`), quantidade e remoção no carrinho (`use-cart-lines:25-50`), troca de carteira principal (`use-set-primary-wallet:18-26`); specs `phase7-resilience:17`, `phase11:24`, `phase15:228` | — |
| **Política de cache, retries e sincronização documentada** | **Parcial** | `ARCHITECTURE.md` §"Cache, retries e sincronização" (staleTime 30 s, gcTime 5 min, 1 retry só rede/5xx, mutations sem retry, session staleTime 0) bate com `lib/query.ts:25-29` | O texto está **desatualizado/incompleto**: lista keys antigas (`['nfts','list',search]`), diz que o socket "pertence ao layout raiz" (hoje `renderApp()` chama `startRealtime()`), não descreve as otimistas, o descarte de respostas obsoletas nem a tabela de keys por usuário |

---

## 4. ETH e quantidades

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| ETH como string decimal, sem float | Atende | `ethSchema` (`contracts:3`, regex até 18 casas); `lib/eth.ts` (`toWei`/`fromWei` com BigInt); `lineTotal` em wei (`cart-line`, `order-line`); MSW calcula em wei (`handlers.ts:~253`); `formatEthLabel` por string | Busca por `parseFloat/toFixed/Number(` em `src` (fora de mocks): só `Number(rating…)` (nota) e `Math.floor` na paginação. Slider de preço usa `z.number().transform` para `priceMin/priceMax` na URL, convertido para string (`contracts:22`), sem cálculo |
| Quantidades inteiras | Atende | `z.number().int().positive()` (`cartItemSchema`), `available` `int().nonnegative()` | — |
| Cotação da API como referência | Atende | `quoteId/quoteVersion` enviados no pedido; `QUOTE_STALE` (`handlers.ts:921-950`) | A regra `quoteVersion !== 1 → QUOTE_STALE` (`handlers.ts:~965`) é um atalho do mock que torna qualquer cotação v≠1 inválida; vale revisar |

---

## 5. Mocking com MSW (§6)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| Mocks só na camada MSW | Atende | `src/mocks/*` importado só em `main.tsx`; busca de respostas fictícias em hooks/Axios sem resultados | — |
| Estado consistente entre catálogo, favoritos, carrinho, perfil, carteiras, pedidos | Atende | `mocks/db.ts` único (chave `nft-marketplace:mock-db:v8`, zod ao carregar) | — |
| Persistência e reset | Atende | `localStorage` (`db.ts:170-179`); `POST /api/__mock/reset` (`handlers.ts:467`) → `resetDb()` + cenário `default` | "Reset integral" não é coberto por spec dedicado (usado só como passo em `foundation:44`) |
| ≥2 usuários e fixtures variadas (filtros, paginação) | Atende | Ana e Bruno; 283 NFTs, 9 coleções, 3 redes | — |
| Condições de rede: lentidão, latência variável, timeouts, indisponibilidade, HTTP de erro | Parcial | `conditions()` (`handlers.ts:261-282`): `slow` 2 s, `variable-latency`, `network-error`, `http-500` (503), `unauthorized` (401) | **Timeout de verdade (resposta que excede os 8 s do Axios) só existe no pedido** (`payment-timeout` devolve 504, não pendura a conexão). Não há cenário de 4xx genérico além de 401/409/422 de negócio. `conditions()` só se aplica a `GET /api/nfts` e detalhe (`handlers.ts:371,415`), não a todos os recursos |
| Cenários determinísticos do §6 | ver tabela abaixo | | |
| Socket.IO via `@mswjs/socket.io-binding` | Atende | `mocks/socket.ts` (`ws.link` + `toSocketIo`), `package.json` `@mswjs/socket.io-binding ^0.2.0`, MSW 2.15.0 fixo | Limitações documentadas só em comentário no código e no último parágrafo de `ARCHITECTURE.md` (heartbeat manual a cada 20 s, namespace `/`); ausente no README |
| Cenários exercitam `socket.io-client` | Atende | `broadcastNft/broadcastOrder` emitem pelo servidor mock; cliente recebe por `socket.on`; `foundation:32`, `phase0-realtime:79` | — |
| Ativação por configuração e presença no build demo | Atende | `VITE_ENABLE_MOCKS` (`lib/env.ts`), `.env.demo`, `npm run build:demo`, `vercel.json` `buildCommand: build:demo`, `main.tsx` | Não verificado em URL pública |
| Mudanças dos dados refletidas em REST e eventos | Atende | `POST /__mock/nfts/:id/update` altera DB, versão e emite `nft.updated`; ordem/confirmação emitem `order.updated` | O endpoint só muda o NFT para `0.125` (sem escolher valor/estoque) |

### Cenários do §6, um a um

| Cenário exigido | Nome(s) no MSW | Situação | Teste | Falta |
| --- | --- | --- | --- | --- |
| Sucesso | `default` | Atende | quase todos | — |
| Resultado vazio | `empty` | Atende | `phase7-marketplace:48` | — |
| Latência variável | `variable-latency` | Parcial | **nenhum** | Teste de ordem de chegada |
| Respostas fora de ordem | `variable-latency` (páginas ímpares 900 ms / pares 100 ms) | Parcial | **nenhum** | Teste que navega páginas rápido e confere o resultado final |
| Falha de conexão | `network-error` | Atende | `phase13:160` | — |
| HTTP 4xx/5xx | `http-500` (503), `unauthorized` (401), 409/422 de negócio | Parcial | `foundation:44` (503) | Sem 4xx de catálogo coberto; `unauthorized` sem teste |
| Sessão expirada | `POST /__mock/session/expire`, `unauthorized` | Parcial | `phase6-auth:51` | Só por recarga; ver §2 |
| Acesso não autorizado | `unauthorized`, 401/403 nos handlers privados | Parcial | `phase7-resilience:92` (403) | `unauthorized` sem teste |
| Conflito de cadastro | e-mail duplicado (409 com `fields.email`) | Atende | `phase6-auth:11,97` | — |
| Validação de formulário | 422 com `fields` | Atende | `phase6-auth:97`, `phase15:67` | — |
| Cupom inválido ou expirado | `INVALID_COUPON` / `COUPON_EXPIRED` | Atende | `phase9:17,69` | — |
| Preço alterado durante a compra | `POST /__mock/nfts/:id/update`, `stale-quote` | Atende | `phase9:39,58` | — |
| Edição esgotada | `soldOutEditions` (`nft-4` 1/1) → 409 `OUT_OF_STOCK` | Atende | `phase9:85` | Não é "durante a compra": a edição já nasce esgotada. Falta cenário em que o estoque zera entre carrinho e pedido |
| Timeout após criar pedido, recuperação por idempotência | `payment-timeout` | Atende | `phase13:128`, `phase7-resilience:56,64` | — |
| Pagamento confirmado | `default` | Atende | `phase5:11`, `phase13:72` | — |
| Pagamento recusado | `payment-declined` | Atende | `phase7-resilience:47` | — |
| (extra) Carteira recusada | `wallet-rejected` | Parcial | **nenhum** | Teste |
| (extra) Pedido pendente | `payment-pending`, `payment-held` | Atende | `phase10:49`, `phase0-realtime:79` | `payment-held` não está no README |

---

## 6. Tempo real (§7)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| `nft.updated` atualiza catálogo, detalhe e carrinho | Atende | `onNftUpdated` (`realtime:58-65`) → `reconcileNfts` invalida `nfts`, `cart`, cotações; `foundation:32`, `phase9:31` | O cliente **não copia o payload** para o cache: sempre reconsulta o REST (decisão documentada e segura) |
| `order.updated` atualiza estado e mostra confirmação/recusa | Atende | `onOrderUpdated` (`realtime:67-77`) → `invalidateQueries(order)`; `phase0-realtime:79` | — |
| Identidade, recurso e versão nos eventos | Atende | `{eventId, resourceId, version, nft|userId,status}` (`contracts:110-113`) | `eventId` é gerado mas **não é usado na deduplicação** (só `version`) |
| Duplicatas e eventos antigos sem regredir nem reaplicar | Atende | `acceptVersion` (`realtime:27-32`) compara com o último visto e com a versão em cache; `phase10:28`, `phase13:169` | O mapa `versions` de NFTs nunca é limpo; um `reset` do mock (versão volta a 1) com a aba aberta ignoraria eventos. Efeito só no ambiente demo |
| Reconexão com reconciliação REST | Atende | `onConnect` (`realtime:46-52`): se reconexão, `reconcileNfts()` + re-assina e invalida os pedidos; `phase10:49` | Favoritos, perfil e carteiras não são reconciliados (não há eventos para eles; ok) |
| Isolamento entre usuários/sessões | Atende | Assinatura privada `order.subscribe {userId, orderId}` filtrada no servidor mock (`mocks/socket.ts:30-40`, `broadcastOrder`) e de novo no cliente (`realtime:72-73`); `resetPrivateRealtime` no logout/login; `phase0-realtime:50` | Eventos `nft.updated` são públicos, por desenho |
| Listeners/subscriptions liberados | Parcial | `subscribeNftUpdates`/`subscribeOrder` devolvem cleanup; hooks usam `useEffect`; contagem de conexões testada (`phase0-realtime:30`) | `startRealtime()` (`app/render.tsx:11`) **descarta** a função de cleanup que retorna; o socket vive a aba toda. Aceitável para uma SPA, mas `ARCHITECTURE.md` diz o contrário ("cleanup... inclusive StrictMode") |
| Cenário do carrinho (NFT no carrinho → muda → UI informa e atualiza resumo → checkout impede cotação velha) | Atende | `useCartLiveNotice`, `useCheckoutLive`, `refreshReview`; `phase9:31,39,58` | — |
| Interrupção com pedido pendente, recuperação por reconexão/refresh, sem nova compra | Atende | `disconnectSockets` + `/orders/by-key`; `phase10:49`, `phase13:128` | — |
| Pedidos confirmados/recusados terminais | Atende | `confirmOrder` só transiciona de `pending` (`handlers.ts:~180-198`); versão monotônica | Sem teste que tente regredir um pedido terminal por evento (há só "evento antigo não regride o recibo", `phase13:169`) |

---

## 7. Interface, acessibilidade e skeletons (§8)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| Skeleton com shimmer em catálogo, detalhe e resumo do carrinho | Atende | `components/ui/skeleton` (`animate-shimmer`, `motion-reduce:animate-none`), `@keyframes shimmer` (`styles.css:336`), `home-loading`, `nft-detail/skeleton`, resumo do carrinho (`phase11:55`); `foundation:44`, `phase11:17`, `phase15:147` | Config global `reducedMotion: 'reduce'` no Playwright: o shimmer em movimento não é verificado em nenhum spec |
| Sem deslocamento de layout | Atende | CLS 0 medido em detalhe/1440 e 390 (`progresso.md`); skeleton reserva rodapé | Medido manualmente, sem teste de CLS |
| Movimento reduzido | Atende | `styles.css:345`, `motion-reduce:*`; `phase12:64` | — |
| 390 / 768 / 1440 | Parcial | Três projetos Playwright; baselines nos três | Specs de fluxo nos 3 projetos, mas **tablet** não tem frame (docs do desvio em `ARCHITECTURE.md`) |
| Teclado e foco visível | Atende | `styles.css:319-333` (`:focus-visible`), skip link (`foundation:57`) | Nenhum spec percorre um formulário ou fluxo inteiro só com teclado |
| Foco em diálogos e drawers | Parcial | Radix `Modal`/`Sheet`; `phase12:11` (painel de filtros), `:27` (zoom da galeria) | **Diálogo "Revise sua compra" não tem teste de foco** (armadilha, devolução ao botão, Esc) |
| Semântica, labels, erros associados | Atende | `aria-invalid`/`aria-describedby` em `TextField`/`Input`; `phase6:97`, `phase15:50` | — |
| Alternativas textuais | Atende | `Image` com `alt`; checagem manual | Nenhuma verificação automatizada (sem axe, sem `eslint-plugin-jsx-a11y`) |
| Contraste e estados não só por cor | Parcial | Ajustes registrados em `ARCHITECTURE.md` | Sem verificação automatizada |
| Feedback acessível de mutations e tempo real | Atende | `role="status"`/`aria-live` nos avisos de preço, quantidade, avatar | — |
| Sem overflow horizontal / zoom | Parcial | `foundation:57,67` (estrutura) | Telas completas não verificadas contra overflow/zoom 200 % |
| Documentar substituição de assets e ajustes de a11y | Atende | `ARCHITECTURE.md` (lucide no lugar de ícones ausentes, cores com mais contraste) | — |

---

## 8. Os 12 itens de testes do §9

| # | Item | Situação | Specs que cobrem | O que falta |
| --- | --- | --- | --- | --- |
| 1 | Busca, filtros combinados, ordenação, paginação, histórico | **Parcial** ✔ | `phase7-marketplace:3` (busca+filtros), `:16` (debounce, só mobile), `:27` (paginação+histórico, só desktop), `foundation:15`, `phase16:42` (paginação, URL, histórico e refresh em desktop e mobile) | **Ordenação sem teste** |
| 2 | Acesso direto ao detalhe e recurso inexistente | Atende | `foundation:4,11` (404 de NFT), `:24` (rota desconhecida) | — |
| 3 | Cadastro, login, expiração, logout, troca de usuário | **Atende ✔** | `phase6-auth:11,27,39,51,76`, `phase0-isolation:18`, `phase16:71,86,103` (expiração sem recarga: navegação, ação na página e envio do pedido com retomada) | — |
| 4 | Favoritos com falha de mutation e recuperação | Atende | `phase7-resilience:17`, `phase11:76`, `phase8:38`, `phase6:76` | — |
| 5 | Carrinho: quantidades, remoção, cupom, persistência após refresh/login | Atende | `phase13:31,62`, `phase7-resilience:33`, `phase9:17,69`, `phase11:24-66` | — |
| 6 | Compra completa do catálogo ao recibo | Atende | `phase13:72` (começa no detalhe), `phase5:11,31` | — |
| 7 | Falha de pagamento, clique repetido, timeout com mesmo pedido | Atende | `phase7-resilience:47,56,64`, `phase13:106,128` | — |
| 8 | Perfil, avatar, senha, carteiras com erros de validação | Atende | `phase15-account` (14 testes), `phase8:55`, `phase13:141` | — |
| 9 | Preço/disponibilidade via Socket.IO durante o checkout | Atende | `phase9:31,39,58` | — |
| 10 | Eventos duplicados/antigos, desconexão, retomada de pedido pendente | Atende | `phase10-realtime:28,49`, `phase13:169`, `phase0-realtime:79` | — |
| 11 | Teclado, foco de diálogos, validação de formulários | **Parcial** | `phase12:11,27,46`, `foundation:57`, validação em `phase6:97`, `phase15:50` | Sem teste de teclado em fluxo completo; diálogo de revisão sem foco testado; sem axe |
| 12 | Skeletons com carga lenta, feedback de falha, nova tentativa | Atende | `foundation:44`, `phase11:17,32,55,66,100`, `phase13:160`, `phase15:147` | — |

Requisitos transversais do §9:

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| Chromium desktop e mobile nos fluxos principais | Atende | `playwright.config.ts` (3 projetos) | — |
| **Regressão visual de início, detalhe, carrinho, pagamento com baselines versionadas e dados estáveis** | **Não atende** | `visual-regression.spec.ts:17-38`; 12 PNGs em `visual-regression.spec.ts-snapshots/` | Baselines são do primeiro commit (`db97731`), **anteriores a todas as telas refeitas**; o `progresso.md` registra falha em 8 casos + `phase5-visual` mobile e adia a regeneração. Nomes terminam em `-win32`: **falhariam no Linux/CI**. Teste só do `/` com `fullPage`, sem máscara de dados voláteis |
| Estado isolado por teste | Atende | Contexto novo do Playwright (localStorage vazio) + `reset` | — |
| **Controle de relógio, latência e disparo de eventos em cenários sensíveis a tempo** | **Parcial** | Latência e disparo controlados via cenários e `__mock/*`; | **`page.clock` não é usado em nenhum spec.** O debounce de 300 ms e o `setTimeout(400)` de confirmação dependem de tempo real |
| Relatório HTML e traces de falha | Atende | `playwright.config.ts`: `reporter html`, `trace: retain-on-failure` | — |
| Testes de tempo real passam pelo socket.io-client; REST pelos handlers | Atende | Handlers MSW + `broadcast*` | — |
| Última execução completa conhecida | Parcial | `progresso.md`: 132 testes passaram (sem visuais) depois do perfil | Nenhuma execução completa **incluindo** `visual-regression`; não reexecutado agora |

---

## 9. Lighthouse (§10)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| Script versionado, 3 medições por página/perfil, medianas | Atende | `scripts/lighthouse.mjs`, `reports/lighthouse/summary.json` (12 medições) | — |
| Metas (≥90/95/95/90) na aplicação final | **Não atende** | `docs/VALIDATION.md` (02/10): 98–100 / 100 / 100 / 91, LCP 2121–2384 ms mobile | Resultados são **da estrutura inicial**, o próprio documento diz que não valem. Nenhuma medição desde Início/Detalhe/Carrinho/Pagamento refeitos |
| Relatórios HTML/JSON entregues com versões/ambiente | Parcial | Gerados | `reports/` e `reports/lighthouse/` estão no `.gitignore`: **não vão no repositório** |
| Análise de LCP/CLS/TBT e justificativa abaixo da meta | Parcial | Tabela em `VALIDATION.md` | Refazer sobre a entrega final |

---

## 10. Entrega (§12)

| Requisito | Situação | Evidência | O que falta |
| --- | --- | --- | --- |
| Código, lockfile, assets, mocks, fixtures, testes, configs | Atende | `package-lock.json`, `public/`, `src/mocks`, `tests/`, `scripts/` | — |
| **Deploy público obrigatório** | **Não atende** | `vercel.json` existe (build demo, rewrite SPA excluindo `assets/` e `mockServiceWorker.js`, `no-cache` no worker); branch **13 commits à frente do origin**; README: "deploy e URL ... pendentes" | Publicar, validar rota direta/refresh, MSW e Socket.IO na URL pública. Sem URL |
| Scripts: dev com mocks, build, preview, typecheck, lint, Playwright, Lighthouse | Atende | `package.json`: `dev`, `build`, `build:demo`, `preview`, `typecheck`, `lint`, `test:e2e`, `test:e2e:ui`, `test:report`, `test:visual`, `audit:lighthouse` | `test:visual` filtra `@visual`, que hoje falha |
| README: setup, variáveis, credenciais, cenários, reset, comandos | Parcial | `README.md` §13: setup, `.env`, credenciais (`ana@…`/`kurio-demo`, `bruno@…`), lista de cenários, reset, `KURIO-2026`, cupons | O README (que é idêntico ao `readme.md`: `README.md` e `readme.md` são o mesmo arquivo no Windows) mantém o enunciado + "§13 estrutura inicial" com frases desatualizadas ("não conclui os fluxos de compra/conta", "metas finais ainda não aferidas", `test:visual` "reserva"). Falta `payment-held`, os endpoints `__mock/session/expire`, `/orders/:id/event` e `/socket/disconnect`, e um roteiro "passo a passo" por fluxo de falha |
| Documentar contratos REST e eventos | Parcial | `docs/CONTRACTS.md` (51 linhas) | Não cobre perfil/senha/avatar, carteiras (`primary`, `connect`), `facets`, erros por código |
| Política de sessão, carrinho, cache, reconciliação REST × Socket.IO | Parcial | `ARCHITECTURE.md` §Cache, §Sessão/carrinho | Texto parte do estado inicial, ver §3 |
| Limitações, decisões de UX, desvios do Figma em `ARCHITECTURE.md` | Atende | Seções por tela com decisões/medidas | O topo do arquivo ainda diz "Esta é a estrutura inicial, não a solução completa" |
| Execução a partir de checkout limpo | Parcial | `npm ci` + `npx playwright install chromium` + `npm run dev` | Nunca verificado em checkout limpo depois das últimas mudanças; `.env.demo` e worker MSW estão versionados |
| Documentos antigos enganosos | Parcial | `docs/audit/gaps.md` diz "0/15 telas implementadas"; `docs/VALIDATION.md` e `docs/CHECKLIST.md` do início | Podem induzir o avaliador ao erro; atualizar ou remover |

---

## 11. Critérios eliminatórios do §11, um a um

| Critério | Situação | Evidência | Risco |
| --- | --- | --- | --- |
| Ausência de uso efetivo da stack obrigatória | **Atende** | §1. Tudo é usado de fato; shadcn é o mais fino (só 1 `toast` não usado) | Baixo (shadcn: reforçar com uso de `toast()` ou documentar a escolha) |
| Fluxos principais apenas visuais | **Atende** | Auth, catálogo, carrinho, cupom, checkout, pedidos, perfil, carteiras e favoritos passam por MSW com DB persistida | Baixo |
| Compra confirmada sem resposta da simulação | **Atende** | Status vem do handler (`handlers.ts:978-990`); página do pedido mostra recibo só se `confirmed` | Baixo |
| Exposição de dados entre usuários | **Atende** | Keys com `userId`, `clearUserItems`, `queryClient.clear()`, assinaturas filtradas no servidor e no cliente, 403 em pedido alheio (`handlers.ts:1025-1058`); `phase0-isolation`, `phase0-realtime:50`, `phase6:76` | Baixo. Observação: a chave de idempotência é global no mock (`db.idempotency[key]`), mas devolve 403 para outro usuário |
| Eventos simulados direto na UI | **Atende** | Só `broadcastNft/broadcastOrder` emitem pelo transporte Socket.IO via MSW; o cliente recebe por `socket.on`; nenhum teste chama setter/cache | Baixo |
| Ausência de testes E2E executáveis | **Atende (com ressalva)** | 19 specs em `tests/e2e`, `npm run test:e2e` sobe build demo + preview, relatório HTML e traces | **Os visuais falham hoje** e as baselines só existem para `win32`; sem execução completa registrada que inclua `visual-regression`. Se a avaliação rodar `npm run test:e2e` inteiro, haverá falhas |
| **Deploy (§12, obrigatório)** | **Não atende** | Sem URL pública, branch não publicada | **Alto**. Pode eliminar |

---

## 12. Lacunas por risco de eliminação

**Risco alto (podem eliminar ou derrubar nota de forma visível)**

1. **Deploy inexistente.** `vercel.json` pronto, mas branch 13 commits à frente do `origin`, sem URL. Falta publicar e validar rota direta, refresh, MSW e Socket.IO na URL. (§12, P0)
2. **Suíte E2E não passa inteira.** `visual-regression` falha nos 4 casos × 3 projetos por baselines do commit inicial, `phase5-visual` mobile também já falhou; baselines só `-win32`. `npm run test:e2e` completo não está verde nem comprovado. (§9, P0)
3. **Lighthouse sem medição da entrega final.** Os números em `VALIDATION.md` são da estrutura e `reports/` está fora do git. Faltam as 12 medições novas, versionadas, com análise. (§10)
4. ~~Expiração de sessão incompleta.~~ **Resolvido** em `3da74bf` + `phase16` (ver §2).

**Risco médio**

5. **README e `ARCHITECTURE.md` desatualizados.** Frases de "estrutura inicial", política de cache sem as otimistas e sem o descarte de respostas obsoletas, `startRealtime` descrito como no layout, `payment-held` e endpoints `__mock/*` sem documentação, README sem roteiro de reprodução das falhas. (§12)
6. **Respostas fora de ordem sem prova.** `variable-latency` e `unauthorized` existem no MSW e nenhum spec os usa; ordenação sem spec; `wallet-rejected` sem spec. (§4, §6, §9 itens 1 e 3)
7. **Timeout real de rede só no pedido.** Falta cenário em que a conexão exceda os 8 s do Axios em catálogo/detalhe; `conditions()` só vale para `GET /api/nfts` e detalhe. (§6)
8. **Controle de relógio ausente.** Nenhum `page.clock`; debounce e confirmação automática (400 ms) dependem de tempo real. (§9)
9. ~~Paginação inacessível no mobile.~~ **Resolvido** em `4979c7b` (desvio do frame registrado em `ARCHITECTURE.md`).
10. **Acessibilidade sem verificação automatizada.** Sem axe, sem `jsx-a11y`; teclado só em 4 pontos; diálogo "Revise sua compra" sem teste de foco. (§8, §9 item 11)

**Risco baixo**

11. `.home-products` morta em `styles.css:360` e comentários vazios no fim do arquivo (AGENTS: classes CSS próprias proibidas).
12. 404 global é só um `<h1>`, sem navegação de volta nem padrão visual.
13. shadcn: só `Toaster` sem nenhum `toast()`; `Modal` próprio em vez de `Dialog`.
14. Documentos de auditoria antigos enganosos (`docs/audit/gaps.md`: "0/15 telas").
15. Mapa `versions` de NFTs nunca é limpo e `eventId` não participa da deduplicação (hoje inofensivo).
16. Regra `quoteVersion !== 1 → QUOTE_STALE` no mock (`handlers.ts:~965`) é um atalho.
17. Estrutura de pastas: sem `src/routes` nem `src/shared` conforme o AGENTS (rotas em `app/router.tsx`, ainda `src/lib` e `src/components`). Não é requisito do readme.

Sem commits e sem alterações de código nesta etapa. Aguardando "continue".
