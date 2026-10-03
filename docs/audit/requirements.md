# Auditoria de Requisitos — Checklist do README.md

**Fonte:** `README.md` integral (329 linhas)
**Método:** Cada seção do enunciado verificada contra implementação atual.
**Legenda:** ✅ Completo | ⚠️ Parcial | ❌ Ausente | 📋 Documentado (apenas docs/figma)

---

## §1 Escopo

| Requisito | Status | Evidência / Gap |
|-----------|--------|-----------------|
| Fluxos: descoberta, compra, conta | ❌ | Rotas existem, telas são `PendingFeature` |
| Versões desktop e mobile | ❌ | 0 telas implementadas |
| APIs, auth, carteiras, pagamentos com dados simulados | ⚠️ | MSW pronto, mas handlers de auth/carteiras/pedidos não implementados |
| Integrações reais (blockchain, wallet extensions, payment gateways) fora do escopo | ✅ | Não há código para isso |
| Figma define identidade visual/composição | 📋 | Documentado em `docs/figma/` |
| Enunciado define comportamentos/cenários | ✅ | Este checklist |
| Estados não desenhados seguem mesmo padrão visual | 📋 | Pendente design system |

---

## §2 Stack Obrigatória

| Tecnologia | Status | Verificado em |
|------------|--------|---------------|
| React | ✅ | `stack.md` |
| TypeScript | ✅ | `stack.md` |
| TanStack Router | ✅ | `stack.md` |
| TanStack Query | ✅ | `stack.md` |
| Axios | ✅ | `stack.md` |
| Socket.IO | ✅ | `stack.md` |
| Tailwind CSS | ⚠️ | Tokens não correspondem ao Figma |
| shadcn/ui | ⚠️ | 2/38 componentes |
| MSW | ✅ | `stack.md` |
| Playwright | ⚠️ | 6/12 grupos |
| Lighthouse | ⚠️ | Estrutura apenas |

---

## §3 Telas e Fluxos — Tabela Obrigatória

| Tela | Funcionalidades Obrigatórias | Status | Gap |
|------|------------------------------|--------|-----|
| **Início** | Destaques, catálogo, busca, filtros, ordenação, navegação para NFT | ❌ | Rota `/` existe, componente `CatalogPage` é skeleton genérico |
| **Detalhes do NFT** | Galeria, informações, edição, quantidade, favoritos, compra | ❌ | Rota `/nfts/:id` existe, `NftPage` é placeholder |
| **Carrinho de NFTs** | Edição de quantidades, remoção, cupom, resumo de valores | ❌ | Rota `/cart` existe, `PendingFeature` |
| **Pagamento** | Dados do colecionador, seleção de carteira e rede, revisão, envio | ❌ | Rota `/checkout` (privada) existe, `PendingFeature` |
| **Confirmação de pedido** | Resultado, identificação da transação, itens, taxas, total | ❌ | Rota `/orders/:id` (privada) existe, `PendingFeature` |
| **Login** | Autenticação, validação, retorno ao fluxo anterior | ❌ | Rota `/login` existe, `PendingFeature` |
| **Cadastro** | Criação de conta, validação, tratamento de conflito | ❌ | Rota `/register` existe, `PendingFeature` |
| **Perfil do colecionador** | Edição dos dados, avatar, alteração de senha | ❌ | Rota `/profile` (privada) existe, `PendingFeature` |
| **Carteiras** | Cadastro e edição de carteiras principal e secundária | ❌ | Rota `/wallets` (privada) existe, `PendingFeature` |

**Regra §3:** *"Implemente os frames desktop e mobile disponíveis. Perfil, carteiras e confirmação também devem funcionar em mobile, mesmo sem um frame específico."*
→ **0/9 telas implementadas**; mobile não considerado.

**Páginas fora do escopo:** editoriais, suporte, atividade, ofertas, downloads → ✅ Não implementadas.

---

## §3 — Catálogo e Detalhe

| Requisito | Status | Gap |
|-----------|--------|-----|
| Busca, filtros, ordenação, paginação compõem estado da URL | ⚠️ | `catalogSearchSchema` valida `q`, `category`, `sort`, `page`; `useSearch` no `CatalogPage`; mas **UI de filtros/ordenção não existe** |
| Sobreviver a refresh e navegação pelo histórico | ⚠️ | Parâmetros na URL funcionam (teste E2E passa), mas UI não persiste estado visual |
| Filtros combináveis; mudança de filtro reinicia paginação | ❌ | Lógica de filtro no mock (`handlers.ts` combina `q` + `category`), mas **UI não implementada** |
| Consultas refletem parâmetros na API, tratamento de vazio/erro/fora de ordem | ⚠️ | Mock trata; `CatalogPage` mostra erro + retry; **empty state genérico** |
| Detalhe: acesso direto, NFT inexistente, edição indisponível, limite de quantidade | ⚠️ | Acesso direto + 404 funcionam (teste); **edição/quantidade/favoritos/compra não existem** |
| Favoritos persistem para usuário autenticado | ❌ | API de favoritos não implementada; hook otimista não existe |

---

## §3 — Carrinho

| Requisito | Status | Gap |
|-----------|--------|-----|
| Adicionar, alterar, remover itens por NFT/edição/disponibilidade | ❌ | API de carrinho não implementada |
| Carrinho persistente de visitante + merge ao autenticar sem perder itens | ❌ | Não existe |
| Aplicar/remover cupom; inválido/expirado com respostas da API | ❌ | API de cotação/cupom não implementada |
| Cotação autoritativa: subtotal, desconto, taxa, total em strings ETH, cálculo exato | ❌ | `Quote` type existe em `contracts.ts`, mas endpoint `/quotes` não existe |
| Skeleton do resumo | ❌ | Não existe |
| Informar preço/estoque alterado via socket e atualizar cotação | ❌ | `nft.updated` existe mas não integra com carrinho |

---

## §3 — Pagamento e Confirmação

| Requisito | Status | Gap |
|-----------|--------|-----|
| Validar campos, carteiras cadastradas, rede; conectar/recusar/desconectar simulação | ❌ | API de carteiras `/wallets` não implementada |
| Revisão e revalidação de preço/estoque/cupom/taxas; mudança exige nova confirmação | ❌ | Não existe |
| Chave de idempotência persistida por tentativa; mesma chave/body recupera pedido | ❌ | `Idempotency-Key` header previsto em `CONTRACTS.md`, não implementado |
| Clique repetido e timeout após criação não duplicam compra | ❌ | Não existe |
| Pedido pendente/confirmado/recusado com recuperação por refresh/reconexão | ❌ | Não existe |
| Estados terminais imutáveis | ❌ | Não existe |
| Confirmação somente para pedido confirmado na simulação | ❌ | Não existe |
| Falhas preservam carrinho; confirmação retira só itens/quantidades comprados | ❌ | Não existe |
| Recibo = snapshot do pedido; alterações posteriores no catálogo não modificam valores | ❌ | Não existe |
| Referências de transação e links de exploração simulados | ❌ | Link "Ver no Etherscan" no Figma, não implementado |

---

## §3 — Conta e Sessão

| Requisito | Status | Gap |
|-----------|--------|-----|
| Cadastro, login, logout, sessão, expiração via REST MSW | ❌ | Handlers `/auth/*` não existem; `/session` retorna `{ user: null }` |
| Credenciais fictícias, hash de senha com salt | ❌ | Não existe |
| Sessão recuperável após refresh | ⚠️ | `sessionOptions` com `staleTime: 0` + `retry: false`; mas user sempre `null` |
| Expiração durante navegação/checkout preserva contexto e informa retomada | ❌ | Não existe |
| Proteger checkout, perfil, carteiras, favoritos, pedidos também nos handlers (401/403) | ⚠️ | Guard `beforeLoad` no router protege rotas; **handlers MSW não validam sessão** |
| Logout/troca de usuário cancela requests, limpa cache privado, subscriptions anteriores | ❌ | Não existe |
| Perfil, avatar, senha, carteiras principal/secundária: formulários, validações, persistência | ❌ | Não existe |

---

## §4 Integração e Estado

| Requisito | Status | Gap |
|-----------|--------|-----|
| TanStack Router nas rotas, parâmetros de busca, proteção fluxos privados | ✅ | `router.tsx` + `validateSearch` + `beforeLoad` guard |
| TanStack Query nas consultas, mutations, sincronização cache | ✅ | `queryClient` + `catalogOptions`/`nftOptions` + `sessionOptions` |
| Chamadas REST via Axios | ✅ | `http` client |
| Contratos tipados entre transporte, estado e interface | ✅ | Zod schemas em `contracts.ts` |
| Estados: carregamento, vazio, erro, sucesso, atualização em background | ⚠️ | `isPending`, `isError`, `isFetching` no `CatalogPage`; `isFetching` mostra "Atualizando…" |
| Invalidação coerente após mutations e eventos | ✅ | `reconcile()` invalida `['nfts']` no `nft.updated` |
| Cancelamento/descarte de respostas obsoletas | ✅ | `signal` nas queries + `refetchOnWindowFocus` |
| Isolamento de dados por usuário e parâmetros da consulta | ⚠️ | Keys incluem `search` params; **isolamento por user não implementado** (sem auth) |
| Recuperação de falhas sem duplicar operações | ✅ | `retry: false` em mutations; `retry` condicional em queries |
| Tratamento de rotas inexistentes e acesso direto a qualquer tela | ✅ | `notFoundComponent` + `errorComponent` no root; rotas todas definidas |
| Atualização otimista em ≥1 interação com rollback | ❌ | Não implementado (favoritos seria candidato) |
| Política de cache, retries, sincronização documentada | 📋 | Em `query.ts` + `CONTRACTS.md` |

---

## §5 Contratos REST — Recursos Mínimos

| Recurso | Operações | Status | Gap |
|---------|-----------|--------|-----|
| Sessão e conta | Cadastro, login, consulta, logout, expiração | ❌ | Apenas `GET /session` (visitor) |
| NFTs | Listagem (busca/filtros/ordenação/paginação) + detalhe por ID | ⚠️ | Listagem + detalhe OK; **filtros/ordenação só no mock, sem UI** |
| Favoritos | Consulta, inclusão, remoção | ❌ | Não existe |
| Carrinho | Consulta, inclusão, alteração, remoção de itens | ❌ | Não existe |
| Cotação | Validação cupom, disponibilidade, descontos, taxas, total | ❌ | Não existe |
| Pedidos | Criação idempotente + consulta estado/recibo | ❌ | Não existe |
| Perfil | Consulta, atualização dados/avatar, alteração senha | ❌ | Não existe |
| Carteiras | Consulta, cadastro, atualização | ❌ | Não existe |

**Erros implementados no mock:** 404 `NOT_FOUND`, 422 `VALIDATION_ERROR`, 401 `SESSION_EXPIRED` (simulado), 503 `TRANSIENT_FAILURE`, falha de conexão.
**Faltam:** 409 `CONFLICT` (idempotency, disponibilidade, cupom), 403 `FORBIDDEN`, 422 por campo.

**Idempotência de pedidos:** Header `Idempotency-Key` previsto em `CONTRACTS.md`; mesma chave/payload recupera mesma resposta; chave reutilizada com body diferente → 409. **Não implementado.**

---

## §6 Mocking com MSW

| Requisito | Status | Gap |
|-----------|--------|-----|
| Mocks na camada de rede, reutilizando contratos/cenários | ✅ | `handlers.ts` usa `catalogSearchSchema`, `toWei`, `db`, `scenarios` |
| Componentes/hooks/Axios sem respostas fictícias | ✅ | `useQuery` + `http` |
| Estado consistente entre catálogo, favoritos, carrinho, perfil, carteiras, pedidos | ⚠️ | DB só tem NFTs; **favoritos/carrinho/perfil/carteiras/pedidos não existem** |
| Persistência local para sustentar reset | ✅ | `localStorage` + `resetDb()` + `saveDb()` |
| Cenários determinísticos (7): sucesso, vazio, latência variável, fora de ordem, falhas conexão, 4xx/5xx, sessão expirada, não autorizado, conflito cadastro/validação, cupom inválido/expirado, preço alterado/edição esgotada, timeout após pedido, pagamento confirmado/recusado | ⚠️ | Implementados: `default`, `empty`, `slow`, `variable-latency`, `network-error`, `http-500`, `unauthorized`. **Faltam:** conflito cadastro, cupom inválido/expirado, preço alterado/edição esgotada (parcial via `nft.updated`), timeout pedido, pagamento confirmado/recusado |
| MSW + Socket.IO (`@mswjs/socket.io-binding`) | ✅ | `socket.ts` + `broadcastNft` |
| Eventos simulados via Socket.IO (não setters/callbacks/cache direto) | ✅ | `broadcastNft` emite `nft.updated`; cliente reconcilia via REST |
| Camada de mocks ativada por config, disponível no build demo | ✅ | `VITE_ENABLE_MOCKS=true` em `.env.demo`; `worker.start()` em `main.tsx` |
| Mudanças nos dados simuladas refletidas em REST + eventos | ✅ | `nft.updated` emite após `saveDb()` |

---

## §7 Tempo Real com Socket.IO

| Evento | Comportamento Esperado | Status | Gap |
|--------|------------------------|--------|-----|
| `nft.updated` | Atualizar preço/disponibilidade no catálogo, detalhe, carrinho | ⚠️ | Catálogo + detalhe via `reconcile()`; **carrinho não existe** |
| `order.updated` | Atualizar estado do pedido, apresentar confirmação/recusa | ❌ | Não implementado |

**Requisitos técnicos:**
- Identidade estável, recurso afetado, versão ✅ (`eventId`, `resourceId`, `version`)
- Tolerar duplicatas e eventos antigos, não regredir estado mais recente ✅ (`versions` Map + `latest`)
- Após reconexão, reconciliar com REST ✅ `reconcile()` no `onConnect`
- Eventos de sessão anterior não atualizam dados de outro usuário ❌ (sem auth)
- Listeners/subscriptions liberados ao encerrar ciclo ✅ `off` + `disconnect` + `clear`

**Cenário obrigatório (§7):**
1. NFT no carrinho → ❌ carrinho não existe
2. Preço/disponibilidade muda (`nft.updated`) → ✅ evento funciona
3. UI informa alteração + atualiza resumo → ❌ carrinho não existe
4. Checkout impede confirmação com cotação desatualizada → ❌ checkout não existe

**Interrupção de conexão durante pedido pendente:** Não testável (sem pedido).

---

## §8 Interface, Responsividade e Acessibilidade

| Requisito | Status | Gap |
|-----------|--------|-----|
| Preservar tipografia, cores, espaçamentos, hierarquia, imagens, proporções, composição do Figma | ❌ | **Tokens não aplicados** (ver `design-tokens.md` vs `styles.css`) |
| Adaptar shadcn/ui à identidade visual do projeto | ⚠️ | Button/Skeleton usam classes genéricas |
| Funcionar em desktop, tablet, mobile (390, 768, 1440) | ❌ | Breakpoints não configurados; apenas `md:` |
| Skeletons com shimmer effect em componentes dependentes de dados | ⚠️ | `.skeleton` + `@keyframes shimmer` no CSS global; **mas dimensões não correspondem ao Figma** |
| Preservar dimensões do conteúdo (evitar layout shift) | ❌ | Skeletons genéricos (`h-40`, `h-64`) |
| Respeitar `prefers-reduced-motion` | ✅ | `@media (prefers-reduced-motion: reduce)` no CSS global |
| Navegação por teclado e foco visível | ⚠️ | `focus-visible` no Button + skip link; **formulários não existem** |
| Controle de foco em diálogos e drawers | ❌ | Modais não implementados |
| Semântica adequada, labels, erros associados aos campos | ⚠️ | `nav`, `main`, `header`, `footer`, `section`, `ul/li` OK; **labels/erros em formulários não existem** |
| Alternativas textuais para imagens relevantes | ❌ | Imagens/assets não integrados |
| Contraste legível e estados não dependentes apenas de cor | ⚠️ | Cores atuais têm contraste; **estados focus/hover/error não definidos** |
| Feedback acessível para mutations e alterações em tempo real | ❌ | Toast/status não implementado |
| Ausência de overflow horizontal indevido e perda de conteúdo com zoom | ✅ | Teste E2E verifica `scrollWidth <= innerWidth` |
| Assets do arquivo quando disponíveis | ❌ | 4 imagens raster + 40 vetores + logo não integrados |
| Documentar substituições de asset/ajustes de acessibilidade em ARCHITECTURE.md | 📋 | Pendente |

---

## §9 Testes com Playwright — 12 Grupos Obrigatórios

| # | Grupo | Status | Gap |
|---|-------|--------|-----|
| 1 | Busca, filtros combinados, ordenação, paginação, restauração histórico | ⚠️ | Smoke: parâmetros URL funcionam; **UI de filtros/ordenção/paginação não existe** |
| 2 | Acesso direto ao detalhe + recurso inexistente | ✅ | Teste passa (404 + reload) |
| 3 | Cadastro, login, expiração sessão, logout, troca usuário | ❌ | Auth não implementado |
| 4 | Favoritos, falha mutation, recuperação estado | ❌ | Não existe |
| 5 | Carrinho: quantidades, remoção, cupom, persistência refresh/login | ❌ | Não existe |
| 6 | Compra completa: catálogo → recibo confirmado | ❌ | Não existe |
| 7 | Falha pagamento, clique repetido, timeout + recuperação mesmo pedido | ❌ | Não existe |
| 8 | Edição perfil, avatar, senha, carteiras + erros validação | ❌ | Não existe |
| 9 | Alteração preço/disponibilidade via Socket.IO durante checkout | ⚠️ | Smoke no detalhe passa; **checkout não existe** |
| 10 | Eventos duplicados/antigos, desconexão, retomada pedido pendente | ❌ | Parcial no detalhe; pedido não existe |
| 11 | Navegação teclado, foco diálogos, validação formulários | ⚠️ | Skip link + foco main testado; **diálogos/formulários não existem** |
| 12 | Skeletons carregamento lento, feedback falha, recuperação retry | ⚠️ | Smoke catálogo/detalhe passa; **nem todos os fluxos** |

**Requisitos de execução:**
- Chromium, viewports desktop + mobile ✅ (3 projects configurados)
- Regressão visual: início, detalhe, carrinho, pagamento + baselines versionadas ❌ (não criado)
- Dados estáveis ✅ (fixtures + reset)
- Isolamento por teste ✅ (browser context fresco)
- Controle relógio, latência, disparo eventos ⚠️ (cenários MSW configuráveis)
- Relatório HTML + traces falhas ✅ (`npm run test:report`)
- Verificar interface + resultados operações ✅
- Tempo real via `socket.io-client` ✅ (teste Socket.IO usa cliente real)
- REST via handlers MSW ✅

---

## §10 Performance e Lighthouse

| Métrica | Meta | Status | Gap |
|---------|------|--------|-----|
| Performance | ≥ 90 | ⚠️ | Estrutura: 97-100; **App final não auditado** |
| Accessibility | ≥ 95 | ⚠️ | Estrutura: 100; **App final não auditado** |
| Best Practices | ≥ 95 | ⚠️ | Estrutura: 100; **App final não auditado** |
| SEO | ≥ 90 | ⚠️ | Estrutura: 91; **App final não auditado** |
| 3 medições por página/perfil | ✅ | Script faz |
| Medianas + LCP/CLS/TBT | ✅ | `summary.json` |
| Versões, ambiente, condições | ✅ | Registrados |
| Sem simplificações exclusivas para pontuação | ✅ | Build demo real |

---

## §11 Critérios de Avaliação (100 pts)

| Critério | Pontos | Status Atual | Gap para pontuação máxima |
|----------|--------|--------------|---------------------------|
| Fidelidade visual e responsividade | 20 | 0 | 0 telas implementadas |
| Fluxos e experiência de uso | 20 | 0 | 0 fluxos completos |
| Integração e estado | 15 | ~8 | Router/Query/Axios OK; cache/sync parcial; otimista ausente |
| Tempo real | 10 | ~4 | `nft.updated` OK; `order.updated` + carrinho + reconciliação + isolamento ausentes |
| Mocking | 10 | ~6 | REST + WS + cenários básicos OK; estado consistente + cenários avançados + handlers privados ausentes |
| Testes | 10 | ~3 | 6/12 grupos (smoke); regressão visual + isolamento + determinístico ausentes |
| Acessibilidade | 5 | ~1 | Skip link + focus-visible + reduced-motion; formulários/diálogos/estados/alt/contrast ausentes |
| Performance | 5 | ~2 | Estrutura passa; app final não auditado |
| Arquitetura e documentação | 5 | ~4 | Docs/figma completos; ARCHITECTURE.md existe; **arquitetura final não documentada** |

**Eliminatórios (§11):**
- ❌ Ausência de uso efetivo da stack obrigatória → **OK (stack usada)**
- ❌ Fluxos principais apenas visuais → **VIOLAÇÃO** (0 telas implementadas)
- ❌ Compra confirmada sem resposta da simulação → N/A (sem compra)
- ❌ Exposição de dados entre usuários → N/A (sem multi-user)
- ❌ Eventos simulados diretamente na UI → **OK** (Socket.IO real + MSW binding)
- ❌ Ausência de testes E2E executáveis → **VIOLAÇÃO** (6/12 grupos, sem regressão visual)

---

## §12 Entrega

| Item | Status |
|------|--------|
| Código-fonte, lockfile, assets, mocks, fixtures, testes, configs | ✅ Parcial (sem assets Figma, sem testes completos) |
| Deploy público obrigatório | ❌ |
| URL repositório + URL pública | ❌ |
| README da solução com setup, env, credenciais, cenários, comandos, falhas | ⚠️ README do desafio existe; **README da solução não criado** |
| Documentar contratos REST/eventos, política sessão, estado carrinho, cache, reconciliação REST/Socket.IO em ARCHITECTURE.md | 📋 Parcial (`ARCHITECTURE.md` + `CONTRACTS.md` existem) |
| Limitações, decisões UX, desvios Figma em ARCHITECTURE.md | 📋 Parcial |
| Comandos: dev, build, preview, typecheck, lint, test:e2e, audit:lighthouse | ✅ Todos em `package.json` |
| Execução a partir de checkout limpo (`npm ci`) | ✅ Validado |
| Sem depender de serviços privados/backend produção | ✅ (mocks) |

---

## Resumo Quantitativo

| Categoria | Total | Implementado | % |
|-----------|-------|--------------|---|
| Telas (9) | 9 | 0 | 0% |
| Componentes Figma (38) | 38 | 2 | 5% |
| Design tokens (cores, typo, spacing, raios, sombras) | ~20 grupos | 0 aplicados | 0% |
| Assets (4 raster + 40 vetores + logo) | 45 | 0 | 0% |
| Handlers REST (8 recursos × ~4 ops) | ~32 | 3 | 9% |
| Eventos Socket.IO (2) | 2 | 1 | 50% |
| Testes E2E (12 grupos) | 12 | 6 (smoke) | 50% |
| Regressão visual (4 telas × 3 viewports) | 12 baselines | 0 | 0% |
| Lighthouse (2 páginas × 2 perfis × 3 runs) | 12 medições | 12 (estrutura) | 100% (estrutura) |
| Deploy | 1 | 0 | 0% |

**Conclusão:** A base técnica está sólida (infraestrutura, contratos, mocks, roteamento, tempo real básico). **A implementação das telas, componentes, design system e fluxos de negócio é 0%**. A Fase 2+ deve focar 100% na camada de UI e integração dos fluxos.